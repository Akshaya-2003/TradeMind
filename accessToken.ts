import { KiteConnect } from "kiteconnect";
import https from "https";

const apiKey = "fyicz55abxw00mfd";
const apiSecret = "ihg4uvdvk2cw2xo0uauag3ps7enyo885";
const requestToken = "uXCatZ7u0uFhZgM8gKNHcNtiLny4dIK1";
// let accessToken = "";

const kc = new KiteConnect({ api_key: apiKey });

console.log(kc.getLoginURL());

const agent = new https.Agent({
    rejectUnauthorized: false,
  });

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
    // kc.setAccessToken(response.access_token);
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