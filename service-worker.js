/* Este service worker reemplaza al anterior y se autodestruye.
   Objetivo: en cualquier navegador que ya tenga instalado el
   service worker viejo (el que causaba que no se vieran los
   cambios), este se instala, borra todo el caché guardado,
   se desregistra a sí mismo y obliga a recargar la página
   con la versión real publicada en GitHub. */

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", async () => {
  const keys = await caches.keys();
  await Promise.all(keys.map((key) => caches.delete(key)));
  await self.registration.unregister();
  const clientsList = await self.clients.matchAll({ type: "window" });
  clientsList.forEach((client) => client.navigate(client.url));
});
