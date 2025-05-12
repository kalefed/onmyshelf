import pytest
from models import db, User, Book
from server import app as flask_app


@pytest.fixture(autouse=True, scope="function")
def test_app():
    flask_app.config.update(
        {
            "TESTING": True,
            "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        }
    )

    with flask_app.app_context():
        db.create_all()  # Create the database schema

        yield flask_app  # Yield the actual Flask app object

        db.session.remove()  # Clean up DB sessions
        db.drop_all()  # Drop the tables after testing


@pytest.fixture()
def client(test_app):
    return test_app.test_client()

# Fixture to seed book data
@pytest.fixture(scope="function")
def seed_books(test_app):
    with test_app.app_context():
        db.session.add_all(
            [
                Book(id=1, title="The Hunger Games", author="Suzanne Collins"),
                Book(id=2, title="Jade City", author="Fonda Lee"),
            ]
        )
        db.session.commit()
        yield
        db.session.rollback()


# Fixture to generate a book payload
@pytest.fixture()
def book_payload():
    """Generate a book payload."""
    return {
        "id": 3,
        "title": "The Raven Boys",
        "author": "Maggie Stiefvater",
    }
