import { KiteConnect } from "kiteconnect";
import https from "https";

const apiKey = "fyicz55abxw00mfd";
let accessToken = "ce6o4ZBLXeyj8GHOJyK1F17fDilT7mgu";


// Create an HTTPS agent that ignores self-signed certs
const agent = new https.Agent({
  rejectUnauthorized: false,
});

const kc = new KiteConnect({ api_key: apiKey });

console.log(kc.getLoginURL())

export async function placeOrder(tradingsymbol: string, quantity: number, type: "BUY" | "SELL") {
  try {
    kc.setAccessToken(accessToken);
    const profile = await kc.placeOrder("regular", {
      exchange: "NSE",
      tradingsymbol,
      transaction_type: type,
      quantity,
      product: "CNC", //INTRADAY OR LONG-TERM
      order_type: "MARKET"
    });
  } catch (err) {
    console.error(err);
  }
}

