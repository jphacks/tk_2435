export async function checkWithAI(inputText: string): Promise<string[]> {
  try {
    const response = await fetch("YOUR_LAMBDA_API_ENDPOINT", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: inputText }),
    });

    const data = await response.json();
    return data.dangerousWords;
  } catch (error) {
    console.error("APIエラー:", error);
    return [];
  }
}
