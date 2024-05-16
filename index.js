import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // Import paket corsimp
import Groq from "groq-sdk";

dotenv.config({ path: ".env" });

const app = express();

// Gunakan cors middleware
app.use(cors());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.get("/anime", async (req, res) => {
  const { question } = req.query;
  const response = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "Nama kamu adalah NakaAI dan kamu hanya menjawab seputar anime, dan balas yang pakai bahasa indonesia.",
      },
      { role: "user", content: question },
    ],
    model: "llama3-70b-8192",
  });

  res.json({ answer: response.choices[0].message.content });
});

// Endpoint untuk menerima pesan dan mengirim balasan
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    // Kirim pesan ke Groq dan dapatkan balasan
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: message }],
      model: "mixtral-8x7b-32768", // Ganti dengan model yang Anda inginkan
    });

    // Kirim balasan ke pengguna
    res.json({ reply: chatCompletion.choices[0].message.content });
  } catch (error) {
    console.error("Error during chat completion:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, () => {
  console.log("Server berjalan di port 3000");
});
