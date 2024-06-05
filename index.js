import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // Import paket corsimp
import Groq from "groq-sdk";
import bodyParser from "body-parser";

dotenv.config({ path: ".env" });

const app = express();
app.use(bodyParser.json());

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

let conversationContext = [];

// Endpoint untuk menerima pesan dan mengirim balasan
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    // Tambahkan instruksi sistem untuk fokus pada anime
    const systemMessage = {
      role: "system",
      content:
        "Nama kamu adalah NakaAI dan pokoknya kamu adalah orang yang paling paham soal anime dan manga, dan jawabnya harus pake indonesia",
    };

    // Tambahkan pesan pengguna ke konteks percakapan
    conversationContext.push(systemMessage);
    conversationContext.push({ role: "user", content: message });

    // Kirim pesan ke Groq dan dapatkan balasan
    const chatCompletion = await groq.chat.completions.create({
      messages: conversationContext,
      model: "llama3-70b-8192", // Ganti dengan model yang Anda inginkan
    });

    // Dapatkan balasan dari AI dan tambahkan ke konteks
    const aiReply = chatCompletion.choices[0].message.content;
    conversationContext.push({ role: "system", content: aiReply });

    // Kirim balasan ke pengguna
    res.json({ reply: aiReply });

    // Bersihkan konteks setelah beberapa waktu atau berdasarkan logika tertentu
    // conversationContext = []; // Uncomment untuk membersihkan konteks
  } catch (error) {
    console.error("Error during chat completion:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint untuk menerima pesan dan mengirim balasan
app.post("/chit-chat", async (req, res) => {
  try {
    const { message } = req.body;

    // Tambahkan instruksi sistem untuk fokus pada anime
    const systemMessage = {
      role: "system",
      content:
        "Nama kamu adalah FS Chat, kamu bisa segala yang kamu bisa. prioritas jawabny pake bahasa indonesia.",
    };

    // Tambahkan pesan pengguna ke konteks percakapan
    conversationContext.push(systemMessage);
    conversationContext.push({ role: "user", content: message });

    // Kirim pesan ke Groq dan dapatkan balasan
    const chatCompletion = await groq.chat.completions.create({
      messages: conversationContext,
      model: "llama3-70b-8192", // Ganti dengan model yang Anda inginkan
    });

    // Dapatkan balasan dari AI dan tambahkan ke konteks
    const aiReply = chatCompletion.choices[0].message.content;
    conversationContext.push({ role: "system", content: aiReply });

    // Kirim balasan ke pengguna
    res.json({ reply: aiReply });

    // Bersihkan konteks setelah beberapa waktu atau berdasarkan logika tertentu
    // conversationContext = []; // Uncomment untuk membersihkan konteks
  } catch (error) {
    console.error("Error during chat completion:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, () => {
  console.log("Server berjalan di port 3000");
});
