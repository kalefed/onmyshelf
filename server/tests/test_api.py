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


def test_get_shelves(client, register_user, login_user):
    # user log in
    register_user("testuser", "test@example.com", "password123")
    login_resp = login_user("testuser", "password123")
    token = login_resp.get_json()["access_token"]

    response = client.get(f"/api/shelves", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    print(response.get_json())
    assert response.get_json() == [
        {"id": 1, "shelf_type": "currently-reading", "user_id": 1},
        {"id": 2, "shelf_type": "tbr", "user_id": 1},
        {"id": 3, "shelf_type": "up-next", "user_id": 1},
        {"id": 4, "shelf_type": "dnf", "user_id": 1},
    ]


def test_get_shelves_id(client, register_user, login_user, book_payload):
    # User log in
    register_user("testuser", "test@example.com", "password123")
    login_resp = login_user("testuser", "password123")
    token = login_resp.get_json()["access_token"]

    # Add a book
    response = client.post(
        f"/api/shelves/{1}/books",
        headers={"Authorization": f"Bearer {token}"},
        json=book_payload,
    )
    assert response.status_code == 201

    # Get the books on a shelf by its shelf_id
    response = client.get(
        f"/api/shelves/{"currently-reading"}/books",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert response.get_json() == [
        {"author": "Maggie Stiefvater", "id": 1, "title": "The Raven Boys"}
    ]


def test_get_shelves_id_not_found(client, register_user, login_user, book_payload):
    # User log in
    register_user("testuser", "test@example.com", "password123")
    login_resp = login_user("testuser", "password123")
    token = login_resp.get_json()["access_token"]

    # Add a book
    response = client.post(
        f"/api/shelves/{1}/books",
        headers={"Authorization": f"Bearer {token}"},
        json=book_payload,
    )
    assert response.status_code == 201

    # Get the books on a shelf by its shelf_id that doesn't exist
    response = client.get(
        f"/api/shelves/{"not-here"}/books",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 404
    assert response.get_json() == {
        "error": f"Shelf 'not-here' not found for this user."
    }


def test_add_book_shelf_success(client, register_user, login_user, book_payload):
    # User log in
    register_user("testuser", "test@example.com", "password123")
    login_resp = login_user("testuser", "password123")
    token = login_resp.get_json()["access_token"]

    # Add a book
    response = client.post(
        f"/api/shelves/{1}/books",
        headers={"Authorization": f"Bearer {token}"},
        json=book_payload,
    )
    assert response.status_code == 201
    assert response.get_json() == {
        "book": {
            "author": "Maggie Stiefvater",
            "id": 1,
            "title": "The Raven Boys",
            "shelf_id": 1,
        },
        "message": "Book added successfully.",
    }


def test_add_book_shelf_failure(client, register_user, login_user, book_payload):
    # User log in
    register_user("testuser", "test@example.com", "password123")
    login_resp = login_user("testuser", "password123")
    token = login_resp.get_json()["access_token"]

    # Add a book
    response = client.post(
        f"/api/shelves/{10}/books",
        headers={"Authorization": f"Bearer {token}"},
        json=book_payload,
    )
    assert response.status_code == 404
    assert response.get_json() == {"error": f"No shelf with this id: `10` found."}


def test_move_book_success(client, register_user, login_user, book_payload):
    # User log in
    register_user("testuser", "test@example.com", "password123")
    login_resp = login_user("testuser", "password123")
    token = login_resp.get_json()["access_token"]

    # Add a book
    client.post(
        f"/api/shelves/{1}/books",
        headers={"Authorization": f"Bearer {token}"},
        json=book_payload,
    )

    # Move the book
    response = client.put(
        f"/api/shelves/{1}/books/{1}",
        headers={"Authorization": f"Bearer {token}"},
        json={"shelf_id": 2},
    )
    assert response.status_code == 201
    assert response.get_json() == {"message": "Book moved successfully"}

    # Check that the book is on the new shelf
    response = client.get(
        f"/api/shelves/{"tbr"}/books",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert response.get_json() == [
        {"author": "Maggie Stiefvater", "id": 1, "title": "The Raven Boys"}
    ]


def test_move_book_failure(client, register_user, login_user, book_payload):
    # User log in
    register_user("testuser", "test@example.com", "password123")
    login_resp = login_user("testuser", "password123")
    token = login_resp.get_json()["access_token"]

    # Add a book
    client.post(
        f"/api/shelves/{1}/books",
        headers={"Authorization": f"Bearer {token}"},
        json=book_payload,
    )

    # Move the book to a shelf that does not exist
    response = client.put(
        f"/api/shelves/{1}/books/{1}",
        headers={"Authorization": f"Bearer {token}"},
        json={"shelf_id": 20},
    )
    assert response.status_code == 404
    assert response.get_json() == {"message": "Shelf not found"}

    # Move a book that does not exist to a shelf
    response = client.put(
        f"/api/shelves/{1}/books/{20}",
        headers={"Authorization": f"Bearer {token}"},
        json={"shelf_id": 2},
    )
    assert response.status_code == 404
    assert response.get_json() == {"message": "Book not found"}


def test_create_delete_book(client, register_user, login_user, book_payload):
    # User log in
    register_user("testuser", "test@example.com", "password123")
    login_resp = login_user("testuser", "password123")
    token = login_resp.get_json()["access_token"]

    # Add a book
    client.post(
        f"/api/shelves/{1}/books",
        headers={"Authorization": f"Bearer {token}"},
        json=book_payload,
    )

    # Delete the added book
    response = client.delete(
        f"/api/shelves/{1}/books/{1}",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 202
    assert response.get_json() == {"message": "Book deleted successfully"}

    # Try to get the deleted book
    # Get the books on a shelf by its shelf_id
    response = client.get(
        f"/api/shelves/{"currently-reading"}/books",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert response.get_json() == []


def test_create_delete_book_failure(client, register_user, login_user, book_payload):
    # User log in
    register_user("testuser", "test@example.com", "password123")
    login_resp = login_user("testuser", "password123")
    token = login_resp.get_json()["access_token"]

    # Add a book
    client.post(
        f"/api/shelves/{1}/books",
        headers={"Authorization": f"Bearer {token}"},
        json=book_payload,
    )

    # Delete the added book
    response = client.delete(
        f"/api/shelves/{1}/books/{20}",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 404
    assert response.get_json() == {"error": f"No Book with this id: `20` found."}
