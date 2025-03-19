import pickle
import pandas as pd
import os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from gtts import gTTS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Ensure the static/audio directory exists
AUDIO_DIR = os.path.join("static", "audio")
if not os.path.exists(AUDIO_DIR):
    os.makedirs(AUDIO_DIR)

# Load model and encoders with error handling
try:
    with open('customer_churn_model_tuned.pkl', 'rb') as model_file:
        model_data = pickle.load(model_file)
        model = model_data["model"]

    with open('encoders.pkl', 'rb') as encoder_file:
        encoders = pickle.load(encoder_file)
except FileNotFoundError as e:
    print(f"Error: Required file not found - {str(e)}")
    exit(1)
except Exception as e:
    print(f"Error loading files: {str(e)}")
    exit(1)

@app.route("/", methods=["GET"])
def home():
    return "Customer Churn App is Running"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data
        data = request.get_json()
        if not data:
            return jsonify({"message": "No data provided"}), 400

        # Convert to DataFrame
        input_data = pd.DataFrame([data])

        # Define required columns
        required_columns = [
            "gender", "SeniorCitizen", "Partner", "Dependents", "tenure",
            "PhoneService", "MultipleLines", "InternetService", "OnlineSecurity",
            "OnlineBackup", "DeviceProtection", "TechSupport", "StreamingTV",
            "StreamingMovies", "Contract", "PaperlessBilling", "PaymentMethod",
            "MonthlyCharges", "TotalCharges"
        ]

        # Check missing columns
        missing_columns = [col for col in required_columns if col not in input_data.columns]
        if missing_columns:
            return jsonify({"message": f"Missing columns: {', '.join(missing_columns)}"}), 400

        # Convert numeric columns and validate
        numeric_columns = ["tenure", "MonthlyCharges", "TotalCharges"]
        for col in numeric_columns:
            input_data[col] = pd.to_numeric(input_data[col], errors="coerce")
            if input_data[col].isnull().any():
                return jsonify({"message": f"Invalid numeric value in {col}"}), 400

        # Encode categorical features with error handling
        for column in encoders:
            if column in input_data.columns:
                try:
                    input_data[column] = encoders[column].transform(input_data[column])
                except ValueError as e:
                    return jsonify({"message": f"Invalid value in {column}: {str(e)}"}), 400

        # Make prediction
        prediction = model.predict(input_data)
        prediction_text = "Churn" if prediction[0] == 1 else "No Churn"

        # Generate audio file with gTTS and save in static/audio
        audio_filename = "prediction_audio.mp3"
        audio_file = os.path.join(AUDIO_DIR, audio_filename)
        tts = gTTS(text=f"The prediction is {prediction_text}", lang='en')
        tts.save(audio_file)

        # Prepare response with prediction and audio
        response = {
            "Prediction": prediction_text,
            "status": "success"
        }

        # Return response with custom header and expose it for CORS
        response = jsonify(response)
        response.headers.add('Access-Control-Expose-Headers', 'X-Audio-File')
        response.headers.add('X-Audio-File', f"/get_audio/{audio_filename}")
        return response, 200

    except Exception as e:
        return jsonify({
            "message": f"Error: {str(e)}",
            "status": "error"
        }), 500

@app.route('/get_audio/<filename>', methods=['GET'])
def get_audio(filename):
    try:
        # Serve the audio file from static/audio
        audio_file_path = os.path.join(AUDIO_DIR, filename)
        return send_file(audio_file_path, mimetype='audio/mpeg')
    except Exception as e:
        return jsonify({"message": f"Error sending audio: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
    

#The Flask API deploys the churn prediction model, 
# loading a tuned RandomForestClassifier and encoders. 
# It handles POST requests, validates input, encodes data, 
# predicts churn, and returns results, with robust error 
# handling and CORS support for frontend integration
