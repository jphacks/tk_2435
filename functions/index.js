
// const serviceAccount =  require('./.cert/gemini-firebase-chrome-firebase-adminsdk-z9eb7-57efa56c24.json');
// const admin =  require("firebase-admin");
// const functions =  require("firebase-functions/v2");
// const { defineString } = require('firebase-functions/params');
// const fetch =  require("node-fetch");
// const geminiApi = defineString('GEMINI_API_KEY');
// const genAI = new GoogleGenerativeAI(geminiApi);
// const {
//     GoogleGenerativeAI,
//     HarmCategory,
//     HarmBlockThreshold,
//   } = require("@google/generative-ai");
// const model = genAI.getGenerativeModel({
//     model: "gemini-1.5-flash",
//     systemInstruction: "機能: あなたは入力された内容でハラスメントになりそうな言い回しや内容を検知して, 該当する入力部分とその部分の修正案を返します. さらにその入力された文章を会話の相手が読んだ時にどんな気持ちになるかを検知してください.\n\n詳細な説明: 相手の気持ちの種類は \"cry\", \"happy\", \"surprise\", \"question\", \"pain\" です.\n入力された内容を相手が読んでその気持ちになりそうなら true を そうでなないなら false を返してください.\n\n出力フォーマットは以下で, \"hoge\" は出力内容によって置き換えてください.\n\n{\n  \"content\": {\n    \"該当する入力部分\": \"hoge\",\n    \"その修正案\": \"hoge\",\n  },\n\n  \"emotions\": {\n    \"cry\": false,\n    \"happy\": false,\n    \"surprise\": false,\n    \"question\": false,\n    \"pain\": false,\n  }\n}",
//   });
// const generationConfig = {
//     temperature: 1,
//     topP: 0.95,
//     topK: 64,
//     maxOutputTokens: 8192,
//     responseMimeType: "application/json",
//   };
//   // const logger = await import("firebase-functions");
//   // const getFirestore =  require("firebase-admin/firestore");


// // Initialise firebase app (firebase function)...maybe not needed
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });



const express = require("express");
const app = express();
const port = 3000

app.post('/', (req, res) => {
    res.send('Hello World!')
  })
  
app.listen(port, () => {
console.log(`Example app listening on port ${port}`)
})

// Accepting http request from the chrome extension
//   async function talkToGemeni() {
//     const chatSession = model.startChat({
//       generationConfig,
//       history: [
//       ],
//     });
  
//     let INPUT_MESSAGE =  "hoge hoge"

//     const result = await chatSession.sendMessage(INPUT_MESSAGE);
//     console.log(result.response.text());


//   }






// exports.sendToGemini = functions.https.onRequest(async (req, res) => {
//   try {
//     const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${geminiApi}`,
//       },
//       body: JSON.stringify(req.body),
//     });

//     const data = await response.json();
//     res.status(200).send(data);
//   } catch (error) {
//     console.error("Error calling Gemini API:", error);
//     res.status(500).send({error: "Failed to communicate with Gemini API"});
//   }
// });
//   run();