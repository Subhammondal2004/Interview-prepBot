import generateApiResponse from "../utils/ai-services.js";
import apiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

const evaulateAnswersAi = async (question, answer, answerkey) => {
    try {
        if ([question, answer, answerkey].some((field) => field?.trim() === "")) {
            throw new apiError(400, "All fields are required");
        }


        const prompt = `Evaluate the following answer based on the provided answer key:\n\nQuestion: ${question}\n\nAnswer: ${answer}\n\nAnswer Key: ${answerkey}\n\nProvide a score out of 5, feedback on strengths and weaknesses, and a brief explanation of the correct answer if necessary.Always return JSON using the following format with numeric score (no fractions or 'x/5' strings):`;
        const aiResponse = await generateApiResponse(prompt);
        const response = aiResponse;
        
        return new ApiResponse(200, "Answers evaluated successfully", {
            score: response.score,
            feedback: response.feedback,
            aiResponse: response.aiResponse || "No additional AI response provided"
        });

    } catch (error) {
        throw new apiError(500, error.message || "Failed to evaluate answers");
    }
}

export {
    evaulateAnswersAi
}