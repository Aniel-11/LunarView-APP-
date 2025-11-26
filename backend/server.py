from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime, timedelta
from passlib.context import CryptContext
import jwt
from bson import ObjectId
import httpx

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# ipgeolocation.io API key
IPGEO_API_KEY = "4b71d9db16dc4ef1a8abb2d6129514cb"

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Models
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: Optional[str] = None
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class FavoriteLocation(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()))
    user_id: str
    location_name: str
    latitude: float
    longitude: float
    saved_at: datetime = Field(default_factory=datetime.utcnow)

class FavoriteLocationCreate(BaseModel):
    location_name: str
    latitude: float
    longitude: float

class AstronomyResponse(BaseModel):
    location: dict
    date: str
    current_time: str
    sunrise: str
    sunset: str
    sun_status: str
    solar_noon: str
    day_length: str
    sun_altitude: float
    sun_azimuth: float
    moonrise: str
    moonset: str
    moon_status: str
    moon_altitude: float
    moon_azimuth: float
    moon_distance: float
    moon_parallactic_angle: float

# Helper functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# Auth Routes
@api_router.post("/auth/register", response_model=Token)
async def register(user_data: UserRegister):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user_dict = {
        "email": user_data.email,
        "password": hash_password(user_data.password),
        "name": user_data.name,
        "created_at": datetime.utcnow()
    }
    result = await db.users.insert_one(user_dict)
    user_dict["_id"] = result.inserted_id
    
    # Create token
    access_token = create_access_token(
        data={"sub": str(result.inserted_id)},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    user_response = UserResponse(
        id=str(user_dict["_id"]),
        email=user_dict["email"],
        name=user_dict.get("name"),
        created_at=user_dict["created_at"]
    )
    
    return Token(access_token=access_token, token_type="bearer", user=user_response)

@api_router.post("/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    # Find user
    user = await db.users.find_one({"email": user_data.email})
    if not user or not verify_password(user_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    # Create token
    access_token = create_access_token(
        data={"sub": str(user["_id"])},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    user_response = UserResponse(
        id=str(user["_id"]),
        email=user["email"],
        name=user.get("name"),
        created_at=user["created_at"]
    )
    
    return Token(access_token=access_token, token_type="bearer", user=user_response)

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return UserResponse(
        id=str(current_user["_id"]),
        email=current_user["email"],
        name=current_user.get("name"),
        created_at=current_user["created_at"]
    )

# Astronomy Routes
@api_router.get("/astronomy")
async def get_astronomy_data(
    lat: float,
    long: float,
    current_user: dict = Depends(get_current_user)
):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://api.ipgeolocation.io/astronomy",
                params={
                    "apiKey": IPGEO_API_KEY,
                    "lat": lat,
                    "long": long
                }
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail="Failed to fetch astronomy data"
                )
            
            return response.json()
    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"Error fetching astronomy data: {str(e)}")

# Favorites Routes
@api_router.post("/favorites", response_model=FavoriteLocation)
async def add_favorite(
    favorite: FavoriteLocationCreate,
    current_user: dict = Depends(get_current_user)
):
    favorite_dict = {
        "user_id": str(current_user["_id"]),
        "location_name": favorite.location_name,
        "latitude": favorite.latitude,
        "longitude": favorite.longitude,
        "saved_at": datetime.utcnow()
    }
    
    result = await db.favorites.insert_one(favorite_dict)
    favorite_dict["_id"] = result.inserted_id
    
    return FavoriteLocation(
        id=str(favorite_dict["_id"]),
        user_id=favorite_dict["user_id"],
        location_name=favorite_dict["location_name"],
        latitude=favorite_dict["latitude"],
        longitude=favorite_dict["longitude"],
        saved_at=favorite_dict["saved_at"]
    )

@api_router.get("/favorites", response_model=List[FavoriteLocation])
async def get_favorites(current_user: dict = Depends(get_current_user)):
    favorites = await db.favorites.find({"user_id": str(current_user["_id"])}).to_list(1000)
    return [
        FavoriteLocation(
            id=str(fav["_id"]),
            user_id=fav["user_id"],
            location_name=fav["location_name"],
            latitude=fav["latitude"],
            longitude=fav["longitude"],
            saved_at=fav["saved_at"]
        )
        for fav in favorites
    ]

@api_router.delete("/favorites/{favorite_id}")
async def delete_favorite(
    favorite_id: str,
    current_user: dict = Depends(get_current_user)
):
    result = await db.favorites.delete_one({
        "_id": ObjectId(favorite_id),
        "user_id": str(current_user["_id"])
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Favorite not found")
    
    return {"message": "Favorite deleted successfully"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
