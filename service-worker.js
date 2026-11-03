
const CACHE_NAME = "stockcontrol-v4";

const ARCHIVOS = [
    "./",
    "./index.html",
    "./styles.css",
    "./app.js",
    "./manifest.json",
    "./icon-192.png",
    "./icon-512.png"
];

// INSTALAR SERVICE WORKER

self.addEventListener("install", function(event) {

    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(ARCHIVOS);
        })
    );

});

// ACTIVAR SERVICE WORKER

self.addEventListener("activate", function(event) {

    event.waitUntil(
        caches.keys().then(function(nombres) {

            return Promise.all(
                nombres.map(function(nombre) {

                    if (nombre !== CACHE_NAME) {
                        return caches.delete(nombre);
                    }

                })
            );

        })
    );

});

// INTERCEPTAR SOLICITUDES

self.addEventListener("fetch", function(event) {

    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(

        caches.match(event.request).then(function(respuesta) {

            if (respuesta) {
                return respuesta;
            }

            return fetch(event.request).then(function(respuestaRed) {

                if (respuestaRed && respuestaRed.ok) {

                    const copia = respuestaRed.clone();

                    caches.open(CACHE_NAME).then(function(cache) {
                        cache.put(event.request, copia);
                    });

                }

                return respuestaRed;

            });

        })

    );

});
