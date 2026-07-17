# DTA Chanclas — Catálogo Digital

Sitio estático (HTML/CSS/JS puro + PWA) basado en el Expediente Técnico DTA.

## 📁 Estructura

```
dta-chanclas/
├── index.html
├── manifest.json            ← config de instalación PWA
├── service-worker.js        ← cache offline básico
├── css/styles.css
├── js/app.js                ← productos, carrusel, QR, vCard, PWA
└── assets/
    ├── logo/dta-logo.png    ← logo concepto #2 (elegido según expediente)
    └── catalogo_dta/
        ├── dama-planas/
        ├── dama-altas/
        ├── altas-cruzadas/
        └── caballero/
```

## 🎨 Identidad de marca

- **Logo:** concepto #2 del expediente (franja "VENDE, EMPRENDE Y CRECE").
- **Paleta:** azul marino `#0B1F4D`, rojo `#E11D33`, blanco — tomada del logo, como marca propia DTA.
- **Nota legal:** se evitó cualquier referencia a "Tommy" en nombre, copy o metadatos para no exponer la marca a un reclamo de infracción. Si tus fotos de producto traen ese nombre superpuesto o cosido, recomiendo no usarlas tal cual — usa fotos limpias del producto físico.

## 📸 Dónde subir tus fotos

`assets/catalogo_dta/<categoria>/<archivo>.jpg`, con los nombres ya configurados en `js/app.js` (`planas1.jpg`, `altas1.jpg`, `cruzadas1.jpg`, `caballero1.jpg`, etc.). Mientras no subas una, la tarjeta muestra "Foto próximamente" sin romper el diseño.

Para agregar productos nuevos: edita el array `productos` de la categoría en `js/app.js` y sube la foto con ese mismo nombre.

## ✏️ Datos editables (todo en `js/app.js`, arriba del todo)

- `WHATSAPP_NUM` → ya configurado con **573175821372**
- `ASESOR_NOMBRE`, `SITIO_NOMBRE`
- Precios y tallas por categoría dentro de `categorias`
- Cada categoría admite hasta **10 fotos**: `planas1.jpg` ... `planas10.jpg`, `altas1.jpg` ... `altas10.jpg`, `cruzadas1.jpg` ... `cruzadas10.jpg`, `caballero1.jpg` ... `caballero10.jpg`. No hace falta subir las 10 — las que falten se ven como "Foto pendiente" dentro del carrusel.

## 🖱️ Cómo funciona ahora (versión landing)

- La página ya no lista todos los productos en una grilla larga: cada categoría es una **tarjeta** en la sección "Categorías". Al hacer clic, se abre un **carrusel modal** con hasta 10 fotos de esa categoría, navegación con flechas/puntos, y un botón de WhatsApp que manda la referencia exacta de la foto que se está viendo.
- Navegación superior fija (`Categorías`, `Precios`, `Contacto`) con scroll suave.
- Sección de precios con dos tarjetas de color (azul = detal, naranja = mayorista) en vez de listas planas.
- Se eliminó el bloque suelto de "Tallas disponibles" — esa información ahora vive dentro de cada tarjeta de categoría y del carrusel.

## 🚀 Subir a GitHub Pages

```bash
cd dta-chanclas
git init
git add .
git commit -m "Catálogo DTA Chanclas - versión inicial"
git branch -M main
git remote add origin https://github.com/konfiozinc/dta-chanclas.git
git push -u origin main
```

En GitHub: **Settings → Pages → Source: `main` / `(root)`**. El `index.html` debe quedar en la raíz del repo (o de la carpeta que selecciones) o dará 404.

## 📲 Funciones incluidas (del expediente)

✅ Catálogo visual por categoría · ✅ Galería/carrusel destacado · ✅ WhatsApp flotante · ✅ Compartir catálogo (share nativo o QR) · ✅ Guardar contacto (.vcf) · ✅ Código QR · ✅ Iconos de redes sociales (enlaza tus perfiles en `index.html`, sección `.hero-social`) · ✅ Instalable como PWA (manifest + service worker) · ✅ Diseño responsive.

**Pendiente para activar 100% la PWA:** los íconos del manifest están apuntando al logo actual; cuando tengas un logo definitivo en alta resolución (512×512 mínimo, fondo sólido), reemplázalo en `assets/logo/dta-logo.png`.
