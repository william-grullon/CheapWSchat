require('dotenv').config();
const makeWASocket = require('baileys').default;
const { useMultiFileAuthState, DisconnectReason } = require('baileys');
const OpenAI = require('openai');
const P = require('pino');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    logger: P({ level: 'info' }),
  });

  sock.ev.on('creds.update', saveCreds);

  // Add a queue to store the last 5 messages
  const lastMessages = [];

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const from = msg.key.remoteJid;
    const incoming = msg.message.conversation || msg.message.extendedTextMessage?.text;

    console.log(`Received: ${incoming}`);

    // Add the incoming message to the queue
    if (incoming) {
      lastMessages.push(incoming);
      if (lastMessages.length > 5) {
        lastMessages.shift(); // Remove the oldest message if the queue exceeds 5
      }
      console.log('Last 5 messages:', lastMessages);
    }

    const sanitizedInput = incoming?.trim();
    if (!sanitizedInput) {
      console.error('Invalid input message:', incoming);
      await sock.sendMessage(from, { text: 'Sorry, I could not process your message.' });
      return;
    }

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a friendly assitant.' },
          { role: 'user', content: 'You are a WhatsApp bot.' },
          { role: 'user', content: 'You are a chatbot that can answer questions.' },
          { role: 'user', content: 'You are a chatbot that can answer questions about the weather.' },
          { role: 'user', content: 'You are a chatbot that can answer questions about the news.' },
          { role: 'user', content: 'You are a chatbot that can answer questions about places.' },
          { role: 'user', content: 'You are a chatbot that can answer questions about technology.' },
          { role: 'user', content: 'You are a chatbot that can answer questions about science.' },  
          { role: 'user', content: sanitizedInput },
        ],
      });

      const reply = response.choices[0].message.content.trim();
      await sock.sendMessage(from, { text: reply });
      console.log(`Replied: ${reply}`);
    } catch (err) {
      console.error('OpenAI error:', err);
      await sock.sendMessage(from, { text: 'Sorry, I had an error processing that reply.' });
    }
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut);
      console.log('Connection closed. Reconnecting:', shouldReconnect);
      if (shouldReconnect) startBot();
    } else if (connection === 'open') {
      console.log('✅ WhatsApp connected');
    }
  });
}

startBot();