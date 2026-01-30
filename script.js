const dateInput = document.getElementById("dateInput");
const shopInput = document.getElementById("shopInput");
const createListBtn = document.getElementById("createListBtn");
const listsDiv = document.getElementById("lists");

let shoppingLists = JSON.parse(localStorage.getItem("shoppingLists")) || [];

// リスト作成
createListBtn.addEventListener("click", () => {
  // お店の名前が空なら何もしない（日付は空でもOKにする）
  if (!shopInput.value.trim()) return;

  shoppingLists.push({
    // 値があれば使い、なければ空文字にする（明示的に指定）
    date: dateInput.value || "",
    shop: shopInput.value,
    items: []
  });

  // 入力欄をクリア
  dateInput.value = "";
  shopInput.value = "";

  // 【重要】スマホ用：一度日付欄に触れた後に空にした場合、
  // 表示が type="date" のまま固まらないよう強制的に text に戻す
  dateInput.type = "text";

  save();
  render();
});

// 描画
function render() {
  listsDiv.innerHTML = "";

  shoppingLists.forEach((list, listIndex) => {
    const total = list.items.reduce((sum, item) => sum + item.price, 0);
    // チェックされているアイテムがあるか確認
    const hasCheckedItems = list.items.some(item => item.done);

    const div = document.createElement("div");
    div.className = "list";

    div.innerHTML = `
      <h2>${list.date ? list.date + " / " : ""}${list.shop}</h2>
      <div class="total">合計：¥${total}</div>

      <div class="input-row">
        <input type="text" placeholder="商品名" id="name-${listIndex}">
        <input type="number" placeholder="¥" id="price-${listIndex}">
      </div>

      <button onclick="addItem(${listIndex})">商品を追加</button>

      ${list.items.map((item, itemIndex) => `
        <div class="item">
            <input type="checkbox"
            ${item.done ? "checked" : ""}
            onclick="toggleItem(${listIndex}, ${itemIndex})">
            
            <div class="item-text ${item.done ? "done" : ""}">
              ${item.name}
            </div>

            <span class="price">¥${item.price}</span>

            <button class="delete-btn"
            onclick="deleteItem(${listIndex}, ${itemIndex})">
            削除
            </button>
        </div>
      `).join("")}

      <div class="list-actions">
        ${hasCheckedItems ? `
          <button class="clear-checked-btn" onclick="deleteCheckedItems(${listIndex})">
            チェック済みを削除
          </button>
        ` : ""}
        
        <button class="delete-btn" onclick="deleteList(${listIndex})">
          このリストを削除
        </button>
      </div>
    `;

    listsDiv.appendChild(div);
  });
}

// チェック済み商品を削除する関数（script.js の末尾などに追加）
function deleteCheckedItems(listIndex) {
  if (!confirm("チェックした項目をすべて削除しますか？")) return;
  
  // done が false のものだけを残す
  shoppingLists[listIndex].items = shoppingLists[listIndex].items.filter(item => !item.done);
  
  save();
  render();
}

// 商品追加
function addItem(listIndex) {
  const nameInput = document.getElementById(`name-${listIndex}`);
  const priceInput = document.getElementById(`price-${listIndex}`);

  if (!nameInput.value || !priceInput.value) return;

  shoppingLists[listIndex].items.push({
    name: nameInput.value,
    price: Number(priceInput.value),
    done: false
  });

  nameInput.value = "";
  priceInput.value = "";

  save();
  render();
}

// チェック
function toggleItem(listIndex, itemIndex) {
  shoppingLists[listIndex].items[itemIndex].done =
    !shoppingLists[listIndex].items[itemIndex].done;

  save();
  render();
}

// 商品削除
function deleteItem(listIndex, itemIndex) {
  if (!confirm("この項目を本当に削除してもよろしいですか？")) return;

  shoppingLists[listIndex].items.splice(itemIndex, 1);
  save();
  render();
}

// リスト削除
function deleteList(listIndex) {
  if (!confirm("このお買い物リストを本当に削除してもよろしいですか？")) return;

  shoppingLists.splice(listIndex, 1);
  save();
  render();
}

const themeToggle = document.getElementById("themeToggle");

// ページ読み込み時に保存されたテーマを適用
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  themeToggle.textContent = "☀️"; // 太陽アイコンに
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  
  // 現在のモードを保存
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
    themeToggle.textContent = "☀️";
  } else {
    localStorage.setItem("theme", "light");
    themeToggle.textContent = "🌙";
  }
});

// 保存
function save() {
  localStorage.setItem("shoppingLists", JSON.stringify(shoppingLists));
}

// 初期表示
render();
