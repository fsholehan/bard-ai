import express from "express";
import dotenv from "dotenv";
import Bard from "bard-ai";
import cors from "cors"; // Import paket corsimp
import ollama from "ollama";

dotenv.config({ path: ".env" });

const app = express();

// Gunakan cors middleware
app.use(cors());

app.get("/anime", async (req, res) => {
  const response = await ollama.chat({
    model: "llama2",
    messages: [{ role: "user", content: "Why is the sky blue?" }],
  });
  console.log(response.message.content);

  res.json({ answer: response.message.content });
});

app.get("/ask", async (req, res) => {
  const { question } = req.query;
  const myBard = new Bard(process.env.BARD_SESSION_KEY);
  let myChat = myBard.createChat();

  try {
    const answer = await myChat.ask(question);
    res.json({ answer });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.listen(3000, () => {
  console.log("Server berjalan di port 3000");
});
