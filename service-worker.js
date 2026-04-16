importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

/* =========================
   CONFIGURACIÓN
========================= */

const CACHE_NAME = "finanzas-app-v1";

const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./push-notifications.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

/* =========================
   FIREBASE (CORREGIDO)
========================= */

firebase.initializeApp({
  apiKey: "AIzaSyD0WkuS9Ffg3jk3Azrboxy2xCdinzt7Tk0",
  authDomain: "finanzas-app-2b2e9.firebaseapp.com",
  projectId: "finanzas-app-2b2e9",
  storageBucket: "finanzas-app-2b2e9.appspot.com",
  messagingSenderId: "601169370641",
  appId: "1:601169370641:web:da4af945221733d0011bb0"
});
 
const messaging = firebase.messaging();

/* =========================
   INSTALL
========================= */

self.addEventListener("install", (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL);
    })
  );
});

/* =========================
   ACTIVATE
========================= */

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

/* =========================
   FETCH (CACHE FIRST + NETWORK)
========================= */

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          const clone = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });

          return response;
        })
        .catch(() => caches.match("./index.html"));
    })
  );
});

/* =========================
   PUSH BACKGROUND
========================= */

messaging.onBackgroundMessage((payload) => {
  console.log("Push en background:", payload);

  const title =
    payload?.notification?.title ||
    payload?.data?.title ||
    "Recordatorio";

  const options = {
    body:
      payload?.notification?.body ||
      payload?.data?.body ||
      "Tienes una notificación pendiente.",
    icon:
      payload?.notification?.icon ||
      payload?.data?.icon ||
      "./icon-192.png",
    badge: "./icon-192.png",
    data: {
      url: payload?.data?.url || "./"
    }
  };

  return self.registration.showNotification(title, options);
});

/* =========================
   CLICK NOTIFICACIÓN
========================= */

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification?.data?.url || "./";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) {
            return client.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});