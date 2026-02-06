const CACHE_NAME = 'topraga-donus-v1';
const OFFLINE_URL = '/offline.html';

// Önbelleğe alınacak dosyalar
const STATIC_ASSETS = [
    '/',
    '/offline.html',
    '/logo.png',
    '/site.webmanifest'
];

// Service Worker kurulumu
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Statik dosyalar önbelleğe alınıyor...');
            return cache.addAll(STATIC_ASSETS);
        })
    );
    // Beklemeden aktifleş
    self.skipWaiting();
});

// Eski önbellekleri temizle
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => {
                        console.log('[SW] Eski önbellek siliniyor:', name);
                        return caches.delete(name);
                    })
            );
        })
    );
    // Tüm istemcileri hemen kontrol et
    self.clients.claim();
});

// Fetch isteklerini yakala
self.addEventListener('fetch', (event) => {
    // Sadece GET isteklerini işle
    if (event.request.method !== 'GET') return;

    // API isteklerini farklı işle
    if (event.request.url.includes('/api/') || event.request.url.includes('supabase')) {
        // Network First stratejisi - API için
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    // Başarılı yanıtı önbelleğe al
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                    return response;
                })
                .catch(() => {
                    // Ağ hatası - önbellekten sun
                    return caches.match(event.request);
                })
        );
        return;
    }

    // Navigasyon istekleri için
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .catch(() => {
                    return caches.match(OFFLINE_URL);
                })
        );
        return;
    }

    // Diğer istekler için Cache First stratejisi
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                // Önbellekte var, onu döndür
                // Arka planda güncelle (stale-while-revalidate)
                fetch(event.request).then((response) => {
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, response);
                    });
                });
                return cachedResponse;
            }

            // Önbellekte yok, ağdan al
            return fetch(event.request)
                .then((response) => {
                    // Geçerli yanıtı önbelleğe al
                    if (response && response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseClone);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // Resim istekleri için placeholder döndür
                    if (event.request.destination === 'image') {
                        return caches.match('/logo.png');
                    }
                    return new Response('Offline', { status: 503 });
                });
        })
    );
});

// Push bildirimleri (gelecekte kullanılabilir)
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body || 'Yeni bir güncelleme var!',
            icon: '/logo.png',
            badge: '/logo.png',
            vibrate: [100, 50, 100],
            data: {
                url: data.url || '/'
            }
        };
        event.waitUntil(
            self.registration.showNotification(data.title || 'Toprağa Dönüş', options)
        );
    }
});

// Bildirime tıklama
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});

console.log('[SW] Service Worker yüklendi - Toprağa Dönüş PWA');
