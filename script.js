// EDIT: isi nomor WhatsApp admin/penerima RSVP dengan kode negara tanpa tanda +.
// Contoh Indonesia: 6281234567890
const WHATSAPP_NUMBER = "6285819625816";

// EDIT NAMA PASANGAN DI SINI. Foto memakai nama file tetap di folder foto/.
const COUPLE_NAMES = { bride: "Eneng Siti Sadiyah", groom: "Syaefudin Asyhari" };

const music = document.getElementById("weddingMusic");
const openButton = document.getElementById("openInvitation");
const musicToggle = document.getElementById("musicToggle");

function setMusicButton() {
  musicToggle.textContent = music.paused ? "♫" : "Ⅱ";
  musicToggle.setAttribute("aria-label", music.paused ? "Putar musik" : "Jeda musik");
}

openButton.addEventListener("click", async () => {
  document.getElementById("intro").scrollIntoView({ behavior: "smooth" });
  try {
    await music.play();
  } catch (err) {
    // Musik mungkin belum tersedia atau browser menolak pemutaran.
  }
  setMusicButton();
});

musicToggle.addEventListener("click", async () => {
  if (music.paused) {
    try { await music.play(); } catch (err) {
      alert("Tambahkan file musik.mp3 ke folder website terlebih dahulu.");
    }
  } else {
    music.pause();
  }
  setMusicButton();
});

// Nama tamu dari URL, contoh: https://alamat-undangan/?to=Bapak%20Andi
const params = new URLSearchParams(window.location.search);
const guest = params.get("to");
if (guest) document.getElementById("guestName").textContent = guest.replace(/[<>]/g, "").slice(0, 80);

// Hitung mundur ke tanggal acara. Ubah tanggal ini sesuai jadwal sebenarnya.
const weddingDate = new Date("2027-03-20T08:00:00+07:00").getTime();
function updateCountdown() {
  const remaining = weddingDate - Date.now();
  if (remaining <= 0) {
    document.getElementById("countdown").innerHTML = "<p>Hari bahagia kami telah tiba. Sampai jumpa!</p>";
    return;
  }
  const units = {
    days: Math.floor(remaining / 86400000),
    hours: Math.floor((remaining % 86400000) / 3600000),
    minutes: Math.floor((remaining % 3600000) / 60000),
    seconds: Math.floor((remaining % 60000) / 1000)
  };
  for (const [id, value] of Object.entries(units)) {
    const el = document.getElementById(id);
    if (el) el.textContent = String(value).padStart(2, "0");
  }
}
updateCountdown();
setInterval(updateCountdown, 1000);

// RSVP: susun pesan lalu buka WhatsApp. Ini tidak menyimpan RSVP ke database.
document.getElementById("rsvpForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("name").value.trim();
  const attendance = document.getElementById("attendance").value;
  const guests = document.getElementById("guests").value;
  const message = document.getElementById("message").value.trim();
  const text = [
    `Assalamualaikum saya dengan: ${getCoupleNames().bride} & ${getCoupleNames().groom}`,
    `Nama: ${name}`,
    `Konfirmasi: ${attendance}`,
    `Jumlah tamu: ${guests}`,
    `Ucapan/doa: ${message || "-"}`
  ].join("\n");
  if (!/^\d{9,15}$/.test(WHATSAPP_NUMBER)) {
    alert("Nomor WhatsApp di script.js belum benar. Gunakan kode negara, angka saja.");
    return;
  }
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
});

// Galeri lightbox
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("click", () => {
    const image = item.querySelector("img");
    if (!image || image.style.display === "none" || !image.complete || image.naturalWidth === 0) {
      alert("Ganti file foto galeri dengan foto milik Anda terlebih dahulu.");
      return;
    }
    lightboxImage.src = item.dataset.full;
    lightbox.classList.add("open");
  });
});
function closeLightbox() {
  lightbox.classList.remove("open");
  lightboxImage.src = "";
}
document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeLightbox(); });

// EDIT: ganti alamat di bawah ini dengan lokasi acara yang tepat.
document.getElementById("mapLink").href = "https://maps.app.goo.gl/gSheWHwSPHC9vMCVA?g_st=ac";


// Nama dan foto pasangan memakai file tetap agar sama bagi semua pengunjung.
// Ganti nama di COUPLE_NAMES di bagian atas file ini.
function getCoupleNames() {
  return { bride: COUPLE_NAMES.bride, groom: COUPLE_NAMES.groom };
}
function escapeCoupleName(value) {
  return String(value).replace(/[&<>"']/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[ch]));
}
function applyCoupleSettings() {
  const { bride, groom } = getCoupleNames();
  document.querySelector(".cover-names").innerHTML = `${escapeCoupleName(bride)} <span>&amp;</span> ${escapeCoupleName(groom)}`;
  document.querySelector(".closing-names").innerHTML = `${escapeCoupleName(bride.split(" ")[0])} <span>&amp;</span> ${escapeCoupleName(groom.split(" ")[0])}`;
  document.querySelectorAll(".person h3")[0].textContent = bride;
  document.querySelectorAll(".person h3")[1].textContent = groom;
  document.title = `Undangan Pernikahan — ${bride} & ${groom}`;
  const portraits = [
    { id: "bridePortrait", parent: document.querySelector(".portrait-one") },
    { id: "groomPortrait", parent: document.querySelector(".portrait-two") }
  ];
  portraits.forEach(({ id, parent }) => {
    const img = document.getElementById(id);
    if (img && img.complete && img.naturalWidth > 0) parent.classList.add("has-photo");
  });
}
applyCoupleSettings();
