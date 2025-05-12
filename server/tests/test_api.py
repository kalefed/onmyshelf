def test_get_users_empty(client):
    response = client.get("/api/users")
    assert response.status_code == 200
    assert response.get_json() == [
        {"id": 1, "username": "defaultuser", "email": "default@example.com"}
    ]


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

    # Delete the added book
    response = client.delete(f"/api/books/{book_payload['id']}")
    assert response.status_code == 202
    assert response.get_json()["Message"] == "Book deleted successfully"

    # Get the deleted book
    response = client.get(f"/api/books/{book_payload['id']}")
    assert response.status_code == 404
    assert (
        response.get_json()["detail"]
        == f"No Book with this id: `{book_payload['id']}` found"
    )
