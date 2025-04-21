from flask import Flask, jsonify
from flask_cors import CORS

# app instance
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route("/api/home", methods=['GET'])
def hello_world():
    return jsonify({'message':'Hello world!'})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)
