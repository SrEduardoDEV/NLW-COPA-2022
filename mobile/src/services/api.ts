import axios from "axios";

export const api = axios.create({
  baseURL: "http://172.20.20.21:3333",
});
