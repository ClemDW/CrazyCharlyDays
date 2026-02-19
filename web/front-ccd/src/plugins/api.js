import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default {
  install: (app) => {
    app.config.globalProperties.$api = apiClient;
  },
};
