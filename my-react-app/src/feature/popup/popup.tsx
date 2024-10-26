import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios, { AxiosResponse } from "axios"; // APIを叩くのにaxiosを使用
import { useForm } from "react-hook-form"; // formを使うためにreact-hook-formを使用
import chrome from "chrome";

// GitHubのユーザー名を取得するための型
// GitHubのページに居れば自動的にユーザー名を取得し
// それ以外のページではフォームにユーザー名を入力すれば、結果を表示することが出来る。
type FormData = {
  username: string;
};

declare var chrome: any;

const Popup = () => {
  const [username, setUsername] = useState<string>("");
  const [currentStats, setCurrentStats] = useState<AxiosResponse>();
  const [currentTopLanguage, setCurrentTopLanguage] = useState<AxiosResponse>();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  // フォームに直接ユーザー名を入れてsubmitしたときに走る関数
  const onSubmit = handleSubmit((data) => {
    console.log(data["username"]);
    setUsername(data["username"]);
  });

  // useEffectは2つに分けている。こちらは初期化時のみに発火
  useEffect(() => {
    // chrome.**でchrome extension特有の動作を行える。詳しくは公式ドキュメント参照。
    // ここではアクティブなタブのURLを取得して
    // GitHubのユーザー名を取得してusernameにセットしている
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentURL = tabs[0].url as string;
      const name = getGitHubUsername(currentURL) as string;
      setUsername(name);
      setValue("username", name);
    });
  }, []);

  // こちらはusernameを監視しているuseEffect
  // useEffect内で非同期処理したいときは、関数を別にして後から呼ぶようにする
  useEffect(() => {
    const fetch = async (username: string) => {
      const stats = await getGitHubStats(username);
      const lang = await getGitHubTopLanguage(username);
      setCurrentTopLanguage(lang);
      setCurrentStats(stats);
    };
    console.log(username);
    // usernameが空かundefinedの時はfetchしないようにする
    // これやらないと初回のusernameのfetch処理と、username取得後のfetchと
    // 処理が2回走って、たいていはエラーになる方が後から返却されるので
    // 表示もエラーになる
    if (username !== "" && username !== undefined) {
      console.log(username);
      fetch(username);
    }
  }, [username]);

  // statsのAPI叩いているだけ。将来的には他のパラメータを選択出来るようにしたい。
  const getGitHubStats = async (username: string) => {
    const response = await axios.get(
      `https://github-readme-stats.vercel.app/api?username=${username}&count_private=true&show_icons=true`
    );
    return response;
  };

  // top-langsのAPI叩いているだけ。こちらもレイアウトとか変えれるようにすると良さそう。
  const getGitHubTopLanguage = async (username: string) => {
    const response = await axios.get(
      `https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact`
    );
    return response;
  };

  // ここはchrome.tab~~で受け取ったurlをstring -> urlObjに変換して、hostnameを取得
  // そのあともしそれがgithub.comだったらその次のURLに含まれるユーザー名を取得している
  // GitHubじゃなかったらundefined
  const getGitHubUsername = (url: string) => {
    const urlObj = new URL(url);
    console.log(urlObj.hostname);
    if (urlObj.hostname === "github.com") {
      return urlObj.pathname.split("/")[1];
    }
  };

  return (
    <>
      <h1>GitHub Language Stats Extension</h1>
      <div dangerouslySetInnerHTML={{ __html: currentStats?.data }} />
      <div dangerouslySetInnerHTML={{ __html: currentTopLanguage?.data }} />
      <form onSubmit={onSubmit}>
        <label>GitHub username </label>
        <input {...register("username")} placeholder="GitHub username" />
        <input type="submit" />
      </form>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
