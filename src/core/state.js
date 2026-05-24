import {
  STORAGE_KEY,
  BUDGET_STORAGE_KEY,
  PRORRATEO_STORAGE_KEY,
  PIN_STORAGE_KEY
} from "./constants.js";

export let movimientos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
export let presupuestos = JSON.parse(localStorage.getItem(BUDGET_STORAGE_KEY)) || {};
export let prorrateos = JSON.parse(localStorage.getItem(PRORRATEO_STORAGE_KEY)) || [];
export let editandoId = null;
export let editandoProrrateoId = null;
export let pinGuardado = localStorage.getItem(PIN_STORAGE_KEY) || "";
export let modoLock = "unlock";
export let sincronizandoScrollGrafico = false;
export let prorrateoCalendarDate = new Date(
  new Date().getFullYear(),
  new Date().getMonth(),
  1
);

export function setMovimientos(data) {
  movimientos = data;
}

export function setPresupuestos(data) {
  presupuestos = data;
}

export function setProrrateos(data) {
  prorrateos = data;
}

export function setEditandoId(id) {
  editandoId = id;
}

export function setEditandoProrrateoId(id) {
  editandoProrrateoId = id;
}

export function setPinGuardado(pin) {
  pinGuardado = pin;
}

export function setModoLock(value) {
  modoLock = value;
}

export function setSincronizandoScrollGrafico(value) {
  sincronizandoScrollGrafico = value;
}

export function setProrrateoCalendarDate(date) {
  prorrateoCalendarDate = date;
}

