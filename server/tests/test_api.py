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
