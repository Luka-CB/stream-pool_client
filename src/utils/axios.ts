import axios from "axios";

export default axios.create({
  baseURL: "https://stream-pool-api.onrender.com",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
