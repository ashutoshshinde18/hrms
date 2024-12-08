import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:8000", // Replace with your backend URL
    withCredentials: true, // Include cookies for cross-origin requests
});

// Add a response interceptor
apiClient.interceptors.response.use(
    (response) => response, // Return response if successful
    async (error) => {
        const originalRequest = error.config;
        console.log('originalRequest:',originalRequest)

        // Check if the error is due to an expired access token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                console.log("Attempting token refresh...");
                // Refresh the token
                const refreshResponse =await axios.post(
                    "/user-management/api/token/refresh/",
                    {},
                    { withCredentials: true }
                );
                console.log("Token refreshed successfully:", refreshResponse.data);

                // Retry the original request
                return apiClient(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                window.location.href = "/login"; // Redirect to login
            }
        }

        // If the error is not due to token expiration, reject it
        return Promise.reject(error);
    }
);

export default apiClient;
