interface ElectronAPI {
  closeWindow(): void;
  OpenFilePath(): void;
  generateKeys: () => Promise<{ success: boolean, message: string, privateKey?: string }>;
  copyPublicKey: () => Promise<{ success: boolean, message: string }>;
  connectToServer: (address: string) => Promise<{ success: boolean, message: string }>;
  startServer: () => Promise<{ success: boolean, message: string }>;
  stopServer: () => Promise<{ success: boolean, message: string }>;
  minimizeWindow(): void;
  openGitHub(): void;
  createSignature: (privateKey: string, message: string) => Promise<string>;
  loadSavedConfig: () => Promise<{ address?: string, privateKey?: string }>;
  saveConfig: (address: string, privateKey: string) => Promise<boolean>;
}

declare interface Window {
electronAPI: ElectronAPI;
}