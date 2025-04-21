from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from os import environ

# app instance
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:booksarekewl@postgres_db:5432/dev_db'
db = SQLAlchemy(app)

# Define a simple model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password_hash = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.now())
    updated_at = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())

@app.route("/api/home", methods=['GET'])
def hello_world():
    return jsonify({'message':'Hello world!'})

@app.route("/api/users", methods=["GET"])
def get_users():
    # Query all users from the database
    users = User.query.all()

    # Convert each user to a dictionary
    users_data = [{"id": u.id, "username": u.username, "email": u.email} for u in users]

    # Return as JSON response
    return jsonify(users_data)

# Seed a default user if not exists
def get_or_create_default_user():
    default_email = "default@example.com"
    existing_user = User.query.filter_by(email=default_email).first()

    if not existing_user:
        user = User(
            username="defaultuser",
            email=default_email,
            password_hash="dev-placeholder"  # Not secure — fine for testing only
        )
        db.session.add(user)
        db.session.commit()
        print("Default user created")
    else:
        print("Default user already exists")

if __name__ == "__main__":
    # create the table schema in the database
    with app.app_context():
            db.create_all()
            get_or_create_default_user()

    app.run(host='0.0.0.0', port=8080, debug=True)
