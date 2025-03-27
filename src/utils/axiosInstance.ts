import axios from "axios";
import Cookies from "universal-cookie";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If unauthorized and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const cookies = new Cookies();
        const refreshToken = cookies.get("refresh_token");

        const response = await axios.post(
          "/api/token/refresh/",
          { refresh: refreshToken },
          { withCredentials: true }
        );

        const { access } = response.data;

        // Update access token cookie
        cookies.set("access_token", access, {
          path: "/",
          httpOnly: true,
        });

        // Retry original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Logout user if refresh fails
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
