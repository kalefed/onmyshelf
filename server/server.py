import os
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
from flask import Flask, abort, jsonify, redirect, request, session, url_for
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    get_jwt,
    jwt_required,
    get_jwt_identity,
)
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import select

from models import db, Book, User, TokenBlocklist, Shelf

load_dotenv()

# app instance
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Configuration
ACCESS_EXPIRES = timedelta(hours=1)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = ACCESS_EXPIRES
app.config["JWT_TOKEN_LOCATION"] = ["headers"]
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("SQLALCHEMY_DATABASE_URI")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# DB initialization
db.init_app(app)

# JWT & bycrypt Initialization
jwt = JWTManager(app)


# Endpoints
@app.route("/api/users", methods=["GET"])
def get_users():
    # Query all users from the database
    users = User.query.all()

    # Convert each user to a dictionary
    users_data = [{"id": u.id, "username": u.username, "email": u.email} for u in users]

    # Return as JSON response
    return jsonify(users_data)


# Callback function to check if a JWT exists in the database blocklist
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    jti = jwt_payload["jti"]
    token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()

    return token is not None


# Register endpoint
@app.route("/api/register", methods=["POST"])
def register():
    # Get the info from the register form
    data = request.get_json()
    username = data["username"]
    email = data["email"]
    password = data["password"]

    # check if there is an existing user
    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({"message": "User already exists. Please login."}), 400

    # if user doesn't already exist, create new user, and hash password
    new_user = User(
        username=username,
        email=email,
    )
    new_user.set_password(password)

    # Add default shelves for the new user
    default_shelves = ["currently-reading", "tbr", "up-next", "dnf"]
    for shelf_type in default_shelves:
        shelf = Shelf(shelf_type=shelf_type, user=new_user)
        db.session.add(shelf)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully."}), 201


# Login endpoint
@app.route("/api/login", methods=["POST"])
def login():
    # Get the info from the login form and ensure its in the DB
    data = request.get_json()
    username = data["username"]
    password = data["password"]
    print("Received data:", username, password)

    user = User.query.filter_by(username=username).first()

    # if the user exists and the password check is successful
    if user and user.check_password(password):
        access_token = create_access_token(identity=str(user.id))
        # refresh_token = create_refresh_token(identity=username)
        return (
            jsonify(
                {
                    "message": f"Logged in as {username}",
                    "access_token": access_token,
                    # "refresh_token": refresh_token,
                }
            ),
            200,
        )
    else:
        return jsonify({"message": "Invalid username or password."}), 401


# Logout endpoint for revoking the current users access token
@app.route("/api/logout", methods=["DELETE"])
@jwt_required()
def modify_token():
    jti = get_jwt()["jti"]
    now = datetime.now(timezone.utc)
    db.session.add(TokenBlocklist(jti=jti, created_at=now))
    db.session.commit()
    return jsonify({"message": "User logged out successfully"}), 200


# Get user's books (all shelves)
@app.route("/api/shelves", methods=["GET"])
@jwt_required()
def get_shelves():
    current_user = get_jwt_identity()

    # Get all books associated with the user
    stmt = select(Shelf).filter_by(user_id=current_user)
    users_shelves = db.session.execute(stmt).scalars().all()

    # If the user does not have any shelves
    if not users_shelves:
        return jsonify({"message": "No shelves found for this user."}), 404

    shelves_data = [shelf.to_dict() for shelf in users_shelves]

    return jsonify(shelves_data), 200


# Get all books on a specific shelf
@app.route("/api/shelves/<string:shelf_type>", methods=["GET"])
@jwt_required()
def get_shelf_books(shelf_type):
    current_user = get_jwt_identity()

    stmt = select(Shelf).filter_by(user_id=current_user, shelf_type=shelf_type)

    # Execute the query
    users_shelf = db.session.execute(stmt).scalars().all()

    # If the user does not have any shelves
    if not users_shelf:
        return jsonify({"message": "No shelves found for this user."}), 404

    return jsonify(users_shelf.to_dict()), 200


# Add a new book to a specific shelf
# TODO - does it make sense to have a shelf_id?
@app.route("/api/shelves/<string:shelf_id>/books", methods=["POST"])
@jwt_required()
def add_book(shelf_id):
    data = request.get_json()

    # Does the shelf exist?
    stmt = select(Shelf).filter_by(id=data["shelf_id"]).first()
    shelf = db.session.execute(stmt).scalars()

    if shelf:
        new_book = Book(title=data["title"], author=data["author"], shelf_id=shelf_id)
        db.session.add(new_book)
        db.session.commit()

    else:
        abort(404, description=f"No shelf with this id: `{shelf_id}` found")


# Move a new book from one shelf to another
@app.route("/api/shelves/<string:shelf_id>/books<int:id>", methods=["PUT"])
@jwt_required()
def move_book(shelf_id, id):
    data = request.get_json()

    # Does the book exist?
    stmt = select(Book).filter_by(id=id, shelf_id=shelf_id).first()
    book = db.session.execute(stmt).scalars()

    # Does the shelf exist?
    stmt = select(Shelf).filter_by(id=data["shelf_id"]).first()
    new_shelf = db.session.execute(stmt).scalars()

    if not book:
        return jsonify({"message": "Book not found"}), 404

    if not new_shelf:
        return jsonify({"message": "Shelf not found"}), 404

    # move the book to a new shelf
    book.shelf_id = data["shelf_id"]
    db.session.commit()


# Delete a book from a shelf
@app.route("/api/shelves/<string:shelf_id>/books<int:id>", methods=["DELETE"])
@jwt_required()
def delete_book(shelf_id, id):
    # Get the book to delete
    stmt = select(Book).filter_by(id=id, shelf_id=shelf_id).first()
    book = db.session.execute(stmt).scalars()

    if book:
        db.session.delete(book)
        db.session.commit()
        return jsonify({"Message": "Book deleted successfully"}), 202
    else:
        abort(404, description=f"No Book with this id: `{id}` found")


# Seed a default user if not exists
def get_or_create_default_user():
    default_email = "default@example.com"
    existing_user = User.query.filter_by(email=default_email).first()

    if not existing_user:
        user = User(
            username="defaultuser",
            email=default_email,
            password="devpassword",
        )
        db.session.add(user)
        db.session.commit()
        print("Default user created")
    else:
        print("Default user already exists")


@app.errorhandler(404)
def handle_404(e):
    return jsonify({"detail": e.description}), 404


if __name__ == "__main__":
    # create the table schema in the database
    with app.app_context():
        db.drop_all()
        db.create_all()
        get_or_create_default_user()

    app.run(host="0.0.0.0", port=8080, debug=True)
