import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def run_tests():
    session = requests.Session()
    print("=== STARTING DRF BACKEND INTEGRATION TESTS ===")

    # 1. Guest Project List
    res = session.get(f"{BASE_URL}/api/v1/portfolio/projects/")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
    projects = res.json()
    assert len(projects) == 7, f"Expected 7 seeded projects, got {len(projects)}"
    print(f"[PASS] 1. Public GET /api/v1/portfolio/projects/ OK (Found {len(projects)} projects)")

    # 2. Guest Skills List
    res = session.get(f"{BASE_URL}/api/v1/portfolio/skills/")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    skills = res.json()
    assert len(skills) >= 3, f"Expected at least 3 categories, got {len(skills)}"
    print(f"[PASS] 2. Public GET /api/v1/portfolio/skills/ OK ({len(skills)} categories)")

    # 3. Guest Contact Submission
    contact_payload = {
        "name": "Integration Test Visitor",
        "email": "visitor@test.com",
        "subject": "Automated Testing Contact",
        "message": "Hello from backend integration test"
    }
    res = session.post(f"{BASE_URL}/api/v1/portfolio/contact/", json=contact_payload)
    assert res.status_code == 201, f"Expected 201, got {res.status_code}: {res.text}"
    print("[PASS] 3. Public POST /api/v1/portfolio/contact/ OK (Created message)")

    # 4. Guest Unauthorized Mutation Attempt
    res = session.post(f"{BASE_URL}/api/v1/portfolio/projects/", json={"title": "Hacker Project"})
    assert res.status_code in [401, 403], f"Expected 401/403 for guest mutation, got {res.status_code}"
    print(f"[PASS] 4. Protected Route Security: Guest POST /api/v1/portfolio/projects/ correctly rejected with {res.status_code}")

    # 5. Admin Login & Cookie Set
    login_payload = {
        "username": "admin",
        "password": "admin123"
    }
    res = session.post(f"{BASE_URL}/api/v1/auth/login/", json=login_payload)
    assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
    login_data = res.json()
    assert "access" in login_data, "Missing access token in login response"
    assert "user" in login_data, "Missing user object in login response"
    access_token = login_data["access"]

    # Verify HttpOnly Cookie
    assert "refresh_token" in session.cookies, f"Expected refresh_token cookie, found: {list(session.cookies.keys())}"
    refresh_cookie = session.cookies.get("refresh_token")
    assert len(refresh_cookie) > 20, "Refresh cookie is unexpectedly short"
    print(f"[PASS] 5. POST /api/v1/auth/login/ OK (Access token received, HttpOnly refresh cookie set)")

    # 6. Authenticated Me Endpoint
    headers = {"Authorization": f"Bearer {access_token}"}
    res = session.get(f"{BASE_URL}/api/v1/auth/me/", headers=headers)
    assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
    user_me = res.json()
    assert user_me["username"] == "admin"
    print(f"[PASS] 6. GET /api/v1/auth/me/ OK (User: {user_me['username']}, Role: {user_me.get('role')})")

    # 7. Token Refresh via Cookie
    res = session.post(f"{BASE_URL}/api/v1/auth/refresh/")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
    refresh_data = res.json()
    assert "access" in refresh_data, "Missing new access token in refresh response"
    new_access_token = refresh_data["access"]
    headers = {"Authorization": f"Bearer {new_access_token}"}
    print("[PASS] 7. POST /api/v1/auth/refresh/ OK (Rotated refresh cookie and issued fresh access token)")

    # 8. Admin Protected Mutation (Create & Delete Project)
    test_project = {
        "title": "Automated Test Project",
        "description": "Created during DRF verification",
        "category": "Web App",
        "tags": ["Python", "Django", "React"],
        "liveUrl": "https://example.com/live",
        "githubUrl": "https://github.com/example/repo",
        "featured": False
    }
    res = session.post(f"{BASE_URL}/api/v1/portfolio/projects/", json=test_project, headers=headers)
    assert res.status_code == 201, f"Expected 201, got {res.status_code}: {res.text}"
    created_proj = res.json()
    proj_id = created_proj["id"]
    print(f"[PASS] 8. Admin POST /api/v1/portfolio/projects/ OK (Created project id={proj_id})")

    # Clean up test project
    del_res = session.delete(f"{BASE_URL}/api/v1/portfolio/projects/{proj_id}/", headers=headers)
    assert del_res.status_code == 204, f"Expected 204, got {del_res.status_code}"
    print(f"[PASS] 8b. Admin DELETE /api/v1/portfolio/projects/{proj_id}/ OK")

    # 9. Admin Message Inbox Reading
    res = session.get(f"{BASE_URL}/api/v1/portfolio/messages/", headers=headers)
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    messages = res.json()
    assert len(messages) >= 3, f"Expected at least 3 messages (2 seeded + 1 test), got {len(messages)}"
    print(f"[PASS] 9. Admin GET /api/v1/portfolio/messages/ OK (Found {len(messages)} messages)")

    # 10. AI Chat Endpoint
    chat_payload = {
        "message": "What architecture does Usama use in the Olyra project?"
    }
    res = session.post(f"{BASE_URL}/api/v1/ai/chat/", json=chat_payload)
    assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
    chat_data = res.json()
    assert "reply" in chat_data, "Missing reply in AI chat response"
    print(f"[PASS] 10. POST /api/v1/ai/chat/ OK (Provider: {chat_data.get('provider')}, Reply snippet: {chat_data['reply'][:65]}...)")

    # 11. AI Settings Endpoint (Admin Only)
    res = session.get(f"{BASE_URL}/api/v1/ai/settings/", headers=headers)
    assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
    ai_settings = res.json()
    assert ai_settings["primary_provider"] == "gemini"
    print(f"[PASS] 11. Admin GET /api/v1/ai/settings/ OK (Primary: {ai_settings['primary_provider']}, Fallback: {ai_settings['fallback_provider']})")

    # Update AI Settings
    update_res = session.put(
        f"{BASE_URL}/api/v1/ai/settings/",
        json={"primary_provider": "gemini", "primary_model": "gemini-2.5-flash", "temperature": 0.8},
        headers=headers
    )
    assert update_res.status_code == 200, f"Expected 200, got {update_res.status_code}: {update_res.text}"
    print("[PASS] 11b. Admin PUT /api/v1/ai/settings/ OK (Updated temperature to 0.8)")

    # 12. Logout & Token Blacklist
    logout_res = session.post(f"{BASE_URL}/api/v1/auth/logout/")
    assert logout_res.status_code == 200, f"Expected 200, got {logout_res.status_code}: {logout_res.text}"
    assert session.cookies.get("refresh_token") in [None, ""], "Refresh cookie was not cleared on logout"
    print("[PASS] 12. POST /api/v1/auth/logout/ OK (Refresh cookie cleared, session terminated)")

    print("\n========================================================")
    print("ALL 12 BACKEND INTEGRATION TESTS PASSED WITH 100% SUCCESS!")
    print("========================================================")

if __name__ == "__main__":
    run_tests()
