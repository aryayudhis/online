// === DATA MENU ===
const menuData = [
  { id: 1, name: "Nasi Goreng Spesial", price: 25000, img: "images/imagesasgor.jpg", category: "makanan" },
  { id: 2, name: "Ayam Geprek", price: 20000, img: "images/ayam.jpg", category: "makanan" },
  { id: 3, name: "Bakso Urat", price: 18000, img: "images/bakso.jpg", category: "makanan" },
  { id: 4, name: "Es Teh Manis", price: 5000, img: "images/teh.jpg", category: "minuman" },
  { id: 5, name: "Mie Goreng Jawa", price: 22000, img: "images/mie.jpg", category: "makanan" },
  { id: 6, name: "Mie Gacoan", price: 10500, img: "images/gacoan.jpeg", category: "makanan" },
  { id: 7, name: "Kopi", price: 4000, img: "images/kopi.jpeg", category: "minuman" },
  { id: 8, name: "Es Cincau", price: 5000, img: "images/es cincau.jpeg", category: "minuman" },
  { id: 9, name: "Es Coklat", price: 5000, img: "images/es coklat.jpeg", category: "minuman" },
  { id: 10, name: "Cireng", price: 10000, img: "images/cireng.jpeg", category: "snack" },
  { id: 11, name: "Udang Keju", price: 9500, img: "images/udang.jpeg", category: "snack" },
  { id: 12, name: "Kentang Goreng", price: 10000, img: "images/kentang.jpeg", category: "snack" },
];

// === 💫 FITUR AI REKOMENDASI MENU ===
function tampilkanRekomendasiAI() {
  const container = document.getElementById("rekomendasi-container");
  if (!container) return; // biar gak error kalau bukan di beranda

  const jam = new Date().getHours();
  let kategoriRekomendasi = "";
  let judul = "";

  // === Logika waktu untuk rekomendasi dinamis ===
  if (jam >= 5 && jam < 11) {
    kategoriRekomendasi = "minuman";
    judul = "☀️ Menu Sarapan & Minuman Pagi";
  } else if (jam >= 11 && jam < 17) {
    kategoriRekomendasi = "makanan";
    judul = "🍱 Makan Siang Favorit";
  } else if (jam >= 17 && jam < 22) {
    kategoriRekomendasi = "snack";
    judul = "🌆 Camilan & Minuman Malam";
  } else {
    kategoriRekomendasi = "minuman";
    judul = "🌙 Minuman & Snack Malam";
  }

  // === Ganti judul otomatis ===
  const section = document.getElementById("ai-rekomendasi");
  section.querySelector("h3").textContent = judul;

  // === Filter menu sesuai waktu ===
  const rekomendasi = menuData
    .filter(item => item.category === kategoriRekomendasi)
    .slice(0, 4); // ambil 4 item aja biar rapi

  // === Tampilkan hasilnya ===
  container.innerHTML = "";
  rekomendasi.forEach(item => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <h4>${item.name}</h4>
      <p>Rp ${item.price.toLocaleString()}</p>
      <button onclick="addToCart(${item.id})">Tambah</button>
    `;
    container.appendChild(card);
  });
}

// Jalankan saat halaman beranda dibuka
document.addEventListener("DOMContentLoaded", tampilkanRekomendasiAI);

// === RENDER MENU ===
const menuContainer = document.getElementById("menu-container");
menuData.forEach(item => {
  const card = document.createElement("div");
  card.classList.add("card");
  card.setAttribute("data-category", item.category);
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
  showToast(`${item.name} ditambahkan ke keranjang!`);
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

// === FILTER + SEARCH MENU ===
const filterButtons = document.querySelectorAll(".filter-btn");
const searchInput = document.getElementById("search-input");
let selectedCategory = "all";
let searchKeyword = "";

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedCategory = btn.dataset.category;
    renderFilteredMenu();
  });
});

searchInput.addEventListener("input", (e) => {
  searchKeyword = e.target.value.toLowerCase().trim();
  renderFilteredMenu();
});

function renderFilteredMenu() {
  const menuContainer = document.getElementById("menu-container");
  menuContainer.innerHTML = "";

  const filteredMenu = menuData.filter(item => {
    const matchCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(searchKeyword);
    return matchCategory && matchSearch;
  });

  if (filteredMenu.length === 0) {
    menuContainer.innerHTML = `<p class="no-result">😕 Tidak ada hasil untuk "<b>${searchKeyword}</b>"</p>`;
    return;
  }

  filteredMenu.forEach(item => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("data-category", item.category);
    card.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <h4>${item.name}</h4>
      <p>Rp ${item.price.toLocaleString()}</p>
      <button onclick="addToCart(${item.id})">Tambah</button>
    `;
    menuContainer.appendChild(card);
  });
}

// === CHECKOUT ===
document.getElementById("checkout-btn").addEventListener("click", () => {
  if (cart.length === 0) {
    showPopupAlert("Perhatian", "Keranjang masih kosong!");
    return;
  }

  localStorage.setItem("pesananSaya", JSON.stringify(cart));
  showPopupAlert("Berhasil", "✅ Pesanan kamu berhasil dipesan!");
  cart = [];
  updateCart();
});

// === TOAST NOTIFICATION ===
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

// === LOADING SCREEN ===
window.addEventListener("load", () => {
  const loadingScreen = document.getElementById("loading-screen");
  setTimeout(() => {
    loadingScreen.classList.add("hidden");
  }, 1500);
});

// === POPUP ALERT CUSTOM ===
const popupAlert = document.getElementById("popup-alert");
const popupAlertTitle = document.getElementById("popup-alert-title");
const popupAlertMessage = document.getElementById("popup-alert-message");
const popupAlertOk = document.getElementById("popup-alert-ok");

function showPopupAlert(title, message) {
  popupAlertTitle.textContent = title;
  popupAlertMessage.textContent = message;
  popupAlert.classList.add("show");
}

popupAlertOk.addEventListener("click", () => {
  popupAlert.classList.remove("show");
  // Tutup keranjang jika masih terbuka
  const cartBox = document.querySelector(".cart");
  if (cartBox && cartBox.classList.contains("show")) {
    cartBox.classList.remove("show");
  }
});




// === 💬 CHATBOT CUSTOMER SERVICE INTERAKTIF & KONTEKSTUAL (v3.5 - Offline AI) ===
const chatToggle = document.getElementById("chat-toggle");
const chatBox = document.getElementById("chat-box");
const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");

let lastContext = ""; // menyimpan konteks percakapan terakhir
let userName = ""; // opsional, nanti bisa diisi kalau mau personalisasi

// Tampilkan/sembunyikan chatbot
if (chatToggle) {
  chatToggle.addEventListener("click", () => {
    chatBox.classList.toggle("show");
  });
}

// Input pesan
if (chatInput) {
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const userMsg = chatInput.value.trim();
      if (!userMsg) return;
      addChat("user", userMsg);
      chatInput.value = "";

      showTyping();
      setTimeout(() => {
        hideTyping();
        const botReply = getSmartCSReply(userMsg);
        addChat("bot", botReply.text);
        if (botReply.quickReplies) showQuickReplies(botReply.quickReplies);
      }, 1000);
    }
  });
}

// === TAMBAHKAN PESAN KE CHAT ===
function addChat(sender, text) {
  const msg = document.createElement("div");
  msg.className = sender;
  msg.innerHTML = (sender === "bot" ? "🤖 " : "🧍 ") + text;
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// === EFEK BOT “SEDANG MENGETIK” ===
function showTyping() {
  const typing = document.createElement("div");
  typing.id = "typing-indicator";
  typing.className = "bot";
  typing.textContent = "🤖 sedang mengetik...";
  chatMessages.appendChild(typing);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTyping() {
  const typing = document.getElementById("typing-indicator");
  if (typing) typing.remove();
}

// === QUICK REPLIES ===
function showQuickReplies(options) {
  const wrapper = document.createElement("div");
  wrapper.className = "quick-replies";

  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "quick-btn";
    btn.textContent = opt;
    btn.addEventListener("click", () => {
      addChat("user", opt);
      wrapper.remove();
      showTyping();
      setTimeout(() => {
        hideTyping();
        const reply = getSmartCSReply(opt);
        addChat("bot", reply.text);
        if (reply.quickReplies) showQuickReplies(reply.quickReplies);
      }, 800);
    });
    wrapper.appendChild(btn);
  });

  chatMessages.appendChild(wrapper);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// === 🤖 INTELIGENSI CHATBOT CUSTOMER SERVICE OFFLINE (v4.1) ===
function getSmartCSReply(msg) {
  const text = msg.toLowerCase().trim();
  const pesanan = JSON.parse(localStorage.getItem("pesananSaya")) || [];
  let reply = { text: "", quickReplies: null };

  // ====== KATA KUNCI DASAR ======
  const greet = /(halo|hai|hey|hei|helo|hi|selamat|pagi|siang|malam)/;
  const order = /(pesan|pesanan|order|makanan|menu|beli|checkout|keranjang)/;
  const promo = /(promo|diskon|voucher|potongan)/;
  const help = /(bantuan|tolong|help|butuh|panduan|support)/;
  const complain = /(komplain|masalah|lapor|keluhan|telat|salah|tidak sesuai|gagal|error)/;
  const thanks = /(terima kasih|makasih|thanks|thx|mantap|oke|ok|sip)/;
  const goodbye = /(bye|dadah|sampai jumpa|selamat tinggal)/;

  // === SAPAAN ===
  if (greet.test(text)) {
    lastContext = "menu";
    const sapaan = [
      "Hai kak! 👋 Aku <b>Wira</b> — asisten pelanggan Warmam 🍱",
      "Halo! Senang kamu mampir lagi 😄 Aku siap bantu kamu!",
      "Hai, aku <b>Wira</b> 🤖 — siap bantu pesanan dan pembayaranmu!"
    ];
    reply.text = `${sapaan[Math.floor(Math.random() * sapaan.length)]}<br><br>
    Aku bisa bantu kamu untuk:<br>
    🍔 Pesan makanan<br>💳 Panduan pembayaran<br>🎁 Promo<br>🧾 Komplain & bantuan<br><br>
    Mau mulai dari mana nih? 😄`;
    reply.quickReplies = ["Pesanan Saya", "Promo Hari Ini", "Pembayaran", "Bantuan"];
    return reply;
  }

  // === PESANAN ===
  if (order.test(text)) {
    lastContext = "pesanan";

    if (pesanan.length === 0) {
      reply.text = `📦 Kamu belum punya pesanan aktif nih 😅<br>
      Yuk lihat menu di halaman <b>Beranda</b>!`;
      reply.quickReplies = ["Beranda", "Promo Hari Ini"];
    } else {
      let total = 0;
      const daftar = pesanan.map(item => {
        total += item.price * item.qty;
        return `🍴 ${item.name} x${item.qty} (Rp ${(item.price * item.qty).toLocaleString("id-ID")})`;
      }).join("<br>");

      reply.text = `✅ Ini pesanan kamu saat ini:<br>${daftar}<br><br>
      💰 Total: <b>Rp ${total.toLocaleString("id-ID")}</b><br>
      Mau lanjut bayar atau ubah pesanan?`;
      reply.quickReplies = ["Lanjut Bayar", "Ubah Pesanan", "Batalkan Semua"];
    }
    return reply;
  }

  // === PANDUAN TRANSFER BANK ===
  if (text.includes("transfer") || text.includes("bank")) {
    lastContext = "transfer-bank";
    reply.text = `
      🏦 <b>Panduan Pembayaran via Transfer Bank</b><br><br>
      1️⃣ Pilih <b>Transfer Bank</b> saat checkout.<br>
      2️⃣ Pilih bank tujuan (BCA / BNI / Mandiri / BRI).<br>
      3️⃣ Salin nomor rekening yang muncul di layar.<br>
      4️⃣ Lakukan transfer sesuai total pesanan kamu.<br>
      5️⃣ Setelah transfer, sistem akan otomatis verifikasi dalam 1–3 menit.<br><br>
      ✅ Pastikan nominalnya sesuai ya biar proses cepat.
    `;
    reply.quickReplies = ["Panduan E-Wallet", "Panduan COD", "Kembali ke Pembayaran"];
    return reply;
  }

  // === PANDUAN E-WALLET ===
  if (text.includes("e-wallet") || text.includes("ovo") || text.includes("dana") || text.includes("gopay") || text.includes("shopee")) {
    lastContext = "e-wallet";
    reply.text = `
      📱 <b>Panduan Pembayaran via E-Wallet</b><br><br>
      1️⃣ Pilih <b>E-Wallet</b> di halaman checkout.<br>
      2️⃣ Pilih salah satu: OVO, DANA, GoPay, atau ShopeePay.<br>
      3️⃣ Masukkan nomor akun kamu dan klik bayar.<br>
      4️⃣ Konfirmasi pembayaran di aplikasi e-wallet kamu.<br>
      5️⃣ Setelah sukses, status pesanan kamu otomatis diperbarui ✅.<br><br>
      💡 Tips: pastikan saldo kamu cukup sebelum checkout ya!
    `;
    reply.quickReplies = ["Panduan Transfer Bank", "Panduan COD", "Kembali ke Pembayaran"];
    return reply;
  }

  // === PANDUAN COD ===
  if (text.includes("cod") || text.includes("bayar di tempat")) {
    lastContext = "cod";
    reply.text = `
      💵 <b>Panduan Pembayaran COD (Bayar di Tempat)</b><br><br>
      1️⃣ Pilih <b>COD</b> di halaman checkout.<br>
      2️⃣ Tunggu kurir mengantarkan pesanan ke alamatmu.<br>
      3️⃣ Bayar langsung ke kurir sesuai total tagihan.<br><br>
      ⚠️ Mohon siapkan uang pas ya untuk mempercepat transaksi 🙏
    `;
    reply.quickReplies = ["Panduan E-Wallet", "Panduan Transfer Bank", "Kembali ke Pembayaran"];
    return reply;
  }

  // === PEMBAYARAN (UMUM) ===
  if (text.includes("pembayaran") || text.includes("bayar") || text.includes("metode")) {
    lastContext = "pembayaran";
    reply.text = `
      Berikut metode pembayaran yang tersedia 💳:<br>
      🏦 Transfer Bank<br>📱 E-Wallet (OVO, DANA, GoPay, ShopeePay)<br>💵 COD (Bayar di tempat)<br><br>
      Mau lihat panduan langkah-langkahnya?`;
    reply.quickReplies = ["Panduan Transfer Bank", "Panduan E-Wallet", "Panduan COD"];
    return reply;
  }

  // === PROMO ===
  if (promo.test(text)) {
    lastContext = "promo";
    const promos = [
      "🎉 Beli 2 Ayam Geprek Gratis 1 Es Teh Manis 🍗🥤",
      "🔥 Diskon 20% untuk menu Mie Goreng hari ini!",
      "🎁 Gratis ongkir untuk pesanan di atas Rp 50.000 🚚"
    ];
    reply.text = `${promos[Math.floor(Math.random() * promos.length)]}<br><br>
    Berlaku sampai jam 23.59 malam ini 😋<br>
    Mau aku bantu pesankan sekarang?`;
    reply.quickReplies = ["Ya, pesan sekarang", "Lihat Menu Lain"];
    return reply;
  }

  // === BANTUAN ===
  if (help.test(text)) {
    lastContext = "bantuan";
    reply.text = `
      Aku bisa bantu kamu 👇<br>
      📦 Status Pesanan<br>💸 Pembayaran<br>🎁 Promo<br>❗ Komplain / Masalah<br>
      Mau bahas yang mana dulu?`;
    reply.quickReplies = ["Status Pesanan", "Pembayaran", "Komplain"];
    return reply;
  }

  // === KOMPLAIN ===
  if (complain.test(text)) {
    lastContext = "komplain";
    reply.text = `
      Waduh 😔 maaf banget atas ketidaknyamanannya.<br>
      Bisa jelaskan sedikit masalahnya ya biar aku bantu teruskan ke tim dukungan.<br>
      Contoh: pesanan telat, makanan salah, atau pembayaran gagal.`;
    reply.quickReplies = ["Pesanan Telat", "Makanan Salah", "Pembayaran Gagal"];
    return reply;
  }

  // === TERIMA KASIH ===
  if (thanks.test(text)) {
    const balasan = [
      "Sama-sama kak! 😊",
      "Terima kasih kembali 🙏",
      "Senang bisa bantu kamu! 💪"
    ];
    reply.text = balasan[Math.floor(Math.random() * balasan.length)];
    reply.quickReplies = ["Promo Hari Ini", "Pesanan Saya"];
    return reply;
  }

  // === PERPISAHAN ===
  if (goodbye.test(text)) {
    reply.text = "Sampai jumpa lagi ya kak! 🍱 Semoga harimu menyenangkan!";
    return reply;
  }

  // === DEFAULT ===
  reply.text = `
    Hmm... aku belum yakin maksud kamu 😅.<br>
    Tapi aku bisa bantu soal <b>pesanan</b>, <b>pembayaran</b>, <b>promo</b>, atau <b>komplain</b>.<br>
    Mau coba pilih salah satu?`;
  reply.quickReplies = ["Pesanan Saya", "Pembayaran", "Promo Hari Ini", "Bantuan"];
  return reply;
}


// === 💡 AI STATUS TRACKER DI BERANDA ===

// Jalankan otomatis setiap 30 detik untuk cek status pesanan dari localStorage
setInterval(checkAIStatus, 30000);
document.addEventListener("DOMContentLoaded", checkAIStatus);

function checkAIStatus() {
  const data = JSON.parse(localStorage.getItem("aiStatus"));
  if (!data || data.tahap >= 4) return; // kalau belum ada atau sudah selesai, skip

  const waktuLalu = data.mulai;
  const menitBerjalan = Math.floor((Date.now() - waktuLalu) / 60000);
  const waktuSisa = Math.max(data.waktuSisa - menitBerjalan, 0);

  let statusText = data.status;
  let newTahap = data.tahap;
  let toastMsg = "";

  // === Update status berdasarkan waktu berjalan ===
  if (waktuSisa <= data.waktuSisa * 0.75 && data.tahap === 1) {
    statusText = "🍱 Pesanan kamu sedang dikemas!";
    newTahap = 2;
    toastMsg = statusText;
  } else if (waktuSisa <= data.waktuSisa * 0.4 && data.tahap === 2) {
    statusText = "🚴 Pesanan kamu sedang diantar oleh kurir!";
    newTahap = 3;
    toastMsg = statusText;
  } else if (waktuSisa <= 0 && data.tahap < 4) {
    statusText = "✅ Pesanan kamu sudah sampai! Selamat menikmati 🍽️";
    newTahap = 4;
    toastMsg = statusText;
  }

  // kalau ada status baru, tampilkan notifikasi toast
  if (toastMsg !== "") showAIToast(toastMsg);

  // Simpan kembali update ke localStorage
  const updated = {
    ...data,
    waktuSisa,
    status: statusText,
    tahap: newTahap
  };
  localStorage.setItem("aiStatus", JSON.stringify(updated));
}

// === Fungsi menampilkan toast (notifikasi kecil di layar) ===
function showAIToast(message) {
  const toast = document.createElement("div");
  toast.className = "ai-toast show";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}
