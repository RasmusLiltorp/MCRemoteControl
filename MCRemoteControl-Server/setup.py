import os
import sys
import json
import argparse
import config
def setup_public_key(key_input, name=None):
    try:
        key_input_stripped = key_input.strip()
        # If the key begins with the expected header, assume it's key text.
        if key_input_stripped.startswith("-----BEGIN PUBLIC KEY-----"):
            key_data = key_input_stripped.encode()
        elif os.path.exists(key_input):
            with open(key_input, 'rb') as f:
                key_data = f.read()
        else:
            print(f"Error: File not found: {key_input}")
            print('Please provide the entire public key as a text message enclosed in quotes, e.g.:')
            print('  --add-key "-----BEGIN PUBLIC KEY-----\\n...\\n-----END PUBLIC KEY-----"')
            return False

        # Basic validation
        if not key_data.startswith(b'-----BEGIN PUBLIC KEY-----'):
            print("Error: The provided public key does not appear to be a valid PEM format public key.")
            print('Make sure to supply the key as a complete text string:')
            print('  --add-key "-----BEGIN PUBLIC KEY-----\\n...\\n-----END PUBLIC KEY-----"')
            return False

        # Confirm with user that the public key input is correct
        print("\nYou have entered the following public key:")
        print("-" * 50)
        print(key_data.decode())
        print("-" * 50)
        confirm = input("Are you sure you want to add this key? (y/N): ")
        if confirm.lower() != 'y':
            print("Public key setup cancelled.")
            return False

        # Use filename as key name if not provided and input was from a file
        if not name:
            if not key_input_stripped.startswith("-----BEGIN PUBLIC KEY-----") and os.path.exists(key_input):
                name = os.path.basename(key_input).split('.')[0]
            else:
                name = "custom_key"
                
        return config.add_public_key(key_data, name)
    except Exception as e:
        print(f"Error setting up public key: {e}")
        return False
    
def show_config():
    cfg = config.load_config()
    print("\nCurrent Configuration:")
    print("-" * 50)
    for key, value in cfg.items():
        print(f"{key}: {value}")
    
    keys = config.list_authorized_keys()
    print("\nAuthorized Keys:")
    print("-" * 50)
    
    if not keys:
        print("No keys configured. Use --add-key to add a public key as text.")
    else:
        print(f"Total keys: {len(keys)}")
        for i, key in enumerate(keys, 1):
            print(f"{i}. {key['name']} - Fingerprint: {key['fingerprint']}")
    
    print("-" * 50)

def main():
    parser = argparse.ArgumentParser(description="MCRemoteControl Server Setup")
    parser.add_argument("--add-key", metavar="KEY", help='Add a public key by passing the entire key as text (e.g., --add-key "-----BEGIN PUBLIC KEY-----\\n...\\n-----END PUBLIC KEY-----")')
    parser.add_argument("--remove-key", metavar="NAME", help="Remove a public key by name")
    parser.add_argument("--reset", action="store_true", help="Reset to default configuration")
    parser.add_argument("--mc-root", metavar="PATH", help="Specify the path to your Minecraft server root directory")
    
    if len(sys.argv) == 1:
        parser.print_help()
        show_config()
        return
    
    args = parser.parse_args()
    
    if args.mc_root:
        print(f"Setting Minecraft server root to: {args.mc_root}")
        config.update_config("minecraft_root", args.mc_root)
    
    if args.add_key:
        setup_public_key(args.add_key)
    
    if args.remove_key:
        config.remove_public_key(args.remove_key)
    

    if args.reset:
        confirm = input("Are you sure you want to reset to default configuration? (y/N): ")
        if confirm.lower() == 'y':
            config.save_config(config.DEFAULT_CONFIG)
            print("Configuration reset to defaults")
    
    show_config()

if __name__ == "__main__":
    main()