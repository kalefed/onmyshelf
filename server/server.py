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
    set_access_cookies,
    create_refresh_token,
    get_csrf_token,
    unset_jwt_cookies,
)
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import select

from models import db, Book, User, TokenBlocklist, Shelf, Genre

load_dotenv()

# app instance
app = Flask(__name__)
CORS(
    app,
    supports_credentials=True,
    resources={r"/api/*": {"origins": "http://localhost:3000"}},
)


# Configuration
ACCESS_EXPIRES = timedelta(hours=1)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = ACCESS_EXPIRES
app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
app.config["JWT_COOKIE_SECURE"] = False  # TODO - not sure about this
app.config["JWT_COOKIE_CSRF_PROTECT"] = True
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("SQLALCHEMY_DATABASE_URI")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_COOKIE_SAMESITE"] = "Lax"

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
        refresh_token = create_refresh_token(identity=str(user.id))
        response = jsonify(
            {
                "message": f"Logged in as {username}",
                "access_token": access_token,
                "refresh_token": refresh_token,
            }
        )

        set_access_cookies(response, access_token)
        response.status_code = 200

        # Set CSRF token in a separate cookie
        csrf_token = get_csrf_token(access_token)
        response.set_cookie(
            "csrf_access_token",
            csrf_token,
            secure=False,  # True in production
            samesite="Lax",
            httponly=False,  # Important: JS needs to read this!
        )

        return response
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
    response = jsonify({"message": "User logged out successfully"})
    response.status_code = 200
    unset_jwt_cookies(response)
    return response


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
        return jsonify([]), 200
        # return jsonify({"message": "No shelves found for this user."}), 404

    shelves_data = [shelf.to_dict() for shelf in users_shelves]

    return jsonify(shelves_data), 200


# Get all books on a specific shelf
@app.route("/api/shelves/<string:shelf_type>/books", methods=["GET"])
@jwt_required()
def get_shelf_books(shelf_type):
    current_user = get_jwt_identity()

    # Check if the shelf exists for this user
    shelf_test = db.session.execute(
        select(Shelf).where(
            Shelf.user_id == current_user, Shelf.shelf_type == shelf_type
        )
    ).scalar_one_or_none()

    if shelf_test is None:
        return jsonify({"error": f"Shelf '{shelf_type}' not found for this user."}), 404

    stmt = (
        select(Book)
        .join(Book.shelf)
        .where(Shelf.user_id == current_user, Shelf.shelf_type == shelf_type)
    )

    # Execute the query
    users_shelf = db.session.execute(stmt).scalars().all()

    return jsonify([shelf.to_dict() for shelf in users_shelf]), 200


# Add a new book to a specific shelf
@app.route("/api/shelves/<int:shelf_id>/books", methods=["POST"])
@jwt_required()
def add_book(shelf_id):
    data = request.get_json()
    current_user = get_jwt_identity()

    # Does the shelf exist?
    stmt = select(Shelf).filter_by(id=shelf_id, user_id=current_user)
    shelf = db.session.execute(stmt).scalars().first()

    if shelf:
        # Get genres list from incoming data
        genre_names = list({name.strip().lower() for name in data.get("genres", [])})

        # Create genre objects for each genre in the data
        genres = []
        for name in genre_names:
            stmt = select(Genre).filter_by(name=name)
            genre = db.session.execute(stmt).scalars().first()

            if not genre:
                genre = Genre(name=name)
                db.session.add(genre)
            genres.append(genre)

        new_book = Book(
            title=data["title"],
            author=data["author"],
            format_type=data["format_type"],
            shelf_id=shelf_id,
            genres=genres,
        )
        db.session.add(new_book)
        db.session.commit()

        return (
            jsonify(
                {
                    "message": "Book added successfully.",
                }
            ),
            201,
        )

    else:
        abort(404, description=f"No shelf with this id: `{shelf_id}` found.")


# Move a new book from one shelf to another
@app.route("/api/shelves/<int:shelf_id>/books/<int:id>", methods=["PUT"])
@jwt_required()
def move_book(shelf_id, id):
    data = request.get_json()

    # First, check if the shelf exists
    stmt = select(Shelf).filter_by(id=data["shelf_id"])
    new_shelf = db.session.execute(stmt).scalars().one_or_none()

    if not new_shelf:
        return jsonify({"message": "Shelf not found"}), 404

    # Then, check if the book exists
    stmt = select(Book).filter_by(id=id, shelf_id=shelf_id)
    book = db.session.execute(stmt).scalars().one_or_none()

    if not book:
        return jsonify({"message": "Book not found"}), 404

    # Move the book to the new shelf
    book.shelf_id = data["shelf_id"]
    db.session.commit()

    return jsonify({"message": "Book moved successfully"}), 201


# Delete a book from a shelf
@app.route("/api/shelves/<int:shelf_id>/books/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_book(shelf_id, id):
    # Get the book to delete
    stmt = select(Book).filter_by(id=id, shelf_id=shelf_id)
    book = db.session.execute(stmt).scalars().one_or_none()

    if book:
        db.session.delete(book)
        db.session.commit()
        return jsonify({"message": "Book deleted successfully"}), 202
    else:
        abort(404, description=f"No Book with this id: `{id}` found.")


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

        # Create default shelves
        default_shelves = ["currently-reading", "tbr", "up-next", "dnf"]
        for shelf_type in default_shelves:
            shelf = Shelf(shelf_type=shelf_type, user=user)
            db.session.add(shelf)

        db.session.commit()

        print("Default user created")
    else:
        print("Default user already exists")


@app.errorhandler(404)
def handle_404(e):
    return jsonify({"error": e.description}), 404


if __name__ == "__main__":
    # create the table schema in the database
    with app.app_context():
        # db.drop_all()
        db.create_all()
        get_or_create_default_user()

    app.run(host="0.0.0.0", port=8080, debug=True)
