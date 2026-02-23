# Water Quality Predictor

A machine learning-powered web application that analyzes water quality parameters and predicts whether water is potable (safe to drink) or non-potable (health hazard). The application uses an XGBoost model for predictions and Google's Gemini AI for detailed analysis and recommendations.

## Features

- 🧪 **Water Quality Analysis** - Analyzes 9 key water quality parameters
- 🤖 **ML-Powered Predictions** - Uses XGBoost model for accurate safety classification
- 💡 **AI-Powered Insights** - Google Gemini provides detailed analysis and recommendations
- 🌐 **Web Interface** - User-friendly frontend to input water parameters
- ⚡ **Real-time Processing** - Fast prediction and analysis results
- 🔄 **CORS Enabled** - Ready for cross-origin requests

## Technology Stack

### Backend
- **Node.js & Express.js** - REST API server
- **Python** - ML model execution
- **XGBoost** - Machine learning model
- **Google Gemini API** - AI-powered analysis
- **scikit-learn** - Data preprocessing (Scaler)

### Frontend
- HTML, CSS, JavaScript

## Prerequisites

Before running this project, ensure you have:

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **Google Gemini API Key** ([Get it here](https://ai.google.dev/))
- **npm** (comes with Node.js)

### Required Python Packages
```bash
pip install xgboost numpy scikit-learn
```

## Installation

### 1. Clone or Download the Project
```bash
cd water-quality-model
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Install Python Dependencies
```bash
pip install xgboost numpy scikit-learn
```

### 4. Setup Environment Variables
Create a `.env` file in the `backend` folder with:

```env
# Google Gemini API Configuration
GOOGLE_API_KEY=your_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development

# Python Configuration
PYTHON_PATH=python
```

Replace `your_api_key_here` with your actual Google Gemini API key.

### 5. Update server.js to Use Environment Variables
In `backend/server.js`, update the Gemini initialization:

```javascript
import dotenv from 'dotenv';
dotenv.config();

// Replace the hardcoded API key with:
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
```

And install dotenv:
```bash
npm install dotenv
```

## How to Run

### Option 1: Development Mode (with auto-reload)
```bash
cd backend
npm run dev
```

### Option 2: Production Mode
```bash
cd backend
npm start
```

The backend server will start on `http://localhost:5000` (or the port specified in `.env`)

### Running the Frontend
1. Open `index.html` in your web browser, or
2. Serve it using a local server (e.g., VS Code Live Server)

## Project Structure

```
water-quality-model/
├── index.html              # Frontend interface
├── README.md               # This file
└── backend/
    ├── package.json        # Node.js dependencies
    ├── server.js           # Express server & API endpoints
    ├── predict.py          # ML model prediction script
    ├── water_model.pkl     # Trained XGBoost model
    ├── scaler.pkl          # Feature scaler for data preprocessing
    └── .env                # Environment variables (create this)
```

## API Endpoints

### POST `/analyze-water`
Analyzes water quality and returns potability prediction with AI insights.

**Request Body:**
```json
{
  "ph": 7.5,
  "hardness": 200,
  "solids": 45000,
  "chloramines": 4,
  "sulfate": 300,
  "conductivity": 500,
  "organic_carbon": 15,
  "trihalomethanes": 80,
  "turbidity": 4
}
```

**Response:**
```json
{
  "prediction": "POTABLE (Safe to Drink)",
  "analysis": "Detailed AI analysis from Gemini...",
  "timestamp": "2026-02-23T10:30:00Z"
}
```

## Water Quality Parameters

The model analyzes these 9 parameters:

1. **pH** - Acidity/alkalinity (0-14)
2. **Hardness** - Mineral content (mg/L)
3. **Solids** - Total dissolved solids (mg/L)
4. **Chloramines** - Disinfectant levels (mg/L)
5. **Sulfate** - Sulfate concentration (mg/L)
6. **Conductivity** - Electrical conductivity (μS/cm)
7. **Organic Carbon** - Organic matter (mg/L)
8. **Trihalomethanes** - Disinfection byproducts (μg/L)
9. **Turbidity** - Water clarity (NTU)

## Troubleshooting

### Python Not Found
If you get "Python not found" error, make sure:
- Python is installed and added to PATH
- Use `python3` instead of `python` if on macOS/Linux
- Update `PYTHON_PATH` in `.env` accordingly

### API Key Error
- Verify your Google Gemini API key is correct
- Check that the `.env` file is in the `backend` folder
- Ensure `dotenv` is installed and configured in `server.js`

### Port Already in Use
Change the `PORT` value in `.env` to an available port (e.g., 5001, 5002)

## License

ISC

## Support

For issues or questions, please check the project repository or contact the development team.