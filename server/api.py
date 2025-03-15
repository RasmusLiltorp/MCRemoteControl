from fastapi import FastAPI, Header, HTTPException
import base64
import subprocess
from cryptography.hazmat.primitives.asymmetric import padding, rsa
from cryptography.hazmat.primitives import hashes, serialization

app = FastAPI()

# Runs shell commmands
def run_command(command):
    try:
        result = subprocess.run(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return result.stdout.decode(), result.stderr.decode()
    except Exception as e:
        return str(e), ""

# Verifies the signature of client public key
def verify_signature(signature_b64: str, message: str) -> bool:
    try:
        signature = base64.b64decode(signature_b64)
        public_key.verify(
            signature,
            message.encode(),
            padding.PKCS1v15(),
            hashes.SHA256()
        )
        return True
    except Exception as e:
        print(f"Signature verification failed: {e}")
        return False

# Start the server    
@app.post("/start")
async def start_server(x_signature: str = Header(None)):
    if not x_signature or not verify_signature(x_signature, "start"):
        raise HTTPException(status_code=403, detail="Unauthorized")

    stdout, stderr = run_command("screen -dmS minecraft java -Xmx4G -Xms4G -jar server.jar nogui")
    return {"stdout": stdout, "stderr": stderr}

@app.post("/stop")
async def stop_server(x_signature: str = Header(None)):
    if not x_signature or not verify_signature(x_signature, "stop"):
        raise HTTPException(status_code=403, detail="Unauthorized")

    stdout, stderr = run_command('screen -S minecraft -X stuff "stop\n"')
    return {"stdout": stdout, "stderr": stderr}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)