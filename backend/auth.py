# from fastapi import APIRouter, HTTPException, Depends
# from fastapi.security import OAuth2PasswordBearer
# from passlib.context import CryptContext
# from jose import JWTError, jwt
# from datetime import datetime, timedelta
# from dotenv import load_dotenv
# import os

# from database import get_db
# from schemas import UserRegister, UserLogin, TokenResponse

# load_dotenv()

# router = APIRouter(prefix="/auth", tags=["Authentication"])

# SECRET_KEY = os.getenv("SECRET_KEY", "fallback-secret")
# ALGORITHM  = os.getenv("ALGORITHM", "HS256")
# EXPIRE_MIN = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

# pwd_context   = CryptContext(schemes=["bcrypt"], deprecated="auto")
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# def hash_password(password: str) -> str:
#     return pwd_context.hash(password)

# def verify_password(plain: str, hashed: str) -> bool:
#     return pwd_context.verify(plain, hashed)

# def create_token(data: dict) -> str:
#     payload = data.copy()
#     payload["exp"] = datetime.utcnow() + timedelta(minutes=EXPIRE_MIN)
#     return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

# async def get_current_user(token: str = Depends(oauth2_scheme)):
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         email   = payload.get("sub")
#         if not email:
#             raise HTTPException(status_code=401, detail="Invalid token")

#         db   = get_db()
#         resp = db.table("users").select("*").eq("email", email).execute()

#         if not resp.data:
#             raise HTTPException(status_code=401, detail="User not found")

#         return resp.data[0]
#     except JWTError:
#         raise HTTPException(status_code=401, detail="Token expired or invalid")



# @router.post("/register", response_model=TokenResponse)
# async def register(user: UserRegister):
#     db = get_db()

#     # Check duplicate
#     existing = db.table("users").select("id").eq("email", user.email).execute()
#     if existing.data:
#         raise HTTPException(status_code=400, detail="Email already registered")

#     # Insert new user
#     new_user = {
#         "name":     user.name,
#         "email":    user.email,
#         "password": hash_password(user.password),
#     }
#     result = db.table("users").insert(new_user).execute()
    
#     if not result.data:
#         raise HTTPException(status_code=500, detail="Failed to create user")

#     token = create_token({"sub": user.email})
#     return TokenResponse(
#         access_token=token,
#         token_type="bearer",
#         user_name=user.name
#     )


# @router.post("/login", response_model=TokenResponse)
# async def login(user: UserLogin):
#     db   = get_db()
#     resp = db.table("users").select("*").eq("email", user.email).execute()

#     if not resp.data:
#         raise HTTPException(status_code=401, detail="Invalid email or password")

#     db_user = resp.data[0]
    
#     if not verify_password(user.password, db_user["password"]):
#         raise HTTPException(status_code=401, detail="Invalid email or password")

#     token = create_token({"sub": user.email})
#     return TokenResponse(
#         access_token=token,
#         token_type="bearer",
#         user_name=db_user["name"]
#     )





# # @router.post("/register", response_model=TokenResponse)
# # async def register(user: UserRegister):
# #     db = get_db()

# #     # Check duplicate
# #     existing = db.table("users").select("id").eq("email", user.email).execute()
# #     if existing.data:
# #         raise HTTPException(status_code=400, detail="Email already registered")

# #     # Insert new user
# #     new_user = {
# #         "name":     user.name,
# #         "email":    user.email,
# #         "password": hash_password(user.password),
# #     }
# #     db.table("users").insert(new_user).execute()

# #     token = create_token({"sub": user.email})
# #     return TokenResponse(access_token=token, user_name=user.name)


# # @router.post("/login", response_model=TokenResponse)
# # async def login(user: UserLogin):
# #     db      = get_db()
# #     resp    = db.table("users").select("*").eq("email", user.email).execute()

# #     if not resp.data:
# #         raise HTTPException(status_code=401, detail="Invalid email or password")

# #     db_user = resp.data[0]
# #     if not verify_password(user.password, db_user["password"]):
# #         raise HTTPException(status_code=401, detail="Invalid email or password")

# #     token = create_token({"sub": user.email})
# #     return TokenResponse(access_token=token, user_name=db_user["name"])






# # @router.post("/register", response_model=TokenResponse)
# # async def register(user: UserRegister):
# #     db = get_db()

# #     # Check duplicate
# #     existing = db.table("users").select("id").eq("email", user.email).execute()
# #     if existing.data:
# #         raise HTTPException(status_code=400, detail="Email already registered")

# #     # Insert new user
# #     new_user = {
# #         "name":     user.name,
# #         "email":    user.email,
# #         "password": hash_password(user.password),
# #     }
# #     result = db.table("users").insert(new_user).execute()
    
# #     if not result.data:
# #         raise HTTPException(status_code=500, detail="Failed to create user")

# #     token = create_token({"sub": user.email})
# #     return TokenResponse(
# #         access_token=token,
# #         token_type="bearer",
# #         user_name=user.name
# #     )


# # @router.post("/login", response_model=TokenResponse)
# # async def login(user: UserLogin):
# #     db   = get_db()
# #     resp = db.table("users").select("*").eq("email", user.email).execute()

# #     if not resp.data:
# #         raise HTTPException(status_code=401, detail="Invalid email or password")

# #     db_user = resp.data[0]
    
# #     if not verify_password(user.password, db_user["password"]):
# #         raise HTTPException(status_code=401, detail="Invalid email or password")

# #     token = create_token({"sub": user.email})
# #     return TokenResponse(
# #         access_token=token,
# #         token_type="bearer",
# #         user_name=db_user["name"]
# #     )



from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

from database import get_db
from schemas import UserRegister, UserLogin, TokenResponse

# Load env variables
load_dotenv()

router = APIRouter(prefix="/auth", tags=["Authentication"])

# ENV Config
SECRET_KEY = os.getenv("SECRET_KEY", "fallback-secret")
ALGORITHM  = os.getenv("ALGORITHM", "HS256")
EXPIRE_MIN = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

# Security setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security    = HTTPBearer()

# ---------------- PASSWORD ----------------
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

# ---------------- TOKEN ----------------
def create_token(data: dict) -> str:
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(minutes=EXPIRE_MIN)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

# ---------------- CURRENT USER ----------------
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        # Check scheme
        if credentials.scheme != "Bearer":
            raise HTTPException(status_code=401, detail="Invalid authentication scheme")

        token = credentials.credentials

        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email   = payload.get("sub")

        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")

        db   = get_db()
        resp = db.table("users").select("*").eq("email", email).execute()

        if not resp.data:
            raise HTTPException(status_code=401, detail="User not found")

        return resp.data[0]

    except JWTError:
        raise HTTPException(status_code=401, detail="Token expired or invalid")

# ---------------- REGISTER ----------------
@router.post("/register", response_model=TokenResponse)
async def register(user: UserRegister):
    db = get_db()

    # Check duplicate user
    existing = db.table("users").select("id").eq("email", user.email).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Insert new user
    new_user = {
        "name":     user.name,
        "email":    user.email,
        "password": hash_password(user.password),
    }

    result = db.table("users").insert(new_user).execute()

    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create user")

    # Create token
    token = create_token({"sub": user.email})

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user_name=user.name
    )

# ---------------- LOGIN ----------------
@router.post("/login", response_model=TokenResponse)
async def login(user: UserLogin):
    db   = get_db()
    resp = db.table("users").select("*").eq("email", user.email).execute()

    if not resp.data:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    db_user = resp.data[0]

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Create token
    token = create_token({"sub": user.email})

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user_name=db_user["name"]
    )