#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import ollama from 'ollama';
import fs from 'fs';

const PROMPT = 'Extract all text and tables into Markdown format. Maintain the original structure and use LaTeX for any mathematical formulas.';

const server = new Server(
  {
    name: 'glm-ocr-server',
    version: '1.0.0',
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
        name: 'ocr_document',
        description: 'Perform OCR on an image document using GLM-OCR via Ollama',
        inputSchema: {
          type: 'object',
          properties: {
            image_path: {
              type: 'string',
              description: 'Path to the image file to process',
            },
          },
          required: ['image_path'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== 'ocr_document') {
    throw new Error(`Unknown tool: ${request.params.name}`);
  }

  const { image_path } = request.params.arguments;

  if (!image_path) {
    throw new Error('image_path is required');
  }

  if (!fs.existsSync(image_path)) {
    throw new Error(`Image file not found: ${image_path}`);
  }

  try {
    const imageBuffer = fs.readFileSync(image_path);
    const base64Image = imageBuffer.toString('base64');

    const response = await ollama.chat({
      model: 'glm-ocr',
      messages: [
        {
          role: 'user',
          content: PROMPT,
          images: [base64Image],
        },
      ],
    });

    return {
      content: [
        {
          type: 'text',
          text: response.message.content,
        },
      ],
    };
  } catch (error) {
    throw new Error(`OCR failed: ${error.message}`);
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('GLM-OCR MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});