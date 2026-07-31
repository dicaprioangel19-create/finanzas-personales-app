import {
  BUDGET_STORAGE_KEY
} from "../core/constants.js";

import {
  presupuestos,
  setPresupuestos,
  movimientos
} from "../core/state.js";

/* =========================
   DOM PRESUPUESTO
========================= */

const presupuestoMesInput = document.getElementById("presupuesto-mes");
const presupuestoMontoInput = document.getElementById("presupuesto-monto");
const mensajePresupuesto = document.getElementById("mensaje-presupuesto");

const budgetTitle = document.getElementById("budget-title");
const budgetTotalEl = document.getElementById("budget-total");
const budgetSpentEl = document.getElementById("budget-spent");
const budgetRemainingEl = document.getElementById("budget-remaining");
const budgetPercentEl = document.getElementById("budget-percent");

const budgetStatusLabel = document.getElementById("budget-status-label");
const budgetProgressText = document.getElementById("budget-progress-text");
const budgetProgressFill = document.getElementById("budget-progress-fill");

const btnEliminarPresupuesto = document.getElementById("btn-eliminar-presupuesto");
const filtroMes = document.getElementById("filtro-mes");

/* =========================
   DEPENDENCIAS TEMPORALES
========================= */

let renderAppCallback = null;
let toastCallback = null;

function configurarPresupuesto({ renderApp, mostrarToast } = {}) {
  renderAppCallback = renderApp || null;
  toastCallback = mostrarToast || null;
}

/* =========================
   PRESUPUESTO
========================= */

function manejarSubmitPresupuesto(e) {
  e.preventDefault();

  const mes = presupuestoMesInput?.value || "";
  const monto = Number(presupuestoMontoInput?.value);

  if (!mes) {
    mostrarMensajePresupuesto("Debes seleccionar el mes del presupuesto.", "error");
    return;
  }

  if (!monto || Number.isNaN(monto) || monto <= 0) {
    mostrarMensajePresupuesto("El presupuesto debe ser mayor que 0.", "error");
    return;
  }

  setPresupuestos({
    ...presupuestos,
    [mes]: monto
  });

  if (filtroMes) filtroMes.value = mes;

  guardarPresupuestos();
  renderAppCallback?.();

  mostrarMensajePresupuesto("Presupuesto guardado correctamente.", "success");
  toastCallback?.("Presupuesto guardado", "success");
}

function eliminarPresupuestoMesActual() {
  const mes = obtenerMesPresupuestoActivo();

  if (!mes || !presupuestos[mes]) {
    mostrarMensajePresupuesto("No hay presupuesto guardado para ese mes.", "error");
    return;
  }

  if (!confirm("¿Seguro que quieres eliminar el presupuesto de este mes?")) return;

  const nuevosPresupuestos = { ...presupuestos };
  delete nuevosPresupuestos[mes];

  setPresupuestos(nuevosPresupuestos);

  guardarPresupuestos();
  renderAppCallback?.();

  mostrarMensajePresupuesto("Presupuesto eliminado correctamente.", "success");
  toastCallback?.("Presupuesto eliminado", "success");
}

function renderPresupuestoMensual() {
  const mesActivo = obtenerMesPresupuestoActivo();
  const presupuesto = Number(presupuestos[mesActivo] || 0);
  const egresoReal = obtenerEgresoDelMes(mesActivo);

  if (presupuestoMesInput) {
    presupuestoMesInput.value = mesActivo;
  }

  if (presupuestoMontoInput) {
    presupuestoMontoInput.value = presupuesto > 0 ? String(presupuesto) : "";
  }

  if (budgetTitle) {
    budgetTitle.textContent = `Resumen del presupuesto de ${formatearMesTitulo(mesActivo)}`;
  }

  if (budgetTotalEl) {
    budgetTotalEl.textContent = formatearMoneda(presupuesto);
  }

  if (budgetSpentEl) {
    budgetSpentEl.textContent = formatearMoneda(egresoReal);
  }

  if (presupuesto <= 0) {
    if (budgetRemainingEl) budgetRemainingEl.textContent = "—";
    if (budgetPercentEl) budgetPercentEl.textContent = "—";

    actualizarEstadoSinPresupuesto(egresoReal);
    btnEliminarPresupuesto?.classList.add("hidden");
    return;
  }

  const disponible = presupuesto - egresoReal;
  const porcentajeUsado = (egresoReal / presupuesto) * 100;

  if (budgetRemainingEl) {
    budgetRemainingEl.textContent = formatearMoneda(disponible);
  }

  if (budgetPercentEl) {
    budgetPercentEl.textContent = `${porcentajeUsado.toFixed(1)}%`;
  }

  actualizarEstadoBarraPresupuesto(porcentajeUsado);
  btnEliminarPresupuesto?.classList.remove("hidden");
}

function inicializarMesPresupuesto() {
  if (presupuestoMesInput) {
    presupuestoMesInput.value = obtenerMesPresupuestoActivo();
  }
}

function sincronizarMesPresupuestoConFiltro() {
  if (presupuestoMesInput) {
    presupuestoMesInput.value = obtenerMesPresupuestoActivo();
  }
}

/* =========================
   ESTADOS VISUALES
========================= */

function actualizarEstadoSinPresupuesto(egresoReal) {
  if (!budgetProgressFill || !budgetProgressText || !budgetStatusLabel) return;

  budgetProgressFill.className = "budget-progress-fill";
  budgetProgressFill.style.width = "0%";
  budgetProgressText.textContent = "—";

  budgetStatusLabel.textContent =
    egresoReal > 0
      ? "Tienes egresos registrados, pero no hay presupuesto configurado"
      : "Sin presupuesto configurado";
}

function actualizarEstadoBarraPresupuesto(porcentajeUsado) {
  if (!budgetProgressFill || !budgetProgressText || !budgetStatusLabel) return;

  budgetProgressFill.className = "budget-progress-fill";
  budgetProgressFill.style.width = `${Math.min(porcentajeUsado, 100)}%`;
  budgetProgressText.textContent = `${porcentajeUsado.toFixed(1)}%`;

  if (porcentajeUsado < 80) {
    budgetStatusLabel.textContent = "Vas dentro del presupuesto";
  } else if (porcentajeUsado < 100) {
    budgetStatusLabel.textContent = "Cerca del límite del presupuesto";
    budgetProgressFill.classList.add("warning");
  } else {
    budgetStatusLabel.textContent = "Presupuesto excedido";
    budgetProgressFill.classList.add("danger");
  }
}

function mostrarMensajePresupuesto(texto, tipo) {
  if (!mensajePresupuesto) return;

  mensajePresupuesto.textContent = texto;
  mensajePresupuesto.className = `mensaje ${tipo}`;

  clearTimeout(mostrarMensajePresupuesto.timeoutId);
  mostrarMensajePresupuesto.timeoutId = setTimeout(() => {
    mensajePresupuesto.textContent = "";
    mensajePresupuesto.className = "mensaje";
  }, 3000);
}

/* =========================
   DATOS
========================= */

function guardarPresupuestos() {
  localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(presupuestos));
}

function obtenerMesPresupuestoActivo() {
  return filtroMes?.value || obtenerMesActual();
}

function obtenerEgresoDelMes(mesISO) {
  return movimientos
    .filter(
      (mov) =>
        mov.tipo === "egreso" &&
        String(mov.fechaISO || "").startsWith(mesISO)
    )
    .reduce((acc, mov) => acc + Number(mov.monto || 0), 0);
}


/* =========================
   HELPERS LOCALES
========================= */

function obtenerMesActual() {
  const fecha = new Date();
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function formatearMesTitulo(mesISO) {
  if (!mesISO) return "";

  const [year, month] = mesISO.split("-");
  const fecha = new Date(Number(year), Number(month) - 1, 1);

  return fecha.toLocaleDateString("es-PE", {
    month: "long",
    year: "numeric"
  });
}

function formatearMoneda(valor) {
  return Number(valor || 0).toLocaleString("es-PE", {
    style: "currency",
    currency: "PEN"
  });
}

/* =========================
   EXPORTS
========================= */

export {
  configurarPresupuesto,
  manejarSubmitPresupuesto,
  eliminarPresupuestoMesActual,
  renderPresupuestoMensual,
  inicializarMesPresupuesto,
  sincronizarMesPresupuestoConFiltro,
  actualizarEstadoSinPresupuesto,
  actualizarEstadoBarraPresupuesto,
  obtenerMesPresupuestoActivo,
  obtenerEgresoDelMes,
  guardarPresupuestos,
  mostrarMensajePresupuesto
};