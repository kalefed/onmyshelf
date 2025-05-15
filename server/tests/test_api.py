def test_register_user_success(client, register_user):
    response = register_user("testuser", "test@example.com", "password123")
    assert response.status_code == 201
    assert response.get_json()["message"] == "User registered successfully."


def test_register_existing_user(client, register_user):
    register_user("testuser", "test@example.com", "password123")
    response = register_user("testuser", "test@example.com", "password123")
    assert response.status_code == 400
    assert response.get_json()["message"] == "User already exists. Please login."


def test_user_login_success(client, register_user, login_user):
    register_user("testuser", "test@example.com", "password123")
    response = login_user("testuser", "password123")
    data = response.get_json()
    assert response.status_code == 200
    assert data["message"] == "Logged in as testuser"
    assert "access_token" in data


def test_user_login_invalid_username(client, register_user, login_user):
    register_user("testuser", "test@example.com", "password123")
    response = login_user("notmyuser", "password123")
    assert response.status_code == 401
    assert response.get_json()["message"] == "Invalid username or password."


def test_user_login_invalid_password(client, register_user, login_user):
    register_user("testuser", "test@example.com", "password123")
    response = login_user("testuser", "notmypassword")
    assert response.status_code == 401
    assert response.get_json()["message"] == "Invalid username or password."


def test_user_logout_success(client, register_user, login_user):
    register_user("testuser", "test@example.com", "password123")
    login_resp = login_user("testuser", "password123")
    token = login_resp.get_json()["access_token"]

    response = client.delete(
        "/api/logout", headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.get_json()["message"] == "User logged out successfully"


def test_get_all_books(client, seed_books):
    response = client.get("/api/books")
    assert response.status_code == 200
    assert response.get_json() == [
        {"id": 1, "title": "The Hunger Games", "author": "Suzanne Collins"},
        {"id": 2, "title": "Jade City", "author": "Fonda Lee"},
    ]


def test_get_book_id(client, seed_books):
    response = client.get(f"/api/books/{1}")
    assert response.status_code == 200
    assert response.get_json() == {
        "id": 1,
        "title": "The Hunger Games",
        "author": "Suzanne Collins",
    }


def test_get_book_not_found(client, seed_books):
    response = client.get(f"/api/books/{200}")
    assert response.status_code == 404
    assert response.get_json()["detail"] == f"No Book with this id: `{200}` found"


def test_create_delete_book(client, book_payload):
    response = client.post("/api/books", json=book_payload)
    assert response.status_code == 201
    
    books = client.get("/api/books").get_json()
    book_id = books[0]["id"]

    # Delete the added book
    response = client.delete(f"/api/books/{book_id}")
    assert response.status_code == 202
    assert response.get_json()["Message"] == "Book deleted successfully"

    # Get the deleted book
    response = client.get(f"/api/books/{book_id}")
    assert response.status_code == 404
    assert (
        response.get_json()["detail"]
        == f"No Book with this id: `{book_id}` found"
    )
