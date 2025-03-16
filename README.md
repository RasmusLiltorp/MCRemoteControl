# MCRemoteControl

MCRemoteControl is a remote administration tool for Minecraft servers. The project is divided into two parts:

- **Client Side** – An Electron application (built with Vue 3, TypeScript, and Vite) for server configuration, key generation, and control.
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
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)

---

## Client Side Installation

### Prerequisites

- [Node.js (v16 or later)](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### Installation & Development

- TODO

### Key Generation

The client provides a functionality to generate an RSA key pair:

- When you click **Generate New Key Pair** in the settings, the program generates a new RSA key pair.
- The private key is returned to the client and saved in the configuration.
- You can then use the **Copy Public Key** button to copy the public key to your clipboard.
  
Be sure to input and save the server address in the settings after key generation.

---

## Server Side Installation

The server is a FastAPI application that processes remote control commands for your Minecraft server. It also uses RSA keys for signing and verifying incoming requests.

### Local Setup

#### Prerequisites

- [Python 3.10](https://www.python.org/downloads/)
- [pip](https://pip.pypa.io/en/stable/installation/)

#### Steps

1. **Clone the repository and navigate to the server directory:**

   ```bash
   git clone https://github.com/YourUsername/MCRemoteControl.git
   cd MCRemoteControl/MCRemoteControl-Server
   ```

2. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

3. **Run the server:**

   Use Uvicorn to launch the FastAPI server:
   
   ```bash
   python app.py
   ```
   
   The server listens on port **5000** by default (as defined in the Dockerfile and Uvicorn command) for API requests. Configuration settings are stored in `config.json`, and RSA public keys are managed inside the `auth_keys` directory.

### Docker Setup

Docker is recommended for a consistent, containerized deployment.

1. **Ensure Docker is installed** on your VPS ([Docker Installation Guide](https://docs.docker.com/get-docker/)).

2. **Build the Docker image:**

   In the `MCRemoteControl-Server` directory (where the Dockerfile is located):
   
   ```bash
   docker build -t mcremotecontrol-server .
   ```

3. **Run the Docker container:**

   Map container port 5000 to host port 5000:
   
   ```bash
   docker run -d --name mcremotecontrol-server -p 5000:5000 mcremotecontrol-server
   ```

The container automatically starts the FastAPI server using Uvicorn with the command:
   
```
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5000"]
```

---

## Usage

- **Client Side:**  
  Launch the Electron app, enter the server address, generate keys, and use the provided buttons to connect, start, or stop the Minecraft server.

- **Server Side:**  
  The FastAPI server validates requests using RSA signatures. Commands to start or stop the server are triggered via API endpoints. Monitor the server via logs or status endpoints.

---

## Troubleshooting
- TODO
---
