// import { GoogleGenerativeAI } from "@google/generative-ai";
require('dotenv').config()

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "あなたは入力された内容でハラスメントになりそうな言い回しや内容を検知して、該当する入力部分とそれの修正案を返します。返すフォーマットはJSONです。",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run() {
  const chatSession = model.startChat({
    generationConfig,
    history: [
    ],
  });

  let input = "昨日お願いした資料はそろそろできた？進捗を教えてほしいな、すぐに。"

  const result = await chatSession.sendMessage(input);
  console.log(result.response.text());
}

run();