#Render can't use your .pkl files because they're in .gitignore. We need to retrain models on startup instead. Create backend/startup.py:




import os
import joblib
import pandas as pd
import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score
import warnings
warnings.filterwarnings('ignore')

MODELS_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')


def models_exist():
    required = [
        'diabetes_model.pkl', 'diabetes_rf_model.pkl',
        'cancer_model.pkl',   'cancer_rf_model.pkl',
        'heart_model.pkl',    'heart_rf_model.pkl',
    ]
    return all(os.path.exists(os.path.join(MODELS_DIR, f)) for f in required)


def train_and_save(name, X, y):
    os.makedirs(MODELS_DIR, exist_ok=True)

    Xtr, Xte, ytr, yte = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    sc = StandardScaler()
    Xtr_s = sc.fit_transform(Xtr)
    Xte_s = sc.transform(Xte)

    lr = LogisticRegression(max_iter=1000, random_state=42)
    lr.fit(Xtr_s, ytr)
    lr_auc = roc_auc_score(yte, lr.predict_proba(Xte_s)[:, 1])

    rf = RandomForestClassifier(n_estimators=200, random_state=42)
    rf.fit(Xtr_s, ytr)
    rf_auc = roc_auc_score(yte, rf.predict_proba(Xte_s)[:, 1])

    best = rf if rf_auc >= lr_auc else lr

    joblib.dump(best, os.path.join(MODELS_DIR, f'{name}_model.pkl'))
    joblib.dump(rf,   os.path.join(MODELS_DIR, f'{name}_rf_model.pkl'))
    joblib.dump(sc,   os.path.join(MODELS_DIR, f'{name}_scaler.pkl'))
    joblib.dump(list(X.columns), os.path.join(MODELS_DIR, f'{name}_features.pkl'))
    print(f"✓ {name} trained — LR:{lr_auc:.3f} RF:{rf_auc:.3f}")


def ensure_models():
    if models_exist():
        print("✓ Models already exist, skipping training")
        return

    print("Training models on startup...")
    os.makedirs(MODELS_DIR, exist_ok=True)

    # Diabetes
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
    df = pd.read_csv(os.path.join(data_dir, 'diabetes.csv'))
    for c in ['Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI']:
        df[c] = df[c].replace(0, df[c].median())
    train_and_save('diabetes', df.drop('Outcome', axis=1), df['Outcome'])

    # Cancer
    bc = load_breast_cancer()
    X2 = pd.DataFrame(bc.data, columns=bc.feature_names)
    train_and_save('cancer', X2, pd.Series(bc.target))

    # Heart
    df3 = pd.read_csv(os.path.join(data_dir, 'heart.csv'))
    if 'condition' in df3.columns:
        df3 = df3.rename(columns={'condition': 'target'})
    df3['target'] = (df3['target'] > 0).astype(int)
    train_and_save('heart', df3.drop('target', axis=1), df3['target'])

    # Population stats
    import json
    stats = {}
    for name in ['diabetes', 'cancer', 'heart']:
        model  = joblib.load(os.path.join(MODELS_DIR, f'{name}_model.pkl'))
        scaler = joblib.load(os.path.join(MODELS_DIR, f'{name}_scaler.pkl'))
        feats  = joblib.load(os.path.join(MODELS_DIR, f'{name}_features.pkl'))
        if name == 'diabetes':
            df_s = pd.read_csv(os.path.join(data_dir, 'diabetes.csv'))
            for c in ['Glucose','BloodPressure','SkinThickness','Insulin','BMI']:
                df_s[c] = df_s[c].replace(0, df_s[c].median())
            X_s = df_s[feats]
            pos_rate = df_s['Outcome'].mean()
            n = len(df_s)
        elif name == 'cancer':
            bc2 = load_breast_cancer()
            X_s = pd.DataFrame(bc2.data, columns=bc2.feature_names)[feats]
            pos_rate = 1 - np.mean(bc2.target)
            n = len(bc2.data)
        else:
            df_s = pd.read_csv(os.path.join(data_dir, 'heart.csv'))
            if 'condition' in df_s.columns:
                df_s = df_s.rename(columns={'condition': 'target'})
            df_s['target'] = (df_s['target'] > 0).astype(int)
            X_s = df_s[feats]
            pos_rate = df_s['target'].mean()
            n = len(df_s)

        probs = model.predict_proba(scaler.transform(X_s))[:, 1]
        stats[name] = {
            'mean': round(float(np.mean(probs)), 3),
            'std':  round(float(np.std(probs)), 3),
            'p25':  round(float(np.percentile(probs, 25)), 3),
            'p50':  round(float(np.percentile(probs, 50)), 3),
            'p75':  round(float(np.percentile(probs, 75)), 3),
            'p90':  round(float(np.percentile(probs, 90)), 3),
            'positive_rate': round(float(pos_rate), 3),
            'total_samples': n,
        }

    with open(os.path.join(MODELS_DIR, 'population_stats.json'), 'w') as f:
        json.dump(stats, f)

    print("✓ All models and stats ready")