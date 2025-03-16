from fastapi import FastAPI, Header, HTTPException, WebSocket, WebSocketDisconnect
import base64
import subprocess
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import hashes, serialization 
import config
import asyncio

app = FastAPI()

# Runs shell commmands
def run_command(command):
    try:
        result = subprocess.run(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return result.stdout.decode(), result.stderr.decode()
    except Exception as e:
        return str(e), ""

# Load the public key from a file
def load_public_key():
    with open("public_key.pem", "rb") as key_file:
        return serialization.load_pem_public_key(key_file.read())

# Verifies the signature of client public key
def verify_signature(signature_b64: str, message: str) -> bool:
    public_keys = config.load_all_public_keys()
    
    if not public_keys:
        print("Cannot verify signature: No public keys configured")
        return False
        
    signature = base64.b64decode(signature_b64)
    
    # Try each key until one works
    for public_key in public_keys:
        try:
            public_key.verify(
                signature,
                message.encode(),
                padding.PKCS1v15(),
                hashes.SHA256()
            )
            return True
        except Exception:
            continue  # Try the next key
    print(f"Signature verification failed with all keys")
    return False

@app.get("/status")
async def server_status(x_signature: str = Header(None)):
    if not x_signature:
        # Public endpoint for client to check if API is up
        keys = config.list_authorized_keys()
        return {
            "setup_complete": config.is_setup_complete(),
            "key_count": len(keys)
        }
    
    # Detailed status with authentication
    if not verify_signature(x_signature, "status"):
        raise HTTPException(status_code=403, detail="Unauthorized")
    
    screen_name = config.config.get("screen_name", "minecraft")
    
    # Check if server process is running
    check_cmd = f"screen -list | grep {screen_name}"
    stdout, _ = run_command(check_cmd)
    is_running = screen_name in stdout
    
    response = {
        "running": is_running
    }
        
    return response

# Start the server    
@app.post("/start")
async def start_server(x_signature: str = Header(None)):
    if not config.is_setup_complete():
        raise HTTPException(status_code=503, detail="Server not configured. Please add at least one public key.")
        
    if not x_signature or not verify_signature(x_signature, "start"):
        raise HTTPException(status_code=403, detail="Unauthorized")

    mc_dir = config.config.get("minecraft_root")
    if mc_dir == "":
        raise HTTPException(status_code=503, detail="Minecraft root is not configured. Please set it via setup.")

    server_jar = config.config.get("server_jar", "server.jar")
    java_args = config.config.get("java_args", "-Xms2G -Xmx4G")
    screen_name = config.config.get("screen_name", "minecraft")
    
    # screen -dmS minecraft java -Xms2G -Xmx4G -jar server.jar nogui
    command = f'cd {mc_dir} && screen -dmS {screen_name} java {java_args} -jar {server_jar} nogui'
    print(f"Executing command: {command}")
    stdout, stderr = run_command(command)
    return {"stdout": stdout, "stderr": stderr}

# Stop the server
@app.post("/stop")
async def stop_server(x_signature: str = Header(None)):
    if not config.is_setup_complete():
        raise HTTPException(status_code=503, detail="Server not configured")
        
    if not x_signature or not verify_signature(x_signature, "stop"):
        raise HTTPException(status_code=403, detail="Unauthorized")

    screen_name = config.config.get("screen_name", "minecraft")
    stdout, stderr = run_command(f'screen -S {screen_name} -X stuff "stop\n"')
    return {"stdout": stdout, "stderr": stderr}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Wait for a message with a timeout (e.g., 60 seconds for inactivity)
            data = await asyncio.wait_for(websocket.receive_text(), timeout=60)
            # Process data as usual (and reset your inactivity timer here)
    except asyncio.TimeoutError:
        # If no data is received in 60 seconds, disconnect the client.
        await websocket.close(code=1001)
    except WebSocketDisconnect:
        pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)