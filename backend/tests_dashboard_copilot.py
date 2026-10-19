import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def run_tests():
    session = requests.Session()
    print("=== STARTING DASHBOARD AI COPILOT INTEGRATION TESTS ===")

    # 1. Login as Admin
    login_res = session.post(f"{BASE_URL}/api/v1/auth/login/", json={"username": "admin", "password": "admin123"})
    assert login_res.status_code == 200, f"Login failed: {login_res.text}"
    token = login_res.json()["access"]
    headers = {"Authorization": f"Bearer {token}"}
    print("[PASS] 1. Admin authenticated")

    # 2. Test Content Generator: Project Title
    res_title = session.post(
        f"{BASE_URL}/api/v1/ai/copilot/generate/",
        json={"field_type": "project_title", "context": {"title": "Aura Health", "category": "Dashboard", "tags": "Next.js, Echarts"}},
        headers=headers
    )
    assert res_title.status_code == 200, f"Generate title failed: {res_title.text}"
    title_text = res_title.json()["generated_text"]
    assert len(title_text) > 3
    print(f"[PASS] 2. AI Copilot Title Generated: '{title_text}'")

    # 3. Test Content Generator: Project Description
    res_desc = session.post(
        f"{BASE_URL}/api/v1/ai/copilot/generate/",
        json={
            "field_type": "project_description",
            "context": {"title": title_text, "category": "Dashboard", "tags": "Next.js, Echarts, Tailwind CSS"}
        },
        headers=headers
    )
    assert res_desc.status_code == 200
    desc_text = res_desc.json()["generated_text"]
    assert len(desc_text) > 20
    print(f"[PASS] 3. AI Copilot Description Generated ({len(desc_text)} chars): '{desc_text[:70]}...'")

    # 4. Test Content Generator: Architecture & Metrics
    res_arch = session.post(
        f"{BASE_URL}/api/v1/ai/copilot/generate/",
        json={"field_type": "project_architecture", "context": {"title": title_text, "tags": "React 19, Redux"}},
        headers=headers
    )
    assert res_arch.status_code == 200
    arch_text = res_arch.json()["generated_text"]
    print(f"[PASS] 4. AI Copilot Architecture: '{arch_text}'")

    res_metrics = session.post(
        f"{BASE_URL}/api/v1/ai/copilot/generate/",
        json={"field_type": "project_metrics", "context": {"title": title_text}},
        headers=headers
    )
    assert res_metrics.status_code == 200
    metrics_text = res_metrics.json()["generated_text"]
    print(f"[PASS] 4b. AI Copilot Metrics: '{metrics_text}'")

    # 5. Test AI Inbox Analysis / Triage
    res_inbox = session.get(f"{BASE_URL}/api/v1/ai/copilot/inbox-analysis/", headers=headers)
    assert res_inbox.status_code == 200, f"Inbox analysis failed: {res_inbox.text}"
    inbox_data = res_inbox.json()
    assert "unread_count" in inbox_data
    assert "needs_reply_count" in inbox_data
    assert "messages" in inbox_data
    print(f"[PASS] 5. AI Inbox Triage OK: {inbox_data['total_messages']} total, {inbox_data['unread_count']} unread, {inbox_data['needs_reply_count']} need reply")

    # 6. Test Personalized AI Email Reply Generator
    sample_msg = inbox_data["messages"][0] if inbox_data["messages"] else {
        "name": "Sarah Connor",
        "email": "sarah@cyberdyne.ai",
        "subject": "Frontend Contract Offer",
        "snippet": "We want you to build our operations dashboard."
    }
    res_reply = session.post(
        f"{BASE_URL}/api/v1/ai/copilot/draft-reply/",
        json={
            "name": sample_msg["name"],
            "email": sample_msg.get("email", "client@domain.com"),
            "subject": sample_msg.get("subject", "Collaboration"),
            "message": "Hello Usama, we reviewed your Olyra and Dentalook projects. We are looking for an architect to build our 2026 operations dashboard.",
            "tone": "warm_professional"
        },
        headers=headers
    )
    assert res_reply.status_code == 200, f"Draft reply failed: {res_reply.text}"
    reply_data = res_reply.json()
    assert "reply_body" in reply_data
    assert "mailto_url" in reply_data
    assert "mailto:" in reply_data["mailto_url"]
    print(f"[PASS] 6. Personalized AI Reply Drafted for {reply_data['name']}! (Body length: {len(reply_data['reply_body'])} chars)")
    print(f"       Prefilled mailto URI generated: {reply_data['mailto_url'][:60]}...")

    print("\n==================================================================")
    print("ALL DASHBOARD AI COPILOT TESTS PASSED WITH 100% SUCCESS!")
    print("==================================================================")

if __name__ == "__main__":
    run_tests()
