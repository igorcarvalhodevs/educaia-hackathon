const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateContent(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    if (!response.text) {
      throw new Error("Empty response from Gemini");
    }

    return response.text;
  } catch (error) {
    console.error("Gemini provider error:", {
      status: error.status,
      message: error.message,
    });

    const providerError = new Error(
      "AI provider unavailable"
    );

    providerError.code = "AI_PROVIDER_ERROR";
    providerError.status = error.status || 500;

    throw providerError;
  }
}

module.exports = {
  generateContent,
};