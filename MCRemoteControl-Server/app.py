import os
import sys
import uvicorn
import config
from api import app
from fastapi.middleware.cors import CORSMiddleware

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

def main():
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"], 
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Check setup before starting
    setup_initial_config()
    
    # Server config
    host = config.config.get("host", "0.0.0.0")
    port = config.config.get("port", 5000)
    
    print(f"\nStarting API server on {host}:{port}")
    print("Press CTRL+C to stop\n")
    
    # Run the API server
    uvicorn.run(app, host=host, port=port)

if __name__ == "__main__":
    main()