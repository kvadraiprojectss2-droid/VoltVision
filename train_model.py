import joblib
import numpy as np
from sklearn.linear_model import LinearRegression

# Dummy dataset (you can expand this later with real data)
# Each row: [fan_usage, light_usage, tv_usage] (Watt-hours)
X = np.array([
    [600, 90, 400],   # Low usage
    [800, 120, 500],  # Medium usage
    [1200, 200, 700], # High usage
    [1500, 300, 1000] # Very high usage
])

# Target: Energy consumption (kWh per week)
y = np.array([15, 20, 30, 40])

# Train model
model = LinearRegression()
model.fit(X, y)

# Save to pkl
joblib.dump(model, "energy_prediction_model.pkl")
print("✅ Model trained and saved as energy_prediction_model.pkl")
