// content.js

console.log("Slack Text Logger: content.jsが読み込まれました。");

let currentPath = window.location.pathname;

// チャンネル変更を監視して、必要に応じて監視を再設定する関数
const monitorChannelChange = () => {
  let lastPath = currentPath;

  // 定期的にURLのパス部分をチェック
  setInterval(() => {
    currentPath = window.location.pathname;
    if (currentPath !== lastPath) {
      console.log("Slack Text Logger: チャンネルが変更されました。");
      lastPath = currentPath;
      // 既存の監視を停止して、新しいメッセージ入力欄を監視
      observeMessageChanges();
    }
  }, 1000);
};

// メッセージ入力欄の変化を監視し、メッセージをキャプチャする関数
let messageObserver = null;

const observeMessageChanges = () => {
  // 既存のオブザーバーがある場合は切断
  if (messageObserver) {
    messageObserver.disconnect();
    console.log("Slack Text Logger: 既存のMutationObserverを切断しました。");
  }

  const editorDiv = document.querySelector("div.ql-editor");
  if (!editorDiv) {
    console.log(
      "Slack Text Logger: div.ql-editorが見つかりませんでした。再試行します。"
    );
    setTimeout(observeMessageChanges, 1000);
    return;
  }

  const pTag = editorDiv.querySelector("p");
  if (!pTag) {
    console.log(
      "Slack Text Logger: pタグが見つかりませんでした。再試行します。"
    );
    setTimeout(observeMessageChanges, 1000);
    return;
  }

  // メッセージを初期化
  const initialText = pTag.innerText.trim();
  displayCapturedMessage(initialText);

  // MutationObserverのコールバック関数
  const callback = (mutationsList) => {
    for (let mutation of mutationsList) {
      if (mutation.type === "childList" || mutation.type === "characterData") {
        const currentText = pTag.innerText.trim();
        console.log("Slack Text Logger: メッセージが変更されました。");
        console.log("Captured Message:", currentText);
        displayCapturedMessage(currentText); // メッセージを表示
      }
    }
  };

  // オブザーバーのオプション設定
  const config = {
    characterData: true,
    childList: true,
    subtree: true,
  };

  // 新しいMutationObserverのインスタンスを作成
  messageObserver = new MutationObserver(callback);

  // MutationObserverをeditorDiv全体に設定
  messageObserver.observe(editorDiv, config);

  console.log("Slack Text Logger: メッセージ入力の監視を開始しました。");
};

const GEMINI_API_KEY = "AIzaSyCtw3Z-Nk-U1-ITZcaqz341NJg9aKV0XhI"; // ここにあなたのAPIキーを入力してください
const API_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta2/models/chat-bison-001:generateMessage?key=" +
  GEMINI_API_KEY; // 新しいAPIエンドポイント形式

// キャプチャしたメッセージを画面に表示する関数
const displayCapturedMessage = (message) => {
  try {
    console.log(
      "Slack Text Logger: displayCapturedMessage 関数が呼び出されました。"
    );
    const displayDiv = createDisplayDiv();
    if (!displayDiv) {
      console.log("Slack Text Logger: displayDiv が作成されませんでした。");
      return;
    }
    const contentDiv = displayDiv.querySelector("#captured-message-content");
    if (!contentDiv) {
      console.log("Slack Text Logger: contentDiv が見つかりませんでした。");
      return;
    }

    // 以前のメッセージをクリア
    contentDiv.innerHTML = "";

    // 新しいメッセージを追加
    const messageElement = document.createElement("p");
    messageElement.textContent = message;

    // メッセージを追加
    contentDiv.appendChild(messageElement);

    // 送信ボタンが既に存在するか確認
    let sendButton = displayDiv.querySelector("button");
    if (!sendButton) {
      // 送信ボタンを作成
      sendButton = document.createElement("button");
      sendButton.textContent = "送信";
      sendButton.style.marginLeft = "10px"; // ボタンとメッセージの間にスペースを追加
      sendButton.onclick = () => {
        console.log("送信ボタンがクリックされました。メッセージ:", message);
        // Geminiの関数を呼び出す
        const feedback = callGeminiFunction(message); // Geminiの関数を呼び出す
        displayFeedback(feedback); // フィードバックを表示
      };

      // フレックスボックスを設定
      const flexContainer = document.createElement("div");
      flexContainer.style.display = "flex";
      flexContainer.style.alignItems = "center"; // 垂直方向の中央揃え
      flexContainer.appendChild(contentDiv);
      flexContainer.appendChild(sendButton);

      // フレックスコンテナをdisplayDivに追加
      displayDiv.appendChild(flexContainer);
    }

    console.log(
      "Slack Text Logger: メッセージが displayDiv に追加されました。"
    );

    // Gemini APIにハラスメント判定を問い合わせ
    checkHarassment(message);
  } catch (error) {
    console.error(
      "Slack Text Logger: displayCapturedMessage 関数でエラーが発生しました。",
      error
    );
  }
};

// メッセージ表示用のdivを作成または取得する関数
const createDisplayDiv = () => {
  console.log("Slack Text Logger: createDisplayDiv 関数が呼び出されました。");
  let displayDiv = document.getElementById("captured-message-display");
  if (!displayDiv) {
    console.log(
      "Slack Text Logger: displayDiv が存在しないため、新規作成します。"
    );
    displayDiv = document.createElement("div");
    displayDiv.id = "captured-message-display";
    // タイトルを追加
    displayDiv.innerHTML =
      '<h2>Captured Message</h2><div id="captured-message-content"></div>';

    // ツールバーdivを特定してその上に挿入
    const toolbarDiv = document.querySelector(
      'div[role="toolbar"][aria-label="プライマリビューのアクション"]'
    );
    if (toolbarDiv) {
      toolbarDiv.parentNode.insertBefore(displayDiv, toolbarDiv);
      console.log(
        "Slack Text Logger: displayDiv が toolbarDiv の上に挿入されました。"
      );
    } else {
      console.log(
        "Slack Text Logger: toolbarDiv が見つかりませんでした。displayDiv を body に追加します。"
      );
      document.body.appendChild(displayDiv);
    }
  } else {
    console.log("Slack Text Logger: displayDiv が既に存在します。");
  }
  return displayDiv;
};

// 初期化関数
const initialize = () => {
  console.log("Slack Text Logger: 初期化を開始します。");
  observeMessageChanges();
  monitorChannelChange();
};

// DOMが完全に読み込まれた後にセットアップを開始
window.addEventListener("load", () => {
  console.log("Slack Text Logger: ページロード完了。初期化を開始します。");
  initialize();
});
