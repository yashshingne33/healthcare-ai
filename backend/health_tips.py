TIPS = {
    "diabetes": {
        "HIGH": [
            "Reduce sugar and refined carbohydrate intake immediately",
            "Aim for 30 minutes of walking daily — lowers glucose by up to 20%",
            "Monitor fasting blood sugar every morning",
            "Consult an endocrinologist within the next 2 weeks",
        ],
        "MEDIUM": [
            "Reduce processed food and increase fiber intake",
            "Exercise at least 3 times per week",
            "Get an HbA1c blood test done",
        ],
        "LOW": [
            "Maintain your current healthy lifestyle",
            "Annual diabetes screening recommended after age 35",
        ]
    },
    "cancer": {
        "HIGH": [
            "Schedule a clinical breast exam and mammogram immediately",
            "Consult an oncologist for further screening",
            "Avoid alcohol and smoking — both increase cancer risk",
        ],
        "MEDIUM": [
            "Schedule a mammogram in the next 3 months",
            "Maintain a diet rich in antioxidants (berries, leafy greens)",
        ],
        "LOW": [
            "Continue routine annual screenings",
            "Maintain a healthy BMI and active lifestyle",
        ]
    },
    "heart": {
        "HIGH": [
            "Seek cardiologist consultation immediately",
            "Reduce sodium intake — target under 1500mg per day",
            "Monitor blood pressure daily",
            "Avoid strenuous exercise until cleared by a doctor",
        ],
        "MEDIUM": [
            "Adopt a heart-healthy Mediterranean diet",
            "Aim for 150 minutes of moderate cardio per week",
            "Get cholesterol and blood pressure checked",
        ],
        "LOW": [
            "Keep up your healthy habits",
            "Annual heart health checkup recommended",
        ]
    }
}

def get_health_tips(disease: str, risk_level: str, count: int = 3) -> list:
    tips = TIPS.get(disease, {}).get(risk_level, ["Consult a healthcare professional."])
    return tips[:count]