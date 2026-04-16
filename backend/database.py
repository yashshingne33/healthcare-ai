from supabase import create_client, Client
from dotenv import load_dotenv
import os

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_db():
    return supabase

def connect_db():
    try:
        # Simple ping — fetch 1 row to verify connection
        supabase.table("users").select("id").limit(1).execute()
        print("✓ Supabase connected successfully")
    except Exception as e:
        print(f"✗ Supabase connection failed: {e}")