interface ElectronAPI {
    closeWindow(): void;
    OpenFilePath(): void;
    generateKeys: () => Promise<{ success: boolean, message: string }>;
    copyPublicKey: () => Promise<{ success: boolean, message: string }>;
    connectToServer: (address: string) => Promise<{ success: boolean, message: string }>;
    startServer: () => Promise<{ success: boolean, message: string }>;
    stopServer: () => Promise<{ success: boolean, message: string }>;
    minimizeWindow(): void;
    openGitHub(): void;
}

declare interface Window {
  electronAPI: ElectronAPI;
}