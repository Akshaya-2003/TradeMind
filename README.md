# TradeMind

A trading application with Claude Desktop MCP (Model Context Protocol) server integration that enables AI-powered trading operations through conversational interface.

## Features

- **Access Token Management**: Secure authentication flow for trading APIs
- **MCP Server Integration**: Direct integration with Claude Desktop for AI-powered trading
- **Trading Operations**: Buy/sell stock operations through conversational AI
- **Portfolio Management**: View and manage your trading portfolio
- **Real-time Trading Status**: Monitor your trading activities

## Prerequisites

- [Bun](https://bun.com) runtime (v1.2.20 or later)
- Trading account with API access (appears to be Zerodha-based)
- Claude Desktop application

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Akshaya-2003/TradeMind.git
cd TradeMind
```

2. Install dependencies:
```bash
bun install
```

## Configuration

### 1. Trading API Setup

Before running the application, you need to obtain an access token:

1. **Generate Access Token**:
   ```bash
   bun accessToken.ts
   ```

2. **Authorize Application**:
   - The command will provide you with an authorization link
   - Click on the link and complete the authorization process
   - Copy the `requestToken` from the redirect URL

3. **Get Final Access Token**:
   ```bash
   bun accessToken.ts
   ```
   - Run the command again after obtaining the request token
   - The access token will be logged to the console
   - This token should be added to `trade.js` for API authentication

### 2. Claude Desktop MCP Server Setup

The `claude_desktop_config.json` file contains the MCP server configuration. This enables Claude Desktop to communicate with your trading application.

**For macOS/Linux:**
```bash
cp claude_desktop_config.json ~/.config/claude-desktop/claude_desktop_config.json
```

**For Windows:**
```bash
copy claude_desktop_config.json %APPDATA%\Claude\claude_desktop_config.json
```

## Usage

### Running the Application

```bash
bun run index.ts
```

### Available Trading Operations via Claude

Once configured, you can interact with your trading account through Claude Desktop using natural language:

- **Buy Stocks**: "Buy 10 shares of RELIANCE"
- **Sell Stocks**: "Sell 5 shares of TCS"
- **View Portfolio**: "Show my portfolio"
- **Check Trading Status**: "What's my trading status?"
- **Mathematical Operations**: Basic calculations for trading decisions

### MCP Server Functions

The application provides the following functions through the MCP server:

| Function | Description |
|----------|-------------|
| `trade:buy-stock` | Execute buy orders on the exchange |
| `trade:sell-stock` | Execute sell orders on the exchange |
| `trade:show-portfolio` | Display complete portfolio information |
| `trade:trading-status` | Get current trading status |
| `trade:add` | Basic addition operations |
| `trade:factorial` | Calculate factorial (for mathematical analysis) |

## Project Structure

```
TradeMind/
├── accessToken.ts          # Access token generation script
├── trade.js               # Main trading operations (requires access token)
├── index.ts               # Application entry point
├── claude_desktop_config.json  # MCP server configuration
├── package.json           # Project dependencies
└── README.md             # This file
```

## Important Security Notes

- **Never commit access tokens** to version control
- Store sensitive credentials in environment variables or secure configuration files
- The access token has limited validity and may need periodic renewal
- Always verify trading operations before execution

## Troubleshooting

### Access Token Issues
- Ensure you complete the full OAuth flow
- Check that the request token is properly extracted from the callback URL
- Verify API credentials are correctly configured

### MCP Server Connection
- Restart Claude Desktop after updating the configuration file
- Verify the configuration file is in the correct location for your OS
- Check that the MCP server is properly running

### Trading Operations
- Confirm your trading account has sufficient balance
- Verify stock symbols are correct and tradable
- Check market hours and trading status


## License

This project is created for educational and personal trading purposes. Please ensure compliance with your broker's API terms and local trading regulations.

## Disclaimer

**⚠️ Trading Risk Warning**: This application executes real trading orders. Always verify operations and understand the risks involved in trading. The developers are not responsible for any financial losses incurred through the use of this application.

---

Built with [Bun](https://bun.com) and integrated with Claude Desktop for AI-powered trading conversations.
