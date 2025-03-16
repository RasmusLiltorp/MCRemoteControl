import os
import sys
import json
import argparse
import config

def setup_public_key(key_file, name=None):
    """Set up a public key from a file"""
    try:
        if not os.path.exists(key_file):
            print(f"Error: File not found: {key_file}")
            return False
            
        with open(key_file, 'rb') as f:
            key_data = f.read()
            
        # Basic validation
        if not key_data.startswith(b'-----BEGIN PUBLIC KEY-----'):
            print("Error: File does not appear to be a valid PEM format public key")
            return False
        
        # Use filename as name if not provided
        if not name:
            name = os.path.basename(key_file).split('.')[0]
            
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
        print("No keys configured. Use --add-key to add a public key.")
    else:
        print(f"Total keys: {len(keys)}")
        for i, key in enumerate(keys, 1):
            print(f"{i}. {key['name']} - Fingerprint: {key['fingerprint']}")
    
    print("-" * 50)

def main():
    parser = argparse.ArgumentParser(description="MCRemoteControl Server Setup")
    parser.add_argument("--add-key", metavar="FILE", help="Add a public key from a PEM file")
    parser.add_argument("--key-name", metavar="NAME", help="Name for the added key (optional)")
    parser.add_argument("--remove-key", metavar="NAME", help="Remove a public key by name")
    parser.add_argument("--config", nargs=2, metavar=("KEY", "VALUE"), help="Set a configuration value")
    parser.add_argument("--show", action="store_true", help="Show current configuration")
    parser.add_argument("--reset", action="store_true", help="Reset to default configuration")
    
    if len(sys.argv) == 1:
        parser.print_help()
        show_config()
        return
    
    args = parser.parse_args()
    
    if args.add_key:
        setup_public_key(args.add_key, args.key_name)
    
    if args.remove_key:
        config.remove_public_key(args.remove_key)
    
    if args.config:
        key, value = args.config
        try:
            if value.lower() == "true":
                value = True
            elif value.lower() == "false":
                value = False
            elif value.isdigit():
                value = int(value)
        except:
            pass
        config.update_config(key, value)
    
    if args.reset:
        confirm = input("Are you sure you want to reset to default configuration? (y/N): ")
        if confirm.lower() == 'y':
            config.save_config(config.DEFAULT_CONFIG)
            print("Configuration reset to defaults")
    
    if args.show or args.add_key or args.remove_key or args.config or args.reset:
        show_config()

if __name__ == "__main__":
    main()