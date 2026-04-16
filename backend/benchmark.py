import json
import os

STATS_PATH = os.path.join(os.path.dirname(__file__), '..', 'models', 'population_stats.json')

with open(STATS_PATH) as f:
    POPULATION_STATS = json.load(f)


def get_benchmark(disease: str, user_probability: float) -> dict:
    """
    Compares user's risk probability against population distribution.
    Returns percentile rank and contextual message.
    """
    stats = POPULATION_STATS.get(disease)
    if not stats:
        return {}

    prob = user_probability

    # Calculate percentile rank
    if prob <= stats['p25']:
        percentile = round((prob / stats['p25']) * 25)
        bucket = "bottom 25%"
        message = f"Your risk is lower than 75% of people in our dataset."
        color = "#059669"
    elif prob <= stats['p50']:
        percentile = round(25 + ((prob - stats['p25']) / (stats['p50'] - stats['p25'])) * 25)
        bucket = "25th–50th percentile"
        message = f"Your risk is around the median for {disease}."
        color = "#10b981"
    elif prob <= stats['p75']:
        percentile = round(50 + ((prob - stats['p50']) / (stats['p75'] - stats['p50'])) * 25)
        bucket = "50th–75th percentile"
        message = f"Your risk is higher than average. Consider lifestyle changes."
        color = "#f59e0b"
    elif prob <= stats['p90']:
        percentile = round(75 + ((prob - stats['p75']) / (stats['p90'] - stats['p75'])) * 15)
        bucket = "75th–90th percentile"
        message = f"Your risk is in the upper range. Consult a healthcare provider."
        color = "#ef4444"
    else:
        percentile = round(90 + ((prob - stats['p90']) / (1 - stats['p90'])) * 10)
        bucket = "top 10%"
        message = f"Your risk is among the highest in our dataset. Seek medical advice."
        color = "#dc2626"

    percentile = min(99, max(1, percentile))

    return {
        "percentile":       percentile,
        "bucket":           bucket,
        "message":          message,
        "color":            color,
        "population_mean":  round(stats['mean'] * 100, 1),
        "population_median":round(stats['p50'] * 100, 1),
        "positive_rate":    round(stats['positive_rate'] * 100, 1),
        "total_samples":    stats['total_samples'],
        "user_probability": round(prob * 100, 1),
    }