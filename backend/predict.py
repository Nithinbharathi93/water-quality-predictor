import sys
import pickle
import json
import numpy as np
import xgboost as xgb # Ensure you use xgboost here

def predict():
    try:
        # 1. Load the XGBoost model and the Scaler
        with open('water_model.pkl', 'rb') as f:
            model = pickle.load(f)
        with open('scaler.pkl', 'rb') as f:
            scaler = pickle.load(f)

        # 2. Get data from Node.js (via stdin/arguments)
        raw_data = json.loads(sys.argv[1])
        input_data = [float(val) for val in raw_data]
        
        # 3. SCALE THE DATA (Crucial!)
        # This transforms your raw inputs (like 45000 solids) 
        # into the same scale the model was trained on.
        input_scaled = scaler.transform([input_data])
        
        # 4. Predict
        prediction = model.predict(input_scaled)
        
        # 5. Return result
        print(int(prediction[0]))

    except Exception as e:
        sys.stderr.write(str(e))
        sys.exit(1)

if __name__ == "__main__":
    predict()