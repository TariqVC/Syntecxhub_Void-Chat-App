import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true, // sends cookies with every request
});

export default axiosInstance;