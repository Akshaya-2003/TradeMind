import { KiteConnect } from "kiteconnect";
import https from "https";

const apiKey = "Add your apikey";
const apiSecret = "Add your apiSecret";
const requestToken = "Add your requestToken";
let accessToken = "Add your accessToken";

// Allow self-signed certificates (Bun/Node compatible)
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
const httpsAgent = new https.Agent({ rejectUnauthorized: false });
https.globalAgent.options.rejectUnauthorized = false;

const kc = new KiteConnect({ api_key: apiKey });

console.log(kc.getLoginURL());

// Retain agent reference if needed elsewhere
const agent = httpsAgent;

async function init() {
  try {
    await generateSession();
    await getProfile();
  } catch (err) {
    console.error(err);
  }
}

async function generateSession() {
  try {
    const response = await kc.generateSession(requestToken, apiSecret);
    console.log(response.access_token);
    kc.setAccessToken(response.access_token);
    console.log("Session generated:", response);
  } catch (err) {
    console.error("Error generating session:", err);
  }
}

async function getProfile() {
  try {
    const profile = await kc.getProfile();
    console.log("Profile:", profile);
  } catch (err) {
    console.error("Error getting profile:", err);
  }
}
// Initialize the API calls
init();
