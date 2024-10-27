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


let emoIcons = {
  grey: {
    "cry": "https://i.ibb.co/BwYyyCr/cry.png",
    "happy": "https://i.ibb.co/xskMcz8/happy.png",
    "surprise": "https://i.ibb.co/sw78pms/surprise.png",
    "question": "https://i.ibb.co/rf3W5V0/question.png",
    "pain": "https://i.ibb.co/z4PKzhS/pain.png",
  },
  color: {
    "cry": "https://i.ibb.co/2WzNTJh/blue-cry.png",
    "happy": "https://i.ibb.co/vvM4sqJ/pink-happy.png",
    "surprise": "https://i.ibb.co/nn9S0zf/orenge-suprise.png",
    "question": "https://i.ibb.co/5GkGbrx/yellow-question.png",
    "pain": "https://i.ibb.co/ZJs0NT1/purple-pain.png",
  }
};

const insertEmoIcons = () =>{

  const targetElement = document.querySelector("div.p-composer__body");

  if (targetElement) {
      // Create a container to hold the images
      const container = document.createElement("div");
      container.style.display = "flex";
      container.style.gap = "10px"; 

    // const dicLength = Object.keys(emoIcons["grey"]).length;
    // Loop through the image URLs and add each as an <img> element
    for (let key in emoIcons.grey) {
        const img = document.createElement("img");
        img.src = `${emoIcons.grey[key]}`;
        img.style.width = "30px";
        img.style.height = "auto";
        img.id = `grey-${key}`
        container.appendChild(img);
    }
    
    targetElement.appendChild(container);
    } else {
        console.error("Target element not found.");
    }
};


const switchEmotions = (emotions) => {
  if (emotions["cry"]){
    const img = document.getElementById("grey-cry");
    img.src = `${emoIcons.color["cry"]}`;
    console.log(img.src)
  }else{
    console.log("hoge")

  }
}

let jsonSample

const emoIconChangeButton = () => {
  const targetElement = document.querySelector("div.p-composer__body");

  jsonSample = '{ "content": { "該当する入力部分": "すぐに", "その修正案": "なるべく早く" }, ' +
  '"emotions": { "cry": true, "happy": false, "surprise": false, "question": false, "pain": true } }';

  let jsonObj = JSON.parse(jsonSample);
  let emotions = jsonObj.emotions;

  if (targetElement) {
    const button = document.createElement("button");
    button.textContent = "Change Emoji"; // Add text to the button
    targetElement.appendChild(button);
    button.addEventListener('click', function() {
      switchEmotions(emotions);
    }, false);
  } else {
    console.error("Target element not found.");
  }
};



// 初期化関数
const initialize = () => {
  console.log("Slack Text Logger: 初期化を開始します。");
  observeMessageChanges();
  monitorChannelChange();
  insertEmoIcons();
  emoIconChangeButton();
};

// DOMが完全に読み込まれた後にセットアップを開始
window.addEventListener("load", () => {
  console.log("Slack Text Logger: ページロード完了。初期化を開始します。");
  initialize();
});



