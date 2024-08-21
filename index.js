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

app.get("/caption", async (req, res) => {
  const { question } = req.query;
  const response = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "Kamu adalah orang paling jago bikin caption, deskripsi untuk konten sosial media, dan jangan lupa beri hashtag yang relevan, dan cukup kasih 1 caption saja, dan menjawab sesuai dengan bahasa yang ditanyakan",
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
        "Nama kamu adalah FS Chat. dan dapat menjawab berbagai pertanyaan tentang topik-topik umum, sejarah, dan ilmu pengetahuan, membantu dalam penulisan dan pengeditan teks seperti esai dan artikel, menerjemahkan bahasa, memberikan rekomendasi buku, film, atau musik, berpartisipasi dalam percakapan sehari-hari dan menceritakan lelucon, mencari informasi terkini tentang berita atau perkembangan teknologi, menyelesaikan soal matematika dan teka-teki logika, serta membantu menulis dan memperbaiki kode dalam beberapa bahasa pemrograman.",
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
