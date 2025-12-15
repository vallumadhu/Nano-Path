const express = require("express");
require('dotenv').config()
const router = express.Router()

async function invokeChute(prompt) {
    try {
        const response = await fetch("https://llm.chutes.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.CHUTES_API_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-20b",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 1024,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (err) {
        console.error("Error invoking Chute:", err);
        return null;
    }
}



router.post("/note/formatter", async (req, res) => {
    const noteData = req.body.note
    const prompt = `
You are a precise code formatter. Follow these rules:
1. Detect the programming language of any code blocks in the note.
2. Fix only indentation and syntax errors in the code.
3. Do not change any natural language text, comments, or paragraphs.
4. Do not summarize, remove, or alter any content outside of the code.
5. If the code is already correct and no changes are needed, return the content exactly as it was.

Content to process:
${noteData}

Return only the resulting content exactly as instructed.
`;

    const chuteResponse = await invokeChute(prompt);
    const formattedNote = chuteResponse.choices?.[0]?.message?.content || "";

    res.status(200).json({
        original: noteData,
        formatted: formattedNote || ""
    });
})

router.post("/note/grammarfix", async (req, res) => {
    const noteData = req.body.note;
    const prompt = `
You are a precise editor. Follow these rules:
1. Leave all code blocks and inline code exactly as they are.
2. Only correct grammar, punctuation, and readability in normal text, comments, and paragraphs.
3. Do not summarize, add, or remove content.
4. Keep original spacing, indentation, and line breaks intact.
5. If no corrections are needed, return the content exactly as it was.

Content to fix:
${noteData}

Return the corrected content exactly as instructed.
`;


    const chuteResponse = await invokeChute(prompt);
    const correctedNote = chuteResponse?.choices?.[0]?.message?.content || "";

    res.status(200).json({
        original: noteData,
        corrected: correctedNote
    });
});

router.post("/note/ai", async (req, res) => {
    const { noteData, userPrompt, previousChatsContext } = req.body

    const prompt = `
A user has some queries related to this note: "${noteData}". Here is the previous conversation context (if any) for reference: "${previousChatsContext || 'None'}". Read and understand this note and the previous conversation, then provide a clear, concise, and professional answer to resolve the user's query: "${userPrompt}". Do not add unnecessary explanations, jokes, or filler—focus only on answering the query accurately. You may improve or clarify the answer if needed, but only when it helps make the response more correct or understandable.
`;

    const chuteResponse = await invokeChute(prompt);
    const aiAnswer = chuteResponse?.choices?.[0]?.message?.content || "";

    res.status(200).json({
        userPrompt: userPrompt,
        aiAnswer: aiAnswer
    });

})

module.exports = router;