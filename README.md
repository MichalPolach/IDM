# Inventory Management System

A simple web-based inventory management system built with Flask, MariaDB, and JavaScript.

As an example here, it is configured for PC repair/RMA service to track the status of inputted devices with a specified workflow.

## Table of Contents

- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Project Structure

### Key Files and Directories

- [`app.py`]: Main application logic (Flask) file.
- [`run.sh`]: Linux wrapper script to setup and run the application.
- [`run.ps1`]: Windows wrapper script to setup and run the application.
- [`config/config.json`]: Configurations for the main workflow and database connection.
- [`static/`]: Directory containing static files (CSS, JS) and the main config file (config.json).
- [`templates/`]: Directory containing HTML templates for the routes.
- [`utils/db_utils.py`]: Contains ORM models and functions that interact with the application database.
- [`utils/archive_db_csv.py`]: Script to dump archive data from the database to CSV file.

## Installation

To install and set up the project locally, follow these steps:

1. Ensure that you have Python and MariaDB installed:
   - If you are on Windows, download the latest Python from the official website: https://www.python.org/downloads/
   - For MariaDB installation, refer to this page: https://mariadb.com/kb/en/where-to-download-mariadb/
   - Linux distributions should have Python installed by-default. MariaDB should be in most cases available in the distros repository.

1. Clone the repository:
    ```sh
    git clone https://github.com/MichalPolach/IDM.git
    ```
2. Navigate to the project directory:
    ```sh
    cd IDM
    ```
3. Run & setup scripts:
    - On Windows:
        ```sh
        run.ps1
        ```
    - On macOS and Linux:
        ```sh
        run.sh
        ```

## Usage

Open your web browser and navigate to `http://localhost:5000` or `your-ip-address:5000`

The application should now be running.

You can login as the defaultly created `admin` user with password `admin`.
You can change the password after loging in when you click on the `admin` user on the top right corner next to the `LOGOUT`.
If you would like to instead create a new account, do so by clicking on the `Create new Account`.

There are no data in the application by-default.
You can create a new record on the `INPUT` by filling and submitting the form.
The record will then be visible on the main `FIFO` page - and as the name suggest, the records are orderer to follow FIFO principle.
If the inputted description is long, only part of it will be displayed on the `FIFO` page. You can show the whole description by hovering cursor over it.
To edit a record, it must first be assigned to a user. You can assign to unassigned record by clicking on the `ASSIGN` button on the far right side of the record.
If you would like to unassign yourself from the record, do so by clicking `REMOVE` where the assign button used to be.

Record editing is done by clicking on a user assigned record. Otherwise notification will popup to inform user about assigning first.
If another user is assigned to the record, you can only view the record (it is read-only).
Changing assigned record user can be done only by the user with admin role (which is the default admin user).
Based on the `RESULT` of the current stage (location in the process), a specific next stage can be selected (following the workflow logic) with its according storage racks and shelves.
After saving the changes and submitting, assigned user will be removed from the record and the record will now be shown as unassigned and ready for a next stage in the process.

Each modification and movement of the record through the process can be viewed in the `ARCHIVE` page.
There, a specific SN of the device can be filtered to show its history.
This same thing can be also done by clicking on the record in the record editing page - it will show history for that specific record (SN).


## Wanna contribute?

If you would like to contribute to the project but have no clue how it is done:

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
