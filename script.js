
// === DATA MENU ===
const menuData = [
  { id: 1, name: "Nasi Goreng Spesial", price: 25000, img: "images/imagesasgor.jpg" },
  { id: 2, name: "Ayam Geprek", price: 20000, img: "images/ayam.jpg" },
  { id: 3, name: "Bakso Urat", price: 18000, img: "images/bakso.jpg" },
  { id: 4, name: "Es Teh Manis", price: 8000, img: "images/teh.jpg" },
  { id: 5, name: "Mie Goreng Jawa", price: 22000, img: "images/mie.jpg" },
  { id: 6, name: "Mie Gacoan", price: 10500, img: "images/gacoan.jpeg" },
];

// === RENDER MENU ===
const menuContainer = document.getElementById("menu-container");
menuData.forEach(item => {
  const card = document.createElement("div");
  card.classList.add("card");
  card.innerHTML = `
    <img src="${item.img}" alt="${item.name}">
    <h4>${item.name}</h4>
    <p>Rp ${item.price.toLocaleString()}</p>
    <button onclick="addToCart(${item.id})">Tambah</button>
  `;
  menuContainer.appendChild(card);
});

// === KERANJANG ===
let cart = [];
const cartCount = document.getElementById("cart-count");

function addToCart(id) {
  const item = menuData.find(m => m.id === id);
  const existing = cart.find(i => i.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const total = document.getElementById("total");

  cartItems.innerHTML = "";
  let totalPrice = 0;
  let totalQty = 0;

  cart.forEach((item, index) => {
    totalPrice += item.price * item.qty;
    totalQty += item.qty;

    const li = document.createElement("li");
    li.innerHTML = `
      <div class="cart-item-info">
        <span>${item.name}</span>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
        <span>${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
        <button class="delete-btn" onclick="removeItem(${index})">×</button>
      </div>
      <div class="cart-item-price">Rp ${(item.price * item.qty).toLocaleString()}</div>
    `;
    cartItems.appendChild(li);
  });

  total.textContent = `Total: Rp ${totalPrice.toLocaleString()}`;

  // update badge jumlah item
  if (totalQty > 0) {
    cartCount.textContent = totalQty;
    cartCount.classList.add("show");
  } else {
    cartCount.classList.remove("show");
  }
}

// === FUNGSI TAMBAH/KURANG/HAPUS ===
function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  updateCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
}

// === FITUR PENCARIAN MENU ===
const searchInput = document.getElementById("search-input");
searchInput.addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase().trim();
  menuContainer.innerHTML = "";

  const filteredMenu = menuData.filter(item =>
    item.name.toLowerCase().includes(keyword)
  );

  if (filteredMenu.length === 0) {
    const noResult = document.createElement("div");
    noResult.classList.add("no-result");
    noResult.innerHTML = `<p>😕 Tidak ada hasil untuk "<b>${keyword}</b>"</p>`;
    menuContainer.appendChild(noResult);
    return;
  }

  filteredMenu.forEach(item => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <h4>${item.name}</h4>
      <p>Rp ${item.price.toLocaleString()}</p>
      <button onclick="addToCart(${item.id})">Tambah</button>
    `;
    menuContainer.appendChild(card);
  });
});

// === CHECKOUT ===
document.getElementById("checkout-btn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Keranjang masih kosong!");
    return;
  }

  localStorage.setItem("pesananSaya", JSON.stringify(cart));
  alert("Pesanan berhasil disimpan! Lihat di halaman Pesanan Saya.");

  cart = [];
  updateCart();
});
