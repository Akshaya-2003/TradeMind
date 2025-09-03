import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { placeOrder, healthCheck } from "./trade";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Create MCP server
const server = new McpServer({
  name: "secure-trading-server",
  version: "1.0.0"
});

// Math tools
server.tool("add",
  { a: z.number(), b: z.number() },
  async ({ a, b }) => ({
    content: [{ type: "text", text: String(a + b) }]
  })
);

server.tool("factorial",
  { a: z.number() },
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

// Trading tools
server.tool("buy-stock",
  { 
    stock: z.string().min(1).max(20),
    quantity: z.number().positive().int()
  },
  async ({ stock, quantity }) => {
    try {
      const order = await placeOrder(stock, quantity, "BUY");
      return {
        content: [{ 
          type: "text", 
          text: `✅ Buy order placed successfully!\nStock: ${stock}\nQuantity: ${quantity}\nOrder ID: ${order.order_id}` 
        }]
      };
    } catch (err: any) {
      return {
        content: [{ 
          type: "text", 
          text: `❌ Buy order failed: ${err.message}` 
        }]
      };
    }
  }
);

server.tool("sell-stock",
  { 
    stock: z.string().min(1).max(20),
    quantity: z.number().positive().int()
  },
  async ({ stock, quantity }) => {
    try {
      const order = await placeOrder(stock, quantity, "SELL");
      return {
        content: [{ 
          type: "text", 
          text: `✅ Sell order placed successfully!\nStock: ${stock}\nQuantity: ${quantity}\nOrder ID: ${order.order_id}` 
        }]
      };
    } catch (err: any) {
      return {
        content: [{ 
          type: "text", 
          text: `❌ Sell order failed: ${err.message}` 
        }]
      };
    }
  }
);

// Health check tool (for debugging)
server.tool("trading-status",
  {},
  async () => {
    try {
      const status = await healthCheck();
      return {
        content: [{ 
          type: "text", 
          text: `Trading System Status: ${status.status.toUpperCase()}\n${status.message}` 
        }]
      };
    } catch (err: any) {
      return {
        content: [{ 
          type: "text", 
          text: `❌ Status check failed: ${err.message}` 
        }]
      };
    }
  }
);

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);