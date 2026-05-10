from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import uuid
import logging
import base64
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Literal

import bcrypt
import jwt as pyjwt
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, UploadFile, File, Form
from fastapi.responses import Response
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr


# --- Config ---
MONGO_URL = os.environ['MONGO_URL']
DB_NAME = os.environ['DB_NAME']
JWT_SECRET = os.environ['JWT_SECRET']
ADMIN_EMAIL = os.environ['ADMIN_EMAIL']
ADMIN_PASSWORD = os.environ['ADMIN_PASSWORD']
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRES_HOURS = 24

SECTORS = ["entrepot", "paysagerie", "hotelier"]

# --- DB ---
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# --- App ---
app = FastAPI(title="Attouna Services API")
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# --- Models ---
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    email: str


class JobBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    sector: Literal["entrepot", "paysagerie", "hotelier"]
    job_type: str = Field(..., min_length=1, max_length=100)
    location: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1)
    is_active: bool = True


class Job(JobBase):
    id: str
    created_at: str


class JobCreate(JobBase):
    pass


class JobUpdate(BaseModel):
    title: Optional[str] = None
    sector: Optional[Literal["entrepot", "paysagerie", "hotelier"]] = None
    job_type: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None


class ApplicationOut(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: str
    phone: str
    sector: str
    cover_letter: str
    cv_filename: str
    job_id: Optional[str] = None
    job_title: Optional[str] = None
    created_at: str


class EmployerRequestCreate(BaseModel):
    company_name: str = Field(..., min_length=1, max_length=200)
    contact_name: str = Field(..., min_length=1, max_length=200)
    email: EmailStr
    phone: str = Field(..., min_length=1, max_length=50)
    sector: Literal["entrepot", "paysagerie", "hotelier", "autre"]
    nb_positions: int = Field(..., ge=1, le=999)
    urgency: Literal["immediate", "1-2_semaines", "1_mois", "flexible"]
    description: str = Field(..., min_length=1)


class EmployerRequest(EmployerRequestCreate):
    id: str
    created_at: str
    status: str = "new"


# --- Auth helpers ---
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(email: str) -> str:
    payload = {
        "sub": email,
        "email": email,
        "role": "admin",
        "exp": datetime.now(timezone.utc) + timedelta(hours=ACCESS_TOKEN_EXPIRES_HOURS),
        "iat": datetime.now(timezone.utc),
        "type": "access",
    }
    return pyjwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_admin(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> dict:
    token = None
    if credentials and credentials.credentials:
        token = credentials.credentials
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Non authentifié")
    try:
        payload = pyjwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access" or payload.get("role") != "admin":
            raise HTTPException(status_code=401, detail="Token invalide")
        user = await db.users.find_one({"email": payload["email"]}, {"_id": 0, "password_hash": 0})
        if not user:
            raise HTTPException(status_code=401, detail="Utilisateur introuvable")
        return user
    except pyjwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expiré")
    except pyjwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token invalide")


# --- Routes: Auth ---
@api_router.post("/auth/login", response_model=TokenResponse)
async def login(data: LoginRequest):
    email = data.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Identifiants invalides")
    token = create_access_token(email)
    return TokenResponse(access_token=token, email=email)


@api_router.get("/auth/me")
async def me(admin: dict = Depends(get_current_admin)):
    return {"email": admin["email"], "role": admin.get("role", "admin")}


# --- Routes: Jobs ---
@api_router.get("/jobs", response_model=List[Job])
async def list_jobs(sector: Optional[str] = None, active_only: bool = True):
    query: dict = {}
    if sector:
        if sector not in SECTORS:
            raise HTTPException(status_code=400, detail="Secteur invalide")
        query["sector"] = sector
    if active_only:
        query["is_active"] = True
    docs = await db.jobs.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return docs


@api_router.get("/jobs/all", response_model=List[Job])
async def list_all_jobs(admin: dict = Depends(get_current_admin)):
    docs = await db.jobs.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return docs


@api_router.get("/jobs/{job_id}", response_model=Job)
async def get_job(job_id: str):
    doc = await db.jobs.find_one({"id": job_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Offre introuvable")
    return doc


@api_router.post("/jobs", response_model=Job)
async def create_job(payload: JobCreate, admin: dict = Depends(get_current_admin)):
    now = datetime.now(timezone.utc).isoformat()
    doc = payload.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = now
    await db.jobs.insert_one(doc.copy())
    doc.pop("_id", None)
    return doc


@api_router.put("/jobs/{job_id}", response_model=Job)
async def update_job(job_id: str, payload: JobUpdate, admin: dict = Depends(get_current_admin)):
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="Aucune donnée à mettre à jour")
    result = await db.jobs.update_one({"id": job_id}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Offre introuvable")
    doc = await db.jobs.find_one({"id": job_id}, {"_id": 0})
    return doc


@api_router.delete("/jobs/{job_id}")
async def delete_job(job_id: str, admin: dict = Depends(get_current_admin)):
    result = await db.jobs.delete_one({"id": job_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Offre introuvable")
    return {"success": True}


# --- Routes: Applications ---
@api_router.post("/applications", response_model=ApplicationOut)
async def create_application(
    first_name: str = Form(...),
    last_name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    sector: str = Form(...),
    cover_letter: str = Form(...),
    job_id: Optional[str] = Form(None),
    cv: UploadFile = File(...),
):
    if sector not in SECTORS:
        raise HTTPException(status_code=400, detail="Secteur invalide")
    if cv.content_type not in ("application/pdf", "application/x-pdf"):
        raise HTTPException(status_code=400, detail="Le CV doit être un fichier PDF")
    cv_bytes = await cv.read()
    if len(cv_bytes) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Le CV ne doit pas dépasser 10 Mo")
    cv_b64 = base64.b64encode(cv_bytes).decode("utf-8")

    job_title = None
    if job_id:
        job = await db.jobs.find_one({"id": job_id}, {"_id": 0, "title": 1})
        if job:
            job_title = job.get("title")

    doc = {
        "id": str(uuid.uuid4()),
        "first_name": first_name.strip(),
        "last_name": last_name.strip(),
        "email": email.strip().lower(),
        "phone": phone.strip(),
        "sector": sector,
        "cover_letter": cover_letter.strip(),
        "cv_filename": cv.filename or "cv.pdf",
        "cv_base64": cv_b64,
        "job_id": job_id,
        "job_title": job_title,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.applications.insert_one(doc.copy())
    return ApplicationOut(
        id=doc["id"],
        first_name=doc["first_name"],
        last_name=doc["last_name"],
        email=doc["email"],
        phone=doc["phone"],
        sector=doc["sector"],
        cover_letter=doc["cover_letter"],
        cv_filename=doc["cv_filename"],
        job_id=doc["job_id"],
        job_title=doc["job_title"],
        created_at=doc["created_at"],
    )


@api_router.get("/applications", response_model=List[ApplicationOut])
async def list_applications(admin: dict = Depends(get_current_admin)):
    docs = await db.applications.find(
        {}, {"_id": 0, "cv_base64": 0}
    ).sort("created_at", -1).to_list(1000)
    return docs


@api_router.get("/applications/{app_id}/cv")
async def download_cv(app_id: str, admin: dict = Depends(get_current_admin)):
    doc = await db.applications.find_one({"id": app_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Candidature introuvable")
    pdf = base64.b64decode(doc["cv_base64"])
    filename = doc.get("cv_filename", "cv.pdf")
    return Response(
        content=pdf,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@api_router.delete("/applications/{app_id}")
async def delete_application(app_id: str, admin: dict = Depends(get_current_admin)):
    result = await db.applications.delete_one({"id": app_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Candidature introuvable")
    return {"success": True}


# --- Routes: Employer Requests ---
@api_router.post("/employer-requests", response_model=EmployerRequest)
async def create_employer_request(payload: EmployerRequestCreate):
    doc = payload.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    doc["status"] = "new"
    await db.employer_requests.insert_one(doc.copy())
    doc.pop("_id", None)
    return doc


@api_router.get("/employer-requests", response_model=List[EmployerRequest])
async def list_employer_requests(admin: dict = Depends(get_current_admin)):
    docs = await db.employer_requests.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return docs


@api_router.delete("/employer-requests/{req_id}")
async def delete_employer_request(req_id: str, admin: dict = Depends(get_current_admin)):
    result = await db.employer_requests.delete_one({"id": req_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Demande introuvable")
    return {"success": True}


# --- Health ---
@api_router.get("/")
async def root():
    return {"service": "Attouna Services API", "status": "ok"}


# --- Startup ---
@app.on_event("startup")
async def startup():
    # Indexes
    await db.users.create_index("email", unique=True)
    await db.jobs.create_index("sector")
    await db.jobs.create_index("created_at")
    await db.applications.create_index("created_at")
    await db.employer_requests.create_index("created_at")

    # Seed admin
    existing = await db.users.find_one({"email": ADMIN_EMAIL.lower()})
    if existing is None:
        await db.users.insert_one({
            "email": ADMIN_EMAIL.lower(),
            "password_hash": hash_password(ADMIN_PASSWORD),
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Admin seeded: %s", ADMIN_EMAIL)
    elif not verify_password(ADMIN_PASSWORD, existing["password_hash"]):
        await db.users.update_one(
            {"email": ADMIN_EMAIL.lower()},
            {"$set": {"password_hash": hash_password(ADMIN_PASSWORD)}},
        )
        logger.info("Admin password updated: %s", ADMIN_EMAIL)


@app.on_event("shutdown")
async def shutdown():
    client.close()


app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
