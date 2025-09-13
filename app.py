from flask import Flask, render_template, request, jsonify
import joblib
import numpy as np
import random

app = Flask(__name__)

# Load ML model
try:
    model = joblib.load("energy_prediction_model.pkl")
except FileNotFoundError:
    print("❌ energy_prediction_model.pkl not found!")

# Home route
@app.route("/")
def home():
    return render_template("index.html")

# Prediction route
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        fan = float(data.get('fan', 0))
        light = float(data.get('light', 0))
        tv = float(data.get('tv', 0))

        features = np.array([[fan, light, tv]])
        prediction = model.predict(features)[0]

        return jsonify({"prediction": round(float(prediction), 2)})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Energy trends route (6-hour forecast)
@app.route("/energy_trends")
def energy_trends():
    hours = ["Now", "+1h", "+2h", "+3h", "+4h", "+5h", "+6h"]
    load = [random.randint(200, 400) for _ in hours]  # Free API simulation
    return jsonify({"hours": hours, "load": load})

if __name__ == "__main__":
    app.run(debug=True)
