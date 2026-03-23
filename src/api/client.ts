import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://api.cleancity.local",
  timeout: 10000,
});
