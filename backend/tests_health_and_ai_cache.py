import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def run_tests():
    session = requests.Session()
    print("=== STARTING HEALTHCHECK & AI INTELLIGENCE TESTS ===")

    # 1. Healthcheck Route Test
    res = session.get(f"{BASE_URL}/health/")
    assert res.status_code == 200, f"Expected 200 from /health/, got {res.status_code}: {res.text}"
    health_data = res.json()
    assert health_data["status"] == "healthy", f"Expected healthy status, got: {health_data}"
    assert health_data["database"] == "ok", f"Expected database ok, got: {health_data}"
    print(f"[PASS] 1. GET /health/ OK (Status: {health_data['status']}, DB: {health_data['database']}, Uptime: {health_data['uptime_seconds']}s)")

    # 1b. API Versioned Healthcheck Test
    res_v1 = session.get(f"{BASE_URL}/api/v1/health/")
    assert res_v1.status_code == 200, f"Expected 200 from /api/v1/health/, got {res_v1.status_code}"
    print("[PASS] 1b. GET /api/v1/health/ OK (Standardized cloud probe active)")

    # 2. Login as Admin
    login_res = session.post(f"{BASE_URL}/api/v1/auth/login/", json={"username": "admin", "password": "admin123"})
    assert login_res.status_code == 200
    access_token = login_res.json()["access"]
    headers = {"Authorization": f"Bearer {access_token}"}
    print("[PASS] 2. Admin authenticated")

    # 3. First Question (Cache Miss, Fresh Generation)
    res_q1 = session.post(f"{BASE_URL}/api/v1/ai/chat/", json={"message": "What skills does Usama have?"})
    assert res_q1.status_code == 200
    data_q1 = res_q1.json()
    assert data_q1.get("is_cached") is False, f"Expected initial question not cached, got: {data_q1}"
    print(f"[PASS] 3. Initial Question: Fresh response generated (is_cached=False, Provider: {data_q1['provider']})")

    # 4. Same Question Again (Cache Hit, Zero External API Credits Used)
    res_q2 = session.post(f"{BASE_URL}/api/v1/ai/chat/", json={"message": "What skills does Usama have?"})
    assert res_q2.status_code == 200
    data_q2 = res_q2.json()
    assert data_q2.get("is_cached") is True, f"Expected question to be served from cache, got: {data_q2}"
    assert data_q2.get("hit_count", 0) >= 2
    print(f"[PASS] 4. Duplicate Question: Served from semantic cache! (is_cached=True, Hit count: {data_q2['hit_count']})")

    # 5. Semantic Normalization Variation: "what skills does usama have?"
    res_q3 = session.post(f"{BASE_URL}/api/v1/ai/chat/", json={"message": "what skills does usama have???"})
    assert res_q3.status_code == 200
    data_q3 = res_q3.json()
    assert data_q3.get("is_cached") is True, f"Expected semantic variation to hit cache, got: {data_q3}"
    print(f"[PASS] 5. Question Variation: Semantic normalizer successfully matched cache! (Hits: {data_q3['hit_count']})")

    # 6. Check Initial Knowledge Version
    settings_res = session.get(f"{BASE_URL}/api/v1/ai/settings/", headers=headers)
    assert settings_res.status_code == 200
    v1_settings = settings_res.json()
    initial_version = v1_settings["knowledge_version"]
    print(f"[PASS] 6. Initial Knowledge Version verified: v{initial_version}")

    # 7. Add New Project ("QuantumFlow Next-Gen AI") -> Should auto-increment knowledge version!
    new_project = {
        "title": "QuantumFlow Next-Gen AI",
        "description": "High-throughput vector search and neural pipeline architected in React and Python.",
        "category": "Web App",
        "tags": ["React 19", "Python", "Vector DB"],
        "architecture": "Event-driven asynchronous workers with Redis queue",
        "metrics": "Sub-10ms neural retrieval",
        "featured": True
    }
    create_proj_res = session.post(f"{BASE_URL}/api/v1/portfolio/projects/", json=new_project, headers=headers)
    assert create_proj_res.status_code == 201
    created_id = create_proj_res.json()["id"]

    # 8. Verify Knowledge Version Incremented
    settings_res2 = session.get(f"{BASE_URL}/api/v1/ai/settings/", headers=headers)
    v2_settings = settings_res2.json()
    new_version = v2_settings["knowledge_version"]
    assert new_version > initial_version, f"Expected knowledge version > {initial_version}, got {new_version}"
    print(f"[PASS] 7-8. Added new project -> Knowledge version automatically incremented: v{initial_version} -> v{new_version}")

    # 9. Verify AI Dynamically Learns New Project
    res_new_ai = session.post(f"{BASE_URL}/api/v1/ai/chat/", json={"message": "Tell me about QuantumFlow"})
    assert res_new_ai.status_code == 200
    reply_new = res_new_ai.json()["reply"]
    assert "QuantumFlow" in reply_new, f"Expected QuantumFlow in AI response, got: {reply_new}"
    print(f"[PASS] 9. AI Continuous Learning: AI immediately recognized and explained new project 'QuantumFlow'!")

    # 10. Check Cache Statistics
    stats_res = session.get(f"{BASE_URL}/api/v1/ai/cache/stats/", headers=headers)
    assert stats_res.status_code == 200
    stats = stats_res.json()
    print(f"[PASS] 10. Cache Telemetry: {stats['total_cached_queries']} cached queries, {stats['api_calls_saved']} API calls saved!")

    # 11. Test Cache Flush
    flush_res = session.post(f"{BASE_URL}/api/v1/ai/cache/flush/", headers=headers)
    assert flush_res.status_code == 200
    print(f"[PASS] 11. POST /api/v1/ai/cache/flush/ OK (Flushed {flush_res.json()['flushed_count']} entries)")

    # Clean up test project
    session.delete(f"{BASE_URL}/api/v1/portfolio/projects/{created_id}/", headers=headers)
    print(f"[PASS] 12. Cleaned up temporary test project id={created_id}")

    print("\n==================================================================")
    print("ALL HEALTHCHECK & CONTINUOUS AI CACHING TESTS PASSED WITH 100% SUCCESS!")
    print("==================================================================")

if __name__ == "__main__":
    run_tests()
