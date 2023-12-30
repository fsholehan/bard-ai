import Bard from "bard-ai";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

let myBard = new Bard(process.env.BARD_SESSION_KEY);

let myChat = myBard.createChat();
console.log(await myChat.ask("How are you?"));
console.log(await myChat.ask("What's the last thing I said?"));
