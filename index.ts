// Force disable SSL verification at the process level
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { placeOrder } from "./trade";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Create an MCP server
const server = new McpServer({
  name: "demo-server",
  version: "1.0.0"
});

// Add an addition tool
server.tool("add",
  { a: z.number(), b: z.number() },
  async ({ a, b }) => ({
    content: [{ type: "text", text: String(a + b) }]
  })
);

// Add a factorial tool
server.tool("factorial",
  {a: z.number() },
  async ({ a }) => {
    let answer = 1;
    for (let i = 2; i <= a; i++) {
      answer *= i;
    }
    return {
      content: [{ type: "text", text: String(answer) }]
    }
  }
);

// Add a buy stock tool
server.tool("buy-stock",
  { stock: z.string(), quantity: z.number() },
  async ({ stock, quantity }) => {
    try {
      const order = await placeOrder(stock, quantity, "BUY");
      return {
        content: [{ type: "text", text: `✅ Buy order placed successfully. Order ID: ${order.order_id}` }]
      };
    } catch (err: any) {
      return {
        content: [{ type: "text", text: `❌ Buy order failed: ${err.message || err}` }]
      };
    }
  }
);

// Add a sell stock tool
server.tool("sell-stock",
  {stock: z.string(), quantity: z.number()},
  async ({stock, quantity}) => {
    try {
      const order = await placeOrder(stock, quantity, "SELL");
      return {
        content: [{ type: "text", text: `✅ Sell order placed successfully. Order ID: ${order.order_id}` }]
      };
    } catch (err: any) {
      return {
        content: [{ type: "text", text: `❌ Sell order failed: ${err.message || err}` }]
      };
    }
  }
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);