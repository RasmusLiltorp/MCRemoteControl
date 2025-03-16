import axios from "axios";
import type { AxiosInstance } from "axios";

class MinecraftAPI {
  private axiosInstance: AxiosInstance;
  private serverAddress: string;

  constructor(serverAddress: string) {
    this.serverAddress = serverAddress;
    this.axiosInstance = axios.create({
      baseURL: `http://${serverAddress}:5000`,
      timeout: 5000,
    });
  }
}

export default MinecraftAPI;
