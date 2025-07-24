import axios from "axios";

if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
  throw new Error("Missing API url");
}

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor to handle common response scenarios
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error scenarios
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error("Unauthorized access - redirecting to login");
      if (typeof window !== "undefined") {
        window.location.href = "/signin";
      }
    } else if (error.response?.status === 500) {
      console.error("Internal server error");
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout");
    } else if (error.code === "ECONNREFUSED") {
      console.error("Connection refused - server may be down");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
