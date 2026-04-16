importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

const CACHE_NAME = "finanzas-v2";
const APP_SHELL_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./push-notifications.js",
  "./icon-192.png",
  "./icon-512.png",
  "./manifest.json"
];

firebase.initializeApp({
  BBs6Twuxx0jl_XtZw_tAeqpb_pn5iCOkFMwUrx__8hc3HB85JU3lkkZQOfnOoPJT9ti7UVo62pAw5ohQobGcUSw,
  authDomain: "finanzas-app-2b2e9.firebaseapp.com",
  projectId: "finanzas-app-2b2e9",
  storageBucket: "finanzas-app-2b2e9.appspot.com",
  messagingSenderId: "601169370641",
  appId: "1:601169370641:web:da4af945221733d0011bb0"
});

const messaging = firebase.messaging();

self.addEventListener("install", (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const file of APP_SHELL_FILES) {
        try {
          await cache.add(file);
        } catch (error) {
          console.warn("No se pudo cachear:", file, error);
        }
      }
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
          return Promise.resolve();
        })
      )
    )
  );

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone).catch(() => {});
          });
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          return caches.match("./index.html");
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then((networkResponse) => {
          const responseClone = networkResponse.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone).catch(() => {});
          });

          return networkResponse;
        })
        .catch(() => caches.match("./index.html"));
    })
  );
});

messaging.onBackgroundMessage((payload) => {
  console.log("[service-worker.js] Push recibido en background:", payload);

  const notificationTitle =
    payload?.notification?.title ||
    payload?.data?.title ||
    "Recordatorio";

  const notificationOptions = {
    body:
      payload?.notification?.body ||
      payload?.data?.body ||
      "Tienes una notificación pendiente.",
    icon:
      payload?.notification?.icon ||
      payload?.data?.icon ||
      "./icon-192.png",
    badge:
      payload?.notification?.badge ||
      payload?.data?.badge ||
      "./icon-192.png",
    data: {
      url: payload?.data?.url || "./",
      ...payload?.data
    }
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const urlDestino = event.notification?.data?.url || "./";

  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then((clientList) => {
      for (const client of clientList) {
        const clientUrl = new URL(client.url);
        const destinoUrl = new URL(urlDestino, self.location.origin);

        if ("focus" in client) {
          if (clientUrl.pathname === destinoUrl.pathname) {
            return client.focus();
          }

          return client.focus().then(() => {
            if ("navigate" in client) {
              return client.navigate(urlDestino);
            }
            return client;
          });
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(urlDestino);
      }

      return null;
    })
  );
});

self.addEventListener("notificationclose", () => {
  // reservado para futura analítica
});