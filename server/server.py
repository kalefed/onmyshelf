from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from os import environ
from models import db, User, Book

# app instance
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config["SQLALCHEMY_DATABASE_URI"] = (
    "postgresql://postgres:booksarekewl@postgres_db:5432/dev_db"
)
db.init_app(app)


@app.route("/api/users", methods=["GET"])
def get_users():
    # Query all users from the database
    users = User.query.all()

    # Convert each user to a dictionary
    users_data = [{"id": u.id, "username": u.username, "email": u.email} for u in users]

    # Return as JSON response
    return jsonify(users_data)


# Add a new book
@app.route("/api/books", methods=["POST"])
def add_book():
    data = request.get_json()
    new_book = Book(title=data["title"], author=data["author"])
    db.session.add(new_book)
    db.session.commit()

    return {"message": "Book added successfully"}, 201


# Get all books
@app.route("/api/books", methods=["GET"])
def get_books():
    # Query all books from the database
    books = Book.query.all()
    return jsonify([book.to_dict() for book in books])


# Get a book by ID
@app.route("/api/books/<int:id>", methods=["GET"])
def get_book(id):
    book = Book.query.filter_by(id=id).first()

    # Handle case when the book ID does not exist
    if not book:
        abort(404, description=f"No Book with this id: `{id}` found")

    return jsonify(book.to_dict())


# Delete a book
@app.route("/api/books/<int:id>", methods=["DELETE"])
def delete_book(id):
    book = Book.query.filter_by(id=id).first()

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
            password_hash="dev-placeholder",  # Not secure — fine for testing only
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
        db.create_all()
        get_or_create_default_user()

    app.run(host="0.0.0.0", port=8080, debug=True)
