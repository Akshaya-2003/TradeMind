import { KiteConnect } from "kiteconnect";
import https from "https";

// Configuration
const CONFIG = {
  apiKey: "fyicz55abxw00mfd",
  accessToken: "DmOs6vslqtLZaVv4vIwuGWAQtFtmsZJg", // UPDATE THIS WITH FRESH TOKEN
  timeout: 15000,
  retryAttempts: 2
};

// Create a secure HTTPS agent specifically for Kite Connect
const createSecureAgent = () => {
  return new https.Agent({
    // Only bypass SSL for Kite Connect if necessary
    rejectUnauthorized: process.env.NODE_ENV === 'production' ? true : false,
    // Use modern TLS
    secureProtocol: 'TLSv1_2_method',
    // Connection pooling for better performance
    keepAlive: true,
    maxSockets: 5,
    timeout: CONFIG.timeout
  });
};

// Initialize KiteConnect with secure configuration
const initializeKiteConnect = () => {
  const kc = new KiteConnect({ 
    api_key: CONFIG.apiKey,
    timeout: CONFIG.timeout
  });
  
  kc.setAccessToken(CONFIG.accessToken);
  
  // Apply secure agent configuration
  (kc as any).request_opts = {
    agent: createSecureAgent(),
    timeout: CONFIG.timeout,
    headers: {
      'User-Agent': 'KiteConnect-Node-Secure',
      'Accept': 'application/json'
    }
  };
  
  return kc;
};

// Validate credentials before making trades
async function validateCredentials(kc: any): Promise<boolean> {
  try {
    await kc.getProfile();
    return true;
  } catch (error: any) {
    if (error.message?.includes('api_key') || error.message?.includes('access_token')) {
      throw new Error("Invalid or expired credentials - please refresh your access token");
    }
    throw error;
  }
}

// Retry mechanism for network issues
async function executeWithRetry<T>(
  operation: () => Promise<T>, 
  attempts: number = CONFIG.retryAttempts
): Promise<T> {
  let lastError: any;
  
  for (let i = 0; i < attempts; i++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // Don't retry for authentication errors
      if (error.message?.includes('api_key') || error.message?.includes('access_token')) {
        throw error;
      }
      
      // Wait before retry (exponential backoff)
      if (i < attempts - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError;
}

// Main order placement function
export async function placeOrder(
  tradingsymbol: string,
  quantity: number,
  type: "BUY" | "SELL"
): Promise<any> {
  // Input validation
  if (!tradingsymbol || quantity <= 0) {
    throw new Error("Invalid trading symbol or quantity");
  }
  
  if (!["BUY", "SELL"].includes(type)) {
    throw new Error("Invalid transaction type. Must be BUY or SELL");
  }
  
  const kc = initializeKiteConnect();
  
  try {
    // Validate credentials first
    await validateCredentials(kc);
    
    // Execute order with retry mechanism
    const order = await executeWithRetry(async () => {
      return await kc.placeOrder("regular", {
        exchange: "NSE",
        tradingsymbol: tradingsymbol.toUpperCase(),
        transaction_type: type,
        quantity,
        product: "CNC",
        order_type: "MARKET",
      });
    });
    
    return order;
    
  } catch (error: any) {
    // Enhanced error handling with specific messages
    const errorMessage = getErrorMessage(error);
    throw new Error(errorMessage);
  }
}

// Centralized error message handling
function getErrorMessage(error: any): string {
  if (error.message?.includes('Invalid or expired credentials')) {
    return error.message;
  }
  
  if (error.error_type === 'TokenException') {
    return "Access token expired. Please generate a new token from your Kite Connect dashboard.";
  }
  
  if (error.error_type === 'PermissionException') {
    return "Permission denied. Check your API permissions and subscription.";
  }
  
  if (error.error_type === 'OrderException') {
    return `Order error: ${error.message || 'Invalid order parameters'}`;
  }
  
  if (error.message?.includes('ECONNREFUSED')) {
    return "Connection refused. Kite Connect API might be down.";
  }
  
  if (error.message?.includes('ETIMEDOUT')) {
    return "Request timeout. Please try again.";
  }
  
  if (error.message?.includes('certificate') || error.message?.includes('CERT')) {
    return "SSL certificate error. This is a known issue with the trading system.";
  }
  
  // Generic error with sanitized message
  return `Trading error: ${error.message || 'Unknown error occurred'}`;
}

// Health check function (optional - for debugging)
export async function healthCheck(): Promise<{ status: string; message: string }> {
  try {
    const kc = initializeKiteConnect();
    await validateCredentials(kc);
    return { status: "healthy", message: "API connection successful" };
  } catch (error: any) {
    return { status: "error", message: getErrorMessage(error) };
  }
}