from flask import Flask, render_template, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)
model = joblib.load("energy_prediction_model.pkl")  # Your trained ML model

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    features = np.array([[data['fan'], data['light'], data['tv']]])
    prediction = model.predict(features)[0]
    return jsonify({"prediction": round(float(prediction), 2)})

if __name__ == "__main__":
    app.run(debug=True)
