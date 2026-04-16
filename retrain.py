import joblib, os, pandas as pd, numpy as np, warnings
warnings.filterwarnings('ignore')
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score

os.makedirs('models', exist_ok=True)

def train_and_save(name, X, y):
    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    sc = StandardScaler()
    Xtr_s = sc.fit_transform(Xtr)
    Xte_s = sc.transform(Xte)

    lr = LogisticRegression(max_iter=1000, random_state=42)
    lr.fit(Xtr_s, ytr)
    lr_auc = roc_auc_score(yte, lr.predict_proba(Xte_s)[:,1])

    rf = RandomForestClassifier(n_estimators=200, random_state=42)
    rf.fit(Xtr_s, ytr)
    rf_auc = roc_auc_score(yte, rf.predict_proba(Xte_s)[:,1])

    best = rf if rf_auc >= lr_auc else lr
    best_name = "RF" if rf_auc >= lr_auc else "LR"
    print(name + ": LR=" + str(round(lr_auc,3)) + " RF=" + str(round(rf_auc,3)) + " -> best=" + best_name)

    joblib.dump(best, 'models/' + name + '_model.pkl')
    joblib.dump(rf,   'models/' + name + '_rf_model.pkl')
    joblib.dump(sc,   'models/' + name + '_scaler.pkl')
    joblib.dump(list(X.columns), 'models/' + name + '_features.pkl')
    print("  saved all " + name + " models")

# Diabetes
df = pd.read_csv('data/diabetes.csv')
for c in ['Glucose','BloodPressure','SkinThickness','Insulin','BMI']:
    df[c] = df[c].replace(0, df[c].median())
X = df.drop('Outcome', axis=1)
y = df['Outcome']
train_and_save('diabetes', X, y)

# Cancer
bc = load_breast_cancer()
X2 = pd.DataFrame(bc.data, columns=bc.feature_names)
y2 = pd.Series(bc.target)
train_and_save('cancer', X2, y2)

# Heart
df3 = pd.read_csv('data/heart.csv')
if 'condition' in df3.columns:
    df3 = df3.rename(columns={'condition': 'target'})
df3['target'] = (df3['target'] > 0).astype(int)
X3 = df3.drop('target', axis=1)
y3 = df3['target']
train_and_save('heart', X3, y3)

print('ALL MODELS RETRAINED AND SAVED')