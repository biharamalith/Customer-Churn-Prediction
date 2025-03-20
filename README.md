# Telecom Customer Churn Prediction

This project predicts customer churn in the telecom sector using a Machine Learning model (Random Forest Classifier). It integrates a React frontend, Flask backend, and Firebase for authentication and storage.

## 🚀 Features
- Machine learning-based churn prediction
- Flask API for model inference
- React frontend for user interaction
- Firebase authentication and real-time database
- Audio feedback on predictions

## 📁 Project Structure
```
📂 project-root
│
├── 📁 backend
│   ├── app.py (Flask API)
│   └── model.pkl (Trained Random Forest model)
│
├── 📁 frontend
│   ├── src
│   │   ├── App.js (Main React App)
│   │   └── components
│   │       └── PredictionForm.js (Handles user input & API call)
│
└── 📁 data
    └── Telco-Customer-Churn.csv (Dataset)
```

## 🔧 Setup and Installation

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/telecom-churn-prediction.git
cd telecom-churn-prediction
```

### 2️⃣ Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### 3️⃣ Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

## 🔥 How to Use
1. Open the React frontend at `http://localhost:5173`
2. Enter customer details (tenure, monthly charges, etc.)
3. Hit 'Predict' to get churn prediction
4. Audio feedback plays if a result is returned

## 📊 Model Performance
- Accuracy: 77.86%
- Precision: 0.85 (Non-Churn), 0.58 (Churn)
- Recall: 0.85 (Non-Churn), 0.59 (Churn)
- F1 Score: 0.85 (Non-Churn), 0.58 (Churn)

## 🛠️ Future Enhancements
- **Model upgrade**: Implement XGBoost for better performance
- **Cloud deployment**: Deploy Flask backend to AWS or Heroku
- **UX improvements**: Add prediction probability visualization
- **Blockchain integration**: Enhance data security

## 💡 Acknowledgments
- Telco Customer Churn Dataset from [Kaggle](https://www.kaggle.com/datasets)
- Flask, React, Firebase, and scikit-learn documentation

## 📝 License
This project is licensed under the MIT License — feel free to use and modify it!

---

✨ **Built with ❤️ by K.D.B.M Anjana** ✨

