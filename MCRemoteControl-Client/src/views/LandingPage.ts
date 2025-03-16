import { defineComponent, ref } from 'vue';

declare global {
  interface Window {
    electronAPI: {
      generateKeys: () => Promise<{ success: boolean, message: string }>;
      copyPublicKey: () => Promise<{ success: boolean, message: string }>;
      connectToServer: (address: string) => Promise<{ success: boolean, message: string }>;
      startServer: () => Promise<{ success: boolean, message: string }>;
      stopServer: () => Promise<{ success: boolean, message: string }>;
      OpenFilePath: () => void;
      closeWindow: () => void;
      minimizeWindow: () => void;
      openGitHub: () => void;
    }
  }
}

export default defineComponent({
  setup() {
    const serverAddress = ref('');
    const statusMessage = ref('Open settings to configure the client!');
    const showSettings = ref(false);
    
    const generateKeys = async () => {
      try {
        const result = await window.electronAPI.generateKeys();
        statusMessage.value = result.message;
      } catch (error) {
        console.error('Error generating keys:', error);
        statusMessage.value = 'Error generating keys. See console for details.';
      }
    };

    const openGitHub = () => {
        window.electronAPI.openGitHub();
      };

    const copyPubKey = async () => {
      try {
        const result = await window.electronAPI.copyPublicKey();
        statusMessage.value = result.message;
      } catch (error) {
        console.error('Error copying public key:', error);
        statusMessage.value = 'Error accessing keys. See console for details.';
      }
    };

    const toggleSettings = () => {
      showSettings.value = !showSettings.value;
    };

    const OpenFilePath = async() => {
      const result = window.electronAPI.OpenFilePath();
      return result;
    };
    const minimizeWindow = () => {
        window.electronAPI.minimizeWindow();
      };

    const connectToServer = async () => {
      try {
        const result = await window.electronAPI.connectToServer(serverAddress.value);
        statusMessage.value = result.message;
      } catch (error) {
        statusMessage.value = 'Error connecting to server';
      }
    };

    const startServer = async () => {
      try {
        const result = await window.electronAPI.startServer();
        statusMessage.value = result.message;
      } catch (error) {
        statusMessage.value = 'Error starting server';
      }
    };

    const closeWindow = () => {
        window.electronAPI.closeWindow();
      };

    const stopServer = async () => {
      try {
        const result = await window.electronAPI.stopServer();
        statusMessage.value = result.message;
      } catch (error) {
        statusMessage.value = 'Error stopping server';
      }
    };

    return {
      serverAddress,
      statusMessage,
      showSettings,
      generateKeys,
      copyPubKey,
      toggleSettings,
      connectToServer,
      startServer,
      stopServer,
      OpenFilePath,
      closeWindow,
      minimizeWindow,
      openGitHub
    };
  }
});