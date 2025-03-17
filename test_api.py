import requests
import json

# Test data matching the required columns
test_data = {
    "gender": "Female",
    "SeniorCitizen": 0,
    "Partner": "Yes",
    "Dependents": "No",
    "tenure": 1,
    "PhoneService": "No",
    "MultipleLines": "No phone service",
    "InternetService": "DSL",
    "OnlineSecurity": "No",
    "OnlineBackup": "Yes",
    "DeviceProtection": "No",
    "TechSupport": "No",
    "StreamingTV": "No",
    "StreamingMovies": "No",
    "Contract": "Month-to-month",
    "PaperlessBilling": "Yes",
    "PaymentMethod": "Electronic check",
    "MonthlyCharges": 29.85,
    "TotalCharges": 29.85
}

# API endpoint URL (assuming it's running locally)
url = "http://127.0.0.1:5000/predict"


def test_api():
    try:
        # Send POST request to the API
        response = requests.post(
            url,
            json=test_data,
            headers={'Content-Type': 'application/json'}
        )

        # Check if request was successful
        if response.status_code == 200:
            print("API test successful!")
            print("Response:", response.json())
        else:
            print(f"API test failed with status code: {response.status_code}")
            print("Error:", response.json())

    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the API. Make sure the Flask app is running.")
    except Exception as e:
        print(f"An error occurred: {str(e)}")


# Test the home endpoint
def test_home():
    try:
        response = requests.get("http://127.0.0.1:5000/")
        if response.status_code == 200:
            print("Home endpoint test successful!")
            print("Response:", response.text)
        else:
            print(f"Home endpoint test failed with status code: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the API. Make sure the Flask app is running.")


if __name__ == "__main__":
    print("Testing home endpoint...")
    test_home()
    print("\nTesting predict endpoint...")
    test_api()