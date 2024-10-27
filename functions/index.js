const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

// 修正: functions.database.ref を admin.database().ref に変更
exports.processMessage = functions.database
  .ref("/messages/inputMessage")
  .onWrite(async (change) => {
    const messageData = change.after.val();

    if (!messageData) {
      console.log("No data found.");
      return null;
    }

    const inputText = messageData.text;

    // Gemini API の設定
    const genAI = new GoogleGenerativeAI(functions.config().gemini.apikey);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction:
        "あなたは入力内容でハラスメントになりそうな言い回しを検知して、該当する入力部分とそれの修正案を返します。返すフォーマットはJSONです。",
    });

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };

    try {
      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });

      const result = await chatSession.sendMessage(inputText);

      const response = await result.response.text();
      const responseText = response; // Assign to a new variable

      // 結果をデータベースに書き込む
      const resultRef = admin.database().ref("messages/outputMessage"); // ここは正しい
      await resultRef.set({
        text: responseText,
        timestamp: Date.now(),
      });

      return null;
    } catch (error) {
      console.error("Error processing message:", error);
      return null;
    }
  });
