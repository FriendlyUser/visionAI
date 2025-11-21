import { GoogleGenAI } from "@google/genai";
import { stripBase64Prefix } from "../utils/imageUtils";
import { ImageData } from "../types";

// Initialize the client with the API key from environment variables
// @ts-ignore - process.env.API_KEY is injected by the environment
const apiKey = process.env.API_KEY;

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

const MODEL_NAME = 'gemini-2.5-flash-image';

export const editImageWithGemini = async (
  currentImage: ImageData,
  prompt: string
): Promise<ImageData> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please configure the environment.");
  }

  try {
    const cleanBase64 = stripBase64Prefix(currentImage.base64);
    
    // Construct the request
    // We send the image as inline data and the prompt as text
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: currentImage.mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    // Parse the response to find the generated image
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No candidates returned from Gemini.");
    }

    const content = candidates[0].content;
    if (!content || !content.parts) {
      throw new Error("No content parts returned.");
    }

    let generatedImageBase64 = '';
    let generatedMimeType = 'image/png'; // Default for generated images usually

    // Iterate through parts to find the image. It might not be the first part.
    for (const part of content.parts) {
      if (part.inlineData) {
        generatedImageBase64 = part.inlineData.data;
        // API usually returns standard MIME types, but we can default if missing
        generatedMimeType = part.inlineData.mimeType || 'image/png';
        break;
      }
    }

    if (!generatedImageBase64) {
      // Sometimes the model might refuse and return text explaining why (Safety, confusion, etc.)
      // If we have text parts, we can throw them as an error or handle them.
      const textPart = content.parts.find(p => p.text);
      if (textPart && textPart.text) {
        throw new Error(`Gemini API response: ${textPart.text}`);
      }
      throw new Error("No image generated.");
    }

    return {
      base64: `data:${generatedMimeType};base64,${generatedImageBase64}`,
      mimeType: generatedMimeType,
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
