#!/bin/bash

# This script is used to set up the environment and run the Flask app - Linux compatible.

# Check if the environment is already set up
if [ -f setup_ok ]; then
    source venv/bin/activate
    flask run
    exit 0
fi

# If the environment is not set up, do so
echo "###### Environment not set up - Setting up environment ######"
sleep 2
python -m venv venv
source venv/bin/activate
if pip install -r requirements.txt; then
    touch setup_ok
else
    echo "Failed to install requirements."
    exit 1
fi

# Run the Flask app
source venv/bin/activate
flask run