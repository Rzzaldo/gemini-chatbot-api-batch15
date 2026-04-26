import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// const GEMINI_MODEL = 'gemini-2.5-flash';
// const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_MODEL = 'gemini-2.5-flash-lite';

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server ready on http://localhost:${PORT}`));

app.post('/api/chat', async (req, res) => {
    const { conversation } = req.body;
    try {
        if (!Array.isArray(conversation)) throw new Error('Conversation must be an array!');

        const contents = conversation.map(({ role, text }) => ({
            role,
            parts: [{ text }],
        }));
        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents,
            config: {
                temperature: 0.7,
                top_k: 20,
                systemInstruction: `Nama Anda adalah RAI. Jawab dengan ramah dan profesional. Seakan-akan anda adalah Personal Coach yang membantu pengguna untuk memberikan saran atau sugesti yang baik dan tepat untuk mereka yang ingin berolahraga menurut kondisi fisik yang mereka punya dan preferensi mereka.
                                    Tanyakan mau olahraga di luar ruangan atau dalam ruangan, berapa lama waktu yang ingin dibutuhkan untuk olahraga, lalu tanyakan apakah ingin level pemula, menengah atau ahli, serta berikan saran untuk warming up dan recovery yang tepatl, serta beri saran makanan yang tepat selama proses olahraga dan post olahraga dan berikan rekomendasi tempat yang sesuai dengan lokasi mereka sedang berada.`,
            }
        });
        
        res.json({ result: response.text });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
