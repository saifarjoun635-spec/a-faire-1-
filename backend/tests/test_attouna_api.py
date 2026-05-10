"""Backend API tests for Attouna Services.

Covers: auth (login/me), jobs CRUD (admin+public), applications (multipart upload,
list, CV download, delete), and ObjectId leak protection.
"""
import io
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    # fallback to frontend env file (testing env consistency)
    try:
        with open("/app/frontend/.env") as f:
            for ln in f:
                if ln.startswith("REACT_APP_BACKEND_URL="):
                    BASE_URL = ln.split("=", 1)[1].strip().rstrip("/")
                    break
    except Exception:
        pass

API = f"{BASE_URL}/api"

ADMIN_EMAIL = "attounaservice@yahoo.com"
ADMIN_PASSWORD = "Attouna2024!"
SECTORS = ["entrepot", "paysagerie", "hotelier"]

# Minimal valid PDF bytes (header + EOF marker)
PDF_BYTES = (
    b"%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n"
    b"2 0 obj<</Type/Pages/Count 0/Kids[]>>endobj\n"
    b"xref\n0 3\n0000000000 65535 f \n0000000010 00000 n \n0000000060 00000 n \n"
    b"trailer<</Size 3/Root 1 0 R>>\nstartxref\n110\n%%EOF\n"
)


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    return s


@pytest.fixture(scope="module")
def admin_token(session):
    r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    data = r.json()
    assert "access_token" in data and isinstance(data["access_token"], str)
    assert data.get("email") == ADMIN_EMAIL.lower()
    return data["access_token"]


@pytest.fixture(scope="module")
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


# --- Health ---
def test_root_health(session):
    r = session.get(f"{API}/")
    assert r.status_code == 200
    assert r.json().get("status") == "ok"


# --- Auth ---
class TestAuth:
    def test_login_invalid(self, session):
        r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"})
        assert r.status_code == 401

    def test_me_requires_token(self, session):
        r = session.get(f"{API}/auth/me")
        assert r.status_code == 401

    def test_me_invalid_token(self, session):
        r = session.get(f"{API}/auth/me", headers={"Authorization": "Bearer notavalidtoken"})
        assert r.status_code == 401

    def test_me_with_token(self, session, auth_headers):
        r = session.get(f"{API}/auth/me", headers=auth_headers)
        assert r.status_code == 200
        body = r.json()
        assert body["email"] == ADMIN_EMAIL.lower()
        assert body["role"] == "admin"
        assert "_id" not in body


# --- Jobs CRUD ---
class TestJobs:
    created_ids = []

    def test_create_jobs_each_sector(self, session, auth_headers):
        for sector in SECTORS:
            payload = {
                "title": f"TEST_{sector}_job",
                "sector": sector,
                "job_type": "temps_plein",
                "location": "Montréal",
                "description": f"Description test {sector}",
                "is_active": True,
            }
            r = session.post(f"{API}/jobs", json=payload, headers=auth_headers)
            assert r.status_code == 200, f"{sector}: {r.status_code} {r.text}"
            j = r.json()
            assert j["title"] == payload["title"]
            assert j["sector"] == sector
            assert "_id" not in j
            assert "id" in j
            TestJobs.created_ids.append(j["id"])
        assert len(TestJobs.created_ids) == 3

    def test_create_job_no_auth(self, session):
        r = session.post(
            f"{API}/jobs",
            json={"title": "x", "sector": "entrepot", "job_type": "x", "location": "x", "description": "x"},
        )
        assert r.status_code == 401

    def test_list_jobs_public_active_only(self, session):
        r = session.get(f"{API}/jobs")
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        for it in items:
            assert "_id" not in it
            assert it["is_active"] == True  # noqa: E712

    def test_list_jobs_filter_sector(self, session):
        r = session.get(f"{API}/jobs", params={"sector": "entrepot"})
        assert r.status_code == 200
        items = r.json()
        assert all(i["sector"] == "entrepot" for i in items)

    def test_list_jobs_invalid_sector(self, session):
        r = session.get(f"{API}/jobs", params={"sector": "invalid"})
        assert r.status_code == 400

    def test_admin_list_all_jobs(self, session, auth_headers):
        r = session.get(f"{API}/jobs/all", headers=auth_headers)
        assert r.status_code == 200
        items = r.json()
        assert len(items) >= 3
        for it in items:
            assert "_id" not in it

    def test_admin_list_all_jobs_no_auth(self, session):
        r = session.get(f"{API}/jobs/all")
        assert r.status_code == 401

    def test_update_job(self, session, auth_headers):
        jid = TestJobs.created_ids[0]
        r = session.put(
            f"{API}/jobs/{jid}", json={"title": "TEST_updated", "is_active": False}, headers=auth_headers
        )
        assert r.status_code == 200
        assert r.json()["title"] == "TEST_updated"
        # Verify persistence (deactivated => not in public list)
        public = session.get(f"{API}/jobs").json()
        assert all(i["id"] != jid for i in public)

    def test_get_job_by_id(self, session):
        # Need an active one
        jid = TestJobs.created_ids[1]
        r = session.get(f"{API}/jobs/{jid}")
        assert r.status_code == 200
        assert r.json()["id"] == jid

    def test_get_job_404(self, session):
        r = session.get(f"{API}/jobs/nonexistent-id-xyz")
        assert r.status_code == 404


# --- Applications ---
class TestApplications:
    created_app_id = None

    def test_create_application_pdf(self, session):
        # Use an active job
        jobs = session.get(f"{API}/jobs").json()
        job_id = jobs[0]["id"] if jobs else None

        files = {"cv": ("resume.pdf", io.BytesIO(PDF_BYTES), "application/pdf")}
        data = {
            "first_name": "TEST_John",
            "last_name": "Doe",
            "email": "TEST_john@example.com",
            "phone": "5145551234",
            "sector": "entrepot",
            "cover_letter": "Je suis intéressé par ce poste",
        }
        if job_id:
            data["job_id"] = job_id
        r = session.post(f"{API}/applications", data=data, files=files)
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["first_name"] == "TEST_John"
        assert body["email"] == "test_john@example.com"
        assert body["sector"] == "entrepot"
        assert body["cv_filename"] == "resume.pdf"
        assert "cv_base64" not in body  # leak check
        assert "_id" not in body
        TestApplications.created_app_id = body["id"]

    def test_create_application_non_pdf(self, session):
        files = {"cv": ("notes.txt", io.BytesIO(b"hello"), "text/plain")}
        data = {
            "first_name": "X", "last_name": "Y", "email": "x@y.com",
            "phone": "1", "sector": "entrepot", "cover_letter": "x",
        }
        r = session.post(f"{API}/applications", data=data, files=files)
        assert r.status_code == 400

    def test_create_application_invalid_sector(self, session):
        files = {"cv": ("cv.pdf", io.BytesIO(PDF_BYTES), "application/pdf")}
        data = {
            "first_name": "X", "last_name": "Y", "email": "x@y.com",
            "phone": "1", "sector": "BAD", "cover_letter": "x",
        }
        r = session.post(f"{API}/applications", data=data, files=files)
        assert r.status_code == 400

    def test_list_applications_admin(self, session, auth_headers):
        r = session.get(f"{API}/applications", headers=auth_headers)
        assert r.status_code == 200
        items = r.json()
        assert len(items) >= 1
        for it in items:
            assert "cv_base64" not in it
            assert "_id" not in it

    def test_list_applications_no_auth(self, session):
        r = session.get(f"{API}/applications")
        assert r.status_code == 401

    def test_download_cv(self, session, auth_headers):
        assert TestApplications.created_app_id, "create test must have run"
        r = session.get(
            f"{API}/applications/{TestApplications.created_app_id}/cv", headers=auth_headers
        )
        assert r.status_code == 200
        assert r.headers.get("content-type", "").startswith("application/pdf")
        assert r.content[:4] == b"%PDF"

    def test_download_cv_no_auth(self, session):
        assert TestApplications.created_app_id
        r = session.get(f"{API}/applications/{TestApplications.created_app_id}/cv")
        assert r.status_code == 401


# --- Employer Requests ---
class TestEmployerRequests:
    created_ids = []

    def test_create_employer_request_valid(self, session):
        payload = {
            "company_name": "TEST_Acme Logistique",
            "contact_name": "TEST_Marie Tremblay",
            "email": "TEST_emp@example.com",
            "phone": "514-555-7777",
            "sector": "entrepot",
            "nb_positions": 3,
            "urgency": "1-2_semaines",
            "description": "Nous cherchons des opérateurs de chariot élévateur.",
        }
        r = session.post(f"{API}/employer-requests", json=payload)
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["company_name"] == payload["company_name"]
        assert body["sector"] == "entrepot"
        assert body["nb_positions"] == 3
        assert body["urgency"] == "1-2_semaines"
        assert body["status"] == "new"
        assert "id" in body and "created_at" in body
        assert "_id" not in body
        TestEmployerRequests.created_ids.append(body["id"])

    def test_create_employer_request_sector_autre(self, session):
        payload = {
            "company_name": "TEST_Other",
            "contact_name": "TEST_Contact",
            "email": "TEST_other@example.com",
            "phone": "5145550000",
            "sector": "autre",
            "nb_positions": 1,
            "urgency": "flexible",
            "description": "Besoin divers.",
        }
        r = session.post(f"{API}/employer-requests", json=payload)
        assert r.status_code == 200
        TestEmployerRequests.created_ids.append(r.json()["id"])

    def test_create_employer_request_invalid_sector(self, session):
        payload = {
            "company_name": "TEST_Bad",
            "contact_name": "X",
            "email": "x@y.com",
            "phone": "1",
            "sector": "INVALID_SECTOR",
            "nb_positions": 1,
            "urgency": "flexible",
            "description": "x",
        }
        r = session.post(f"{API}/employer-requests", json=payload)
        assert r.status_code == 422

    def test_create_employer_request_invalid_urgency(self, session):
        payload = {
            "company_name": "TEST_Bad",
            "contact_name": "X",
            "email": "x@y.com",
            "phone": "1",
            "sector": "entrepot",
            "nb_positions": 1,
            "urgency": "asap",
            "description": "x",
        }
        r = session.post(f"{API}/employer-requests", json=payload)
        assert r.status_code == 422

    def test_create_employer_request_invalid_nb(self, session):
        payload = {
            "company_name": "TEST_Bad",
            "contact_name": "X",
            "email": "x@y.com",
            "phone": "1",
            "sector": "entrepot",
            "nb_positions": 0,
            "urgency": "flexible",
            "description": "x",
        }
        r = session.post(f"{API}/employer-requests", json=payload)
        assert r.status_code == 422

    def test_list_employer_requests_no_auth(self, session):
        r = session.get(f"{API}/employer-requests")
        assert r.status_code == 401

    def test_list_employer_requests_admin(self, session, auth_headers):
        r = session.get(f"{API}/employer-requests", headers=auth_headers)
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        assert len(items) >= len(TestEmployerRequests.created_ids)
        for it in items:
            assert "_id" not in it
        # verify our created ids present
        ids_in_list = {it["id"] for it in items}
        for cid in TestEmployerRequests.created_ids:
            assert cid in ids_in_list

    def test_delete_employer_request_no_auth(self, session):
        if not TestEmployerRequests.created_ids:
            pytest.skip("no req")
        r = session.delete(f"{API}/employer-requests/{TestEmployerRequests.created_ids[0]}")
        assert r.status_code == 401


# --- Cleanup ---
class TestZCleanup:
    def test_delete_employer_requests(self, session, auth_headers):
        for rid in TestEmployerRequests.created_ids:
            r = session.delete(f"{API}/employer-requests/{rid}", headers=auth_headers)
            assert r.status_code == 200
        # confirm gone
        if TestEmployerRequests.created_ids:
            items = session.get(f"{API}/employer-requests", headers=auth_headers).json()
            for rid in TestEmployerRequests.created_ids:
                assert all(i["id"] != rid for i in items)
        # 404 on second delete
        if TestEmployerRequests.created_ids:
            r = session.delete(
                f"{API}/employer-requests/{TestEmployerRequests.created_ids[0]}",
                headers=auth_headers,
            )
            assert r.status_code == 404

    def test_delete_application(self, session, auth_headers):
        app_id = TestApplications.created_app_id
        if not app_id:
            pytest.skip("no app created")
        r = session.delete(f"{API}/applications/{app_id}", headers=auth_headers)
        assert r.status_code == 200
        # GET the listing — ensure not present
        items = session.get(f"{API}/applications", headers=auth_headers).json()
        assert all(i["id"] != app_id for i in items)

    def test_delete_jobs(self, session, auth_headers):
        for jid in TestJobs.created_ids:
            r = session.delete(f"{API}/jobs/{jid}", headers=auth_headers)
            assert r.status_code == 200
        # 404 on second delete
        if TestJobs.created_ids:
            r = session.delete(f"{API}/jobs/{TestJobs.created_ids[0]}", headers=auth_headers)
            assert r.status_code == 404
