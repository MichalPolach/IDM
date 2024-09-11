# Inventory Management System

A web-based inventory management system built with Flask, MariaDB, and JavaScript.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Installation

To install and set up the project locally, follow these steps:

1. Clone the repository:
    ```sh
    git clone https://github.com/your-username/your-repo.git
    ```
2. Navigate to the project directory:
    ```sh
    cd your-repo
    ```
3. Create a virtual environment:
    ```sh
    python -m venv venv
    ```
4. Activate the virtual environment:
    - On Windows:
        ```sh
        venv\Scripts\activate
        ```
    - On macOS and Linux:
        ```sh
        source venv/bin/activate
        ```
5. Install the project dependencies:
    ```sh
    pip install -r requirements.txt
    ```

## Usage

To use the project, follow these guidelines:

1. Activate the virtual environment (if not already activated):
    - On Windows:
        ```sh
        venv\Scripts\activate
        ```
    - On macOS and Linux:
        ```sh
        source venv/bin/activate
        ```
2. Run the Flask development server:
    ```sh
    flask run
    ```
3. Open your web browser and navigate to `http://localhost:5000`


## Project Structure

### Key Files and Directories

- [`app.py`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fc%3A%2FUsers%2Fc2304001%2FNextcloud%2FProgramming%2FIDM%2Fapp.py%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22646f836d-8817-46d2-be26-8c251e864a2e%22%5D "c:\Users\c2304001\Nextcloud\Programming\IDM\app.py"): Main application file.
- [`archive_db_csv.py`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fc%3A%2FUsers%2Fc2304001%2FNextcloud%2FProgramming%2FIDM%2Farchive_db_csv.py%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22646f836d-8817-46d2-be26-8c251e864a2e%22%5D "c:\Users\c2304001\Nextcloud\Programming\IDM\archive_db_csv.py"): Script to archive database to CSV.
- [`create_db.py`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fc%3A%2FUsers%2Fc2304001%2FNextcloud%2FProgramming%2FIDM%2Fcreate_db.py%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22646f836d-8817-46d2-be26-8c251e864a2e%22%5D "c:\Users\c2304001\Nextcloud\Programming\IDM\create_db.py"): Script to create the database.
- [`db_utils.py`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fc%3A%2FUsers%2Fc2304001%2FNextcloud%2FProgramming%2FIDM%2Fdb_utils.py%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22646f836d-8817-46d2-be26-8c251e864a2e%22%5D "c:\Users\c2304001\Nextcloud\Programming\IDM\db_utils.py"): Utility functions for database operations.
- [`static/`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fc%3A%2FUsers%2Fc2304001%2FNextcloud%2FProgramming%2FIDM%2Fstatic%2F%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22646f836d-8817-46d2-be26-8c251e864a2e%22%5D "c:\Users\c2304001\Nextcloud\Programming\IDM\static\"): Directory containing static files (CSS, JS, JSON).
- [`templates/`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fc%3A%2FUsers%2Fc2304001%2FNextcloud%2FProgramming%2FIDM%2Ftemplates%2F%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22646f836d-8817-46d2-be26-8c251e864a2e%22%5D "c:\Users\c2304001\Nextcloud\Programming\IDM\templates\"): Directory containing HTML templates.

## Contributing

If you would like to contribute to the project, please follow these guidelines:

1. Fork the repository.
2. Create a new branch:
    ```sh
    git checkout -b your-branch-name
    ```
3. Make your changes and commit them:
    ```sh
    git commit -m 'Add some feature'
    ```
4. Push to the branch:
    ```sh
    git push origin your-branch-name
    ```
5. Submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
