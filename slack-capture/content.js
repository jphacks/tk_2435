// content.js

console.log("Slack Text Logger: content.jsが読み込まれました。");

let currentPath = window.location.pathname;

// 不適切な言葉と代替フレーズのマッピングを定義
const badWords = {
  しろよ: "してみれば？",
  遅い: "時間がかかっているけど大丈夫？",
  まだなのか: "もう少しお待ちいただけますか？",
};

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

  // 初期のメッセージを処理
  const initialText = pTag.innerText.trim();
  processText(initialText);

  // MutationObserverのコールバック関数
  const callback = (mutationsList) => {
    for (let mutation of mutationsList) {
      if (mutation.type === "childList" || mutation.type === "characterData") {
        const currentText = pTag.innerText.trim();
        console.log("Slack Text Logger: メッセージが変更されました。");
        console.log("Captured Message:", currentText);

        processText(currentText);
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

function processText(currentText) {
  // 不適切な言葉が含まれているかチェック
  const foundBadWords = Object.keys(badWords).filter((word) =>
    currentText.includes(word)
  );

  // メッセージを表示
  displayCapturedMessage(currentText, foundBadWords);

  if (foundBadWords.length > 0) {
    // 該当する不適切な言葉と代替フレーズを表示
    const suggestions = foundBadWords.map(
      (word) => `${word} → ${badWords[word]}`
    );
    displaySuggestions(suggestions);
  } else {
    // サジェスチョンをクリア
    clearSuggestions();
  }
}

// メッセージ内の不適切な言葉に赤い下線を引く関数
function highlightBadWords(message, foundBadWords) {
  let highlightedMessage = message;

  if (foundBadWords.length === 0) {
    return highlightedMessage;
  }

  // エスケープされた不適切な言葉を格納する配列
  const escapedBadWords = foundBadWords.map((word) =>
    word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );

  // 正規表現を作成
  const regex = new RegExp(`(${escapedBadWords.join("|")})`, "gi");

  // メッセージ内の不適切な言葉を置換
  highlightedMessage = highlightedMessage.replace(regex, (match) => {
    return `<span class="bad-word">${match}</span>`;
  });

  return highlightedMessage;
}

// キャプチャしたメッセージを画面に表示する関数
const displayCapturedMessage = (message, foundBadWords) => {
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

    // 不適切な言葉をハイライト
    const highlightedMessage = highlightBadWords(message, foundBadWords);

    // 新しいメッセージを追加
    const messageElement = document.createElement("p");
    messageElement.innerHTML = highlightedMessage; // innerText を innerHTML に変更

    // メッセージを追加
    contentDiv.appendChild(messageElement);
    console.log(
      "Slack Text Logger: メッセージが displayDiv に追加されました。"
    );
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

    // `div.ql-editor` を取得
    const editorDiv = document.querySelector("div.ql-editor");
    if (editorDiv && editorDiv.parentNode) {
      // 親要素に `position: relative` を設定
      editorDiv.parentNode.style.position = "relative";
      // 親要素の最初の子要素として挿入
      editorDiv.parentNode.insertBefore(
        displayDiv,
        editorDiv.parentNode.firstChild
      );
      console.log(
        "Slack Text Logger: displayDiv が editorDiv の親要素に挿入されました。"
      );
    } else {
      console.log(
        "Slack Text Logger: editorDiv が見つからなかったため、body に追加します。"
      );
      document.body.appendChild(displayDiv);
    }
  } else {
    console.log("Slack Text Logger: displayDiv が既に存在します。");
  }
  return displayDiv;
};

// サジェスチョンを表示する関数
const displaySuggestions = (suggestions) => {
  const suggestionsDiv = createSuggestionsDiv();
  if (!suggestionsDiv) {
    console.log("Slack Text Logger: suggestionsDiv が作成されませんでした。");
    return;
  }
  const contentDiv = suggestionsDiv.querySelector("#suggestions-content");
  if (!contentDiv) {
    console.log("Slack Text Logger: contentDiv が見つかりませんでした。");
    return;
  }

  // 以前の内容をクリア
  contentDiv.innerHTML = "";

  // サジェスチョンを追加
  suggestions.forEach((suggestion) => {
    const suggestionElement = document.createElement("p");
    suggestionElement.textContent = suggestion;
    contentDiv.appendChild(suggestionElement);
  });
};

// サジェスチョン表示用のdivを作成または取得する関数
const createSuggestionsDiv = () => {
  let suggestionsDiv = document.getElementById("suggestions-display");
  if (!suggestionsDiv) {
    suggestionsDiv = document.createElement("div");
    suggestionsDiv.id = "suggestions-display";
    // タイトルを追加
    suggestionsDiv.innerHTML =
      '<h2>Suggestions</h2><div id="suggestions-content"></div>';

    // `captured-message-display` の下に挿入
    const displayDiv = document.getElementById("captured-message-display");
    if (displayDiv && displayDiv.parentNode) {
      displayDiv.parentNode.insertBefore(
        suggestionsDiv,
        displayDiv.nextSibling
      );
    } else {
      document.body.appendChild(suggestionsDiv);
    }
  }
  return suggestionsDiv;
};

// サジェスチョンをクリアする関数
const clearSuggestions = () => {
  const suggestionsDiv = document.getElementById("suggestions-display");
  if (suggestionsDiv) {
    const contentDiv = suggestionsDiv.querySelector("#suggestions-content");
    if (contentDiv) {
      contentDiv.innerHTML = "";
    }
  }
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
