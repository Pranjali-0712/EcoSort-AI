from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline
from PIL import Image
import io

app = FastAPI(
    title="EcoSort AI API",
    description="AI-powered waste classification and sustainability assistant"
)

# Allow React frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the AI image classification model
print("Loading AI model... Please wait.")

classifier = pipeline(
    "image-classification",
    model="WinKawaks/vit-tiny-patch16-224"
)
print("AI model loaded successfully!")


@app.get("/")
def home():
    return {
        "message": "EcoSort AI Backend is Running!"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.post("/analyze")
async def analyze_waste(file: UploadFile = File(...)):

    try:
        # Read the uploaded image
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data)).convert("RGB")

        # Get predictions from the AI model
        predictions = classifier(image)

        # Get the best prediction
        detected_item = predictions[0]["label"]
        confidence = round(predictions[0]["score"] * 100, 2)

        # Check AI confidence
        if confidence < 50:
            warning = (
                "⚠️ Low confidence. Please upload a clearer image "
                "or verify the result manually."
            )
        else:
            warning = "✅ AI prediction confidence is good."

        # Convert detected item to lowercase
        item_lower = detected_item.lower()

        # Default values
        category = "General Waste"

        recommendation = (
            "Please check your local waste disposal guidelines before disposal."
        )

        impact = (
            "Proper waste disposal helps reduce environmental pollution "
            "and prevents unnecessary waste from reaching landfills."
        )

        # Recyclable Waste
        if any(word in item_lower for word in [
            "bottle", "plastic", "can", "paper", "carton"
        ]):
            category = "Recyclable"

            recommendation = (
                "Clean the item and place it in an appropriate recycling bin."
            )

            impact = (
                "Recycling helps conserve natural resources, reduce landfill "
                "waste, and lower environmental pollution."
            )

        # Organic Waste
        elif any(word in item_lower for word in [
            "banana", "apple", "food", "vegetable", "fruit"
        ]):
            category = "Organic Waste"

            recommendation = (
                "Place this waste in an organic waste bin or compost it."
            )

            impact = (
                "Composting organic waste can reduce landfill waste and "
                "produce nutrient-rich material for soil."
            )

        # Hazardous Waste
        elif any(word in item_lower for word in [
            "battery", "cell", "chemical"
        ]):
            category = "Hazardous Waste"

            recommendation = (
                "Do not mix this with regular household waste. "
                "Take it to an authorized collection center."
            )

            impact = (
                "Proper disposal prevents hazardous substances from "
                "contaminating soil and water."
            )

        # E-Waste
        elif any(word in item_lower for word in [
            "computer", "laptop", "phone", "keyboard", "electronic"
        ]):
            category = "E-Waste"

            recommendation = (
                "Take this item to an authorized e-waste collection "
                "or recycling center."
            )

            impact = (
                "Responsible e-waste recycling helps recover valuable "
                "materials and prevents toxic pollution."
            )

        # Return AI analysis result
        return {
            "filename": file.filename,
            "detected_item": detected_item,
            "confidence": f"{confidence}%",
            "category": category,
            "recommendation": recommendation,
            "impact": impact,
            "warning": warning,
            "all_predictions": predictions[:3]
        }

    except Exception as e:
        return {
            "error": str(e)
        }