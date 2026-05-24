import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyD0WkuS9Ffg3jk3Azrboxy2xCdinzt7Tk0",
  authDomain: "finanzas-app-2b2e9.firebaseapp.com",
  projectId: "finanzas-app-2b2e9",
  storageBucket: "finanzas-app-2b2e9.appspot.com",
  messagingSenderId: "601169370641",
  appId: "1:601169370641:web:da4af945221733d0011bb0"
};

const VAPID_KEY = "BBs6Twuxx0jl_XtZw_tAeqpb_pn5iCOkFMwUrx__8hc3HB85JU3lkkZQOfnOoPJT9ti7UVo62pAw5ohQobGcUSw";

const BACKEND_URL = "";

const TOKEN_STORAGE_KEY = "finanzas_fcm_token";
let foregroundListenerAttached = false;

function obtenerFirebaseApp() {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

async function obtenerRegistroServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    throw new Error("Service Worker no soportado en este navegador.");
  }

  let registration = await navigator.serviceWorker.getRegistration();

  if (registration) {
    return registration;
  }

  registration = await navigator.serviceWorker.register("./service-worker.js");
  return registration;
}

function guardarTokenLocal(token) {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch (error) {
    console.warn("No se pudo guardar el token FCM en localStorage:", error);
  }
}

function obtenerTokenLocal() {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY) || "";
  } catch (error) {
    console.warn("No se pudo leer el token FCM desde localStorage:", error);
    return "";
  }
}

async function enviarTokenAlBackend(token) {
  if (!token) return;

  const tokenPrevio = obtenerTokenLocal();

  if (tokenPrevio === token) {
    console.log("El token FCM no cambió; no se reenviará al backend.");
    return;
  }

  if (!BACKEND_URL) {
    console.log("Sin backend configurado. Token disponible solo en consola:", token);
    guardarTokenLocal(token);
    return;
  }

  const response = await fetch(BACKEND_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      token,
      plataforma: "web",
      origen: "finanzas-personales"
    })
  });

  if (!response.ok) {
    throw new Error(`Backend respondió con estado ${response.status}`);
  }

  guardarTokenLocal(token);
  console.log("Token FCM enviado y guardado correctamente en backend.");
}

function mostrarNotificacionForeground(payload) {
  const title =
    payload?.notification?.title ||
    payload?.data?.title ||
    "Recordatorio";

  const body =
    payload?.notification?.body ||
    payload?.data?.body ||
    "Tienes una notificación pendiente.";

  const icon =
    payload?.notification?.icon ||
    payload?.data?.icon ||
    "./icon-192.png";

  if (Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon
    });
  }
}

function registrarListenerForeground(messaging) {
  if (foregroundListenerAttached) return;

  onMessage(messaging, (payload) => {
    console.log("Push recibido en foreground:", payload);
    mostrarNotificacionForeground(payload);
  });

  foregroundListenerAttached = true;
}

export async function iniciarNotificaciones() {
  const soportado = await isSupported();

  if (!soportado) {
    throw new Error("Firebase Messaging no es compatible con este navegador.");
  }

  if (!("Notification" in window)) {
    throw new Error("La API de notificaciones no está disponible.");
  }

  if (!("serviceWorker" in navigator)) {
    throw new Error("Service Worker no disponible.");
  }

  let permisoFinal = Notification.permission;

  if (permisoFinal !== "granted") {
    permisoFinal = await Notification.requestPermission();
  }

  if (permisoFinal !== "granted") {
    throw new Error("El usuario no concedió permisos de notificación.");
  }

  const app = obtenerFirebaseApp();
  const messaging = getMessaging(app);
  const registration = await obtenerRegistroServiceWorker();

  const token = await getToken(messaging, {
    vapidKey: VAPID_KEY,
    serviceWorkerRegistration: registration
  });

  if (!token) {
    throw new Error("No se pudo obtener el token de Firebase Cloud Messaging.");
  }

  console.log("TOKEN_FCM:", token);

  registrarListenerForeground(messaging);
  await enviarTokenAlBackend(token);

  return {
    ok: true,
    token
  };
}