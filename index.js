import express from "express";
import dotenv from "dotenv";
import Bard from "bard-ai";
import cors from "cors"; // Import paket cors

dotenv.config({ path: ".env" });

const app = express();

// Gunakan cors middleware
app.use(cors());

app.get("/anime", async (req, res) => {
  const info = req.query.info;

  const myBard = new Bard(process.env.BARD_SESSION_KEY);

  const answer = await myBard.ask(
    `${info} cerita soal apa? pakai bahasa indonesia ya`
  );

  res.json({ answer });
});

app.listen(3000, () => {
  console.log("Server berjalan di port 3000");
});
