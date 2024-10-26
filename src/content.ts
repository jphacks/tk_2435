import { checkWithAI } from "./apiHandler";
import { dangerousWords as localWords } from "./dangerousWords";

// SVGファイル名を取得する関数
async function getSvgFileNames(): Promise<string[]> {return ['blue_cry.svg'];
}

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

  // SVGを表示するための親要素を作成
  const svgContainer = document.createElement("div");
  console.log(textArea.getBoundingClientRect().top);
  svgContainer.style.position = "absolute";
  svgContainer.style.top = (textArea.getBoundingClientRect().top + window.scrollY) + "px";
  svgContainer.style.right = "0"; // 右上に揃えるために右を0に設定
  svgContainer.style.pointerEvents = "none"; // テキストエリアの操作を妨げない

  // SVGファイル名を取得
  const svgFileNames = await getSvgFileNames();

  // SVGを追加
  svgFileNames.forEach((fileName) => {
    const svgImage = document.createElement("img");
    svgImage.src = `slack-capture/image/${fileName}`; // SVGのパスを指定
    svgImage.style.width = "50px"; // SVGの幅を指定
    svgImage.style.height = "50px"; // SVGの高さを指定
    svgImage.style.marginLeft = "5px"; // SVGの間隔を指定
    svgContainer.appendChild(svgImage);
  });

  // SVGコンテナをテキストエリアの親要素に追加
  textArea.parentNode?.insertBefore(svgContainer, textArea.nextSibling);

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
