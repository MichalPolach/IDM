#!/usr/bin/env pwsh

# This script is used to set up the environment and run the Flask app - Windows PowerShell.

# Check if the environment is already set up
if (Test-Path -Path "setup_ok") {
    .\venv\Scripts\Activate.ps1
    flask run
    exit 0
}

# If the environment is not set up, do so
Write-Output "###### Environment not set up - Setting up environment ######"
Start-Sleep -Seconds 2
python -m venv venv
.\venv\Scripts\Activate.ps1
if (pip install -r requirements.txt) {
    New-Item -Path "setup_ok" -ItemType File
} else {
    Write-Output "Failed to install requirements."
    exit 1
}

# Run the Flask app
.\venv\Scripts\Activate.ps1
flask run