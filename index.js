import express from "express";
import dotenv from "dotenv";
import Bard from "bard-ai";

dotenv.config({ path: ".env" }); // Secara default mencari file .env di root direktori

const app = express();

app.get("/anime", async (req, res) => {
  // Dapatkan nilai episodeNumber dari URL
  const info = req.query.info;

  // Buat objek Bard baru
  const myBard = new Bard(process.env.BARD_SESSION_KEY);

  // Minta jawaban dari Bard
  const answer = await myBard.ask(`${info} cerita soal apa?`);

  // Kirim jawaban ke klien
  res.json({ answer });
});

app.listen(3000, () => {
  console.log("Server berjalan di port 3000");
});
