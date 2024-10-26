// content.js

console.log("Slack Text Logger: content.jsが読み込まれました。");

// 監視対象のpタグの変更を検出し、テキストをコンソールにログ出力する関数
function observeMessageChanges() {
  const editorDiv = document.querySelector("div.ql-editor");
  if (!editorDiv) {
    console.log("Slack Text Logger: div.ql-editorが見つかりませんでした。");
    return;
  }

  const pTag = editorDiv.querySelector("p");
  if (!pTag) {
    console.log("Slack Text Logger: pタグが見つかりませんでした。");
    return;
  }

  // MutationObserverのコールバック関数
  const callback = function (mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (mutation.type === "childList" || mutation.type === "characterData") {
        const currentText = pTag.innerText.trim();
        console.log("Captured Message:", currentText);
      }
    }
  };

  // オブザーバーのオプション設定
  const config = {
    characterData: true,
    childList: true,
    subtree: true,
  };

  // MutationObserverのインスタンスを作成
  const observer = new MutationObserver(callback);

  // MutationObserverをpタグではなくeditorDiv全体に設定
  observer.observe(editorDiv, config);

  console.log("Slack Text Logger: メッセージ入力の監視を開始しました。");
}

// キャプチャしたメッセージを画面左上に表示するためのdivを作成
function createDisplayDiv() {
  let displayDiv = document.getElementById('captured-message-display');
  if (!displayDiv) {
    displayDiv = document.createElement('div');
    displayDiv.id = 'captured-message-display';
    // スタイルを設定
    displayDiv.style.position = 'fixed';
    displayDiv.style.top = '10px';
    displayDiv.style.left = '10px';
    displayDiv.style.width = '300px';
    displayDiv.style.padding = '15px';
    displayDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    displayDiv.style.color = '#fff';
    displayDiv.style.borderRadius = '8px';
    displayDiv.style.zIndex = '10000';
    displayDiv.style.fontSize = '16px';
    displayDiv.style.fontFamily = 'Arial, sans-serif';
    displayDiv.style.boxShadow = '0 0 15px rgba(0,0,0,0.5)';
    displayDiv.style.maxHeight = '80vh';
    displayDiv.style.overflowY = 'auto';
    displayDiv.style.pointerEvents = 'none'; // ユーザーの操作を妨げない
    // タイトルを追加
    displayDiv.innerHTML = '<h2 style="margin-top: 0; font-size: 18px; border-bottom: 1px solid #555; padding-bottom: 5px;">Captured Message</h2><div id="captured-message-content"></div>';
    document.body.appendChild(displayDiv);
  }
  return displayDiv;
}

// メッセージを表示する関数
function displayCapturedMessage(message) {
  const displayDiv = createDisplayDiv();
  const contentDiv = displayDiv.querySelector('#captured-message-content');

  // 新しいメッセージを追加
  const messageElement = document.createElement('p');
  messageElement.textContent = message;
  messageElement.style.margin = '10px 0';
  messageElement.style.padding = '10px';
  messageElement.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
  messageElement.style.borderRadius = '4px';
  messageElement.style.wordBreak = 'break-word'; // 長い単語でも折り返す

  // 最新のメッセージを一番上に表示
  contentDiv.prepend(messageElement);
}

// DOMが完全に読み込まれた後にセットアップを開始
window.addEventListener("load", () => {
  console.log("Slack Text Logger: ページロード完了。監視を開始します。");
  // ページ内の動的な変更に対応するため、一定間隔で監視を試みる
  const intervalId = setInterval(() => {
    const editorDiv = document.querySelector("div.ql-editor");
    const pTag = editorDiv ? editorDiv.querySelector("p") : null;

    if (editorDiv && pTag) {
      observeMessageChanges();
      clearInterval(intervalId); // 監視を開始したらインターバルをクリア
    } else {
      console.log(
        "Slack Text Logger: div.ql-editorまたはpタグがまだ見つかりません。"
      );
    }
  }, 1000);
});
