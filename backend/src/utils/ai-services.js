import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI(
  process.env.GEMINI_API_KEY, // Ensure this is set in your .env file
);

async function generateApiResponse(prompt) {
  try {
    const systemInstruction =
      `
        You are an AI Interview Answer Reviewer. Your job is to evaluate candidate answers based on an answer key provided by the interviewer. Follow these rules:

        1. Compare the candidate's answer with the answer key thoroughly.
        2. Be objective and concise. Use plain English.
        3. Evaluate based on accuracy, completeness, relevance, and clarity.
        4. Provide a score out of 10.
        5. Give constructive feedback on strengths and weaknesses.
        6. If the answer is incorrect or partially correct, explain the correct answer briefly.
        7. Avoid giving marks for generic or unrelated responses.

        Output format:
        {
          "score": 4, // Numeric score out of 10
          "feedback": "Your detailed feedback here...",
          "aiResponse": "Optional – short version of the ideal answer if the answer is incorrect or partially correct."
        }`
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [
        { role: "system", text: systemInstruction },
        { role: "user", text: prompt },     
      ],
    });
    const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("Gemini API returned an invalid or empty response.");
    }

    const jsonString = text.replace(/```json|```/g, "").trim();
    const fixedJson = jsonString.replace(/"score":\s*([\d.]+)\/5/, (_, val) => `"score": ${val}`);

    const parsed = JSON.parse(fixedJson);
    return parsed; // { score, feedback, aiResponse }

  } catch (error) {
    console.error("Error generating AI response:", error);
    throw new Error("Failed to generate AI response");
  }
}
export default generateApiResponse;