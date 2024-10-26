import { checkWithAI } from "./apiHandler";
import { dangerousWords as localWords } from "./dangerousWords";

// 危険ワードが含まれると赤線を引く関数
async function checkForDangerousWords(
  textArea: HTMLTextAreaElement | HTMLInputElement
): Promise<void> {
  const originalText = textArea.value;
  const aiWords = await checkWithAI(originalText); // AIで危険ワードをチェック
  const dangerousWords = [...new Set([...localWords, ...aiWords])]; // ローカルとAIの危険ワードを統合

  let highlightedText = originalText;
  dangerousWords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    highlightedText = highlightedText.replace(
      regex,
      `<span style="color: red; text-decoration: underline;">${word}</span>`
    );
  });

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = highlightedText;

  textArea.style.color = "black";
  textArea.style.position = "relative";

  const parentDiv = document.createElement("div");
  parentDiv.style.position = "absolute";
  parentDiv.style.width = "100%";
  parentDiv.style.height = "100%";
  parentDiv.style.pointerEvents = "none";
  parentDiv.innerHTML = tempDiv.innerHTML;

  textArea.parentNode?.insertBefore(parentDiv, textArea.nextSibling);
}

// テキストエリアを監視する関数
function monitorTextArea(): void {
  const textAreas = document.querySelectorAll("textarea, input[type='text']");
  textAreas.forEach((textArea) => {
    textArea.addEventListener("input", async () => {
      await checkForDangerousWords(
        textArea as HTMLTextAreaElement | HTMLInputElement
      );
    });
  });
}

document.addEventListener("DOMContentLoaded", monitorTextArea);
