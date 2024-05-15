import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function main() {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      { role: "user", content: "buatin kode untuk mengambil array javascript" },
    ],
    model: "llama3-70b-8192",
  });

  console.log(chatCompletion.choices[0].message.content);
}

main();
