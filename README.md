# WhatsApp GPT Agent

This project integrates a GPT-based chatbot with WhatsApp to provide intelligent conversational capabilities. The bot can respond to user queries and perform various tasks based on natural language input.

## Features
- Seamless integration with WhatsApp.
- Powered by GPT for natural language understanding and generation.
- Supports multiple users and conversations.
- Persistent state management for chat sessions.

## Prerequisites
- Node.js (v14 or later)
- A valid WhatsApp account
- API keys or credentials for GPT (e.g., OpenAI API)

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd whatsapp-gpt-agent
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure authentication:
   - Place your WhatsApp authentication details in `auth.json`.
   - Ensure the `auth_info/` directory contains the necessary state sync keys.

## Usage
1. Start the bot:
   ```bash
   node index.js
   ```

2. Interact with the bot via WhatsApp.

## File Structure
- `index.js`: Main entry point of the application.
- `auth.json`: Stores authentication details for WhatsApp.
- `auth_info/`: Contains state sync keys for maintaining session persistence.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.