"""
This module contains general utility functions that are used across the project.
"""

import json
import datetime


def load_config(file_path):
    with open(file_path, 'r') as f:
        return json.load(f)
    

def get_timestamp():
    current_datetime = datetime.datetime.now()
    return current_datetime.strftime("%Y-%m-%d %H:%M:%S")