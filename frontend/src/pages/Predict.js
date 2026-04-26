import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import RiskMeter from '../components/RiskMeter';
import ShapChart from '../components/ShapChart';
// import { predictDiabetes, predictCancer, predictHeart } from '../api';
// import { predictDiabetes, predictCancer, predictHeart, simulate } from '../api';
import { predictDiabetes, predictCancer, predictHeart, simulate, emailReport } from '../api';  // email import

const DISEASES = {
  diabetes: {
    label: 'Diabetes', color: '#6366f1', bg: '#eef2ff',
    fields: [
      { key: 'pregnancies',               label: 'Pregnancies',               min: 0,  max: 20,   step: 1,    default: 2 },
      { key: 'glucose',                   label: 'Glucose (mg/dL)',           min: 0,  max: 300,  step: 1,    default: 120 },
      { key: 'blood_pressure',            label: 'Blood Pressure (mmHg)',     min: 0,  max: 200,  step: 1,    default: 72 },
      { key: 'skin_thickness',            label: 'Skin Thickness (mm)',       min: 0,  max: 100,  step: 1,    default: 20 },
      { key: 'insulin',                   label: 'Insulin (μU/mL)',           min: 0,  max: 900,  step: 1,    default: 80 },
      { key: 'bmi',                       label: 'BMI',                       min: 0,  max: 70,   step: 0.1,  default: 25 },
      { key: 'diabetes_pedigree_function',label: 'Diabetes Pedigree Function',min: 0,  max: 2.5,  step: 0.01, default: 0.3 },
      { key: 'age',                       label: 'Age',                       min: 1,  max: 120,  step: 1,    default: 30 },
    ]
  },
//   cancer: {
//     label: 'Breast Cancer', color: '#10b981', bg: '#ecfdf5',
//     fields: [
//       { key: 'mean_radius',            label: 'Mean Radius',            min: 0, max: 40,   step: 0.01, default: 14 },
//       { key: 'mean_texture',           label: 'Mean Texture',           min: 0, max: 40,   step: 0.01, default: 19 },
//       { key: 'mean_perimeter',         label: 'Mean Perimeter',         min: 0, max: 300,  step: 0.1,  default: 92 },
//       { key: 'mean_area',              label: 'Mean Area',              min: 0, max: 2500, step: 1,    default: 654 },
//       { key: 'mean_smoothness',        label: 'Mean Smoothness',        min: 0, max: 0.2,  step: 0.001,default: 0.096 },
//       { key: 'mean_compactness',       label: 'Mean Compactness',       min: 0, max: 0.5,  step: 0.001,default: 0.1 },
//       { key: 'mean_concavity',         label: 'Mean Concavity',         min: 0, max: 0.5,  step: 0.001,default: 0.088 },
//       { key: 'mean_concave_points',    label: 'Mean Concave Points',    min: 0, max: 0.2,  step: 0.001,default: 0.048 },
//       { key: 'mean_symmetry',          label: 'Mean Symmetry',          min: 0, max: 0.4,  step: 0.001,default: 0.181 },
//       { key: 'mean_fractal_dimension', label: 'Mean Fractal Dimension', min: 0, max: 0.1,  step: 0.001,default: 0.063 },
//     ]
//   },
  cancer: {
    label: 'Breast Cancer', color: '#10b981', bg: '#ecfdf5',
    fields: [
      { key: 'mean_radius',               label: 'Mean Radius',               min: 0,   max: 40,   step: 0.01,  default: 14 },
      { key: 'mean_texture',              label: 'Mean Texture',              min: 0,   max: 40,   step: 0.01,  default: 19 },
      { key: 'mean_perimeter',            label: 'Mean Perimeter',            min: 0,   max: 300,  step: 0.1,   default: 92 },
      { key: 'mean_area',                 label: 'Mean Area',                 min: 0,   max: 2500, step: 1,     default: 654 },
      { key: 'mean_smoothness',           label: 'Mean Smoothness',           min: 0,   max: 0.2,  step: 0.001, default: 0.096 },
      { key: 'mean_compactness',          label: 'Mean Compactness',          min: 0,   max: 0.5,  step: 0.001, default: 0.1 },
      { key: 'mean_concavity',            label: 'Mean Concavity',            min: 0,   max: 0.5,  step: 0.001, default: 0.088 },
      { key: 'mean_concave_points',       label: 'Mean Concave Points',       min: 0,   max: 0.2,  step: 0.001, default: 0.048 },
      { key: 'mean_symmetry',             label: 'Mean Symmetry',             min: 0,   max: 0.4,  step: 0.001, default: 0.181 },
      { key: 'mean_fractal_dimension',    label: 'Mean Fractal Dimension',    min: 0,   max: 0.1,  step: 0.001, default: 0.063 },
      { key: 'radius_error',              label: 'Radius Error',              min: 0,   max: 5,    step: 0.001, default: 0.4 },
      { key: 'texture_error',             label: 'Texture Error',             min: 0,   max: 5,    step: 0.01,  default: 1.2 },
      { key: 'perimeter_error',           label: 'Perimeter Error',           min: 0,   max: 30,   step: 0.01,  default: 2.8 },
      { key: 'area_error',                label: 'Area Error',                min: 0,   max: 600,  step: 0.1,   default: 40 },
      { key: 'smoothness_error',          label: 'Smoothness Error',          min: 0,   max: 0.05, step: 0.001, default: 0.007 },
      { key: 'compactness_error',         label: 'Compactness Error',         min: 0,   max: 0.15, step: 0.001, default: 0.025 },
      { key: 'concavity_error',           label: 'Concavity Error',           min: 0,   max: 0.4,  step: 0.001, default: 0.032 },
      { key: 'concave_points_error',      label: 'Concave Points Error',      min: 0,   max: 0.05, step: 0.001, default: 0.012 },
      { key: 'symmetry_error',            label: 'Symmetry Error',            min: 0,   max: 0.08, step: 0.001, default: 0.02 },
      { key: 'fractal_dimension_error',   label: 'Fractal Dimension Error',   min: 0,   max: 0.03, step: 0.001, default: 0.004 },
      { key: 'worst_radius',              label: 'Worst Radius',              min: 0,   max: 40,   step: 0.01,  default: 16 },
      { key: 'worst_texture',             label: 'Worst Texture',             min: 0,   max: 50,   step: 0.01,  default: 25 },
      { key: 'worst_perimeter',           label: 'Worst Perimeter',           min: 0,   max: 300,  step: 0.1,   default: 107 },
      { key: 'worst_area',                label: 'Worst Area',                min: 0,   max: 4000, step: 1,     default: 880 },
      { key: 'worst_smoothness',          label: 'Worst Smoothness',          min: 0,   max: 0.3,  step: 0.001, default: 0.132 },
      { key: 'worst_compactness',         label: 'Worst Compactness',         min: 0,   max: 1.2,  step: 0.001, default: 0.254 },
      { key: 'worst_concavity',           label: 'Worst Concavity',           min: 0,   max: 1.3,  step: 0.001, default: 0.272 },
      { key: 'worst_concave_points',      label: 'Worst Concave Points',      min: 0,   max: 0.3,  step: 0.001, default: 0.115 },
      { key: 'worst_symmetry',            label: 'Worst Symmetry',            min: 0,   max: 0.7,  step: 0.001, default: 0.29 },
      { key: 'worst_fractal_dimension',   label: 'Worst Fractal Dimension',   min: 0,   max: 0.25, step: 0.001, default: 0.084 },
    ]
  },


  heart: {
    label: 'Heart Disease', color: '#f59e0b', bg: '#fffbeb',
    fields: [
      { key: 'age',     label: 'Age',                         min: 1,  max: 120, step: 1,   default: 45 },
      { key: 'sex',     label: 'Sex (0=Female, 1=Male)',      min: 0,  max: 1,   step: 1,   default: 1 },
      { key: 'cp',      label: 'Chest Pain Type (0-3)',        min: 0,  max: 3,   step: 1,   default: 1 },
      { key: 'trestbps',label: 'Resting Blood Pressure',      min: 80, max: 200, step: 1,   default: 130 },
      { key: 'chol',    label: 'Cholesterol (mg/dL)',          min: 100,max: 600, step: 1,   default: 240 },
      { key: 'fbs',     label: 'Fasting Blood Sugar >120 (0/1)',min:0, max: 1,   step: 1,   default: 0 },
      { key: 'restecg', label: 'Resting ECG (0-2)',            min: 0,  max: 2,   step: 1,   default: 0 },
      { key: 'thalach', label: 'Max Heart Rate',               min: 60, max: 220, step: 1,   default: 150 },
      { key: 'exang',   label: 'Exercise Induced Angina (0/1)',min: 0,  max: 1,   step: 1,   default: 0 },
      { key: 'oldpeak', label: 'ST Depression',                min: 0,  max: 7,   step: 0.1, default: 1 },
      { key: 'slope',   label: 'Slope of ST (0-2)',            min: 0,  max: 2,   step: 1,   default: 1 },
      { key: 'ca',      label: 'Major Vessels (0-3)',          min: 0,  max: 3,   step: 1,   default: 0 },
      { key: 'thal',    label: 'Thal (1=Normal, 2=Fixed, 3=Reversible)', min:1, max:3, step:1, default: 2 },
    ]
  }
};


// mapping helper function 
function mapInputForDisease(disease, body) {
  if (disease === 'diabetes') {
    return {
      Pregnancies:              body.pregnancies,
      Glucose:                  body.glucose,
      BloodPressure:            body.blood_pressure,
      SkinThickness:            body.skin_thickness,
      Insulin:                  body.insulin,
      BMI:                      body.bmi,
      DiabetesPedigreeFunction: body.diabetes_pedigree_function,
      Age:                      body.age,
    };
  }
  if (disease === 'heart') {
    return {
      age: body.age, sex: body.sex, cp: body.cp,
      trestbps: body.trestbps, chol: body.chol, fbs: body.fbs,
      restecg: body.restecg, thalach: body.thalach, exang: body.exang,
      oldpeak: body.oldpeak, slope: body.slope, ca: body.ca, thal: body.thal,
    };
  }
  if (disease === 'cancer') {
    return {
      "mean radius":             body.mean_radius,
      "mean texture":            body.mean_texture,
      "mean perimeter":          body.mean_perimeter,
      "mean area":               body.mean_area,
      "mean smoothness":         body.mean_smoothness,
      "mean compactness":        body.mean_compactness,
      "mean concavity":          body.mean_concavity,
      "mean concave points":     body.mean_concave_points,
      "mean symmetry":           body.mean_symmetry,
      "mean fractal dimension":  body.mean_fractal_dimension,
      "radius error":            body.radius_error,
      "texture error":           body.texture_error,
      "perimeter error":         body.perimeter_error,
      "area error":              body.area_error,
      "smoothness error":        body.smoothness_error,
      "compactness error":       body.compactness_error,
      "concavity error":         body.concavity_error,
      "concave points error":    body.concave_points_error,
      "symmetry error":          body.symmetry_error,
      "fractal dimension error": body.fractal_dimension_error,
      "worst radius":            body.worst_radius,
      "worst texture":           body.worst_texture,
      "worst perimeter":         body.worst_perimeter,
      "worst area":              body.worst_area,
      "worst smoothness":        body.worst_smoothness,
      "worst compactness":       body.worst_compactness,
      "worst concavity":         body.worst_concavity,
      "worst concave points":    body.worst_concave_points,
      "worst symmetry":          body.worst_symmetry,
      "worst fractal dimension": body.worst_fractal_dimension,
    };
  }
  return body;
}



export default function Predict() {
  const [selected, setSelected] = useState('diabetes');
  const [values,   setValues]   = useState({});
  const [result,   setResult]   = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  //prediction id to state  
  const [predictionId, setPredictionId] = useState(null);

  const disease = DISEASES[selected];

  const getVal = (field) => values[field.key] !== undefined ? values[field.key] : field.default;

  const handleSlider = (key, val) => setValues(prev => ({ ...prev, [key]: parseFloat(val) }));
  

  // new states variables for simulator add
  const [simValues,  setSimValues]  = useState({});
  const [simResult,  setSimResult]  = useState(null);
  const [simLoading, setSimLoading] = useState(false);


  //email state variables
  const [emailSent,    setEmailSent]    = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true); setError(''); setResult(null);
    const body = {};
    disease.fields.forEach(f => { body[f.key] = getVal(f); });
    try {
      const fn  = selected === 'diabetes' ? predictDiabetes
                : selected === 'cancer'   ? predictCancer
                : predictHeart;
      const res = await fn(body);
      setResult(res.data);
      setPredictionId(res.data.id);  //added to save prediction id` 
    } catch (err) {
      setError(err.response?.data?.detail || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };


  // function of handle simulate
  const handleSimulate = async (key, val) => {
    const newVals = { ...simValues, [key]: parseFloat(val) };
    setSimValues(newVals);

    // Build full input using current result values + changed slider
    const body = {};
    disease.fields.forEach(f => {
      body[f.key] = newVals[f.key] !== undefined ? newVals[f.key] : getVal(f);
    });

    // Map to backend field names
    const mapped = mapInputForDisease(selected, body);

    setSimLoading(true);
    try {
      const res = await simulate(selected, mapped);
      setSimResult(res.data);
    } catch (err) {
      console.error('Simulate error:', err);
    } finally {
      setSimLoading(false);
    }
  };


  //email handle function
  const handleEmailReport = async () => {
    if (!predictionId) return;
    setEmailLoading(true);
    try {
      await emailReport(predictionId);
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 5000);
    } catch (err) {
      alert('Failed to send email. Please try again.');
    } finally {
      setEmailLoading(false);
    }
  };


  // download button in react 
  // const downloadReport = async (predictionId) => {
  // const token = localStorage.getItem('token');
  // const res = await fetch(
  //     `http://127.0.0.1:8000/predict/report/${predictionId}`,
  //     { headers: { Authorization: `Bearer ${token}` } }
  //   );
  // const blob = await res.blob();
  // const url  = window.URL.createObjectURL(blob);
  // const a    = document.createElement('a');
  //   a.href     = url;
  //   a.download = `healthai_report.pdf`;
  //   a.click();
  //   window.URL.revokeObjectURL(url);
  // };
  const downloadReport = async (predictionId) => {
    const token   = localStorage.getItem('token');
    const baseUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
    const res     = await fetch(
      `${baseUrl}/predict/report/${predictionId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const blob = await res.blob();
    const url  = window.URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'healthai_report.pdf';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f4ff' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '2rem', maxWidth: 900 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1f3a', marginBottom: 4 }}>Run a prediction</h1>
        <p style={{ color: '#6b7280', fontSize: 14, marginBottom: '1.5rem' }}>Select a disease and enter patient data</p>

        {/* Disease selector */}
        <div style={{ display: 'flex', gap: 12, marginBottom: '1.5rem' }}>
          {Object.entries(DISEASES).map(([key, d]) => (
            <button key={key} onClick={() => { setSelected(key); setResult(null); setValues({}); }} style={{
              padding: '10px 20px', borderRadius: 10, border: 'none',
              background: selected === key ? d.color : d.bg,
              color: selected === key ? '#fff' : d.color,
              fontWeight: 600, fontSize: 13, transition: 'all 0.2s'
            }}>
              {d.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: 20 }}>
          {/* Input form */}
          <div style={{ background: '#fff', borderRadius: 12, padding: '1.5rem', border: '0.5px solid #e5e7eb' }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: '1rem', color: disease.color }}>
              {disease.label} — Patient Data
            </h3>
            {disease.fields.map(field => (
              <div key={field.key} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ fontWeight: 500 }}>{field.label}</span>
                  <span style={{ color: disease.color, fontWeight: 600 }}>{getVal(field)}</span>
                </div>
                <input type="range"
                  min={field.min} max={field.max} step={field.step}
                  value={getVal(field)}
                  onChange={e => handleSlider(field.key, e.target.value)}
                  style={{ width: '100%', accentColor: disease.color }}
                />
              </div>
            ))}

            {error && (
              <div style={{ background: '#fee2e2', color: '#991b1b', padding: '8px 12px', borderRadius: 6, fontSize: 12, marginBottom: 12 }}>
                {error}
              </div>
            )}

            <button onClick={handleSubmit} disabled={loading} style={{
              width: '100%', padding: '12px', borderRadius: 8, border: 'none',
              background: disease.color, color: '#fff', fontSize: 14, fontWeight: 600,
              opacity: loading ? 0.7 : 1, marginTop: 8
            }}>
              {loading ? 'Analyzing...' : `Predict ${disease.label} Risk`}
            </button>
          </div>

          {/* Result panel */}
          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: '#fff', borderRadius: 12, padding: '1.5rem', border: '0.5px solid #e5e7eb' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: '1rem' }}>Prediction result</h3>
                <RiskMeter probability={result.probability} riskLevel={result.risk_level} />
                <div style={{ marginTop: 12, fontSize: 12, color: '#9ca3af' }}>
                  Confidence interval: {Math.round(result.confidence_low * 100)}% – {Math.round(result.confidence_high * 100)}%
                </div>
              </div>

              <div style={{ background: '#fff', borderRadius: 12, padding: '1.5rem', border: '0.5px solid #e5e7eb' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: '1rem' }}>Top risk factors (AI explanation)</h3>
                <ShapChart factors={result.top_risk_factors} />
              </div>

              {/* benchmark ui */}
              {result?.benchmark && (
                <div style={{
                  background: '#fff', borderRadius: 12,
                  padding: '1.5rem', border: '0.5px solid #e5e7eb'
                }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: '1rem' }}>
                    Population benchmark
                  </h3>

                  {/* Percentile statement */}
                  <div style={{
                    padding: '12px 16px', borderRadius: 8, marginBottom: 12,
                    background: result.benchmark.color + '18',
                    borderLeft: `4px solid ${result.benchmark.color}`
                  }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: result.benchmark.color }}>
                      Top {100 - result.benchmark.percentile}% risk group
                    </div>
                    <div style={{ fontSize: 12, color: '#6b7280', marginTop: 3 }}>
                      {result.benchmark.message}
                    </div>
                  </div>

                  {/* Population bar */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      fontSize: 11, color: '#9ca3af', marginBottom: 4
                    }}>
                      <span>Population average: {result.benchmark.population_mean}%</span>
                      <span>Your risk: {result.benchmark.user_probability}%</span>
                    </div>

                    {/* Bar with population average marker and user marker */}
                    <div style={{ position: 'relative', height: 20 }}>
                      <div style={{
                        height: 8, borderRadius: 4,
                        background: 'linear-gradient(90deg, #10b981, #f59e0b, #ef4444)',
                        marginTop: 6
                      }} />

                      {/* Population average marker */}
                      <div style={{
                        position: 'absolute',
                        left: `${result.benchmark.population_mean}%`,
                        top: 0, transform: 'translateX(-50%)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center'
                      }}>
                        <div style={{
                          width: 2, height: 20,
                          background: '#6b7280'
                        }} />
                      </div>

                      {/* User marker */}
                      <div style={{
                        position: 'absolute',
                        left: `${Math.min(result.benchmark.user_probability, 98)}%`,
                        top: 2, transform: 'translateX(-50%)',
                      }}>
                        <div style={{
                          width: 14, height: 14, borderRadius: '50%',
                          background: result.benchmark.color,
                          border: '2px solid white',
                          boxShadow: '0 0 0 2px ' + result.benchmark.color
                        }} />
                      </div>
                    </div>

                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      fontSize: 10, color: '#9ca3af', marginTop: 4
                    }}>
                      <span>0% (No risk)</span>
                      <span>100% (Highest risk)</span>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 8, marginTop: 12
                  }}>
                    {[
                      { label: 'Your percentile',   value: `${result.benchmark.percentile}th` },
                      { label: 'Population median', value: `${result.benchmark.population_median}%` },
                      { label: 'Dataset size',      value: result.benchmark.total_samples },
                    ].map((s, i) => (
                      <div key={i} style={{
                        background: '#f9fafb', borderRadius: 8,
                        padding: '8px 10px', textAlign: 'center'
                      }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1f3a' }}>
                          {s.value}
                        </div>
                        <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 2 }}>
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ background: '#fff', borderRadius: 12, padding: '1.5rem', border: '0.5px solid #e5e7eb' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: '1rem' }}>Health recommendations</h3>
                {result.health_tips.map((tip, i) => (
                  <div key={i} style={{
                    padding: '8px 12px', borderRadius: 6, marginBottom: 8,
                    background: '#f0fdf4', borderLeft: '3px solid #10b981',
                    fontSize: 12, color: '#065f46'
                  }}>{tip}</div>
                ))}
              </div>

              {/* download pdf button and email sent   */}
              {predictionId && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <button onClick={() => downloadReport(predictionId)} style={{
                    width: '100%', padding: '12px', borderRadius: 8, border: 'none',
                    background: '#1a1f3a', color: '#fff', fontSize: 14, fontWeight: 600,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                  }}>
                    Download PDF Report
                  </button>

                  <button onClick={handleEmailReport} disabled={emailLoading || emailSent} style={{
                    width: '100%', padding: '12px', borderRadius: 8,
                    border: `2px solid ${disease.color}`,
                    background: emailSent ? '#d1fae5' : 'transparent',
                    color: emailSent ? '#065f46' : disease.color,
                    fontSize: 14, fontWeight: 600,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    opacity: emailLoading ? 0.7 : 1,
                    transition: 'all 0.3s'
                  }}>
                    {emailSent
                      ? 'Report sent to your email!'
                      : emailLoading
                      ? 'Sending...'
                      : 'Email Report to Me'}
                  </button>
                </div>
              )}


            {/* the simulator ui */}
            {result && (
              <div style={{
                background: '#fff', borderRadius: 12, padding: '1.5rem',
                border: `2px solid ${disease.color}`, marginTop: 20
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1f3a' }}>
                      What-If Simulator
                    </h3>
                    <p style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
                      Adjust sliders to see how your risk changes in real time
                    </p>
                  </div>
                  {simLoading && (
                    <span style={{ fontSize: 12, color: '#9ca3af' }}>Calculating...</span>
                  )}
                </div>

                {/* Live risk display */}
                {simResult && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '12px 16px', borderRadius: 10, marginBottom: 16,
                    background: simResult.risk_level === 'HIGH'   ? '#fee2e2'
                              : simResult.risk_level === 'MEDIUM' ? '#fef3c7' : '#d1fae5',
                  }}>
                    <div style={{ fontSize: 28, fontWeight: 700,
                      color: simResult.risk_level === 'HIGH'   ? '#dc2626'
                          : simResult.risk_level === 'MEDIUM' ? '#d97706' : '#059669'
                    }}>
                      {Math.round(simResult.probability * 100)}%
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600,
                        color: simResult.risk_level === 'HIGH'   ? '#991b1b'
                            : simResult.risk_level === 'MEDIUM' ? '#92400e' : '#065f46'
                      }}>
                        {simResult.risk_level} RISK — {simResult.result_label}
                      </div>
                      <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
                        Top factors: {simResult.top_risk_factors.join(', ')}
                      </div>
                    </div>
                    {/* Comparison arrow vs original */}
                    <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                      <div style={{ fontSize: 11, color: '#6b7280' }}>vs original</div>
                      <div style={{ fontSize: 14, fontWeight: 700,
                        color: simResult.probability > result.probability ? '#dc2626' : '#059669'
                      }}>
                        {simResult.probability > result.probability ? '▲' : '▼'}
                        {' '}{Math.abs(Math.round((simResult.probability - result.probability) * 100))}%
                      </div>
                    </div>
                  </div>
                )}

                {/* Simulator sliders — only show top fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {disease.fields.slice(0, 6).map(field => (
                    <div key={field.key}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                        <span style={{ fontWeight: 500 }}>{field.label}</span>
                        <span style={{ color: disease.color, fontWeight: 600 }}>
                          {simValues[field.key] !== undefined ? simValues[field.key] : getVal(field)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={field.min} max={field.max} step={field.step}
                        value={simValues[field.key] !== undefined ? simValues[field.key] : getVal(field)}
                        onChange={e => handleSimulate(field.key, e.target.value)}
                        style={{ width: '100%', accentColor: disease.color }}
                      />
                    </div>
                  ))}
                </div>

                <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 12, textAlign: 'center' }}>
                  Changes here are not saved — this is a simulation only
                </p>
              </div>
            )}



              
            </div>
          )}
        </div>
      </div>
    </div>
  );
}