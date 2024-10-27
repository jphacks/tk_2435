module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    "no-unused-vars": "warn", // 未使用の変数を警告に変更
    "max-len": ["error", { code: 80 }], // 最大行長を80に設定
    quotes: ["error", "double"],
    // 他のルールを追加
  },
};
