/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// HTTPリクエストを処理するエンドポイント
exports.sendMessage = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const message = req.body.message; // リクエストボディからメッセージを取得

  // Firestoreにメッセージを保存する例
  try {
    const docRef = await admin
      .firestore()
      .collection("messages")
      .add({ text: message });
    return res.status(200).send(`Message sent with ID: ${docRef.id}`);
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).send("Internal Server Error");
  }
});
