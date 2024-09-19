"""
This is a script used to archive data from the database to a CSV file.
The data is from two tables, 'data' and 'history_data'.
The data is combined and saved to a CSV file named with the current timestamp.
"""

import csv
import mariadb
import db_utils as db
from utils import general
    
timestamp = general.get_timestamp()


def main():
    config = general.load_config('config/config.json')
    db_config = config['db_config']
    APP_DB = db_config['database']
    DB_USER = db_config['user']
    DB_PSWD = db_config['password']


    def archive_data_to_csv(db_name, db_username, db_pswd, csv_path, table1, table2):
        try:
            conn, cursor = db.database(db_username, db_pswd, db_name)
            headers, rows = db.get_combined_data(cursor, table1, table2, headers=True)

            with open(csv_path, 'w', newline='') as file:
                writer = csv.writer(file)
                writer.writerow(headers)
                writer.writerows(rows)

            conn.commit()
            cursor.close()
            conn.close()
        except mariadb.Error as e:
            print(f"Error connecting to MariaDB Platform: {e}")
            raise

    archive_data_to_csv(APP_DB, DB_USER, DB_PSWD, f'archive_{timestamp}.csv', 'data', 'history_data')


if __name__ == '__main__':
    main()