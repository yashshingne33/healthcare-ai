from fastapi import APIRouter, Depends
from database import get_db
from auth import get_current_user

router = APIRouter(prefix="/history", tags=["History"])


@router.get("/")
async def get_history(user=Depends(get_current_user)):
    db   = get_db()
    resp = db.table("predictions") \
             .select("*") \
             .eq("user_id", user["id"]) \
             .order("timestamp", desc=True) \
             .limit(50) \
             .execute()

    return {"history": resp.data, "count": len(resp.data)}


@router.get("/stats")
async def get_stats(user=Depends(get_current_user)):
    db   = get_db()
    resp = db.table("predictions") \
             .select("*") \
             .eq("user_id", user["id"]) \
             .execute()

    records     = resp.data
    total       = len(records)
    by_disease  = {"diabetes": [], "cancer": [], "heart": []}
    risk_counts = {"LOW": 0, "MEDIUM": 0, "HIGH": 0}

    for rec in records:
        d = rec.get("disease")
        if d in by_disease:
            by_disease[d].append(rec.get("probability", 0))
        rl = rec.get("risk_level", "LOW")
        if rl in risk_counts:
            risk_counts[rl] += 1

    avg_risk = {
        d: round(sum(v) / len(v) * 100, 1) if v else 0
        for d, v in by_disease.items()
    }

    return {
        "total_predictions":       total,
        "risk_distribution":       risk_counts,
        "average_risk_by_disease": avg_risk,
    }