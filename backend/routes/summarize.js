import express from 'express';
import { InferenceClient } from "@huggingface/inference";
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const HF_ACCESS_TOKEN = process.env.HF_ACCESS_TOKEN;
const inference = new InferenceClient(HF_ACCESS_TOKEN);
router.post("/", async (req, res) => {
    const { text } = req.body;

    if (!text || text.trim().split(/\s+/).length < 50) {
        return res.status(400).json({ error: "Summarization requires minimum 50 words!" });
    }
    try {
        const result = await inference.summarization({
            model: "philschmid/bart-large-cnn-samsum",
            inputs: text
        });
        res.json({ summary: result.summary_text });
    }
    catch (err) {
        console.error("Summarization error: ", err);
        res.status(500).json({ error: "Failed to summarize." });
    }
});

export default router;