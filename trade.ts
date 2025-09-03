// Force disable SSL verification
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

import { KiteConnect } from "kiteconnect";
import https from "https";

// TODO: Update these credentials with fresh values
const apiKey = "fyicz55abxw00mfd";
let accessToken = "DmOs6vslqtLZaVv4vIwuGWAQtFtmsZJg";

// Create KiteConnect instance
const kc = new KiteConnect({ 
  api_key: apiKey,
  timeout: 7000
});

kc.setAccessToken(accessToken);

// Configure with SSL bypass
(kc as any).request_opts = {
  agent: new https.Agent({
    rejectUnauthorized: false,
    secureProtocol: 'TLSv1_2_method',
    checkServerIdentity: () => undefined
  }),
  timeout: 15000
};

export async function placeOrder(
  tradingsymbol: string,
  quantity: number,
  type: "BUY" | "SELL"
) {
  try {
    const order = await kc.placeOrder("regular", {
      exchange: "NSE",
      tradingsymbol,
      transaction_type: type,
      quantity,
      product: "CNC",
      order_type: "MARKET",
    });
    
    return order;
    
  } catch (err: any) {
    // Enhanced error messages without console pollution
    if (err.message && err.message.includes('api_key')) {
      throw new Error("Authentication failed - please check your API key and access token");
    } else if (err.message && err.message.includes('access_token')) {
      throw new Error("Access token expired - please generate a new access token");
    } else if (err.error_type === 'TokenException') {
      throw new Error("Token error - your access token may have expired");
    } else if (err.error_type === 'PermissionException') {
      throw new Error("Permission denied - check your API permissions");
    } else {
      throw new Error(`Trading error: ${err.message || 'Unknown error occurred'}`);
    }
  }
}