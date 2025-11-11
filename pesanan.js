// === AMBIL DATA DARI localStorage ===
let pesanan = JSON.parse(localStorage.getItem("pesananSaya")) || [];

const pesananList = document.getElementById("pesanan-list");
const pesananTotal = document.getElementById("pesanan-total");
const btnClear = document.getElementById("btn-clear");
const btnUpdate = document.getElementById("btn-update");

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
});

function renderPesanan() {
  pesananList.innerHTML = "";

  // Ambil tombol bayar kalau ada di halaman
  const btnBayar = document.getElementById("btn-bayar");

  // 🔹 Kalau pesanan kosong
  if (pesanan.length === 0) {
    pesananList.innerHTML = `
      <p style="text-align:center;">
        Yaahh, Pesananmu kosong 😢<br>
        Yuk segera pilih menu yang kamu ingin pesan 😊
      </p>
    `;
    pesananTotal.textContent = "";
    btnClear.style.display = "none";
    btnUpdate.style.display = "none";

    // 🔥 Sembunyikan tombol bayar juga
    if (btnBayar) btnBayar.style.display = "none";
    return;
  }

  // 🔹 Kalau ada pesanan
  btnClear.style.display = "inline-block";
  btnUpdate.style.display = "inline-block";
  if (btnBayar) btnBayar.style.display = "inline-block";

  let totalHarga = 0;

  pesanan.forEach((item, index) => {
    totalHarga += item.price * item.qty;
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="cart-item-info">
        <img src="${item.img}" alt="${item.name}" class="pesanan-img">
        <div>
          <strong>${item.name}</strong><br>
          <small>Rp ${item.price.toLocaleString()}</small>
        </div>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" onclick="ubahQty(${index}, -1)">-</button>
        <span>${item.qty}</span>
        <button class="qty-btn" onclick="ubahQty(${index}, 1)">+</button>
        <button class="delete-btn" onclick="hapusPesanan(${index})">×</button>
      </div>
      <div class="cart-item-price">Rp ${(item.price * item.qty).toLocaleString()}</div>
    `;
    pesananList.appendChild(li);
  });

  pesananTotal.textContent = `Total: Rp ${totalHarga.toLocaleString()}`;
  simpanPesanan();
}


// === FUNGSI UBAH JUMLAH ===
function ubahQty(index, delta) {
  pesanan[index].qty += delta;
  if (pesanan[index].qty <= 0) {
    pesanan.splice(index, 1);
  }
  renderPesanan();
}

// === FUNGSI HAPUS ITEM ===
function hapusPesanan(index) {
  pesanan.splice(index, 1);
  renderPesanan();
}

// === FUNGSI SIMPAN ULANG KE localStorage ===
function simpanPesanan() {
  localStorage.setItem("pesananSaya", JSON.stringify(pesanan));
}

// === POPUP KONFIRMASI HAPUS SEMUA PESANAN ===
const popupHapusPesanan = document.getElementById("popup-hapus-pesanan");
const btnHapusYa = document.getElementById("btn-hapus-ya");
const btnHapusTidak = document.getElementById("btn-hapus-tidak");

btnClear.addEventListener("click", () => {
  popupHapusPesanan.classList.add("show");
});

btnHapusYa.addEventListener("click", () => {
  pesanan = [];
  localStorage.removeItem("pesananSaya");
  renderPesanan();
  updatePesananTerbaru();
  popupHapusPesanan.classList.remove("show");

  // notif kecil di pojok bawah
  const notif = document.createElement("div");
  notif.className = "toast show";
  notif.textContent = "🗑️ Semua pesanan telah dibatalkan!";
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 2500);
});

btnHapusTidak.addEventListener("click", () => {
  popupHapusPesanan.classList.remove("show");
});

// === UPDATE PESANAN TERBARU ===
function updatePesananTerbaru() {
  const container = document.getElementById("pesanan-terbaru");
  container.innerHTML = "";

  if (pesanan.length === 0) {
    container.innerHTML = `<p>Belum ada pesanan terbaru.</p>`;
    return;
  }

  let total = 0;
  let listHTML = "";

  pesanan.forEach((item) => {
    total += item.price * item.qty;
    listHTML += `
      ${item.name} x${item.qty} - Rp ${(item.price * item.qty).toLocaleString()}<br>
    `;
  });

  container.innerHTML = `
    <h3>Pesanan Terbaru</h3>
    <p>${listHTML}</p>
    <strong>Total: Rp ${total.toLocaleString()}</strong>
  `;
}

// === SAAT TEKAN UPDATE PESANAN ===
btnUpdate.addEventListener("click", () => {
  simpanPesanan();
  updatePesananTerbaru();

  // ✅ Pop-up notifikasi kecil (bukan alert)
  const notif = document.createElement("div");
  notif.className = "toast show";
  notif.textContent = "✅ Pesanan berhasil diperbarui!";
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 2500);
});

// === LOADING SCREEN ===
window.addEventListener("load", () => {
  const loadingScreen = document.getElementById("loading-screen");
  setTimeout(() => {
    loadingScreen.classList.add("hidden");
  }, 1500);
});

// === POP-UP PEMBAYARAN ===
const btnBayar = document.getElementById("btn-bayar");
const popupKonfirmasi = document.getElementById("popup-konfirmasi");
const popupBerhasil = document.getElementById("popup-berhasil");
const popupTotal = document.getElementById("popup-total");
const btnLanjutBayar = document.getElementById("btn-lanjut-bayar");
const btnBatalBayar = document.getElementById("btn-batal-bayar");
const closePopupBerhasil = document.getElementById("close-popup-berhasil");

// === Tambahan: Popup Metode Pembayaran ===
const popupMetode = document.getElementById("popup-metode");
const btnKonfirmasiMetode = document.getElementById("btn-konfirmasi-metode");
const btnBatalMetode = document.getElementById("btn-batal-metode");

if (btnBayar) {
  btnBayar.addEventListener("click", () => {
    const pesanan = JSON.parse(localStorage.getItem("pesananSaya")) || [];
    if (pesanan.length === 0) return;

    const total = pesanan.reduce((sum, item) => sum + item.price * item.qty, 0);
    popupTotal.textContent = `Total pembayaran kamu: Rp ${total.toLocaleString()}`;
    popupKonfirmasi.classList.add("show");
  });
}

// Klik “Bayar Sekarang” → buka popup metode
btnLanjutBayar.addEventListener("click", () => {
  popupKonfirmasi.classList.remove("show");
  popupMetode.classList.add("show");
});

// Klik batal (tutup popup konfirmasi)
btnBatalBayar.addEventListener("click", () => {
  popupKonfirmasi.classList.remove("show");
});

// Klik batal (tutup popup metode)
btnBatalMetode.addEventListener("click", () => {
  popupMetode.classList.remove("show");
});

// === Klik “Lanjutkan” setelah pilih metode ===
btnKonfirmasiMetode.addEventListener("click", () => {
  const metodeDipilih = document.querySelector('input[name="metode"]:checked');

  if (!metodeDipilih) {
    const notif = document.createElement("div");
    notif.className = "toast show";
    notif.textContent = "⚠️ Silakan pilih metode pembayaran dulu!";
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 2500);
    return;
  }

  popupMetode.classList.remove("show");
  popupBerhasil.classList.add("show");

  // 🚀 Mulai sistem AI Tracking setelah pembayaran berhasil
  startAITracking();

  // Hapus pesanan dari localStorage
  localStorage.removeItem("pesananSaya");
  pesanan = [];
  renderPesanan();
  updatePesananTerbaru();

  if (btnBayar) btnBayar.style.display = "none";
});

// === TAMPILKAN OPSI BANK JIKA PILIH TRANSFER ===
const bankOptions = document.getElementById("bank-options");

document.querySelectorAll('input[name="metode"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    if (radio.value === "Transfer Bank") {
      bankOptions.style.display = "block";
    } else {
      bankOptions.style.display = "none";
      document.querySelectorAll('input[name="bank"]').forEach(b => b.checked = false);
    }
  });
});

// Tutup popup berhasil
closePopupBerhasil.addEventListener("click", () => {
  popupBerhasil.classList.remove("show");
});

// Jalankan pertama kali
renderPesanan();
updatePesananTerbaru();


// === 💡 FITUR AI: ESTIMASI WAKTU & STATUS DINAMIS ===
function startAITracking() {
  const waktu = Math.floor(Math.random() * 8) + 8; // estimasi 8–15 menit
  const aiStatus = {
    waktuSisa: waktu,
    status: "Sedang diproses oleh dapur 👨‍🍳",
    tahap: 1, // 1=dapur, 2=dikemas, 3=diantar, 4=selesai
    mulai: Date.now()
  };
  localStorage.setItem("aiStatus", JSON.stringify(aiStatus));
}

// === TAMPILKAN STATUS DI HALAMAN PESANAN ===
function loadAIStatus() {
  const box = document.getElementById("ai-estimasi");
  if (!box) return;

  const data = JSON.parse(localStorage.getItem("aiStatus"));
  if (!data) {
    box.style.display = "none";
    return;
  }

  box.style.display = "block";
  updateAIStatus();
}

// === UPDATE WAKTU & STATUS REAL-TIME ===
function updateAIStatus() {
  const box = document.getElementById("ai-estimasi");
  if (!box) return;

  const data = JSON.parse(localStorage.getItem("aiStatus"));
  if (!data) return;

  const waktuLalu = data.mulai;
  const menitBerjalan = Math.floor((Date.now() - waktuLalu) / 60000);
  const waktuSisa = Math.max(data.waktuSisa - menitBerjalan, 0);

  let statusText = data.status;

  // ubah status berdasarkan waktu tersisa
  if (waktuSisa <= data.waktuSisa * 0.75 && data.tahap === 1) {
    statusText = "🍱 Sedang dikemas untuk pengantaran...";
    data.tahap = 2;
  }
  if (waktuSisa <= data.waktuSisa * 0.4 && data.tahap === 2) {
    statusText = "🚴‍♂️ Kurir sedang menuju ke lokasi kamu!";
    data.tahap = 3;
  }
  if (waktuSisa <= 0 && data.tahap < 4) {
    statusText = "✅ Pesanan telah sampai. Selamat menikmati! 🍽️";
    data.tahap = 4;
  }

  // Hitung progress bar
  const progressPercent = Math.min(((data.waktuSisa - waktuSisa) / data.waktuSisa) * 100, 100);

  // update tampilan
  box.innerHTML = `
    <div class="ai-status-box">
      <div>🔍 Estimasi waktu siap: <b>${waktuSisa > 0 ? waktuSisa + " menit" : "0 menit"}</b></div>
      <div>Status: <span style="color:${data.tahap < 4 ? "green" : "gray"};">${statusText}</span></div>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${progressPercent}%;"></div>
      </div>
    </div>
  `;

  // simpan update ke localStorage
  data.waktuSisa = waktuSisa;
  data.status = statusText;
  localStorage.setItem("aiStatus", JSON.stringify(data));

  // update tiap 60 detik
  if (data.tahap < 4) {
    setTimeout(updateAIStatus, 60000);
  }
}

// Jalankan saat halaman pesanan dibuka
document.addEventListener("DOMContentLoaded", loadAIStatus);