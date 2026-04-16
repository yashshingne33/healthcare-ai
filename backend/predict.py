from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from datetime import datetime
from typing import Optional

from database import get_db
from schemas import DiabetesInput, CancerInput, HeartInput, PredictionResponse
from ml_engine import run_prediction
from health_tips import get_health_tips
from auth import get_current_user
from report_generator import generate_pdf_report
from email_service import send_report_email
from benchmark import get_benchmark

router = APIRouter(prefix="/predict", tags=["Predictions"])


async def save_and_respond(disease: str, input_dict: dict, current_user: dict):
    try:
        result = run_prediction(disease, input_dict)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

    tips = get_health_tips(disease, result["risk_level"])
    benchmark = get_benchmark(disease, result["probability"])

    db = get_db()
    record = {
        "user_id":          str(current_user["id"]),
        "user_email":       current_user["email"],
        "disease":          disease,
        "input_data":       input_dict,
        "result":           result["result_label"],
        "probability":      result["probability"],
        "risk_level":       result["risk_level"],
        "top_risk_factors": result["top_risk_factors"],
        "health_tips":      tips,
        "timestamp":        datetime.utcnow().isoformat(),
    }

    inserted = db.table("predictions").insert(record).execute()
    prediction_db_id = inserted.data[0]["id"] if inserted.data else None

    return PredictionResponse(
        id=prediction_db_id,
        disease=disease,
        timestamp=datetime.utcnow(),
        health_tips=tips,
        benchmark=benchmark,
        **result
    )


@router.post("/diabetes", response_model=PredictionResponse)
async def predict_diabetes(data: DiabetesInput, user=Depends(get_current_user)):
    input_dict = {
        "Pregnancies":              data.pregnancies,
        "Glucose":                  data.glucose,
        "BloodPressure":            data.blood_pressure,
        "SkinThickness":            data.skin_thickness,
        "Insulin":                  data.insulin,
        "BMI":                      data.bmi,
        "DiabetesPedigreeFunction": data.diabetes_pedigree_function,
        "Age":                      data.age,
    }
    return await save_and_respond("diabetes", input_dict, user)


@router.post("/cancer", response_model=PredictionResponse)
async def predict_cancer(data: CancerInput, user=Depends(get_current_user)):
    input_dict = {
        "mean radius":             data.mean_radius,
        "mean texture":            data.mean_texture,
        "mean perimeter":          data.mean_perimeter,
        "mean area":               data.mean_area,
        "mean smoothness":         data.mean_smoothness,
        "mean compactness":        data.mean_compactness,
        "mean concavity":          data.mean_concavity,
        "mean concave points":     data.mean_concave_points,
        "mean symmetry":           data.mean_symmetry,
        "mean fractal dimension":  data.mean_fractal_dimension,
        "radius error":            data.radius_error,
        "texture error":           data.texture_error,
        "perimeter error":         data.perimeter_error,
        "area error":              data.area_error,
        "smoothness error":        data.smoothness_error,
        "compactness error":       data.compactness_error,
        "concavity error":         data.concavity_error,
        "concave points error":    data.concave_points_error,
        "symmetry error":          data.symmetry_error,
        "fractal dimension error": data.fractal_dimension_error,
        "worst radius":            data.worst_radius,
        "worst texture":           data.worst_texture,
        "worst perimeter":         data.worst_perimeter,
        "worst area":              data.worst_area,
        "worst smoothness":        data.worst_smoothness,
        "worst compactness":       data.worst_compactness,
        "worst concavity":         data.worst_concavity,
        "worst concave points":    data.worst_concave_points,
        "worst symmetry":          data.worst_symmetry,
        "worst fractal dimension": data.worst_fractal_dimension,
    }
    return await save_and_respond("cancer", input_dict, user)


@router.post("/heart", response_model=PredictionResponse)
async def predict_heart(data: HeartInput, user=Depends(get_current_user)):
    input_dict = {
        "age":      data.age,
        "sex":      data.sex,
        "cp":       data.cp,
        "trestbps": data.trestbps,
        "chol":     data.chol,
        "fbs":      data.fbs,
        "restecg":  data.restecg,
        "thalach":  data.thalach,
        "exang":    data.exang,
        "oldpeak":  data.oldpeak,
        "slope":    data.slope,
        "ca":       data.ca,
        "thal":     data.thal,
    }
    return await save_and_respond("heart", input_dict, user)


@router.get("/report/{prediction_id}")
async def download_report(prediction_id: str, user=Depends(get_current_user)):
    db = get_db()

    resp = db.table("predictions").select("*").eq("id", prediction_id).execute()
    if not resp.data:
        raise HTTPException(status_code=404, detail="Prediction not found")

    rec = resp.data[0]

    if rec["user_id"] != str(user["id"]):
        raise HTTPException(status_code=403, detail="Access denied")

    pdf_bytes = generate_pdf_report(
        user_name=       user["name"],
        user_email=      user["email"],
        disease=         rec["disease"],
        result_label=    rec["result"],
        probability=     rec["probability"],
        confidence_low=  max(0.0, rec["probability"] - 0.07),
        confidence_high= min(1.0, rec["probability"] + 0.07),
        risk_level=      rec["risk_level"],
        top_factors=     rec.get("top_risk_factors") or [],
        health_tips=     rec.get("health_tips") or [],
        input_data=      rec.get("input_data") or {},
    )

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=healthai_report_{prediction_id[:8]}.pdf"
        }
    )


#Add simulator endpoint to backend route
@router.post("/simulate/{disease}")
async def simulate(disease: str, data: dict, user=Depends(get_current_user)):
    """
    Lightweight endpoint for what-if simulator.
    Takes raw input dict, returns probability + risk level only.
    No database save — just instant prediction.
    """
    if disease not in ["diabetes", "cancer", "heart"]:
        raise HTTPException(status_code=400, detail="Invalid disease")
    try:
        result = run_prediction(disease, data)
        return {
            "probability":  result["probability"],
            "risk_level":   result["risk_level"],
            "result_label": result["result_label"],
            "top_risk_factors": result["top_risk_factors"],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation error: {str(e)}")
    
# routing for sending mail
@router.post("/email-report/{prediction_id}")
async def email_report(prediction_id: str, user=Depends(get_current_user)):
    """
    Generates PDF report and emails it to the user.
    """
    db = get_db()

    resp = db.table("predictions").select("*").eq("id", prediction_id).execute()
    if not resp.data:
        raise HTTPException(status_code=404, detail="Prediction not found")

    rec = resp.data[0]

    if rec["user_id"] != str(user["id"]):
        raise HTTPException(status_code=403, detail="Access denied")

    # Generate PDF
    pdf_bytes = generate_pdf_report(
        user_name=       user["name"],
        user_email=      user["email"],
        disease=         rec["disease"],
        result_label=    rec["result"],
        probability=     rec["probability"],
        confidence_low=  max(0.0, rec["probability"] - 0.07),
        confidence_high= min(1.0, rec["probability"] + 0.07),
        risk_level=      rec["risk_level"],
        top_factors=     rec.get("top_risk_factors") or [],
        health_tips=     rec.get("health_tips") or [],
        input_data=      rec.get("input_data") or {},
    )

    # Send email
    success = send_report_email(
        to_email=    user["email"],
        user_name=   user["name"],
        disease=     rec["disease"],
        risk_level=  rec["risk_level"],
        probability= rec["probability"],
        pdf_bytes=   pdf_bytes,
    )

    if not success:
        raise HTTPException(status_code=500, detail="Failed to send email")

    return {"message": f"Report sent successfully to {user['email']}"}