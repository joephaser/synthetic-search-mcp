#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

interface SearchResult {
  url: string;
  title: string;
  text: string;
  published: string;
}

interface SearchResponse {
  results: SearchResult[];
}

const SYNTHETIC_API_KEY = process.env.SYNTHETIC_API_KEY;
const SYNTHETIC_SEARCH_URL = "https://api.synthetic.new/v2/search";

if (!SYNTHETIC_API_KEY) {
  console.error("Error: SYNTHETIC_API_KEY environment variable is required");
  process.exit(1);
}

const server = new Server(
  {
    name: "synthetic-search-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "synthetic_search",
        description:
          "Search the web using Synthetic's zero-data-retention search API. " +
          "Returns relevant web results including URL, title, snippet text, and publication date.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "The search query to execute",
            },
          },
          required: ["query"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "synthetic_search") {
    const { query } = request.params.arguments as { query: string };

    try {
      const response = await fetch(SYNTHETIC_SEARCH_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${SYNTHETIC_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Search API error: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const data = await response.json() as SearchResponse;
      
      const formattedResults = data.results
        .map(
          (result, index) =>
            `[${index + 1}] ${result.title}\nURL: ${result.url}\nPublished: ${result.published}\n${result.text}\n`
        )
        .join("\n");

      return {
        content: [
          {
            type: "text",
            text: formattedResults || "No results found",
          },
        ],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: "text",
            text: `Search failed: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  }

  throw new Error(`Unknown tool: ${request.params.name}`);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Synthetic Search MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
