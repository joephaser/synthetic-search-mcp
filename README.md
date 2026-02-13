# Synthetic Search MCP Server

An MCP (Model Context Protocol) server that provides web search functionality using Synthetic's zero-data-retention search API.

## Features

- Web search via `synthetic_search` tool
- Zero-data-retention privacy
- Fast and relevant results

## Installation

```bash
npm install
npm run build
```

## Usage

Set your Synthetic API key:
```bash
export SYNTHETIC_API_KEY="your-api-key"
```

Run the server:
```bash
npm start
```

Or run in development mode:
```bash
npm run dev
```

## Testing

```bash
export SYNTHETIC_API_KEY="your-api-key"
npm test
```

## OpenCode Configuration

Add this MCP server to your OpenCode configuration at `~/.config/opencode/opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "synthetic-search": {
      "type": "local",
      "command": ["node", "/path/to/synthetic-search-mcp/dist/index.js"],
      "environment": {
        "SYNTHETIC_API_KEY": "your-api-key-here"
      },
      "enabled": true
    }
  }
}
```

**Note:** Replace `your-api-key-here` with your actual Synthetic API key from https://synthetic.new

## Environment Variables

Create a `.env` file from the example:

```bash
cp .env.example .env
# Edit .env and add your API key
```

## Tool: `synthetic_search`

Search the web using Synthetic's search API.

**Parameters:**
- `query` (string, required): The search query to execute

**Returns:**
Formatted search results including:
- Title
- URL
- Publication date
- Snippet text

## License

MIT License - see [LICENSE](LICENSE) file for details.
