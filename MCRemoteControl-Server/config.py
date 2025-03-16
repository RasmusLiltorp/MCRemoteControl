import os
import json
import base64
import hashlib
from cryptography.hazmat.primitives import serialization

# Configuration constants
CONFIG_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_FILE = os.path.join(CONFIG_DIR, "config.json")
KEYS_DIR = os.path.join(CONFIG_DIR, "auth_keys")

# Default config
DEFAULT_CONFIG = {
    "server_jar": "server.jar",
    "java_args": "-Xmx4G -Xms4G",
    "screen_name": "minecraft",
    "port": 5000,
    "host": "0.0.0.0",
    "minecraft_root": ""
}

def load_config():
    if not os.path.exists(CONFIG_FILE):
        save_config(DEFAULT_CONFIG)
        print(f"Created default configuration file at {CONFIG_FILE}")
        return DEFAULT_CONFIG
    
    try:
        with open(CONFIG_FILE, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading config: {e}")
        return DEFAULT_CONFIG

def save_config(config):
    try:
        with open(CONFIG_FILE, 'w') as f:
            json.dump(config, f, indent=4)
        return True
    except Exception as e:
        print(f"Error saving config: {e}")
        return False

def ensure_keys_directory():
    if not os.path.exists(KEYS_DIR):
        os.makedirs(KEYS_DIR)

def list_authorized_keys():
    ensure_keys_directory()
    keys = []
    
    if not os.path.exists(KEYS_DIR):
        return []
    
    for filename in os.listdir(KEYS_DIR):
        if filename.endswith('.pem'):
            key_path = os.path.join(KEYS_DIR, filename)
            try:
                with open(key_path, 'rb') as f:
                    key_data = f.read()
                    fingerprint = hashlib.sha256(key_data).hexdigest()[:16]
                    
                    # Extract key name from filename
                    key_name = filename[:-4]  # Remove .pem extension
                    
                    keys.append({
                        'name': key_name,
                        'fingerprint': fingerprint,
                        'path': key_path
                    })
            except Exception as e:
                print(f"Error reading key {filename}: {e}")
    
    return keys

def add_public_key(key_data, name):
    ensure_keys_directory()
    
    # Validate the key
    try:
        serialization.load_pem_public_key(key_data)
    except Exception as e:
        print(f"Invalid public key: {e}")
        return False
    
    # Create a safe filename from the name
    safe_name = ''.join(c if c.isalnum() else '_' for c in name)
    key_path = os.path.join(KEYS_DIR, f"{safe_name}.pem")
    
    # Save the key
    with open(key_path, 'wb') as f:
        f.write(key_data)
    
    fingerprint = hashlib.sha256(key_data).hexdigest()[:16]
    print(f"Added key: {name} (Fingerprint: {fingerprint})")
    return True

def remove_public_key(name):
    safe_name = ''.join(c if c.isalnum() else '_' for c in name)
    key_path = os.path.join(KEYS_DIR, f"{safe_name}.pem")
    
    if os.path.exists(key_path):
        os.remove(key_path)
        print(f"Removed key: {name}")
        return True
    else:
        print(f"Key not found: {name}")
        return False

def load_all_public_keys():
    keys = []
    for key_info in list_authorized_keys():
        try:
            with open(key_info['path'], 'rb') as f:
                key_data = f.read()
                public_key = serialization.load_pem_public_key(key_data)
                keys.append(public_key)
        except Exception as e:
            print(f"Error loading key {key_info['name']}: {e}")
    
    return keys

def update_config(key, value):
    cfg = load_config()
    cfg[key] = value
    if save_config(cfg):
        print(f"Updated configuration: {key} = {value}")
        return True
    return False

def is_setup_complete():
    return len(list_authorized_keys()) > 0

# Initialize config on import
config = load_config()