import axios from "axios";
import type { AxiosInstance } from "axios";
interface ServerStatus {
  running: boolean;
  uptime?: string;
  players?: number;
  maxPlayers?: number;
}

class MinecraftAPI {
  private axiosInstance: AxiosInstance;
  private privateKey: string | null = null;

  constructor(serverAddress: string) {
    this.axiosInstance = axios.create({
      baseURL: `http://${serverAddress}:5000`,
      timeout: 8000,
    });
  }

  setPrivateKey(privateKey: string) {
    this.privateKey = privateKey;
  }

  hasPrivateKey(): boolean {
    return this.privateKey !== null;
  }

  private async createSignature(message: string): Promise<string> {
    if (!this.privateKey) {
      throw new Error("Private key not set");
    }
    const signature = await window.electronAPI.createSignature(this.privateKey, message);
    if (!signature) {
      throw new Error("Failed to create signature");
    }
    return signature;
  }

  async checkConnection(): Promise<boolean> {
    try {
      const res = await this.axiosInstance.get('/status');
      return res.status === 200;
    } catch (error) {
      console.error('Connection check failed:', error);
      return false;
    }
  }

  async getServerStatus(): Promise<ServerStatus> {
    try {
      const signature = await this.createSignature('status');
      const res = await this.axiosInstance.get('/status', {
        headers: {
          'X-Signature': signature
        }
      });
      return res.data as ServerStatus;
    } catch (error) {
      console.error('Failed to get server status:', error);
      return { running: false };
    }
  }

  async startServer(): Promise<{ success: boolean; message: string }> {
    try {
      const signature = await this.createSignature('start');
      await this.axiosInstance.post('/start', {}, {
        headers: {
          'X-Signature': signature
        }
      });
      return { 
        success: true, 
        message: 'Server starting...'
      };
    } catch (error: any) {
      console.error('Failed to start server:', error);
      return { 
        success: false, 
        message: error.response?.data?.detail || 'Failed to start server'
      };
    }
  }

  async stopServer(): Promise<{ success: boolean; message: string }> {
    try {
      const signature = await this.createSignature('stop');
      await this.axiosInstance.post('/stop', {}, {
        headers: {
          'X-Signature': signature
        }
      });
      return { 
        success: true, 
        message: 'Server stopping...'
      };
    } catch (error: any) {
      console.error('Failed to stop server:', error);
      return { 
        success: false, 
        message: error.response?.data?.detail || 'Failed to stop server'
      };
    }
  }
}

export default MinecraftAPI;