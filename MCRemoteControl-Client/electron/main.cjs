const { app, BrowserWindow, ipcMain, clipboard, shell, dialog, nativeTheme } = require("electron");
const { autoUpdater } = require("electron-updater"); 
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const isDev = process.env.NODE_ENV === 'development';

nativeTheme.themeSource = 'dark';

function createWindow() {
  const win = new BrowserWindow({
    width: 600,
    height: 450,
    icon: null,
    resizable: false,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,    },
  });
  win.removeMenu();
  if (isDev) {
    console.log("Loading from development server...");
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    const indexPath = path.join(__dirname, "../dist/index.html");
    if (fs.existsSync(indexPath)) {
      console.log("Loading from:", indexPath);
      win.loadFile(indexPath);
    } else {
      console.error("Build files not found. Did you run 'npm run build' first?");
    }
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
  
  return win;
}

// Auto update event listeners
autoUpdater.on('update-available', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Update available',
    message: 'A new version is available. It is being downloaded now.',
  });
});

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Update Ready',
    message: 'Update downloaded. Application will now restart.',
  }).then(() => autoUpdater.quitAndInstall());
});

// Config path setup
const getUserDataPath = () => app.getPath('userData');
const getConfigPath = () => path.join(getUserDataPath(), '.mcremoteconfig');

function loadConfig() {
  const configPath = getConfigPath();
  if (fs.existsSync(configPath)) {
    try {
      const configData = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      return configData;
    } catch (error) {
      console.error('Error loading config:', error);
      return {};
    }
  }
  return {};
}

// IPC Handlers
ipcMain.handle('generate-keys', async () => {
  try {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });

    const configDir = getUserDataPath();
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }
    
    const configData = {
      privateKey,
      publicKey
    };

    fs.writeFileSync(getConfigPath(), JSON.stringify(configData, null, 2));
    return { 
      success: true, 
      message: 'New key pair generated successfully',
      privateKey: privateKey
    };
  } catch (error) {
    console.error('Error generating keys:', error);
    return { success: false, message: 'Error generating keys' };
  }
});

ipcMain.on('close-window', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) win.close();
});

ipcMain.handle('OpenFilePath', async () => {
  try {
    const configDir = getUserDataPath();
    
    await shell.openPath(configDir);
    
    return { 
      success: true, 
      message: 'Config directory opened successfully',
      path: configDir 
    };
  } catch (error) {
    console.error('Error opening config directory:', error);
    return { success: false, message: 'Error opening config directory' };
  }
});

ipcMain.handle('open-github', async () => {
  try {
    await shell.openExternal('https://github.com/RasmusLiltorp/MCRemoteControl');
    return { success: true };
  } catch (error) {
    console.error('Error opening GitHub page:', error);
    return { success: false };
  }
});

ipcMain.handle('copy-public-key', async () => {
  try {
    const configPath = getConfigPath();
    if (fs.existsSync(configPath)) {
      const configData = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      clipboard.writeText(configData.publicKey);
      return { success: true, message: 'Public key copied to clipboard' };
    } else {
      return { success: false, message: 'No keys found. Generate keys first.' };
    }
  } catch (error) {
    console.error('Error copying public key:', error);
    return { success: false, message: 'Error accessing keys' };
  }
});

ipcMain.handle('connect-to-server', async (_, address) => {
  return { success: true, message: `Connecting to ${address}...` };
});

ipcMain.handle('start-server', async () => {
  return { success: true, message: 'Starting server...' };
});

ipcMain.handle('stop-server', async () => {
  return { success: true, message: 'Stopping server...' };
});

ipcMain.on('minimize-window', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) win.minimize();
});

app.whenReady().then(() => {
  createWindow();

  // Check for updates when the app is ready (non-dev)
  if (!isDev) {
    autoUpdater.checkForUpdatesAndNotify();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle('create-signature', async (_, privateKey, message) => {
  try {
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(message);
    sign.end();
    return sign.sign(privateKey, 'base64');
  } catch (error) {
    console.error('Error creating signature:', error);
    return null;
  }
});

ipcMain.handle('loadSavedConfig', async () => {
  try {
    const config = loadConfig();
    return {
      address: config.serverAddress,
      privateKey: config.privateKey
    };
  } catch (error) {
    console.error('Error loading saved config:', error);
    return {};
  }
});

ipcMain.handle('saveConfig', async (_, address, privateKey) => {
  try {
    const config = loadConfig();
    const updatedConfig = {
      ...config,
      serverAddress: address,
      privateKey: privateKey
    };
    
    fs.writeFileSync(getConfigPath(), JSON.stringify(updatedConfig, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving config:', error);
    return false;
  }
});