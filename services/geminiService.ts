
import { GoogleGenAI } from "@google/genai";
import { Location } from '../types';

// FIX: Per coding guidelines, initialize GoogleGenAI with process.env.API_KEY directly and assume it is set. Removed manual checks for the key.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export async function generateSafetyTips(topic: string): Promise<string> {
  try {
    const prompt = `You are a helpful safety assistant. Provide clear, concise, and actionable safety tips for the following topic: "${topic}". Structure your response with clear headings and bullet points. Do not use markdown formatting like '*' or '#'. Just use plain text and newlines.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
       config: {
        temperature: 0.5,
        topP: 0.95,
        topK: 64,
       }
    });

    return response.text;
  } catch (error) {
    console.error("Error generating safety tips:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while contacting the Gemini API.");
  }
}

export async function generateEmergencyPlan(location: Location): Promise<string> {
  try {
    const prompt = `
      URGENT: A user is in an emergency situation and has triggered an SOS alert.
      Their current location is Latitude: ${location.lat}, Longitude: ${location.lng}.
      
      Provide an immediate, concise, and actionable emergency plan. The tone should be calm and authoritative.
      The response MUST be plain text and include the following:
      1.  A confirmation of their general area if possible (e.g., "near downtown Los Angeles").
      2.  The address and contact number for the NEAREST police station.
      3.  The address and contact number for the NEAREST hospital.
      4.  Two or three critical, location-aware safety tips (e.g., "Find a well-lit public area," or "Stay away from the warehouse district.").
      
      Structure the response clearly. Do not use markdown.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro", // Using a more powerful model for critical tasks
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating emergency plan:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while contacting the Gemini API.");
  }
}
