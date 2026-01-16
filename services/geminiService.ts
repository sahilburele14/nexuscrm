import { GoogleGenAI } from "@google/genai";
import { Lead } from "../types";

// Helper to safely check if API key exists without crashing during the initial render
const getApiKey = () => {
  try {
    return process.env.API_KEY || '';
  } catch (e) {
    return '';
  }
};

const apiKey = getApiKey();
// Only initialize if key exists to prevent immediate errors, though usage will be guarded
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateEmailDraft = async (lead: Lead): Promise<string> => {
  if (!ai) {
    // Fallback for demo if no API key is present
    return `Subject: Partnership Opportunity - ${lead.company}\n\nHi ${lead.name.split(' ')[0]},\n\nI noticed you're interested in our services via ${lead.source}. I'd love to chat about how we can help ${lead.company}.\n\n(Note: Add a valid API_KEY to env to generate real AI responses)`;
  }

  try {
    const prompt = `
      You are a professional sales representative. 
      Write a personalized, concise, and professional outreach email to a potential client.
      
      Lead Details:
      Name: ${lead.name}
      Company: ${lead.company}
      Source of interest: ${lead.source}
      Current Status: ${lead.status}
      
      The email should be friendly but business-focused. Ask for a brief call next week.
      Do not include placeholders. Output only the email subject and body.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-latest', // High speed for interactive UI
      contents: prompt,
    });

    return response.text || "Could not generate email.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating draft. Please try again later.";
  }
};
