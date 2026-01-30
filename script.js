const dateInput = document.getElementById("dateInput");
const shopInput = document.getElementById("shopInput");
const createListBtn = document.getElementById("createListBtn");
const listsDiv = document.getElementById("lists");

let shoppingLists = JSON.parse(localStorage.getItem("shoppingLists")) || [];

// リスト作成
createListBtn.addEventListener("click", () => {
  // お店の名前さえあれば作成を許可
  if (!shopInput.value) return; 

  shoppingLists.push({
    date: dateInput.value, // 空なら空のまま保存
    shop: shopInput.value,
    items: []
  });

  dateInput.value = "";
  shopInput.value = "";

  // type="text" に戻す処理（スマホ表示対策用）
  if (dateInput.type === "date") {
    dateInput.type = "text";
  }

  save();
  render();
});

// 描画
function render() {
  listsDiv.innerHTML = "";

  shoppingLists.forEach((list, listIndex) => {
    const total = list.items.reduce((sum, item) => sum + item.price, 0);

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



      <button class="delete-btn"
        onclick="deleteList(${listIndex})">
        このリストを削除
      </button>
    `;

    listsDiv.appendChild(div);
  });
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

// 保存
function save() {
  localStorage.setItem("shoppingLists", JSON.stringify(shoppingLists));
}

// 初期表示
render();
