<div align="center">

# 🔍 Synthetic Search MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

**Web search capabilities for your MCP-enabled applications with zero-data-retention privacy.**

[Installation](#installation) • [Usage](#usage) • [Configuration](#configuration) • [API Reference](#api-reference)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🔒 Privacy First
Zero-data-retention search ensures your queries remain private and secure.

</td>
<td width="50%">

### ⚡ Fast & Accurate
Get relevant web search results in milliseconds with high-quality ranking.

</td>
</tr>
<tr>
<td width="50%">

### 🔧 Easy Integration
Simple MCP tool interface that works seamlessly with OpenCode and other MCP clients.

</td>
<td width="50%">

### 📦 Zero Dependencies
Lightweight implementation with minimal external dependencies for reliability.

</td>
</tr>
</table>

---

## 🚀 Installation

### Prerequisites
- Node.js 20 or higher
- A Synthetic API key ([Get one here](https://synthetic.new))

### Quick Start

```bash
# Clone the repository
git clone https://github.com/joephaser/synthetic-search-mcp.git
cd synthetic-search-mcp

# Install dependencies
npm install

# Build the project
npm run build
```

---

## 🎯 Usage

### 1. Configure Your API Key

```bash
# Option 1: Environment variable
export SYNTHETIC_API_KEY="your-api-key-here"

# Option 2: Using .env file
cp .env.example .env
# Edit .env and add your API key
```

### 2. Run the Server

```bash
# Production mode
npm start

# Development mode with hot reload
npm dev
```

### 3. Test It

```bash
export SYNTHETIC_API_KEY="your-api-key"
npm test
```

---

## ⚙️ Configuration

### Claude Code CLI Integration

Add this MCP server to your Claude Code configuration using the `/mcp` command:

```bash
# Add the MCP server interactively
/mcp add synthetic-search node /path/to/synthetic-search-mcp/dist/index.js

# Or edit ~/.claude/CLAUDE.md and add:
```json
{
  "mcpServers": {
    "synthetic-search": {
      "command": "node",
      "args": ["/path/to/synthetic-search-mcp/dist/index.js"],
      "env": {
        "SYNTHETIC_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

> **Note:** Replace `/path/to/synthetic-search-mcp` with the actual path to your installation and `your-api-key-here` with your Synthetic API key.

### OpenCode Integration

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

> **Note:** Replace `/path/to/synthetic-search-mcp` with the actual path to your installation and `your-api-key-here` with your Synthetic API key.

---

## 📚 API Reference

### Tool: `synthetic_search`

Search the web using Synthetic's privacy-focused search API.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | `string` | ✅ Yes | The search query to execute |

#### Example Request

```json
{
  "query": "latest TypeScript features 2024"
}
```

#### Response Format

```json
{
  "results": [
    {
      "title": "What's New in TypeScript 5.4",
      "url": "https://example.com/article",
      "date": "2024-03-15",
      "snippet": "TypeScript 5.4 introduces several exciting features..."
    }
  ]
}
```

#### Result Fields

- **Title** - The page title
- **URL** - Direct link to the source
- **Date** - Publication date (when available)
- **Snippet** - Relevant excerpt from the content

---

## 🛠️ Development

```bash
# Run in development mode
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Run tests
npm test
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ for the MCP community**

[Report Bug](https://github.com/joephaser/synthetic-search-mcp/issues) • [Request Feature](https://github.com/joephaser/synthetic-search-mcp/issues)

</div>
