const CACHE_NAME = "app-cache-v1";
const urlsToCache = [
    "/code/html/index.html",
    "/code/html/admin.html",
    "/code/html/sing-up.html",
    "/code/css/index.css",
    "/code/css/admin.css",
    "/code/css/cadastroLogin.css",
    "/code/js/index.js",
    "/code/js/admin.js",
    "/code/js/sing-up.js",
    "/manifest.json",
    "https://code.jquery.com/jquery-3.6.4.min.js",
    "https://cdn.jsdelivr.net/npm/chart.js",
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
];

self.addEventListener("install", event => {
    console.log('Service Worker instalando...');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Cache aberto');
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("activate", event => {
    console.log('Service Worker ativado');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deletando cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            // Retorna o cache se encontrado, senão faz a requisição
            return response || fetch(event.request);
        })
    );
});

// Exibir notificação quando receber uma mensagem push
self.addEventListener("push", event => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || "Alerta de Enchente";
    const options = {
        body: data.body || "Nível do rio está acima do limite seguro. Evite áreas de risco!",
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-192x192.png",
        vibrate: [200, 100, 200],
        data: {
            url: "/code/html/index.html"
        }
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Lidar com clique na notificação
self.addEventListener("notificationclick", event => {
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
