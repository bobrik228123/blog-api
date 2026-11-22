from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)



def test_get_all_posts():
    response = client.get("/post/?skip=0&limit=10&sort=newest")
    assert response.status_code == 200
    print(response.json())
    assert isinstance(response.json(), list)

    assert all(isinstance(post, dict) for post in response.json()) #check that every item is a dict

    assert all({"id", "title", "content"}.issubset(post.keys()) for post in response.json()) #check that every post contains id title and content

    ids = [post["id"] for post in response.json()]

    assert ids == sorted(ids, reverse=True)

def test_get_all_posts_pagination():
    response_all_posts = client.get("/post/", params={"skip": 0, "limit": 10, "sort": "newest"})



    response_skipped_posts = client.get("/post/", params={"skip": 3, "limit": 4, "sort": "newest"})

    assert response_all_posts.status_code == 200
    assert response_skipped_posts.status_code == 200

    assert response_skipped_posts.json() == response_all_posts.json()[3:7]

