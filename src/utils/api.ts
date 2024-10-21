import axios from "axios";
import CONFIG from "./config";
import router from "@src/router";

const api = axios.create({
  baseURL: CONFIG.APP_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 404) {
        router.push({ path: "/error/404", replace: true });
    } else {
        return error.response;
    }

    return Promise.reject(error);
  }
);

export default api;
