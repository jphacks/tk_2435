const fetch = require("node-fetch");

exports.handler = async (event) => {
  const { text } = JSON.parse(event.body);

  try {
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        prompt: `次のテキスト内の危険なワードをリストアップしてください：「${text}」`,
        max_tokens: 50,
      }),
    });

    const data = await response.json();
    const dangerousWords = data.choices[0].text
      .split(",")
      .map((word) => word.trim());

    return {
      statusCode: 200,
      body: JSON.stringify({ dangerousWords }),
    };
  } catch (error) {
    console.error("APIエラー:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "エラーが発生しました" }),
    };
  }
};
