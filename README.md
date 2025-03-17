# MCRemoteControl
MCRemoteControl lets you remotely start, stop, and manage your Minecraft server with a secure and easy-to-use interface. Generate your key pair, add the public key to your server, and take full control of your Minecraft world—right from your desktop! 🚀

MCRemoteControl is a tool split into two parts:

- **Client:** An Electron (Vue 3/TypeScript/Vite) application that you can download from the [Releases](https://github.com/RasmusLiltorp/MCRemoteControl/releases) page.
- **Server:** A FastAPI-based Python application for managing your Minecraft server, secured with RSA keys.

![image](https://github.com/user-attachments/assets/8cef2076-3321-4d4c-843e-570f257f0c2a)

---

## Client Setup

1. **Download the Client Installer:**

   - Visit the [Releases](https://github.com/RasmusLiltorp/MCRemoteControl/releases) page.
   - Download the latest Windows installer (an `.exe` file).

2. **Install the Client:**

   - Run the installer and follow the on-screen instructions.
   - Once installed, launch the application.
   - Use the settings menu to +generate a new RSA key pair.
   - Connect to your server after providing the host with your public key (copy it from the settings menu).

---

## Server Setup

### Prerequisites

- **Python 3.10 or later**  
- **pip**

### Step-by-Step Setup

1. **Clone the Repository and Navigate to the Server Directory:**

   Open a terminal and run:
   ```bash
   git clone https://github.com/RasmusLiltorp/MCRemoteControl.git
   cd MCRemoteControl/MCRemoteControl-Server
   ```

2. **Set Up a Python Virtual Environment:**

   Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Dependencies:**

   Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Your Minecraft Server Folder Path:**

   The server uses a configuration file (`config.json`). To set your Minecraft server root directory, run:
   ```bash
   python setup.py --mc-root "/path/to/your/minecraft/server/folder"
   ```
   Replace `/path/to/your/minecraft/server/folder` with the full path to your Minecraft server folder.

5. **Setting Up API Keys:**

   If no authentication keys are found, the server will prompt you during startup.
   - Start the server with:
     ```bash
     python app.py
     ```
   - You will see a message like:
     ```
     No authentication keys found!
     To configure the server, run:
       python setup.py --add-key <path_to_public_key>
     Or use the interactive setup now:
     Would you like to run the setup now? (y/N):
     ```
   - To add a key, you can either:
     - Pass the entire public key as text on the command line, or
     - Use the interactive mode when prompted.  
   **Example interactive flow:**
   - If prompted, type `y` and then you will see your public key printed.
   - Next, you will be asked:
     ```
     Enter a name for this public key:
     ```
     Provide a unique name _without duplicates_ (if a key with that name already exists, the setup will warn you).

6. **Start the API Server:**

   Once the above setup is complete, start the server again:
   ```bash
   python app.py
   ```
   The API will attempt to bind to host `0.0.0.0` on port `5000`. Make sure this port is free.

7. **Verifying Server Operation:**

   Use the client application to connect to your server. The client will use the RSA key pair for signing API requests.

---

## Troubleshooting

- **Port 5000 Already in Use:**  
  Check which process is using port 5000:
  ```bash
  sudo lsof -i :5000
  ```
  Then kill the process using:
  ```bash
  sudo kill -9 <PID>
  ```
  Alternatively, you can force kill all processes with:
  ```bash
  sudo fuser -k 5000/tcp
  ```

- **Virtual Environment Issues:**  
  If you experience issues, make sure you have activated the correct Python virtual environment:
  ```bash
  source venv/bin/activate
  ```

- **API Key Setup:**  
  Ensure that when adding a key, you provide a unique name. The interactive setup will prompt you to enter a name if you did not supply one. Duplicate names are not allowed.

---

Now you are ready to use MCRemoteControl to remotely manage your Minecraft server! Enjoy!
