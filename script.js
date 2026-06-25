const dateInput = document.getElementById("dateInput");
const shopInput = document.getElementById("shopInput"); // HTMLのidはそのまま、中身をタイトルとして扱います
const useDateCheckbox = document.getElementById("useDateCheckbox"); // 【追加】
const listTypeCheckbox = document.getElementById("listTypeCheckbox");
const createListBtn = document.getElementById("createListBtn");
const listsDiv = document.getElementById("lists");

let shoppingLists = JSON.parse(localStorage.getItem("shoppingLists")) || [];

// 【追加】日付のチェックボックスが押されたら、入力欄の表示/非表示を切り替える
useDateCheckbox.addEventListener("change", () => {
  if (useDateCheckbox.checked) {
    dateInput.style.display = "block";
  } else {
    dateInput.style.display = "none";
    dateInput.value = "";
    dateInput.type = "text";
  }
});

// リスト作成
createListBtn.addEventListener("click", () => {
  if (!shopInput.value.trim()) return;

  shoppingLists.push({
    // 日付にチェックが入っている場合のみ日付を保存、それ以外は空文字
    date: useDateCheckbox.checked ? dateInput.value : "",
    title: shopInput.value, // 【変更】shop から title に
    hasPrice: listTypeCheckbox.checked, 
    items: []
  });

  // リセット処理
  shopInput.value = "";
  dateInput.value = "";
  dateInput.type = "text";
  dateInput.style.display = "none";
  useDateCheckbox.checked = false;
  // listTypeCheckbox.checked = true; // 金額チェックをONに戻したい場合はコメントアウトを解除

  save();
  render();
});

// 描画
function render() {
  listsDiv.innerHTML = "";

  shoppingLists.forEach((list, listIndex) => {
    const isWithPrice = list.hasPrice; 

    const total = list.items.reduce((sum, item) => sum + (item.price || 0), 0);
    const hasCheckedItems = list.items.some(item => item.done);

    const div = document.createElement("div");
    div.className = "list";

    // 過去のデータ（list.shop）があっても動くように互換性を持たせています
    const displayTitle = list.title || list.shop || "無題のリスト";

    div.innerHTML = `
      <h2>${list.date ? list.date + " / " : ""}${displayTitle}</h2>
      
      ${isWithPrice ? `<div class="total">合計：¥${total}</div>` : ""}

      <div class="input-row">
        <input type="text" placeholder="商品名" id="name-${listIndex}">
        ${isWithPrice ? `<input type="number" placeholder="¥" id="price-${listIndex}">` : ""}
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

            ${isWithPrice && item.price ? `<span class="price">¥${item.price}</span>` : ""}

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

// チェック済み商品を削除する関数
function deleteCheckedItems(listIndex) {
  if (!confirm("チェックした項目をすべて削除しますか？")) return;
  shoppingLists[listIndex].items = shoppingLists[listIndex].items.filter(item => !item.done);
  save();
  render();
}

// 商品追加
function addItem(listIndex) {
  const nameInput = document.getElementById(`name-${listIndex}`);
  const priceInput = document.getElementById(`price-${listIndex}`);
  const currentList = shoppingLists[listIndex];

  if (!nameInput.value.trim()) return;

  let priceValue = 0;
  if (currentList.hasPrice && priceInput && priceInput.value) {
    priceValue = Number(priceInput.value);
  }

  currentList.items.push({
    name: nameInput.value,
    price: priceValue,
    done: false
  });

  nameInput.value = "";
  if (priceInput) priceInput.value = "";

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
  themeToggle.textContent = "☀️"; 
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
