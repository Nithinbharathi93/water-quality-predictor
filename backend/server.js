import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini 3 (Flash Preview)
const ai = new GoogleGenAI({ apiKey: "AIzaSyCyR9s_SwsT_mj7KB3OJwOVTkHZXLnrufk" });

app.post('/analyze-water', async (req, res) => {
    const waterData = req.body;

    // Validate that we have the necessary data
    // The model expects: ph, hardness, solids, chloramines, sulfate, conductivity, organic_carbon, trihalomethanes, turbidity
    if (Object.keys(waterData).length < 9) {
        return res.status(400).json({ error: "Missing water quality parameters. Need exactly 9 fields." });
    }

    // Convert object values to a JSON string to pass to Python
    const inputValues = JSON.stringify(Object.values(waterData));

    // Step 1: Use spawn for better stability with JSON arguments
    // Use 'python' or 'python3' depending on your environment
    const pythonProcess = spawn('python', ['predict.py', inputValues]);

    let pythonData = "";
    let pythonError = "";

    pythonProcess.stdout.on('data', (data) => {
        pythonData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        pythonError += data.toString();
    });

    pythonProcess.on('close', async (code) => {
        if (code !== 0) {
            console.error("Python Error Details:", pythonError);
            return res.status(500).json({
                error: "ML Model Execution Failed",
                details: pythonError.trim()
            });
        }

        const prediction = pythonData.trim();
        const safetyStatus = prediction === "1" ? "POTABLE (Safe to Drink)" : "NON-POTABLE (Health Hazard)";

        try {
            // Step 2: Ask Gemini to analyze the specific hazards
            const result = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: `
          The ML model has flagged this water sample as: ${safetyStatus}.
          Raw Sensor Data (JSON): ${JSON.stringify(waterData)}
          
          Action: As a water safety expert, analyze these specific chemical/physical levels. 
          Focus on why these specific values are dangerous or safe. 
          List specific health hazards (e.g., skin irritation, stomach issues, long-term risks) 
          based on the provided concentrations.
        `,
            });

            // Step 3: Send final response to React frontend
            // Note: In @google/genai, the response structure might require .candidates[0].content.parts[0].text 
            // but usually helper methods exist. Checking standard text extraction:
            const analysisText = result.text || result.response?.text?.() || "Analysis unavailable.";

            res.json({
                prediction: safetyStatus,
                analysis: analysisText,
                rawValues: waterData
            });

        } catch (aiError) {
            console.error("Gemini Error:", aiError);
            res.status(500).json({ error: "Gemini Analysis Failed", details: aiError.message });
        }
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`---`);
    console.log(`🚀 Water Safety Backend Live`);
    console.log(`📡 Endpoint: http://localhost:${PORT}/analyze-water`);
    console.log(`---`);
});