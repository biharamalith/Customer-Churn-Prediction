import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { auth, database } from "./firebase"; // Import Firebase
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref, set } from "firebase/database"; // For Realtime Database
import Auth from "./Auth"; // Import the Auth component

function App() {
  const [formData, setFormData] = useState({
    gender: "",
    SeniorCitizen: "",
    Partner: "",
    Dependents: "",
    tenure: "",
    PhoneService: "",
    MultipleLines: "",
    InternetService: "",
    OnlineSecurity: "",
    OnlineBackup: "",
    DeviceProtection: "",
    TechSupport: "",
    StreamingTV: "",
    StreamingMovies: "",
    Contract: "",
    PaperlessBilling: "",
    PaymentMethod: "",
    MonthlyCharges: "",
    TotalCharges: "",
  });

  const [prediction, setPrediction] = useState("");
  const [user, setUser] = useState(null);

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();//cleans up the listener on unmount to prevent memory leaks
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = [
      "gender",
      "SeniorCitizen",
      "Partner",
      "Dependents",
      "tenure",
      "PhoneService",
      "MultipleLines",
      "InternetService",
      "OnlineSecurity",
      "OnlineBackup",
      "DeviceProtection",
      "TechSupport",
      "StreamingTV",
      "StreamingMovies",
      "Contract",
      "PaperlessBilling",
      "PaymentMethod",
      "MonthlyCharges",
      "TotalCharges",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      setPrediction(
        `Error: Please fill all fields. Missing: ${missingFields.join(", ")}`
      );
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), //matching the Flask API’s expected input format.
      });
      if (!response.ok) {
        const errorData = await response.json();
        setPrediction(`Error: ${errorData.message || "API request failed"}`);
        return;
      }
      const data = await response.json();//Flask API response with  the updated prediction
      setPrediction(data.Prediction);
  
      // Get the audio URL from the response headers and play it in the background
      const audioUrl = response.headers.get("X-Audio-File");
      console.log("Audio URL:", audioUrl); // Debug: Log the audio URL
      if (audioUrl) {
        const audio = new Audio(`http://localhost:5000${audioUrl}`);
        const playPromise = audio.play();
        playPromise.catch((err) => {
          console.error("Audio playback error:", err);
          if (err.name === "NotAllowedError") {
            alert("Audio playback was blocked by the browser. Please click OK to enable audio.");
            audio.play(); // Retry after user interaction
          }
        });
      } else {
        console.error("X-Audio-File header not found in response");
      }
  
      // Store data in Firebase Realtime Database if user is signed in
      if (user) {
        const userRef = ref(database, `users/${user.uid}/predictions/${Date.now()}`);
        await set(userRef, {
          formData,
          prediction: data.Prediction,
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      setPrediction(
        "Error: Could not connect to the API. Ensure the Flask app is running."
      );
      console.error("Error:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setPrediction("");
      setFormData({
        gender: "",
        SeniorCitizen: "",
        Partner: "",
        Dependents: "",
        tenure: "",
        PhoneService: "",
        MultipleLines: "",
        InternetService: "",
        OnlineSecurity: "",
        OnlineBackup: "",
        DeviceProtection: "",
        TechSupport: "",
        StreamingTV: "",
        StreamingMovies: "",
        Contract: "",
        PaperlessBilling: "",
        PaymentMethod: "",
        MonthlyCharges: "",
        TotalCharges: "",
      });
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  if (!user) {
    return <Auth setUser={setUser} />;
  }

  return (
    <div className="app-container">
      <h1 className="title">Telecom Customer Churn Prediction</h1>
      <p className="text-muted" style={{ color: "#ffffff" }}>
        This app uses a machine learning model to predict whether or not a
        customer will churn based on inputs made by the user.{" "}
        <strong>Scroll down to fill all fields.</strong>
      </p>
      <button className="btn btn-danger" onClick={handleSignOut}>
        Sign Out
      </button>
      <form onSubmit={handleSubmit} className="form">
        {/* Demographic Data */}
        <h3>Demographic Data</h3>
        <div className="form-group row">
          <label className="col-sm-4 col-form-label text-right">Gender:</label>
          <div className="col-sm-8">
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Select</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-4 col-form-label text-right">
            Senior Citizen:
          </label>
          <div className="col-sm-8">
            <div className="radio-group">
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="SeniorCitizen"
                  value="1"
                  onChange={handleChange}
                />
                <label className="form-check-label">Yes</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="SeniorCitizen"
                  value="0"
                  onChange={handleChange}
                />
                <label className="form-check-label">No</label>
              </div>
            </div>
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-4 col-form-label text-right">Partner:</label>
          <div className="col-sm-8">
            <div className="radio-group">
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="Partner"
                  value="Yes"
                  onChange={handleChange}
                />
                <label className="form-check-label">Yes</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="Partner"
                  value="No"
                  onChange={handleChange}
                />
                <label className="form-check-label">No</label>
              </div>
            </div>
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-4 col-form-label text-right">
            Dependents:
          </label>
          <div className="col-sm-8">
            <div className="radio-group">
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="Dependents"
                  value="Yes"
                  onChange={handleChange}
                />
                <label className="form-check-label">Yes</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="Dependents"
                  value="No"
                  onChange={handleChange}
                />
                <label className="form-check-label">No</label>
              </div>
            </div>
          </div>
        </div>

        {/* Contract and Tenure Data */}
        <h3>Contract and Tenure Data</h3>
        <div className="form-group row">
          <label className="col-sm-4 col-form-label text-right">Contract:</label>
          <div className="col-sm-8">
            <select
              name="Contract"
              value={formData.Contract}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Select</option>
              <option value="Month-to-month">Month-to-month</option>
              <option value="One year">One year</option>
              <option value="Two year">Two year</option>
            </select>
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-4 col-form-label text-right">
            Tenure (months):
          </label>
          <div className="col-sm-8">
            <input
              type="number"
              name="tenure"
              value={formData.tenure}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        {/* Phone Service Usage */}
        <h3>Phone Service Usage</h3>
        <div className="form-group row">
          <label className="col-sm-4 col-form-label text-right">
            Phone Service:
          </label>
          <div className="col-sm-8">
            <div className="radio-group">
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="PhoneService"
                  value="Yes"
                  onChange={handleChange}
                />
                <label className="form-check-label">Yes</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="PhoneService"
                  value="No"
                  onChange={handleChange}
                />
                <label className="form-check-label">No</label>
              </div>
            </div>
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-4 col-form-label text-right">
            Multiple Lines:
          </label>
          <div className="col-sm-8">
            <select
              name="MultipleLines"
              value={formData.MultipleLines}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="No phone service">No phone service</option>
            </select>
          </div>
        </div>

        {/* Internet Service Usage */}
        <h3>Internet Service Usage</h3>
        <div className="form-group row">
          <label className="col-sm-4 col-form-label text-right">
            Internet Service:
          </label>
          <div className="col-sm-8">
            <select
              name="InternetService"
              value={formData.InternetService}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Select</option>
              <option value="DSL">DSL</option>
              <option value="Fiber optic">Fiber optic</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>
        {[
          "OnlineSecurity",
          "OnlineBackup",
          "DeviceProtection",
          "TechSupport",
          "StreamingTV",
          "StreamingMovies",
        ].map((field) => (
          <div className="form-group row" key={field}>
            <label className="col-sm-4 col-form-label text-right">
              {field.replace(/([A-Z])/g, " $1")}:
            </label>
            <div className="col-sm-8">
              <select
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="No internet service">No internet service</option>
              </select>
            </div>
          </div>
        ))}

        {/* Charges (USD), Billing and Payment Method */}
        <h3>Charges (USD), Billing and Payment Method</h3>
        <div className="form-group row">
          <label className="col-sm-4 col-form-label text-right">
            Monthly Charges:
          </label>
          <div className="col-sm-8">
            <input
              type="number"
              step="0.01"
              name="MonthlyCharges"
              value={formData.MonthlyCharges}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-4 col-form-label text-right">
            Total Charges:
          </label>
          <div className="col-sm-8">
            <input
              type="number"
              step="0.01"
              name="TotalCharges"
              value={formData.TotalCharges}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-4 col-form-label text-right">
            Paperless Billing:
          </label>
          <div className="col-sm-8">
            <div className="radio-group">
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="PaperlessBilling"
                  value="Yes"
                  onChange={handleChange}
                />
                <label className="form-check-label">Yes</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="PaperlessBilling"
                  value="No"
                  onChange={handleChange}
                />
                <label className="form-check-label">No</label>
              </div>
            </div>
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-4 col-form-label text-right">
            Payment Method:
          </label>
          <div className="col-sm-8">
            <select
              name="PaymentMethod"
              value={formData.PaymentMethod}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Select</option>
              <option value="Electronic check">Electronic check</option>
              <option value="Mailed check">Mailed check</option>
              <option value="Bank transfer (automatic)">
                Bank transfer (automatic)
              </option>
              <option value="Credit card (automatic)">
                Credit card (automatic)
              </option>
            </select>
          </div>
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-primary submit-button">
            Submit
          </button>
        </div>
      </form>
      {prediction && <h2 className="prediction text-center">Prediction: {prediction}</h2>}
      <footer className="footer mt-5 py-3 text-center">
        <p>
          Developed by{" "}
          <a
            href="https://www.linkedin.com/in/bihara-malith/.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Bihara Malith
          </a>
          {" "}All rights reserved @2025
        </p>
      </footer>
    </div>
  );
}

export default App;
