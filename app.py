"""
This is the main Flask application file that serves as a backend for the application.
The program allows users to log in, view, edit records, and perform various operations related to inventory management.

The main features include:
- User authentication and authorization using Flask-Login
- Password hashing using Flask-Bcrypt
- Database operations using the db_utils module (db_utils.py) to interact with a MySQL database (MariaDB)
- Record creation, editing, and archiving
- Configuration file (config.json) to store database credentials and other settings.

The program consists of multiple routes that handle simple functionalities:
- /login: Handles user login and authentication
- /logout: Handles user logout
- /userset: Handles user settings management (password change only for now)
- /signin: Handles user registration
- /fifo: Displays the main page with a list of records and allows authenticated users to edit records
- /add_user/<recid>: Assign a user to a specific record
- /remove_user/<recid>: Removes a user from a specific record
- /input: Handles material input and record creation
- /edit/<recid>: Displays the record editing page for a specific record
- /edit/<recid>/save: Saves the changes made to a record
- /archive: Displays the archive page with a table of all changes made to existing and closed records
"""

from flask import Flask, redirect, request, render_template, flash, url_for
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from flask_bcrypt import Bcrypt
from utils import db_utils as db
from utils import general
import re


# Helper functions
def get_next_location():
    try:
        return request.form['next-location']
    except KeyError:
        return None


def get_reoccurence(db, recid):
    occurence = db.query_db(db.Data, id=recid)[0]
    return occurence.reoccurence


# Load config file
config = general.load_config('static/config/config.json')
db_config = config['db_config']

# Constants
INPUT_PAGE = 'input.html'
INPUT_TITLE = 'INPUT'
MAIN_PAGE = 'fifo.html'
MAIN_TITLE = 'Overview / FIFO'
EDIT_PAGE = 'analysis.html'
EDIT_TITLE = 'CURRENT RECORD DETAIL'
LOGIN_PAGE = 'login.html'
LOGIN_TITLE = 'LOGIN'
USER_PAGE = 'userset.html'
USER_TITLE = 'User Settings'
SIGNIN_PAGE = 'signin.html'
SIGNIN_TITLE = 'REGISTER USER'
ARCH_PAGE = 'archive.html'
ARCH_TITLE = 'RECORD HISTORY'
APP_DB = db_config['database']
DB_USER = db_config['user']
DB_PSWD = db_config['password']


#  Flow logic definitions
flow_pass = config['flow_pass']
flow_fail = config['flow_fail']
flow_closed = config['flow_closed']
storage = config['storage']


app = Flask(__name__)
login_manager = LoginManager()
login_manager.init_app(app)
bcrypt = Bcrypt(app)
app.secret_key = config['secret_key']['value']

db_manager = db.DatabaseManager(DB_USER, DB_PSWD, APP_DB)
db_manager.initialize_database()


#################################
########## LOGIN LOGIC ##########
#################################

@login_manager.user_loader
def load_user(uid):
    user = db_manager.query_db(db_manager.User, id=uid)[0]
    return user


@login_manager.unauthorized_handler
def unauthorized_callback():
    flash("Access Denied: Please login!", "danger")
    return redirect(url_for('login'))


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template(LOGIN_PAGE, title=LOGIN_TITLE)
    elif request.method == 'POST':
        username = request.form['username']
        password = request.form['pswd']
        
        try:
            user = db_manager.query_db(db_manager.User, username=username)[0]
        except IndexError:
            flash("Invalid username or password", "danger")
            return render_template(LOGIN_PAGE, title=LOGIN_TITLE)
        
        if user and bcrypt.check_password_hash(user.password, password):
            login_user(user)
            return redirect(url_for('index'))
        else:
            flash("Invalid username or password", "danger")
            return render_template(LOGIN_PAGE, title=LOGIN_TITLE)
        

@app.route('/userset', methods=['GET', 'POST'])
@login_required
def userset():
    if request.method == 'GET':
        if current_user.role == 'admin':
            users = db_manager.query_db(db_manager.User, 'username')[0]
            return render_template(USER_PAGE, title=USER_TITLE, users=users)
        
        return render_template(USER_PAGE, title=USER_TITLE)
    
    elif request.method == 'POST':
        new_pswd = request.form['pswd']
        new_pswd_check = request.form['pswd_check']
        username = current_user.username
        user_data = db_manager.query_db(db_manager.User, 'user_name', username)
        hashed_password = bcrypt.generate_password_hash(new_pswd)
        has_special_char = bool(re.search(r'[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]+', new_pswd))

        
        if bcrypt.check_password_hash(user_data[2], new_pswd):
            flash(f"New password is the same as the current password", "danger")
            return redirect(url_for('userset'))
        
        elif not len(new_pswd) > 4 or not has_special_char:
            flash(f"Your password should be at least 5 characters long and include at least 1 special character", "danger")
            return redirect(url_for('userset'))
        
        elif not bcrypt.check_password_hash(hashed_password, new_pswd_check):
            flash(f"Passwords do not check", "danger")
            return redirect(url_for('userset'))

        db_manager.change_pswd(username, hashed_password,)
        flash(f"Password for user: {username} changed succesfully", "success")
        return redirect(url_for('userset'))
        

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))
    
    
@app.route('/signin', methods=['GET', 'POST'])
def signin():
    if request.method == 'GET':
        return render_template(SIGNIN_PAGE, title=SIGNIN_TITLE)
    elif request.method == 'POST':
        username = request.form['username']
        password = request.form['pswd']
        role = "default"
        hashed_password = bcrypt.generate_password_hash(password)
        db_manager.add_user(username, hashed_password, role)
        return redirect(url_for('login'))

##################################
####### END OF LOGIN LOGIC #######
##################################


##################################
########### MAIN LOGIC ###########
##################################

# Main page
@app.route('/', methods=['GET'])
def index():
    if current_user.is_authenticated:
        return redirect(url_for('fifo'))
    else:
        return render_template(LOGIN_PAGE, title=LOGIN_TITLE)


# FIFO page
@app.route('/fifo', methods=['GET', 'POST'] )
@login_required
def fifo():
    if request.method == "POST":
        search_id = request.form.get('submit-id-onclick')
        is_active = db_manager.query_db(db_manager.Data, id=search_id)[0]
        
        if is_active.active_user == 'unassigned':
            flash("You must first click START on the record before you can edit it!", "danger")
            return redirect(url_for('fifo'))
        else:
            return redirect(url_for('edit_id', recid=search_id))

    else:
        user_role = current_user.role
        querry_all = db_manager.get_records_fifo()
        return render_template(MAIN_PAGE, title=MAIN_TITLE, querry_all=querry_all, user_role=user_role)


# Add user to record
@app.route('/add_user/<recid>', methods=['GET', 'POST'])
@login_required
def add_user(recid):
    if 'userSelect' in request.form:
        username = request.form['userSelect']
    else:
        username = current_user.username
    db_manager.update_col(db_manager.Data, 'id', recid, active_user=username)
    return redirect(url_for('fifo'))
    

# Remove user from record
@app.route('/remove_user/<recid>', methods=['GET', 'POST'])
@login_required
def remove_user(recid):
    db_manager.update_col(db_manager.Data, 'id', recid, active_user='unassigned')
    return redirect(url_for('fifo'))


# Change role of specific user
@app.route('/change_role', methods=['GET', 'POST'])
@login_required
def change_role():
    username = request.form['username']
    role = request.form['role']
    db_manager.update_col(db_manager.User, 'role', 'user_name', username, role)
    flash(f"Role for user: {username} has been changed to {role}", "success")
    return redirect(url_for('userset'))


# Material input logic
@app.route('/input', methods=['GET', 'POST'] )
@login_required
def mat_input():
    if request.method == 'GET':
        return render_template(INPUT_PAGE, title=INPUT_TITLE)
    else:
        timestamp = general.get_timestamp()
        try:
            recid = int(request.form['id'])
        except ValueError:
            flash("ID has to be a NUMBER from 1 to 1000", "danger")
            return redirect(url_for('mat_input'))
        if recid <= 0 or recid > 1000:
            flash("ID has to be a number between 1 and 1000", "danger")
            return redirect(url_for('mat_input'))
        else:
            sn = request.form['sn']
            pn = request.form['pn']
            manufacturer = request.form['manufacturer']
            description = request.form['des']
            location = request.form['location']
            shelf = request.form['shelf']
            employee = current_user.username
            if db_manager.check_if_exists(db_manager.Data, id=recid):
                flash(f"ID {recid} already exists!", "danger")
                return redirect(url_for('mat_input'))
            else:
                db_manager.write_to_db(recid, sn, pn, manufacturer, description, location, shelf, employee, timestamp)
                flash(f"ID {recid} for SN {sn} has been created", "success")
                return redirect(url_for('fifo'))


# Record editing logic
@app.route('/edit/<recid>', methods=['GET', 'POST'])
@login_required
def edit_id(recid):
    if request.method == "POST":
        return redirect(url_for('edit_sn_save', recid=recid))
    else:
        search_result = db_manager.query_db(db_manager.HistoryData, order="DESC", data_id=recid)
        
        if not search_result:
            flash(f"No history found for record ID {recid}", "warning")
            return redirect(url_for('fifo'))
        
        latest_record = search_result[0]
        previous_result = latest_record.result
        previous_location = latest_record.location
        previous_position = latest_record.position
        previous_shelf = latest_record.shelf
        prev_loc_db = latest_record.next_location
        
        is_active = db_manager.query_db(db_manager.Data, id=recid)[0]

        if prev_loc_db:
            next_location = prev_loc_db
        else:
            if previous_result == 'PASS':
                next_location = flow_pass.get(previous_location, [])
            elif previous_result == 'CLOSED':
                next_location = flow_closed.get(previous_location, [])
            else:
                next_location = flow_fail.get(previous_location, [])

        return render_template(EDIT_PAGE, 
                               title=EDIT_TITLE,
                               query_all=latest_record,
                               current_location=next_location,
                               new_location=next_location,
                               current_position=previous_position,
                               current_shelf=previous_shelf,
                               is_active=is_active.active_user,
                               )
        

# Save the dited record logic
@app.route('/edit/<recid>/save', methods=['GET', 'POST'])
@login_required
def edit_sn_save(recid):
    form = request.form
    current_location = form['current-location']
    
    if current_location == 'CLOSED':
        flash(f"Record for {recid} has been already Closed", "danger")
        return redirect(url_for('edit_id', recid=recid))
    
    next_location = get_next_location()
    
    if next_location is None:
        flash("ERROR: There is no next location found!", "danger")
        return redirect(url_for('edit_id', recid=recid))
    
    sn = db_manager.query_db(db_manager.HistoryData, data_id=recid)[0]
    pn = db_manager.query_db(db_manager.HistoryData, data_id=recid)[0]
    manufacturer = db_manager.query_db(db_manager.HistoryData, data_id=recid)[0]
    description = db_manager.query_db(db_manager.HistoryData, data_id=recid)[0]
    date_created = db_manager.query_db(db_manager.HistoryData, data_id=recid)[0]

    result = form['resulta']
    timestamp = general.get_timestamp()
    current_position = form['next-position']
    current_shelf = form['next-shelf']
    comment = form['comment']
    employee = form['employee']

    record_data = {
        'data_id': recid,
        'sn': sn.sn,
        'pn': pn.pn,
        'manufacturer': manufacturer.manufacturer,
        'description': description.description,
        'location': current_location,
        'position': current_position,
        'shelf': current_shelf,
        'comment': comment,
        'employee': employee,
        'result': result,
        'timestamp': timestamp,
        'date_created': date_created.date_created,
        'next_location': next_location
    }

    if current_location == 'QA' and record_data['result'] == 'FAIL' and record_data['next_location'] != 'FAIL STORAGE':
        reoccurence = get_reoccurence(db_manager, recid)
        reoccurence = (reoccurence or 0) + 1
        
        if reoccurence > 2:
            flash(f"Record for {sn.sn} has already been repaired 3 times!", "danger")
            return redirect(url_for('edit_id', recid=recid))
        
        db_manager.update_col(db_manager.Data, 'sn', record_data['sn'], reoccurence=reoccurence)
        db_manager.update_col(db_manager.Data, 'id', recid, active_user='unassigned')
        db_manager.add_history(**record_data)
        flash(f"Record for {sn.sn} has been updated", "success")

    elif next_location == 'CLOSED':
        db_manager.remove_record(db_manager.Data, id=recid)
        db_manager.add_history(**record_data)
        flash(f"Record: {recid} for {sn.sn} has been successfully CLOSED", "success")

    else:
        db_manager.add_history(**record_data)
        db_manager.update_col(db_manager.Data, 'id', recid, active_user='unassigned')
        flash(f"Record for {sn.sn} has been updated", "success")

    return redirect(url_for('fifo'))


# Archive page logic
@app.route('/archive', methods=['GET', 'POST'])
@login_required
def archive():
    user_role = current_user.role
    
    if request.method == "POST":
        search_sn = request.form['sn']
    else:
        search_sn = request.args.get('search_sn', '')
    
    archive_records = db_manager.query_db(db_manager.HistoryData, filter_col='sn', filter_val=search_sn.strip(), order='DESC')
    return render_template(ARCH_PAGE, title=ARCH_TITLE, archive_records=archive_records, user_role=user_role)


###################################
######## END OF MAIN LOGIC ########
###################################

# Run the app on port 5000 on all interfaces
if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)