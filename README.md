# ♻️ EcoSort AI

## AI-Powered Waste Classification and Sustainability Assistant

EcoSort AI is a web-based application that uses **AI-powered image classification** to help users identify waste items and understand how they can be disposed of responsibly.

Users can upload or capture an image of a waste item. The application analyzes the image using a pre-trained **Vision Transformer (ViT)** model, displays the detected item and confidence score, maps the prediction to a waste category, and provides a disposal recommendation.

The project focuses on using Artificial Intelligence and Computer Vision to promote better waste segregation and support **UN Sustainable Development Goal 12 – Responsible Consumption and Production**.

---

## 🌍 Problem Statement

Improper waste segregation is a major environmental challenge. People often find it difficult to identify whether everyday items should be recycled, composted, treated as e-waste, handled as hazardous waste, or disposed of as general waste.

Incorrect segregation can increase landfill waste, pollution, and the loss of recyclable materials.

EcoSort AI addresses this problem by providing an accessible AI-powered waste classification system. Users can upload or capture an image of a waste item, and the system analyzes the image to identify the object, provide a confidence score, assign a waste category, and recommend an appropriate disposal method.

The project aims to improve awareness, encourage responsible waste disposal, and promote sustainable consumption practices.

---

# 💡 Solution

EcoSort AI provides a simple web interface where users can submit an image of a waste item.

The image is sent from the React frontend to a FastAPI backend. The backend processes the image using Pillow and sends it to a pre-trained Vision Transformer image-classification model available through Hugging Face Transformers.

The AI prediction is then processed by the application to determine a suitable waste category and disposal recommendation.

The application also provides confidence information, top AI predictions, low-confidence warnings, analysis history, and a user correction option to support human oversight.

---

# 🤖 How EcoSort AI Works

```text
                    USER
                      │
                      ▼
              Upload / Capture Image
                      │
                      ▼
             React + Vite Frontend
                      │
                      ▼
              FastAPI Backend
                      │
                      ▼
             Image Processing
                  (Pillow)
                      │
                      ▼
        Vision Transformer (ViT)
                      │
                      ▼
             AI Predictions
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
    Detected Item            Confidence
          │
          ▼
     Waste Category
          │
          ▼
 Disposal Recommendation

```
