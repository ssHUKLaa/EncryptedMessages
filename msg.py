from flask import Flask, render_template
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = "nkfdnglnfdlgkndfn342*8"
socketio = SocketIO(app)

@app.route('/')
def sessions():
    return render_template('session.html')

def messageRecieved(methods=['GET', 'POST']):
    print('message was recieved')

socketio.on('my event')
def handler(json, methods=['GET', 'POST']):
    print('recieved' + str(json))
    socketio.emit('my response', json, callback=messageRecieved)

if __name__ == '__main__':
    socketio.run(app, debug=True)