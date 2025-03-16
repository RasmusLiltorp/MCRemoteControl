# MCRemoteControl

MCRemoteControl is a tool for allowing others to start and stop your Minecraft server. The project is divided into two parts:

- **Client Side** – An Electron application (built with Vue 3, TypeScript, and Vite) for server configuration, key generation, and remote control.
- **Server Side** – A FastAPI-based Python application that authenticates remote commands using RSA signatures and manages the Minecraft server process.

---

## Table of Contents

- [Client Side Installation](#client-side-installation)
  - [Prerequisites](#prerequisites)
  - [Installation & Development](#installation--development)
  - [Production Build](#production-build)
  - [Key Generation](#key-generation)
- [Server Side Installation](#server-side-installation)
  - [Local Setup](#local-setup)
  - [Docker Setup](#docker-setup)
  - [Integrating with Your Minecraft Server](#integrating-with-your-minecraft-server)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)

---

## Client Side Installation

### Prerequisites

- [Node.js (v16 or later)](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### Installation & Development

- **TODO:** Provide detailed instructions for cloning, installing dependencies, and running in development mode.

### Production Build

- **TODO:** Provide build and preview instructions.

### Key Generation

The client provides functionality to generate an RSA key pair:

- When you click **Generate New Key Pair** in the settings, the application generates a new RSA key pair.
- The private key is returned to the client and is saved in your configuration.
- You can then use the **Copy Public Key** button to copy the public key to your clipboard.
- **Important:** After generating keys, make sure you enter and save the server address in the settings.

---

## Server Side Installation

The server is a FastAPI application that processes remote control commands and manages your Minecraft server. It uses RSA keys for authentication.

### Local Setup

#### Prerequisites

- [Python 3.10](https://www.python.org/downloads/)
- [pip](https://pip.pypa.io/en/stable/installation/)

#### Steps

1. **Clone the repository and navigate to the server directory:**

   ```bash
   git clone https://github.com/RasmusLiltorp/MCRemoteControl.git
   cd MCRemoteControl/MCRemoteControl-Server
   ```

2. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

3. **Run the server:**

   Start the FastAPI server using Uvicorn by running:

   ```bash
   python app.py
   ```

   The server will first check for authentication keys. In the absence of keys, it will prompt:

   ```
   ===== MCRemoteControl Server =====
   No authentication keys found!
   
   To configure the server, run:
     python setup.py --add-key <path_to_public_key>
   Or use the interactive setup now:
   Would you like to run the setup now? (y/N):
   ```

   In the `app.py` file, if no keys are found the interactive setup is triggered:

   ```python
   def setup_initial_config():
       # Make sure config exists
       cfg = config.load_config()
       
       # Check if any keys are configured
       keys = config.list_authorized_keys()
       
       if not keys:
           print("\n===== MCRemoteControl Server =====")
           print("No authentication keys found!")
           print("\nTo configure the server, run:")
           print("  python setup.py --add-key <path_to_public_key>")
           print("\nOr use the interactive setup now:")
           
           choice = input("Would you like to run the setup now? (y/N): ")
           if choice.lower() == 'y':  
               # Import and run setup
               import setup
               setup.main()
           else:
               choice = input("Setup cancelled")
               sys.exit(1)
       else:
           print(f"\n===== MCRemoteControl Server =====")
           print(f"Found {len(keys)} configured authentication keys")
           for key in keys:
               print(f" - {key['name']} (Fingerprint: {key['fingerprint']})")
       
       print("\n=====================================")
   ```

   After setup, the server starts on the host and port specified in your configuration (default is host `0.0.0.0` and port `5000`).

### Docker Setup

Docker is recommended for a consistent, containerized deployment.

1. **Ensure Docker is installed** on your VPS. (See [Docker Installation Guide](https://docs.docker.com/get-docker/) for details.)

2. **Build the Docker image:**  
   In the `MCRemoteControl-Server` directory where the Dockerfile is located, run:

   ```bash
   docker build -t mcremotecontrol-server .
   ```

3. **Run the Docker container:**  
   Map container port 5000 to host port 5000:

   ```bash
   docker run -d --name mcremotecontrol-server -p 5000:5000 mcremotecontrol-server
   ```

   The Dockerfile starts the server using the command:

   ```
   CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5000"]
   ```

### Integrating with Your Minecraft Server

After installing the server, integrate it with your Minecraft server installation. This means moving the MCRemoteControl-Server files into your Minecraft server’s root folder.

## Move the Files to Your Minecraft Server Directory

Assuming your Minecraft server root is `/minecraft`, run:
```
sudo cp -r /MCRemoteControl/MCRemoteControl-Server/ ./minecraft
```
---

## Usage

- **Client Side:**  
  Launch the application. Enter your Minecraft server address, generate RSA keys, and use the provided controls (connect, start, stop) to manage your server.

- **Server Side:**  
  The FastAPI server validates API requests using RSA signatures. It processes commands (like start or stop) which are triggered via API endpoints. Monitor the server through logs or status endpoints for operation status.

---

## Troubleshooting

- TODO
