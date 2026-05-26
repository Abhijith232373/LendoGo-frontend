// src/utils/apiClient.js

const BASE_URL = 'http://localhost:8080/api';

export const apiClient = async (endpoint, options = {}) => {
  // 1. Automatically set up the headers
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // 2. Merge default options with any custom options you pass in
  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    // 👇 CRITICAL: This forces the browser to send the httpOnly cookie!
    credentials: 'include', 
  };

  try {
    // 3. Make the actual request
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const rawText = await response.text();
    
    let data = {};
    if (rawText) {
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        console.error("Non-JSON response:", rawText);
        throw new Error(`Server returned unexpected format (${response.status})`);
      }
    }

    // 4. Handle global 401 Unauthorized (e.g., token expired)
    if (response.status === 401) {
      console.warn("Session expired or unauthorized. Logging out...");
      // Optional: You can trigger a global event here to force the user to the login screen
      // window.dispatchEvent(new Event('auth-unauthorized'));
    }

    // 5. If it failed, throw an error so your components can catch it
    if (!response.ok) {
      throw new Error(data.error || `HTTP Error: ${response.status}`);
    }

    // 6. Return the clean data
    return data;

  } catch (error) {
    console.error(`API Client Error [${endpoint}]:`, error.message);
    throw error;
  }
};