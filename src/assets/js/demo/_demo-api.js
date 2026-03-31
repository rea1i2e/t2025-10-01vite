/**
 * デモページ: JSONPlaceholder users API（`fetch` + `li` 生成）
 * 対象: `[data-demo-api-users]` + `[data-demo-api-status]`
 */

// リストの出力場所
const list = document.querySelector("[data-demo-api-users]");

// 取得状況の表示場所
const statusEl = document.querySelector("[data-demo-api-status]");

if (list && statusEl) {

  // APIのURL
  const API_URL = "https://jsonplaceholder.typicode.com/users?_limit=5";

  async function loadUsers() {
    try {
      statusEl.textContent = "";
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("通信に失敗しました");
      }
      const users = await response.json();
      if (!Array.isArray(users)) {
        throw new Error("不正なレスポンス");
      }
      for (const user of users) {
        const li = document.createElement("li");
        li.textContent =
          typeof user.name === "string" ? user.name : "";
        list.appendChild(li);
      }
      statusEl.textContent = "読み込み完了";
    } catch (error) {
      statusEl.textContent = "エラーが発生しました";
      console.error(error);
    }
  }

  loadUsers();
}
