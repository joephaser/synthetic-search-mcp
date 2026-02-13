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
const REQUEST_TIMEOUT_MS = 30000;

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
    const args = request.params.arguments as { query?: unknown };
    const query = args.query;

    if (typeof query !== "string" || query.trim().length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "Error: query must be a non-empty string",
          },
        ],
        isError: true,
      };
    }

    if (query.length > 2000) {
      return {
        content: [
          {
            type: "text",
            text: "Error: query must be 2000 characters or less",
          },
        ],
        isError: true,
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      const response = await fetch(SYNTHETIC_SEARCH_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${SYNTHETIC_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: query.trim() }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

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
      let errorMessage: string;
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          errorMessage = "Search request timed out after 30 seconds";
        } else {
          errorMessage = error.message;
        }
      } else {
        errorMessage = String(error);
      }
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
