import pytest
from models import db
from server import app as flask_app


@pytest.fixture(autouse=True, scope="session")
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
    return test_app.test_client()  # Return the test client for interacting with the app
