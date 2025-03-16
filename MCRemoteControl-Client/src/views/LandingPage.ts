import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import MinecraftAPI from '../api';

export default defineComponent({
  setup() {
    const serverAddress = ref('');
    const statusMessage = ref('Open settings to configure the client!');
    const showSettings = ref(false);
    const isConnected = ref(false);
    const isServerRunning = ref(false);
    const apiClient = ref<MinecraftAPI | null>(null);
    const statusCheckInterval = ref<number | null>(null);
    const privateKey = ref<string | null>(null);

    // Load saved configuration on component mount
    onMounted(async () => {
      try {
        const config = await window.electronAPI.loadSavedConfig();
        if (config.address) {
          serverAddress.value = config.address;
          if (config.privateKey) {
            privateKey.value = config.privateKey;
            statusMessage.value = 'Configuration loaded. Click Connect to start.';
          }
        }
      } catch (error) {
        console.error('Failed to load configuration:', error);
      }
    });

    // Clean up on component unmount
    onUnmounted(() => {
      if (statusCheckInterval.value) {
        window.clearInterval(statusCheckInterval.value);
      }
    });
    
    const generateKeys = async () => {
      try {
        const result = await window.electronAPI.generateKeys();
        statusMessage.value = result.message;
        if (result.success && result.privateKey) {
          privateKey.value = result.privateKey;
          
          // Save configuration
          if (serverAddress.value) {
            await window.electronAPI.saveConfig(serverAddress.value, result.privateKey);
          }
        }
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

    const OpenFilePath = async () => {
      const result = window.electronAPI.OpenFilePath();
      return result;
    };

    const minimizeWindow = () => {
      window.electronAPI.minimizeWindow();
    };

    // Check server status periodically
    const startStatusCheck = () => {
      if (statusCheckInterval.value) {
        window.clearInterval(statusCheckInterval.value);
      }

      statusCheckInterval.value = window.setInterval(async () => {
        if (!apiClient.value || !isConnected.value) return;

        try {
          const status = await apiClient.value.getServerStatus();
          isServerRunning.value = status.running;
        } catch (error) {
          console.error('Status check failed:', error);
          // If status check consistently fails, we might be disconnected
          isConnected.value = false;
          if (statusCheckInterval.value) {
            window.clearInterval(statusCheckInterval.value);
            statusCheckInterval.value = null;
          }
          statusMessage.value = 'Connection lost. Please reconnect.';
        }
      }, 5000); // Check every 5 seconds
    };

    const connectToServer = async () => {
      try {
        if (!serverAddress.value) {
          statusMessage.value = 'Please enter a server address';
          return;
        }

        if (!privateKey.value) {
          statusMessage.value = 'No private key found. Generate keys first.';
          return;
        }

        statusMessage.value = 'Connecting to server...';
        
        // Create new API client
        const client = new MinecraftAPI(serverAddress.value);
        client.setPrivateKey(privateKey.value);
        
        // Test connection
        const connected = await client.checkConnection();
        if (!connected) {
          statusMessage.value = 'Failed to connect to server';
          return;
        }
        
        // Save the connection details
        apiClient.value = client;
        isConnected.value = true;
        await window.electronAPI.saveConfig(serverAddress.value, privateKey.value);
        
        // Get initial server status
        const status = await client.getServerStatus();
        isServerRunning.value = status.running;
        
        // Start periodic status checks
        startStatusCheck();
        
        statusMessage.value = isServerRunning.value 
          ? 'Connected! Server is running.' 
          : 'Connected! Server is stopped.';
      } catch (error) {
        console.error('Connection error:', error);
        statusMessage.value = 'Error connecting to server';
      }
    };

    const startServer = async () => {
      try {
        if (!isConnected.value) {
          statusMessage.value = 'Not connected. Connect to a server first.';
          return;
        }

        if (isServerRunning.value) {
          statusMessage.value = 'Server is already running!';
          return;
        }

        statusMessage.value = 'Starting server...';
        
        if (!apiClient.value) {
          throw new Error('API client not initialized');
        }
        
        const result = await apiClient.value.startServer();
        statusMessage.value = result.message;
        
        // Update state immediately for better UX, even though actual startup may take time
        if (result.success) {
          isServerRunning.value = true;
        }
      } catch (error) {
        console.error('Error starting server:', error);
        statusMessage.value = 'Error starting server';
      }
    };

    const closeWindow = () => {
      window.electronAPI.closeWindow();
    };

    const stopServer = async () => {
      try {
        if (!isConnected.value) {
          statusMessage.value = 'Not connected. Connect to a server first.';
          return;
        }

        if (!isServerRunning.value) {
          statusMessage.value = 'Server is not running!';
          return;
        }

        statusMessage.value = 'Stopping server...';
        
        if (!apiClient.value) {
          throw new Error('API client not initialized');
        }
        
        const result = await apiClient.value.stopServer();
        statusMessage.value = result.message;
        
        // Update state immediately for better UX
        if (result.success) {
          isServerRunning.value = false;
        }
      } catch (error) {
        console.error('Error stopping server:', error);
        statusMessage.value = 'Error stopping server';
      }
    };

    return {
      serverAddress,
      statusMessage,
      showSettings,
      isConnected,
      isServerRunning,
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