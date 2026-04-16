# import joblib
# import numpy as np
# import shap
# import os

# BASE = os.path.join(os.path.dirname(__file__), '..', 'models')

# MODELS = {}
# for disease in ['diabetes', 'cancer', 'heart']:
#     MODELS[disease] = {
#         'model':    joblib.load(os.path.join(BASE, f'{disease}_model.pkl')),
#         'rf_model': joblib.load(os.path.join(BASE, f'{disease}_rf_model.pkl')),
#         'scaler':   joblib.load(os.path.join(BASE, f'{disease}_scaler.pkl')),
#         'features': joblib.load(os.path.join(BASE, f'{disease}_features.pkl')),
#     }

# print("✓ All ML models loaded")

# # Always use Random Forest for SHAP (TreeExplainer requirement)
# EXPLAINERS = {}
# for disease, data in MODELS.items():
#     EXPLAINERS[disease] = shap.TreeExplainer(data['rf_model'])

# print("✓ SHAP explainers ready")


# def run_prediction(disease: str, input_dict: dict) -> dict:
#     model    = MODELS[disease]['model']     # best model for prediction
#     rf_model = MODELS[disease]['rf_model']  # random forest for SHAP
#     scaler   = MODELS[disease]['scaler']
#     features = MODELS[disease]['features']

#     input_array  = np.array([[input_dict[f] for f in features]])
#     input_scaled = scaler.transform(input_array)

#     # Prediction from best model
#     prediction      = int(model.predict(input_scaled)[0])
#     probability_arr = model.predict_proba(input_scaled)[0]
#     prob            = float(probability_arr[1])

#     margin  = 0.07
#     ci_low  = round(max(0.0, prob - margin), 3)
#     ci_high = round(min(1.0, prob + margin), 3)

#     if prob >= 0.65:
#         risk_level = "HIGH"
#     elif prob >= 0.40:
#         risk_level = "MEDIUM"
#     else:
#         risk_level = "LOW"

#     # SHAP always from Random Forest
#     shap_values = EXPLAINERS[disease].shap_values(input_scaled)
#     sv = shap_values[1][0] if isinstance(shap_values, list) else shap_values[0]

#     shap_pairs  = sorted(zip(features, sv), key=lambda x: abs(x[1]), reverse=True)
#     top_factors = [name.replace('_', ' ').title() for name, _ in shap_pairs[:3]]

#     return {
#         "prediction":       prediction,
#         "result_label":     "Positive" if prediction == 1 else "Negative",
#         "probability":      round(prob, 3),
#         "confidence_low":   ci_low,
#         "confidence_high":  ci_high,
#         "risk_level":       risk_level,
#         "top_risk_factors": top_factors,
#     }



import joblib
import numpy as np
import shap
import os

BASE = os.path.join(os.path.dirname(__file__), '..', 'models')

MODELS = {}
for disease in ['diabetes', 'cancer', 'heart']:
    MODELS[disease] = {
        'model':    joblib.load(os.path.join(BASE, f'{disease}_model.pkl')),
        'rf_model': joblib.load(os.path.join(BASE, f'{disease}_rf_model.pkl')),
        'scaler':   joblib.load(os.path.join(BASE, f'{disease}_scaler.pkl')),
        'features': joblib.load(os.path.join(BASE, f'{disease}_features.pkl')),
    }

print("✓ All ML models loaded")

# Always use Random Forest for SHAP
EXPLAINERS = {}
for disease, data in MODELS.items():
    EXPLAINERS[disease] = shap.TreeExplainer(data['rf_model'])

print("✓ SHAP explainers ready")


def run_prediction(disease: str, input_dict: dict) -> dict:
    model    = MODELS[disease]['model']
    scaler   = MODELS[disease]['scaler']
    features = MODELS[disease]['features']

    # Build input array
    input_array  = np.array([[input_dict[f] for f in features]])
    input_scaled = scaler.transform(input_array)

    # Prediction from best model (LR)
    prediction      = int(model.predict(input_scaled)[0])
    probability_arr = model.predict_proba(input_scaled)[0]
    prob            = float(probability_arr[1])

    margin  = 0.07
    ci_low  = round(max(0.0, prob - margin), 3)
    ci_high = round(min(1.0, prob + margin), 3)

    if prob >= 0.65:
        risk_level = "HIGH"
    elif prob >= 0.40:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    # SHAP from Random Forest — fix numpy ambiguity
    rf_model    = MODELS[disease]['rf_model']
    rf_scaler   = MODELS[disease]['scaler']
    input_scaled_rf = rf_scaler.transform(input_array)
    
    explainer   = EXPLAINERS[disease]
    shap_values = explainer.shap_values(input_scaled_rf)

    # Handle both old and new SHAP output formats
    if isinstance(shap_values, list):
        # Old format: list of arrays [class0, class1]
        sv = np.array(shap_values[1][0])
    else:
        # New format: single 3D array
        if shap_values.ndim == 3:
            sv = np.array(shap_values[0, :, 1])
        else:
            sv = np.array(shap_values[0])

    # Sort features by absolute SHAP value
    shap_pairs  = sorted(
        zip(features, sv.tolist()),
        key=lambda x: abs(x[1]),
        reverse=True
    )
    top_factors = [name.replace('_', ' ').title() for name, _ in shap_pairs[:3]]

    return {
        "prediction":       prediction,
        "result_label":     "Positive" if prediction == 1 else "Negative",
        "probability":      round(prob, 3),
        "confidence_low":   ci_low,
        "confidence_high":  ci_high,
        "risk_level":       risk_level,
        "top_risk_factors": top_factors,
    }