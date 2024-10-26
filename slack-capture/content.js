// content.js

console.log("Slack Text Logger: content.jsが読み込まれました。");

/**
 * メッセージ入力欄の変化を監視し、メッセージをキャプチャする関数
 */
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
        if (currentText.length > 0) {
          // 空メッセージを除外
          console.log("Slack Text Logger: Mutation detected.");
          console.log("Captured Message:", currentText);
          displayCapturedMessage(currentText); // メッセージを表示
        }
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

  // MutationObserverをeditorDiv全体に設定
  observer.observe(editorDiv, config);

  console.log("Slack Text Logger: メッセージ入力の監視を開始しました。");
}

/**
 * キャプチャしたメッセージを画面に表示する関数
 * 最新のメッセージのみを表示し、以前のメッセージを削除します
 * @param {string} message - キャプチャしたメッセージ
 */
function displayCapturedMessage(message) {
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
    console.log(
      "Slack Text Logger: メッセージが displayDiv に追加されました。"
    );
  } catch (error) {
    console.error(
      "Slack Text Logger: displayCapturedMessage 関数でエラーが発生しました。",
      error
    );
  }
}

/**
 * メッセージ表示用のdivを作成または取得する関数
 * 指定されたツールバーdivの上に挿入します
 * @returns {HTMLElement} - メッセージ表示用のdiv
 */
function createDisplayDiv() {
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
}

/**
 * DOMが完全に読み込まれた後にセットアップを開始する
 */
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
