/* ===========================================================
   CONFIGURACIÓN GENERAL
   =========================================================== */
const WHATSAPP_NUM = "573175821372";
const ASESOR_NOMBRE = "Jaqueline";
const SITIO_NOMBRE = "DTA Chanclas";

/* ===========================================================
   FUENTE DE DATOS — agrega o edita productos aquí.
   Sube tus fotos a: assets/catalogo_dta/<categoria>/<archivo>
   Cada categoría admite hasta 10 fotos (productos1.jpg ... productos10.jpg).
   =========================================================== */
function generarNombres(prefijo, cantidad){
  return Array.from({length: cantidad}, (_, i) => `${prefijo}${i + 1}.jpg`);
}

const categorias = [
  {
    id: "dama-planas",
    nombre: "Dama Planas",
    tallas: "Dama 35 a 41",
    precioDetal: 33000,
    precioMayor: 24000,
    productos: generarNombres("planas", 10)
  },
  {
    id: "dama-altas",
    nombre: "Dama Altas",
    tallas: "Dama 35 a 41",
    precioDetal: 40000,
    precioMayor: 30000,
    productos: generarNombres("altas", 10)
  },
  {
    id: "altas-cruzadas",
    nombre: "Altas Cruzadas",
    tallas: "Dama 35 a 41",
    precioDetal: 40000,
    precioMayor: 32000,
    productos: generarNombres("cruzadas", 10)
  },
  {
    id: "caballero",
    nombre: "Caballero",
    tallas: "Caballero 37 a 44",
    precioDetal: 40000,
    precioMayor: 30000,
    productos: generarNombres("caballero", 10)
  }
];

const fmt = n => "$" + n.toLocaleString("es-CO");

function waLink(texto){
  return `https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(texto)}`;
}
function waLinkProducto(categoriaNombre, archivo){
  return waLink(`Hola, estoy interesado(a) en: ${categoriaNombre} (ref. ${archivo}). ¿Me confirmas disponibilidad?`);
}
function imgPath(catId, archivo){
  return `assets/catalogo_dta/${catId}/${archivo}`;
}
function imgOnError(){
  return `this.closest('.img-wrap, .carousel-img-wrap').innerHTML='<div class=\\'foto-pendiente\\'>Foto pendiente</div>'`;
}

/* ---------- Links de WhatsApp globales ---------- */
const linksGlobales = [
  ["navWhatsapp", "Hola, vi el catálogo DTA y quiero hacer un pedido"],
  ["btnWhatsappHero", "Hola, vi el catálogo DTA y quiero hacer un pedido"],
  ["btnWhatsappFloat", "Hola, quiero hacer un pedido"],
  ["btnWhatsappCTA", "Hola, quiero asesoría para un pedido mayorista"]
];
linksGlobales.forEach(([id, texto]) => {
  const el = document.getElementById(id);
  if(el) el.href = waLink(texto);
});

/* ---------- Render de tarjetas de categoría ---------- */
const categoriasGrid = document.getElementById("categoriasGrid");

function buildCategorias(){
  categoriasGrid.innerHTML = categorias.map(cat => `
    <div class="categoria-card" data-cat="${cat.id}">
      <div class="img-wrap">
        <img src="${imgPath(cat.id, cat.productos[0])}" alt="${cat.nombre}" loading="lazy" onerror="${imgOnError()}">
        <span class="badge-count">${cat.productos.length} fotos</span>
      </div>
      <div class="info">
        <h3>${cat.nombre}</h3>
        <div class="tallas">Tallas ${cat.tallas.replace(/^\S+\s/, '')}</div>
        <div class="precios-mini">Detal <b>${fmt(cat.precioDetal)}</b> · Mayor <b>${fmt(cat.precioMayor)}</b></div>
        <button class="btn-ver">Ver galería</button>
      </div>
    </div>
  `).join("");

  categoriasGrid.querySelectorAll(".categoria-card").forEach(card => {
    card.addEventListener("click", () => openCarousel(card.dataset.cat));
  });
}

/* ---------- Tablas de precios ---------- */
function buildPrecios(){
  document.getElementById("listaDetal").innerHTML = categorias.map(c =>
    `<li>${c.nombre} <b>${fmt(c.precioDetal)}</b></li>`
  ).join("");
  document.getElementById("listaMayor").innerHTML = categorias.map(c =>
    `<li>${c.nombre} <b>${fmt(c.precioMayor)}</b></li>`
  ).join("");
}

/* ---------- Modal Carrusel de categoría ---------- */
const carouselOverlay = document.getElementById("carouselOverlay");
const carouselTitle = document.getElementById("carouselTitle");
const carouselPrecios = document.getElementById("carouselPrecios");
const carouselImgWrap = document.getElementById("carouselImgWrap");
const carouselDotsModal = document.getElementById("carouselDotsModal");
const carouselWhatsapp = document.getElementById("carouselWhatsapp");
const carouselPrev = document.getElementById("carouselPrev");
const carouselNext = document.getElementById("carouselNext");

let catActual = null;
let indiceActual = 0;

function openCarousel(catId){
  catActual = categorias.find(c => c.id === catId);
  indiceActual = 0;
  carouselTitle.textContent = catActual.nombre;
  carouselPrecios.textContent = `Tallas ${catActual.tallas} · Detal ${fmt(catActual.precioDetal)} · Mayor ${fmt(catActual.precioMayor)}`;
  carouselDotsModal.innerHTML = catActual.productos.map((_, i) => `<span data-i="${i}"></span>`).join("");
  carouselDotsModal.querySelectorAll("span").forEach(dot => {
    dot.addEventListener("click", () => { indiceActual = Number(dot.dataset.i); renderCarouselImg(); });
  });
  renderCarouselImg();
  openModal(carouselOverlay);
}

function renderCarouselImg(){
  const archivo = catActual.productos[indiceActual];
  carouselImgWrap.innerHTML = `<img src="${imgPath(catActual.id, archivo)}" alt="${catActual.nombre}" onerror="${imgOnError()}">`;
  carouselDotsModal.querySelectorAll("span").forEach((d, i) => d.classList.toggle("active", i === indiceActual));
  carouselWhatsapp.href = waLinkProducto(catActual.nombre, archivo);
}

carouselPrev.addEventListener("click", () => {
  indiceActual = (indiceActual - 1 + catActual.productos.length) % catActual.productos.length;
  renderCarouselImg();
});
carouselNext.addEventListener("click", () => {
  indiceActual = (indiceActual + 1) % catActual.productos.length;
  renderCarouselImg();
});

/* ---------- Modal QR / Compartir ---------- */
const qrOverlay = document.getElementById("qrOverlay");
const qrBox = document.getElementById("qrBox");
const qrUrlText = document.getElementById("qrUrl");
const btnCopy = document.getElementById("btnCopy");

function openModal(overlay){ overlay.classList.add("open"); }
function closeModal(overlay){ overlay.classList.remove("open"); }

document.getElementById("btnQR").addEventListener("click", () => {
  const url = window.location.href;
  if(navigator.share){
    navigator.share({ title: SITIO_NOMBRE, text: "Mira el catálogo de chanclas al por mayor", url })
      .catch(() => showQR(url));
  } else {
    showQR(url);
  }
});

function showQR(url){
  qrUrlText.textContent = url;
  qrBox.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}" alt="Código QR del catálogo">`;
  openModal(qrOverlay);
}

btnCopy.addEventListener("click", () => {
  navigator.clipboard.writeText(window.location.href).then(() => {
    btnCopy.textContent = "¡Enlace copiado!";
    setTimeout(() => { btnCopy.textContent = "Copiar enlace"; }, 2000);
  });
});

/* ---------- Modal Guardar contacto / Instalar ---------- */
const installOverlay = document.getElementById("installOverlay");
document.getElementById("btnContacto").addEventListener("click", () => openModal(installOverlay));

document.querySelectorAll("[data-close]").forEach(btn => {
  btn.addEventListener("click", () => {
    closeModal(qrOverlay);
    closeModal(installOverlay);
    closeModal(carouselOverlay);
  });
});
[qrOverlay, installOverlay, carouselOverlay].forEach(ov => {
  ov.addEventListener("click", e => { if(e.target === ov) closeModal(ov); });
});

/* vCard dinámica */
const vcard = `BEGIN:VCARD
VERSION:3.0
N:;${ASESOR_NOMBRE};;;
FN:${ASESOR_NOMBRE} - DTA Chanclas
ORG:DTA Chanclas
TEL;TYPE=CELL:+${WHATSAPP_NUM}
NOTE:Catálogo mayorista y al detal. Bucaramanga, Colombia.
END:VCARD`;
const vcardBlob = new Blob([vcard], { type: "text/vcard" });
const btnVcard = document.getElementById("btnVcard");
btnVcard.href = URL.createObjectURL(vcardBlob);
btnVcard.download = "DTA-Chanclas-Contacto.vcf";

/* ---------- Instalación PWA ---------- */
let deferredPrompt;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
});
document.getElementById("btnInstallPWA").addEventListener("click", async () => {
  if(deferredPrompt){
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
  } else {
    alert("Para instalar: abre el menú de tu navegador y elige 'Agregar a pantalla de inicio'.");
  }
});

if("serviceWorker" in navigator){
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  });
}

/* ---------- Init ---------- */
buildCategorias();
buildPrecios();
