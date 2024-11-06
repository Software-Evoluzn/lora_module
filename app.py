from flask import Flask, render_template, request, jsonify
from database import init_db
import sqlite3

app = Flask(__name__)

def toggle_light(command):
    # Process the command to determine the light state
    state = "off" if command.split(":")[-1] == "0" else "on"
    device_id = command[:-2]
    print(f"Received command: {command}, toggling light to: {state} of the device {device_id}")
    return state

# Route to serve the main page
@app.route('/',methods=['GET','POST'])
def index():
    if request.method == 'POST':
        command = request.form['command']
        if command.startswith('T:5:G:G:'):
            toggle_light(command)
            print("Anjali")
            return jsonify({'state': command})
        else:
            state = toggle_light(command)
            return jsonify({'state': state})
    return render_template('dashboard.html')

def get_devices(): 
    conn = sqlite3.connect('lights.db') 
    c = conn.cursor() 
    c.execute('SELECT device_id FROM device') 
    devices = c.fetchall() 
    conn.close() 
    return [device[0] for device in devices]

# Route to handle the light toggle request
@app.route('/light', methods=['GET','POST'])
def light():
    devices = get_devices()
    if request.method == 'POST':
        command = request.form['command']
        state = toggle_light(command)
        return jsonify({'state': state})
    return render_template("lights.html", devices=devices)

# Run the Flask app
if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)
