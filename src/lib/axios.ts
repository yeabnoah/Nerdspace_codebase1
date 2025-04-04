import axios from "axios"

// Create an Axios instance with default config
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "An unexpected error occurred"
    return Promise.reject(new Error(message))
  },
)

export default api

