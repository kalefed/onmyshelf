def test_get_users_empty(client):
    response = client.get("/api/users")
    assert response.status_code == 200
    assert response.get_json() == []
