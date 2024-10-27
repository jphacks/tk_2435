const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.captureMessage = functions.https.onRequest(async (req, res) => {
  const message = req.body.text;
  if (!message) {
    return res.status(400).send("No message provided");
  }

  try {
    await admin.firestore().collection("messages").add({
      text: message,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    return res.status(200).send("Message saved successfully");
  } catch (error) {
    console.error("Error saving message:", error);
    return res.status(500).send("Error saving message");
  }
});
