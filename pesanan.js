// === AMBIL DATA DARI localStorage ===
let pesanan = JSON.parse(localStorage.getItem("pesananSaya")) || [];

const pesananList = document.getElementById("pesanan-list");
const pesananTotal = document.getElementById("pesanan-total");
const btnClear = document.getElementById("btn-clear");
const btnUpdate = document.getElementById("btn-update");

// === FUNGSI RENDER PESANAN DI KERANJANG ===
function renderPesanan() {
  pesananList.innerHTML = "";

  if (pesanan.length === 0) {
    pesananList.innerHTML = `<p style="text-align:center;">Yaahh, Pesananmu kosong. yukk segera pilih menu yang kamu ingin pesan😊 </p>`;
    pesananTotal.textContent = "";
    return;
  }

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

// === HAPUS SEMUA PESANAN ===
document.getElementById("btn-clear").addEventListener("click", () => {
  if (confirm("Yakin ingin membatalkan semua pesanan?")) {
    pesanan = [];
    localStorage.removeItem("pesananSaya"); // 🧹 hapus total dari localStorage
    renderPesanan();
    updatePesananTerbaru();
  }
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
  alert("✅ Pesanan berhasil diperbarui!");
});

// Jalankan pertama kali
renderPesanan();
updatePesananTerbaru();
