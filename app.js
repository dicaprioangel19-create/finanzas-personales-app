const STORAGE_KEY = "finanzas_movimientos";
const BUDGET_STORAGE_KEY = "finanzas_presupuestos";
const PIN_STORAGE_KEY = "finanzas_pin";

let movimientos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let presupuestos = JSON.parse(localStorage.getItem(BUDGET_STORAGE_KEY)) || {};
let editandoId = null;
let pinGuardado = localStorage.getItem(PIN_STORAGE_KEY) || "";
let modoLock = "unlock";

// LOCK
const lockScreen = document.getElementById("lock-screen");
const appContainer = document.getElementById("app-container");
const lockForm = document.getElementById("lock-form");
const lockTitle = document.getElementById("lock-title");
const lockDescription = document.getElementById("lock-description");
const lockSubmit = document.getElementById("lock-submit");
const lockMessage = document.getElementById("lock-message");
const lockUnlockGroup = document.getElementById("lock-unlock-group");
const lockSetupGroup = document.getElementById("lock-setup-group");
const lockPin = document.getElementById("lock-pin");
const lockPinNew = document.getElementById("lock-pin-new");
const lockPinConfirm = document.getElementById("lock-pin-confirm");

// FORM MOVIMIENTO
const form = document.getElementById("form-movimiento");
const tipoInput = document.getElementById("tipo");
const subtipoEgresoGroup = document.getElementById("subtipo-egreso-group");
const subtipoEgresoInput = document.getElementById("subtipo-egreso");
const categoriaInput = document.getElementById("categoria");
const descripcionInput = document.getElementById("descripcion");
const montoInput = document.getElementById("monto");
const fechaInput = document.getElementById("fecha");
const btnSubmit = document.getElementById("btn-submit");
const btnCancelarEdicion = document.getElementById("btn-cancelar-edicion");
const mensaje = document.getElementById("mensaje");
const modalTitle = document.getElementById("modal-title");
const hintCategoria = document.getElementById("hint-categoria");
const hintDescripcion = document.getElementById("hint-descripcion");

// MODAL / FAB / TOAST
const modalOverlay = document.getElementById("modal-overlay");
const btnCloseModal = document.getElementById("btn-close-modal");
const btnOpenModalTop = document.getElementById("btn-open-modal-top");
const fabOpenModal = document.getElementById("fab-open-modal");
const toastEl = document.getElementById("toast");

// FILTROS
const filtroTipo = document.getElementById("filtro-tipo");
const filtroMes = document.getElementById("filtro-mes");
const btnLimpiarFiltros = document.getElementById("btn-limpiar-filtros");
const btnExportarCSV = document.getElementById("btn-exportar-csv");

// DASHBOARD
const totalIngresosEl = document.getElementById("total-ingresos");
const totalEgresosEl = document.getElementById("total-egresos");
const balanceTotalEl = document.getElementById("balance-total");

// SEGURIDAD
const securityStatusText = document.getElementById("security-status-text");
const securityForm = document.getElementById("security-form");
const securityCurrentGroup = document.getElementById("security-current-group");
const securityCurrentPin = document.getElementById("security-current-pin");
const securityNewPin = document.getElementById("security-new-pin");
const securityConfirmPin = document.getElementById("security-confirm-pin");
const btnSavePin = document.getElementById("btn-save-pin");
const btnDeletePin = document.getElementById("btn-delete-pin");
const btnLockNow = document.getElementById("btn-lock-now");
const securityMessage = document.getElementById("security-message");

// PRESUPUESTO
const formPresupuesto = document.getElementById("form-presupuesto");
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

// HÁBITOS
const habitosGrid = document.getElementById("habitos-grid");
const habitosEmptyState = document.getElementById("habitos-empty-state");
const habitTopCategory = document.getElementById("habit-top-category");
const habitTopCategoryDetail = document.getElementById("habit-top-category-detail");
const habitAverageExpense = document.getElementById("habit-average-expense");
const habitAverageExpenseDetail = document.getElementById("habit-average-expense-detail");
const habitTopDay = document.getElementById("habit-top-day");
const habitTopDayDetail = document.getElementById("habit-top-day-detail");
const habitMovementCount = document.getElementById("habit-movement-count");
const habitMovementCountDetail = document.getElementById("habit-movement-count-detail");
const habitMostRepeatedExpense = document.getElementById("habit-most-repeated-expense");
const habitMostRepeatedExpenseDetail = document.getElementById("habit-most-repeated-expense-detail");
const habitWeekPattern = document.getElementById("habit-week-pattern");
const habitWeekPatternDetail = document.getElementById("habit-week-pattern-detail");
const habitExpenseStreak = document.getElementById("habit-expense-streak");
const habitExpenseStreakDetail = document.getElementById("habit-expense-streak-detail");
const habitGrowingCategory = document.getElementById("habit-growing-category");
const habitGrowingCategoryDetail = document.getElementById("habit-growing-category-detail");
const habitosInsights = document.getElementById("habitos-insights");

// HISTORIAL
const contadorMovimientosEl = document.getElementById("contador-movimientos");
const historyListEl = document.getElementById("history-list");

// CATEGORÍAS
const categoriasResumenEl = document.getElementById("categorias-resumen");

// GRÁFICO CIRCULAR
const canvasGrafico = document.getElementById("grafico-categorias");
const ctxGrafico = canvasGrafico.getContext("2d");
const chartWrapper = document.getElementById("chart-wrapper");
const chartLegend = document.getElementById("chart-legend");
const chartEmptyState = document.getElementById("chart-empty-state");

// GRÁFICO SALDO
const canvasBalance = document.getElementById("grafico-saldo-acumulado");
const ctxBalance = canvasBalance.getContext("2d");
const balanceChartWrapper = document.getElementById("balance-chart-wrapper");
const balanceChartEmptyState = document.getElementById("balance-chart-empty-state");
const saldoActualGraficoEl = document.getElementById("saldo-actual-grafico");
const chartTooltip = document.getElementById("chart-tooltip");
const chartTooltipDate = document.getElementById("chart-tooltip-date");
const chartTooltipValue = document.getElementById("chart-tooltip-value");

const canvasNavigator = document.getElementById("grafico-saldo-navigator");
const ctxNavigator = canvasNavigator.getContext("2d");
const chartRangeNav = document.getElementById("chart-range-nav");
const rangeSelection = document.getElementById("range-selection");
const rangeHandleLeft = document.getElementById("range-handle-left");
const rangeHandleRight = document.getElementById("range-handle-right");
const rangeDragArea = document.getElementById("range-drag-area");

// MENÚ
const menuToggle = document.getElementById("menu-toggle");
const sideMenu = document.getElementById("side-menu");
const menuOverlay = document.getElementById("menu-overlay");
const menuLinks = document.querySelectorAll(".menu-link");
const appSections = document.querySelectorAll(".app-section");

const COLORES_GRAFICO = [
  "#2563eb", "#16a34a", "#dc2626", "#d97706", "#7c3aed", "#0891b2",
  "#ea580c", "#4f46e5", "#65a30d", "#db2777", "#0f766e", "#9333ea"
];

const COLOR_SALDO_SUBE = "#5b8def";
const COLOR_SALDO_BAJA = "#d46464";
const COLOR_TEXTO_GRAFICO = "#b2a79a";
const COLOR_LINEA_GUIA = "rgba(178, 167, 154, 0.14)";
const COLOR_LINEA_CERO = "rgba(200, 155, 90, 0.28)";
const COLOR_MES_DIVISOR = "rgba(255, 255, 255, 0.08)";
const COLOR_FONDO_GRAFICO = "#262422";

let chartRange = {
  start: 0,
  end: 0
};

let chartRangeInteraction = {
  active: false,
  mode: "",
  startX: 0,
  startStart: 0,
  startEnd: 0
};

const MAPA_SUGERENCIAS = {
  comida: ["pollo", "restaurante", "almuerzo", "desayuno", "cena", "mercado", "snack", "pan", "fruta", "verdura"],
  transporte: ["uber", "taxi", "bus", "pasaje", "peaje", "combustible", "gasolina", "moto"],
  educación: ["curso", "libro", "matricula", "colegiatura", "universidad", "senati", "clase"],
  salud: ["farmacia", "doctor", "consulta", "medicina", "ibuprofeno", "vitamina", "análisis"],
  hogar: ["alquiler", "luz", "agua", "internet", "gas", "mueble", "limpieza"],
  trabajo: ["cliente", "software", "herramienta", "dominio", "hosting", "canva", "office"],
  inversión: ["curso", "libro", "equipo", "herramienta", "dominio", "hosting", "capacitación", "formación"]
};

document.addEventListener("DOMContentLoaded", () => {
  ocultarMenuBoton();
  colocarFechaActualPorDefecto();
  inicializarMesPresupuesto();
  configurarSeguridadUI();
  iniciarSistemaPIN();
  actualizarUIEgreso();
  mostrarSeccion("registro");
  cerrarModal();
});

// Eventos base
lockForm.addEventListener("submit", manejarLockForm);
form.addEventListener("submit", manejarSubmitFormulario);
btnCancelarEdicion.addEventListener("click", cancelarEdicion);
tipoInput.addEventListener("change", actualizarUIEgreso);
descripcionInput.addEventListener("input", procesarSugerenciasInteligentes);

securityForm.addEventListener("submit", manejarGuardarPin);
btnDeletePin.addEventListener("click", manejarEliminarPin);
btnLockNow.addEventListener("click", bloquearAhora);

formPresupuesto.addEventListener("submit", manejarSubmitPresupuesto);
btnEliminarPresupuesto.addEventListener("click", eliminarPresupuestoMesActual);

filtroTipo.addEventListener("change", () => {
  sincronizarMesPresupuestoConFiltro();
  renderApp();
});

filtroMes.addEventListener("change", () => {
  sincronizarMesPresupuestoConFiltro();
  renderApp();
});

btnLimpiarFiltros.addEventListener("click", () => {
  filtroTipo.value = "todos";
  filtroMes.value = "";
  sincronizarMesPresupuestoConFiltro();
  renderApp();
  mostrarMensaje("Filtros limpiados correctamente.", "success");
  mostrarToast("Filtros limpiados", "success");
});

btnExportarCSV.addEventListener("click", exportarMovimientosCSV);

btnOpenModalTop.addEventListener("click", abrirModalNuevoMovimiento);
fabOpenModal.addEventListener("click", abrirModalNuevoMovimiento);
btnCloseModal.addEventListener("click", cerrarModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) cerrarModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    cerrarModal();
    cerrarMenu();
  }
});

// MENÚ
function mostrarMenuBoton() {
  if (menuToggle) menuToggle.classList.remove("hidden");
}

function ocultarMenuBoton() {
  if (menuToggle) menuToggle.classList.add("hidden");
}

function abrirMenu() {
  if (sideMenu) sideMenu.classList.add("active");
  if (menuOverlay) menuOverlay.classList.add("active");
  if (menuToggle) menuToggle.classList.add("hidden");
}

function cerrarMenu() {
  if (sideMenu) sideMenu.classList.remove("active");
  if (menuOverlay) menuOverlay.classList.remove("active");
  if (menuToggle && !appContainer.classList.contains("hidden")) menuToggle.classList.remove("hidden");
}

function alternarMenu() {
  if (!sideMenu) return;
  if (sideMenu.classList.contains("active")) cerrarMenu();
  else abrirMenu();
}

function actualizarMenuActivo(sectionId) {
  menuLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.section === sectionId);
  });
}

function mostrarSeccion(sectionId) {
  appSections.forEach((section) => {
    section.classList.remove("active-section");
  });

  const seccionActiva = document.getElementById(sectionId);
  if (seccionActiva) {
    seccionActiva.classList.add("active-section");
    actualizarMenuActivo(sectionId);
  }
}

if (menuToggle) {
  menuToggle.addEventListener("click", alternarMenu);
}

if (menuOverlay) {
  menuOverlay.addEventListener("click", cerrarMenu);
}

menuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const sectionId = link.dataset.section;
    mostrarSeccion(sectionId);
    cerrarMenu();
  });
});

// MODAL
function abrirModalNuevoMovimiento() {
  modalOverlay.classList.remove("hidden");
  modalTitle.textContent = editandoId ? "Editar movimiento" : "Nuevo movimiento";
  document.body.style.overflow = "hidden";
  setTimeout(() => {
    tipoInput.focus();
  }, 50);
}

function cerrarModal() {
  modalOverlay.classList.add("hidden");
  document.body.style.overflow = "";
}

function vibrarSuave() {
  if ("vibrate" in navigator) {
    navigator.vibrate(10);
  }
}

function mostrarToast(texto, tipo = "success") {
  toastEl.textContent = texto;
  toastEl.className = `toast show ${tipo}`;

  clearTimeout(mostrarToast.timeoutId);
  mostrarToast.timeoutId = setTimeout(() => {
    toastEl.className = "toast";
  }, 2300);
}

// PIN
function iniciarSistemaPIN() {
  if (pinGuardado) mostrarModoUnlock();
  else mostrarModoSetup();
}

function mostrarModoUnlock() {
  modoLock = "unlock";
  lockTitle.textContent = "Desbloquear app";
  lockDescription.textContent = "Ingresa tu PIN para acceder a tus finanzas.";
  lockSubmit.textContent = "Ingresar";
  lockUnlockGroup.classList.remove("hidden");
  lockSetupGroup.classList.add("hidden");
  appContainer.classList.add("hidden");
  lockScreen.classList.remove("hidden");
  ocultarMenuBoton();
  limpiarCamposLock();
  lockPin.focus();
}

function mostrarModoSetup() {
  modoLock = "setup";
  lockTitle.textContent = "Configura tu PIN";
  lockDescription.textContent = "Crea un PIN de 4 dígitos para proteger tu app.";
  lockSubmit.textContent = "Guardar PIN";
  lockUnlockGroup.classList.add("hidden");
  lockSetupGroup.classList.remove("hidden");
  appContainer.classList.add("hidden");
  lockScreen.classList.remove("hidden");
  ocultarMenuBoton();
  limpiarCamposLock();
  lockPinNew.focus();
}

function desbloquearApp() {
  lockScreen.classList.add("hidden");
  appContainer.classList.remove("hidden");
  limpiarCamposLock();
  configurarSeguridadUI();
  mostrarMenuBoton();
  renderApp();
}

function bloquearAhora() {
  cerrarMenu();
  mostrarModoUnlock();
}

function limpiarCamposLock() {
  lockPin.value = "";
  lockPinNew.value = "";
  lockPinConfirm.value = "";
  lockMessage.textContent = "";
  lockMessage.className = "mensaje";
}

function manejarLockForm(e) {
  e.preventDefault();

  if (modoLock === "unlock") {
    const pin = lockPin.value.trim();

    if (pin !== pinGuardado) {
      mostrarMensajeLock("PIN incorrecto.", "error");
      mostrarToast("PIN incorrecto", "error");
      return;
    }

    desbloquearApp();
    return;
  }

  const nuevo = lockPinNew.value.trim();
  const confirmar = lockPinConfirm.value.trim();
  const error = validarPinNuevo(nuevo, confirmar);

  if (error) {
    mostrarMensajeLock(error, "error");
    mostrarToast(error, "error");
    return;
  }

  pinGuardado = nuevo;
  localStorage.setItem(PIN_STORAGE_KEY, pinGuardado);
  mostrarMensajeLock("PIN configurado correctamente.", "success");
  mostrarToast("PIN configurado", "success");
  setTimeout(() => desbloquearApp(), 500);
}

function validarPinNuevo(nuevo, confirmar) {
  if (!/^\d{4}$/.test(nuevo)) return "El PIN debe tener exactamente 4 dígitos numéricos.";
  if (nuevo !== confirmar) return "La confirmación del PIN no coincide.";
  return "";
}

function mostrarMensajeLock(texto, tipo) {
  lockMessage.textContent = texto;
  lockMessage.className = `mensaje ${tipo}`;
}

// SEGURIDAD
function configurarSeguridadUI() {
  const existePin = Boolean(pinGuardado);

  securityStatusText.textContent = existePin ? "PIN configurado" : "Sin configurar";
  securityCurrentGroup.classList.toggle("hidden", !existePin);
  btnDeletePin.classList.toggle("hidden", !existePin);
  btnLockNow.classList.toggle("hidden", !existePin);
  btnSavePin.textContent = existePin ? "Cambiar PIN" : "Configurar PIN";

  limpiarCamposSeguridad();
}

function manejarGuardarPin(e) {
  e.preventDefault();

  const existePin = Boolean(pinGuardado);
  const actual = securityCurrentPin.value.trim();
  const nuevo = securityNewPin.value.trim();
  const confirmar = securityConfirmPin.value.trim();

  if (existePin && actual !== pinGuardado) {
    mostrarMensajeSeguridad("El PIN actual es incorrecto.", "error");
    mostrarToast("PIN actual incorrecto", "error");
    return;
  }

  const error = validarPinNuevo(nuevo, confirmar);
  if (error) {
    mostrarMensajeSeguridad(error, "error");
    mostrarToast(error, "error");
    return;
  }

  pinGuardado = nuevo;
  localStorage.setItem(PIN_STORAGE_KEY, pinGuardado);
  configurarSeguridadUI();
  mostrarMensajeSeguridad(existePin ? "PIN actualizado correctamente." : "PIN configurado correctamente.", "success");
  mostrarToast(existePin ? "PIN actualizado" : "PIN configurado", "success");
}

function manejarEliminarPin() {
  if (!pinGuardado) {
    mostrarMensajeSeguridad("No hay PIN configurado.", "error");
    return;
  }

  if (securityCurrentPin.value.trim() !== pinGuardado) {
    mostrarMensajeSeguridad("Debes ingresar correctamente el PIN actual para eliminarlo.", "error");
    return;
  }

  if (!confirm("¿Seguro que quieres eliminar el PIN de seguridad?")) return;

  pinGuardado = "";
  localStorage.removeItem(PIN_STORAGE_KEY);
  configurarSeguridadUI();
  mostrarMensajeSeguridad("PIN eliminado correctamente.", "success");
  mostrarToast("PIN eliminado", "success");
}

function limpiarCamposSeguridad() {
  securityCurrentPin.value = "";
  securityNewPin.value = "";
  securityConfirmPin.value = "";
}

function mostrarMensajeSeguridad(texto, tipo) {
  securityMessage.textContent = texto;
  securityMessage.className = `mensaje ${tipo}`;

  clearTimeout(mostrarMensajeSeguridad.timeoutId);
  mostrarMensajeSeguridad.timeoutId = setTimeout(() => {
    securityMessage.textContent = "";
    securityMessage.className = "mensaje";
  }, 3000);
}

// FORMULARIO
function actualizarUIEgreso() {
  const esEgreso = tipoInput.value === "egreso";
  subtipoEgresoGroup.classList.toggle("hidden", !esEgreso);

  if (!esEgreso) {
    subtipoEgresoInput.value = "";
  }
}

function procesarSugerenciasInteligentes() {
  const texto = descripcionInput.value.trim().toLowerCase();

  if (!texto) {
    hintCategoria.textContent = "";
    hintDescripcion.textContent = "";
    return;
  }

  const sugerenciaCategoria = detectarCategoriaPorDescripcion(texto);
  const sugerenciaSubtipo = detectarSubtipoEgresoPorDescripcion(texto);

  if (!categoriaInput.value.trim() && sugerenciaCategoria) {
    categoriaInput.value = capitalizarTexto(sugerenciaCategoria);
    hintCategoria.textContent = `Sugerencia automática: ${capitalizarTexto(sugerenciaCategoria)}`;
  } else {
    hintCategoria.textContent = sugerenciaCategoria
      ? `Coincide con: ${capitalizarTexto(sugerenciaCategoria)}`
      : "";
  }

  if (tipoInput.value === "egreso" && sugerenciaSubtipo) {
    subtipoEgresoInput.value = sugerenciaSubtipo;
    hintDescripcion.textContent = `Sugerencia: esto parece ${sugerenciaSubtipo === "inversion" ? "inversión" : "gasto"}.`;
  } else {
    hintDescripcion.textContent = "";
  }
}

function detectarCategoriaPorDescripcion(texto) {
  for (const [categoria, palabras] of Object.entries(MAPA_SUGERENCIAS)) {
    if (categoria === "inversión") continue;
    if (palabras.some((palabra) => texto.includes(palabra))) {
      return categoria;
    }
  }
  return "";
}

function detectarSubtipoEgresoPorDescripcion(texto) {
  const palabrasInversion = MAPA_SUGERENCIAS["inversión"] || [];
  if (palabrasInversion.some((palabra) => texto.includes(palabra))) {
    return "inversion";
  }
  return "gasto";
}

function manejarSubmitFormulario(e) {
  e.preventDefault();

  const tipo = tipoInput.value.trim();
  const subtipo = tipo === "egreso" ? subtipoEgresoInput.value.trim() : "";
  const categoria = capitalizarTexto(categoriaInput.value.trim());
  const descripcion = descripcionInput.value.trim();
  const monto = Number(montoInput.value);
  const fecha = fechaInput.value;

  const errores = validarFormulario({ tipo, subtipo, categoria, descripcion, monto, fecha });
  if (errores.length > 0) {
    mostrarMensaje(errores[0], "error");
    mostrarToast(errores[0], "error");
    return;
  }

  const { fechaVisible, horaVisible, fechaISO } = construirFechas(fecha);

  if (editandoId) {
    const index = movimientos.findIndex((mov) => mov.id === editandoId);

    if (index === -1) {
      mostrarMensaje("No se encontró el movimiento a editar.", "error");
      mostrarToast("No se encontró el movimiento", "error");
      return;
    }

    movimientos[index] = {
      ...movimientos[index],
      tipo,
      subtipo,
      categoria,
      descripcion,
      monto,
      fecha: fechaVisible,
      hora: horaVisible,
      fechaISO
    };

    guardarMovimientos();
    renderApp();
    resetFormulario();
    cerrarModal();
    mostrarMensaje("Movimiento actualizado correctamente.", "success");
    mostrarToast("Movimiento actualizado", "success");
    vibrarSuave();
    return;
  }

  movimientos.unshift({
    id: Date.now(),
    tipo,
    subtipo,
    categoria,
    descripcion,
    monto,
    fecha: fechaVisible,
    hora: horaVisible,
    fechaISO
  });

  guardarMovimientos();
  renderApp();
  resetFormulario();
  cerrarModal();
  mostrarMensaje("Movimiento guardado correctamente.", "success");
  mostrarToast("Movimiento guardado", "success");
  vibrarSuave();
}

function renderApp() {
  const movimientosFiltrados = obtenerMovimientosFiltrados();
  renderDashboard(movimientosFiltrados);
  renderPresupuestoMensual();
  renderHabitos(movimientosFiltrados);
  renderGraficoSaldoAcumulado(movimientosFiltrados);
  renderGraficoCategorias(movimientosFiltrados);
  renderResumenCategorias(movimientosFiltrados);
  renderHistorial(movimientosFiltrados);
}

function obtenerMovimientosFiltrados() {
  let resultado = [...movimientos];

  if (filtroTipo.value !== "todos") {
    resultado = resultado.filter((mov) => mov.tipo === filtroTipo.value);
  }

  if (filtroMes.value) {
    resultado = resultado.filter((mov) => mov.fechaISO.startsWith(filtroMes.value));
  }

  return resultado;
}

function renderDashboard(lista) {
  const totalIngresos = lista
    .filter((m) => m.tipo === "ingreso")
    .reduce((a, m) => a + m.monto, 0);

  const totalEgresos = lista
    .filter((m) => m.tipo === "egreso")
    .reduce((a, m) => a + m.monto, 0);

  const balance = totalIngresos - totalEgresos;

  totalIngresosEl.textContent = formatearMoneda(totalIngresos);
  totalEgresosEl.textContent = formatearMoneda(totalEgresos);
  balanceTotalEl.textContent = formatearMoneda(balance);
}

// PRESUPUESTO
function manejarSubmitPresupuesto(e) {
  e.preventDefault();

  const mes = presupuestoMesInput.value;
  const monto = Number(presupuestoMontoInput.value);

  if (!mes) {
    mostrarMensajePresupuesto("Debes seleccionar el mes del presupuesto.", "error");
    mostrarToast("Selecciona un mes", "error");
    return;
  }

  if (!monto || isNaN(monto) || monto <= 0) {
    mostrarMensajePresupuesto("El presupuesto debe ser mayor que 0.", "error");
    mostrarToast("El presupuesto debe ser mayor que 0", "error");
    return;
  }

  presupuestos[mes] = monto;
  guardarPresupuestos();
  renderApp();
  mostrarMensajePresupuesto("Presupuesto guardado correctamente.", "success");
  mostrarToast("Presupuesto guardado", "success");
}

function eliminarPresupuestoMesActual() {
  const mes = obtenerMesPresupuestoActivo();

  if (!mes || !presupuestos[mes]) {
    mostrarMensajePresupuesto("No hay presupuesto guardado para ese mes.", "error");
    return;
  }

  if (!confirm("¿Seguro que quieres eliminar el presupuesto de este mes?")) return;

  delete presupuestos[mes];
  guardarPresupuestos();
  renderApp();
  mostrarMensajePresupuesto("Presupuesto eliminado correctamente.", "success");
  mostrarToast("Presupuesto eliminado", "success");
}

function renderPresupuestoMensual() {
  const mesActivo = obtenerMesPresupuestoActivo();
  const presupuesto = Number(presupuestos[mesActivo] || 0);
  const egresoReal = obtenerEgresoDelMes(mesActivo);

  presupuestoMesInput.value = mesActivo;
  presupuestoMontoInput.value = presupuesto > 0 ? presupuesto : "";

  budgetTitle.textContent = `Resumen del presupuesto de ${formatearMesTitulo(mesActivo)}`;
  budgetTotalEl.textContent = formatearMoneda(presupuesto);
  budgetSpentEl.textContent = formatearMoneda(egresoReal);

  if (presupuesto <= 0) {
    budgetRemainingEl.textContent = "—";
    budgetPercentEl.textContent = "—";
    actualizarEstadoSinPresupuesto(egresoReal);
    btnEliminarPresupuesto.classList.add("hidden");
    return;
  }

  const disponible = presupuesto - egresoReal;
  const porcentajeUsado = (egresoReal / presupuesto) * 100;

  budgetRemainingEl.textContent = formatearMoneda(disponible);
  budgetPercentEl.textContent = `${porcentajeUsado.toFixed(1)}%`;
  actualizarEstadoBarraPresupuesto(egresoReal, porcentajeUsado);
  btnEliminarPresupuesto.classList.remove("hidden");
}

function actualizarEstadoSinPresupuesto(egresoReal) {
  budgetProgressFill.className = "budget-progress-fill";
  budgetProgressFill.style.width = "0%";
  budgetProgressText.textContent = "—";
  budgetStatusLabel.textContent = egresoReal > 0
    ? "Tienes egresos registrados, pero no hay presupuesto configurado"
    : "Sin presupuesto configurado";
}

function obtenerMesPresupuestoActivo() {
  return filtroMes.value || obtenerMesActual();
}

function obtenerEgresoDelMes(mesISO) {
  return movimientos
    .filter((mov) => mov.tipo === "egreso" && mov.fechaISO.startsWith(mesISO))
    .reduce((acc, mov) => acc + mov.monto, 0);
}

function actualizarEstadoBarraPresupuesto(egresoReal, porcentajeUsado) {
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

function inicializarMesPresupuesto() {
  presupuestoMesInput.value = obtenerMesPresupuestoActivo();
}

function sincronizarMesPresupuestoConFiltro() {
  presupuestoMesInput.value = obtenerMesPresupuestoActivo();
}

function guardarPresupuestos() {
  localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(presupuestos));
}

function mostrarMensajePresupuesto(texto, tipo) {
  mensajePresupuesto.textContent = texto;
  mensajePresupuesto.className = `mensaje ${tipo}`;

  clearTimeout(mostrarMensajePresupuesto.timeoutId);
  mostrarMensajePresupuesto.timeoutId = setTimeout(() => {
    mensajePresupuesto.textContent = "";
    mensajePresupuesto.className = "mensaje";
  }, 3000);
}

// HÁBITOS
function renderHabitos(lista) {
  if (lista.length === 0) {
    habitosGrid.classList.add("hidden");
    habitosEmptyState.classList.remove("hidden");
    habitosInsights.innerHTML = `<div class="insight-item">No hay datos visibles para analizar en este momento.</div>`;
    resetHabitosCards();
    return;
  }

  habitosGrid.classList.remove("hidden");
  habitosEmptyState.classList.add("hidden");

  const egresos = lista.filter((mov) => mov.tipo === "egreso");
  const ingresos = lista.filter((mov) => mov.tipo === "ingreso");

  renderMayorCategoriaEgreso(egresos);
  renderPromedioEgresos(egresos);
  renderDiaMasEgreso(egresos);
  renderConteoMovimientos(lista, ingresos, egresos);
  renderEgresoMasRepetido(egresos);
  renderSemanaVsFinDeSemana(egresos);
  renderRachaEgresos(egresos);
  renderCategoriaQueMasCrecio();
  renderConclusionesHabitos(lista, ingresos, egresos);
}

function resetHabitosCards() {
  habitTopCategory.textContent = "—";
  habitTopCategoryDetail.textContent = "Sin datos";
  habitAverageExpense.textContent = "—";
  habitAverageExpenseDetail.textContent = "Sin datos";
  habitTopDay.textContent = "—";
  habitTopDayDetail.textContent = "Sin datos";
  habitMovementCount.textContent = "—";
  habitMovementCountDetail.textContent = "Sin datos";
  habitMostRepeatedExpense.textContent = "—";
  habitMostRepeatedExpenseDetail.textContent = "Sin datos";
  habitWeekPattern.textContent = "—";
  habitWeekPatternDetail.textContent = "Sin datos";
  habitExpenseStreak.textContent = "—";
  habitExpenseStreakDetail.textContent = "Sin datos";
  habitGrowingCategory.textContent = "—";
  habitGrowingCategoryDetail.textContent = "Sin datos";
}

function renderMayorCategoriaEgreso(egresos) {
  if (egresos.length === 0) {
    habitTopCategory.textContent = "—";
    habitTopCategoryDetail.textContent = "No hay egresos visibles para analizar.";
    return;
  }

  const agrupado = {};
  egresos.forEach((mov) => {
    agrupado[mov.categoria] = (agrupado[mov.categoria] || 0) + mov.monto;
  });

  const [categoria, total] = Object.entries(agrupado).sort((a, b) => b[1] - a[1])[0];
  const totalEgresos = egresos.reduce((acc, mov) => acc + mov.monto, 0);
  const porcentaje = totalEgresos > 0 ? (total / totalEgresos) * 100 : 0;

  habitTopCategory.textContent = categoria;
  habitTopCategoryDetail.textContent = `${formatearMoneda(total)} • ${porcentaje.toFixed(1)}% del egreso visible`;
}

function renderPromedioEgresos(egresos) {
  if (egresos.length === 0) {
    habitAverageExpense.textContent = "—";
    habitAverageExpenseDetail.textContent = "No hay egresos visibles para calcular promedio.";
    return;
  }

  const total = egresos.reduce((acc, mov) => acc + mov.monto, 0);
  const promedio = total / egresos.length;

  habitAverageExpense.textContent = formatearMoneda(promedio);
  habitAverageExpenseDetail.textContent = `${egresos.length} egreso(s) visibles en este análisis`;
}

function renderDiaMasEgreso(egresos) {
  if (egresos.length === 0) {
    habitTopDay.textContent = "—";
    habitTopDayDetail.textContent = "No hay egresos visibles por día.";
    return;
  }

  const agrupadoPorDia = {};
  egresos.forEach((mov) => {
    agrupadoPorDia[mov.fechaISO] = (agrupadoPorDia[mov.fechaISO] || 0) + mov.monto;
  });

  const [fechaISO, total] = Object.entries(agrupadoPorDia).sort((a, b) => b[1] - a[1])[0];
  habitTopDay.textContent = formatearFechaHumana(fechaISO);
  habitTopDayDetail.textContent = `${formatearMoneda(total)} egresados ese día`;
}

function renderConteoMovimientos(lista, ingresos, egresos) {
  habitMovementCount.textContent = `${lista.length}`;
  habitMovementCountDetail.textContent = `${ingresos.length} ingreso(s) • ${egresos.length} egreso(s) visibles`;
}

function renderEgresoMasRepetido(egresos) {
  if (egresos.length === 0) {
    habitMostRepeatedExpense.textContent = "—";
    habitMostRepeatedExpenseDetail.textContent = "No hay egresos visibles para detectar repetición.";
    return;
  }

  const frecuencia = {};
  const montos = {};

  egresos.forEach((mov) => {
    const key = mov.descripcion.trim().toLowerCase();
    frecuencia[key] = (frecuencia[key] || 0) + 1;
    montos[key] = (montos[key] || 0) + mov.monto;
  });

  const top = Object.entries(frecuencia).sort((a, b) => b[1] - a[1])[0];
  const nombre = capitalizarTexto(top[0]);
  const veces = top[1];
  const total = montos[top[0]] || 0;

  habitMostRepeatedExpense.textContent = nombre;
  habitMostRepeatedExpenseDetail.textContent = `${veces} vez/veces • ${formatearMoneda(total)} acumulados`;
}

function renderSemanaVsFinDeSemana(egresos) {
  if (egresos.length === 0) {
    habitWeekPattern.textContent = "—";
    habitWeekPatternDetail.textContent = "No hay egresos visibles para comparar días.";
    return;
  }

  let totalSemana = 0;
  let totalFinSemana = 0;

  egresos.forEach((mov) => {
    const fecha = new Date(`${mov.fechaISO}T00:00:00`);
    const dia = fecha.getDay();

    if (dia === 0 || dia === 6) totalFinSemana += mov.monto;
    else totalSemana += mov.monto;
  });

  if (totalFinSemana > totalSemana) {
    habitWeekPattern.textContent = "Fines de semana";
    habitWeekPatternDetail.textContent = `${formatearMoneda(totalFinSemana)} vs ${formatearMoneda(totalSemana)} entre semana`;
  } else if (totalSemana > totalFinSemana) {
    habitWeekPattern.textContent = "Días de semana";
    habitWeekPatternDetail.textContent = `${formatearMoneda(totalSemana)} vs ${formatearMoneda(totalFinSemana)} en fin de semana`;
  } else {
    habitWeekPattern.textContent = "Empate";
    habitWeekPatternDetail.textContent = `Mismo egreso en ambos grupos: ${formatearMoneda(totalSemana)}`;
  }
}

function renderRachaEgresos(egresos) {
  if (egresos.length === 0) {
    habitExpenseStreak.textContent = "—";
    habitExpenseStreakDetail.textContent = "No hay egresos visibles para calcular racha.";
    return;
  }

  const diasUnicos = [...new Set(egresos.map((g) => g.fechaISO))].sort();
  let maxRacha = 1;
  let rachaActual = 1;

  for (let i = 1; i < diasUnicos.length; i++) {
    const anterior = new Date(`${diasUnicos[i - 1]}T00:00:00`);
    const actual = new Date(`${diasUnicos[i]}T00:00:00`);
    const diferencia = Math.round((actual - anterior) / 86400000);

    if (diferencia === 1) {
      rachaActual++;
      if (rachaActual > maxRacha) maxRacha = rachaActual;
    } else {
      rachaActual = 1;
    }
  }

  habitExpenseStreak.textContent = `${maxRacha} día(s)`;
  habitExpenseStreakDetail.textContent = "Mayor racha seguida con al menos un egreso";
}

function renderCategoriaQueMasCrecio() {
  const mesActualAnalisis = filtroMes.value || obtenerMesActual();
  const mesAnterior = obtenerMesAnterior(mesActualAnalisis);

  const egresosActual = movimientos.filter((m) => m.tipo === "egreso" && m.fechaISO.startsWith(mesActualAnalisis));
  const egresosAnterior = movimientos.filter((m) => m.tipo === "egreso" && m.fechaISO.startsWith(mesAnterior));

  if (egresosActual.length === 0 || egresosAnterior.length === 0) {
    habitGrowingCategory.textContent = "—";
    habitGrowingCategoryDetail.textContent = "No hay base suficiente entre mes actual y mes anterior.";
    return;
  }

  const actualPorCategoria = agruparMontosPorCategoria(egresosActual);
  const anteriorPorCategoria = agruparMontosPorCategoria(egresosAnterior);

  let mejorCategoria = null;
  let mayorDiferencia = 0;

  Object.keys(actualPorCategoria).forEach((categoria) => {
    const actual = actualPorCategoria[categoria] || 0;
    const anterior = anteriorPorCategoria[categoria] || 0;
    const diferencia = actual - anterior;

    if (diferencia > mayorDiferencia) {
      mayorDiferencia = diferencia;
      mejorCategoria = categoria;
    }
  });

  if (!mejorCategoria || mayorDiferencia <= 0) {
    habitGrowingCategory.textContent = "Sin aumento";
    habitGrowingCategoryDetail.textContent = `Ninguna categoría creció vs ${formatearMesTitulo(mesAnterior)}.`;
    return;
  }

  habitGrowingCategory.textContent = mejorCategoria;
  habitGrowingCategoryDetail.textContent = `${formatearMoneda(mayorDiferencia)} más que en ${formatearMesTitulo(mesAnterior)}`;
}

function agruparMontosPorCategoria(lista) {
  const agrupado = {};
  lista.forEach((mov) => {
    agrupado[mov.categoria] = (agrupado[mov.categoria] || 0) + mov.monto;
  });
  return agrupado;
}

function renderConclusionesHabitos(lista, ingresos, egresos) {
  const insights = [];

  if (egresos.length > 0) {
    const totalEgresos = egresos.reduce((acc, mov) => acc + mov.monto, 0);
    const promedio = totalEgresos / egresos.length;
    insights.push(`Tus egresos visibles suman ${formatearMoneda(totalEgresos)}.`);
    insights.push(`El egreso promedio por movimiento es ${formatearMoneda(promedio)}.`);
  } else {
    insights.push("No hay egresos visibles en los filtros actuales, así que no se puede detectar patrón de egreso.");
  }

  if (ingresos.length > 0) {
    const totalIngresos = ingresos.reduce((acc, mov) => acc + mov.monto, 0);
    insights.push(`Tus ingresos visibles suman ${formatearMoneda(totalIngresos)}.`);
  } else {
    insights.push("No hay ingresos visibles en los filtros actuales.");
  }

  insights.push(generarComparacionMesAnterior());

  const balanceVisible =
    ingresos.reduce((acc, mov) => acc + mov.monto, 0) -
    egresos.reduce((acc, mov) => acc + mov.monto, 0);

  if (balanceVisible > 0) {
    insights.push(`En el conjunto visible, tu balance es positivo: ${formatearMoneda(balanceVisible)}.`);
  } else if (balanceVisible < 0) {
    insights.push(`En el conjunto visible, tu balance es negativo: ${formatearMoneda(balanceVisible)}.`);
  } else {
    insights.push("En el conjunto visible, tus ingresos y egresos están equilibrados.");
  }

  habitosInsights.innerHTML = insights
    .map((texto) => `<div class="insight-item">${escapeHTML(texto)}</div>`)
    .join("");
}

function generarComparacionMesAnterior() {
  const mesActualAnalisis = filtroMes.value || obtenerMesActual();
  const mesAnterior = obtenerMesAnterior(mesActualAnalisis);

  const egresoMesActual = obtenerEgresoDelMes(mesActualAnalisis);
  const egresoMesAnterior = obtenerEgresoDelMes(mesAnterior);

  if (egresoMesActual === 0 && egresoMesAnterior === 0) {
    return "No hay egresos en el mes actual ni en el mes anterior para comparar.";
  }

  if (egresoMesAnterior === 0 && egresoMesActual > 0) {
    return `En ${formatearMesTitulo(mesActualAnalisis)} tienes egresos visibles, pero en ${formatearMesTitulo(mesAnterior)} no hay base para comparar.`;
  }

  const diferencia = egresoMesActual - egresoMesAnterior;
  const porcentaje = (Math.abs(diferencia) / egresoMesAnterior) * 100;

  if (diferencia > 0) {
    return `Egresaste ${formatearMoneda(diferencia)} más que en ${formatearMesTitulo(mesAnterior)} (${porcentaje.toFixed(1)}% más).`;
  }

  if (diferencia < 0) {
    return `Egresaste ${formatearMoneda(Math.abs(diferencia))} menos que en ${formatearMesTitulo(mesAnterior)} (${porcentaje.toFixed(1)}% menos).`;
  }

  return `Tus egresos en ${formatearMesTitulo(mesActualAnalisis)} son iguales a los de ${formatearMesTitulo(mesAnterior)}.`;
}

function obtenerMesAnterior(mesISO) {
  const [year, month] = mesISO.split("-").map(Number);
  const fecha = new Date(year, month - 2, 1);
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}`;
}

// GRÁFICO SALDO
function renderGraficoSaldoAcumulado(lista) {
  limpiarCanvasBalance();
  limpiarCanvasNavigator();
  ocultarTooltipGrafico();

  const datosCompletos = obtenerDatosSaldoAcumulado(lista);

  if (datosCompletos.length < 2) {
    balanceChartWrapper.classList.add("hidden");
    balanceChartEmptyState.classList.remove("hidden");
    saldoActualGraficoEl.textContent = "S/ 0.00";
    return;
  }

  balanceChartWrapper.classList.remove("hidden");
  balanceChartEmptyState.classList.add("hidden");
  saldoActualGraficoEl.textContent = formatearMoneda(datosCompletos[datosCompletos.length - 1].saldo);

  inicializarRangoGrafico(datosCompletos);
  const datosVisibles = obtenerDatosVisiblesGrafico(datosCompletos);

  dibujarGraficoSaldoAcumulado(datosVisibles);
  activarInteraccionGraficoSaldo(datosVisibles);

  dibujarNavigatorSaldo(datosCompletos);
  actualizarUIRangoGrafico(datosCompletos);
}

function inicializarRangoGrafico(datos) {
  const maxIndex = datos.length - 1;

  if (chartRange.end === 0 || chartRange.end > maxIndex) {
    const ventanaInicial = Math.min(8, datos.length - 1);
    chartRange.end = maxIndex;
    chartRange.start = Math.max(0, maxIndex - ventanaInicial);
  }

  if (chartRange.start < 0) chartRange.start = 0;
  if (chartRange.end > maxIndex) chartRange.end = maxIndex;

  if (chartRange.start >= chartRange.end) {
    chartRange.start = Math.max(0, chartRange.end - 1);
  }
}

function obtenerDatosVisiblesGrafico(datos) {
  return datos.slice(chartRange.start, chartRange.end + 1);
}

function limpiarCanvasNavigator() {
  ctxNavigator.clearRect(0, 0, canvasNavigator.width, canvasNavigator.height);
}

function dibujarNavigatorSaldo(datos) {
  const width = canvasNavigator.width;
  const height = canvasNavigator.height;

  const paddingX = 16;
  const paddingY = 12;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const valores = datos.map((item) => item.saldo);
  const minValor = Math.min(...valores, 0);
  const maxValor = Math.max(...valores, 0);
  const rango = maxValor - minValor || 1;
  const xStep = datos.length > 1 ? chartWidth / (datos.length - 1) : chartWidth;

  ctxNavigator.fillStyle = "#1f1d1b";
  ctxNavigator.fillRect(0, 0, width, height);

  ctxNavigator.beginPath();

  datos.forEach((dato, index) => {
    const x = paddingX + xStep * index;
    const y = paddingY + ((maxValor - dato.saldo) / rango) * chartHeight;

    if (index === 0) ctxNavigator.moveTo(x, y);
    else ctxNavigator.lineTo(x, y);
  });

  ctxNavigator.strokeStyle = "#5b8def";
  ctxNavigator.lineWidth = 2;
  ctxNavigator.lineJoin = "round";
  ctxNavigator.lineCap = "round";
  ctxNavigator.stroke();

  const yCero = paddingY + ((maxValor - 0) / rango) * chartHeight;
  ctxNavigator.beginPath();
  ctxNavigator.moveTo(paddingX, yCero);
  ctxNavigator.lineTo(width - paddingX, yCero);
  ctxNavigator.strokeStyle = "rgba(200, 155, 90, 0.25)";
  ctxNavigator.lineWidth = 1;
  ctxNavigator.stroke();
}

function actualizarUIRangoGrafico(datos) {
  const total = datos.length;
  if (total <= 1) return;

  const leftPercent = (chartRange.start / (total - 1)) * 100;
  const rightPercent = (chartRange.end / (total - 1)) * 100;
  const widthPercent = rightPercent - leftPercent;

  rangeSelection.style.left = `${leftPercent}%`;
  rangeSelection.style.width = `${Math.max(widthPercent, 8)}%`;
}

function obtenerDatosSaldoAcumulado(lista) {
  const movimientosOrdenados = [...lista].sort((a, b) => {
    const fechaA = new Date(`${a.fechaISO}T00:00:00`).getTime();
    const fechaB = new Date(`${b.fechaISO}T00:00:00`).getTime();
    if (fechaA !== fechaB) return fechaA - fechaB;
    return a.id - b.id;
  });

  if (movimientosOrdenados.length === 0) return [];

  const primerDia = movimientosOrdenados[0].fechaISO;
  const ultimoDia = movimientosOrdenados[movimientosOrdenados.length - 1].fechaISO;

  const mapaCambios = {};
  movimientosOrdenados.forEach((mov) => {
    mapaCambios[mov.fechaISO] = (mapaCambios[mov.fechaISO] || 0) + (mov.tipo === "ingreso" ? mov.monto : -mov.monto);
  });

  const dias = obtenerRangoDeFechas(primerDia, ultimoDia);
  const puntos = [];
  let saldoAcumulado = 0;

  dias.forEach((fechaISO) => {
    saldoAcumulado += mapaCambios[fechaISO] || 0;
    puntos.push({ fechaISO, label: formatearFechaCorta(fechaISO), saldo: saldoAcumulado });
  });

  return puntos;
}

function obtenerRangoDeFechas(fechaInicioISO, fechaFinISO) {
  const fechas = [];
  const actual = new Date(`${fechaInicioISO}T00:00:00`);
  const fin = new Date(`${fechaFinISO}T00:00:00`);

  while (actual <= fin) {
    fechas.push(obtenerFechaInput(actual));
    actual.setDate(actual.getDate() + 1);
  }

  return fechas;
}

function dibujarGraficoSaldoAcumulado(datos) {
  const width = canvasBalance.width;
  const height = canvasBalance.height;

  const paddingLeft = 80;
  const paddingRight = 24;
  const paddingTop = 26;
  const paddingBottom = 50;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const valores = datos.map((item) => item.saldo);
  const minValor = Math.min(...valores, 0);
  const maxValor = Math.max(...valores, 0);
  const rango = maxValor - minValor || 1;

  ctxBalance.fillStyle = COLOR_FONDO_GRAFICO;
  ctxBalance.fillRect(0, 0, width, height);

  dibujarLineasGuiaSaldo({
    width,
    paddingLeft,
    paddingRight,
    paddingTop,
    chartHeight,
    minValor,
    maxValor,
    rango
  });

  dibujarDivisoresMensuales(datos, {
    width,
    height,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingBottom,
    chartWidth
  });

  if (minValor <= 0 && maxValor >= 0) {
    const yCero = convertirValorAY(0, minValor, maxValor, paddingTop, chartHeight);
    ctxBalance.beginPath();
    ctxBalance.moveTo(paddingLeft, yCero);
    ctxBalance.lineTo(width - paddingRight, yCero);
    ctxBalance.strokeStyle = COLOR_LINEA_CERO;
    ctxBalance.lineWidth = 1.5;
    ctxBalance.stroke();
  }

  const xStep = datos.length > 1 ? chartWidth / (datos.length - 1) : chartWidth;

  dibujarEtiquetasTiempo(datos, {
    height,
    paddingLeft,
    paddingBottom,
    xStep
  });

  dibujarTramosSaldo(datos, {
    paddingLeft,
    xStep,
    minValor,
    maxValor,
    paddingTop,
    chartHeight
  });

  dibujarPuntoFinalSaldo(datos, {
    paddingLeft,
    xStep,
    minValor,
    maxValor,
    paddingTop,
    chartHeight
  });
}

function dibujarLineasGuiaSaldo({ width, paddingLeft, paddingRight, paddingTop, chartHeight, minValor, maxValor, rango }) {
  const lineasGuia = 5;

  for (let i = 0; i <= lineasGuia; i++) {
    const valor = maxValor - (rango / lineasGuia) * i;
    const y = convertirValorAY(valor, minValor, maxValor, paddingTop, chartHeight);

    ctxBalance.beginPath();
    ctxBalance.moveTo(paddingLeft, y);
    ctxBalance.lineTo(width - paddingRight, y);
    ctxBalance.strokeStyle = COLOR_LINEA_GUIA;
    ctxBalance.lineWidth = 1;
    ctxBalance.stroke();

    ctxBalance.fillStyle = COLOR_TEXTO_GRAFICO;
    ctxBalance.font = "12px Arial";
    ctxBalance.textAlign = "right";
    ctxBalance.textBaseline = "middle";
    ctxBalance.fillText(formatearMonedaCorta(valor), paddingLeft - 10, y);
  }
}

function dibujarDivisoresMensuales(datos, { height, paddingLeft, paddingBottom, paddingTop, chartWidth }) {
  if (datos.length < 2) return;
  const xStep = chartWidth / (datos.length - 1);

  for (let i = 1; i < datos.length; i++) {
    const mesActual = datos[i].fechaISO.slice(0, 7);
    const mesAnterior = datos[i - 1].fechaISO.slice(0, 7);

    if (mesActual !== mesAnterior) {
      const x = paddingLeft + xStep * i;
      ctxBalance.beginPath();
      ctxBalance.moveTo(x, paddingTop);
      ctxBalance.lineTo(x, height - paddingBottom);
      ctxBalance.strokeStyle = COLOR_MES_DIVISOR;
      ctxBalance.lineWidth = 1;
      ctxBalance.stroke();
    }
  }
}

function dibujarEtiquetasTiempo(datos, { height, paddingLeft, paddingBottom, xStep }) {
  const cantidadEtiquetas = 6;
  const pasoEtiquetas = Math.max(1, Math.ceil(datos.length / cantidadEtiquetas));

  datos.forEach((dato, index) => {
    const esUltimo = index === datos.length - 1;
    if (index % pasoEtiquetas !== 0 && !esUltimo) return;

    const x = paddingLeft + xStep * index;
    const y = height - paddingBottom + 20;

    const fecha = new Date(`${dato.fechaISO}T00:00:00`);
    const dia = String(fecha.getDate());

    ctxBalance.fillStyle = COLOR_TEXTO_GRAFICO;
    ctxBalance.font = "12px Arial";
    ctxBalance.textAlign = "center";
    ctxBalance.textBaseline = "middle";
    ctxBalance.fillText(dia, x, y);
  });
}

function dibujarTramosSaldo(datos, medidas) {
  const { paddingLeft, xStep, minValor, maxValor, paddingTop, chartHeight } = medidas;

  for (let i = 0; i < datos.length - 1; i++) {
    const actual = datos[i];
    const siguiente = datos[i + 1];

    const x1 = paddingLeft + xStep * i;
    const y1 = convertirValorAY(actual.saldo, minValor, maxValor, paddingTop, chartHeight);
    const x2 = paddingLeft + xStep * (i + 1);
    const y2 = convertirValorAY(siguiente.saldo, minValor, maxValor, paddingTop, chartHeight);

    const colorTramo = siguiente.saldo < actual.saldo ? COLOR_SALDO_BAJA : COLOR_SALDO_SUBE;

    ctxBalance.beginPath();
    ctxBalance.moveTo(x1, y1);
    ctxBalance.lineTo(x2, y2);
    ctxBalance.strokeStyle = colorTramo;
    ctxBalance.lineWidth = 3;
    ctxBalance.lineJoin = "round";
    ctxBalance.lineCap = "round";
    ctxBalance.stroke();
  }
}

function dibujarPuntoFinalSaldo(datos, medidas) {
  const { paddingLeft, xStep, minValor, maxValor, paddingTop, chartHeight } = medidas;
  const ultimo = datos[datos.length - 1];
  const penultimo = datos.length > 1 ? datos[datos.length - 2] : ultimo;

  const ultimoX = paddingLeft + xStep * (datos.length - 1);
  const ultimoY = convertirValorAY(ultimo.saldo, minValor, maxValor, paddingTop, chartHeight);
  const colorPuntoFinal = ultimo.saldo < penultimo.saldo ? COLOR_SALDO_BAJA : COLOR_SALDO_SUBE;

  ctxBalance.beginPath();
  ctxBalance.arc(ultimoX, ultimoY, 5, 0, Math.PI * 2);
  ctxBalance.fillStyle = colorPuntoFinal;
  ctxBalance.fill();
  ctxBalance.strokeStyle = "#ffffff";
  ctxBalance.lineWidth = 2;
  ctxBalance.stroke();
}

function convertirValorAY(valor, minValor, maxValor, paddingTop, chartHeight) {
  const rango = maxValor - minValor || 1;
  return paddingTop + ((maxValor - valor) / rango) * chartHeight;
}

function limpiarCanvasBalance() {
  ctxBalance.clearRect(0, 0, canvasBalance.width, canvasBalance.height);
}

function activarInteraccionGraficoSaldo(datos) {
  canvasBalance.onmousemove = (e) => manejarInteraccionGraficoSaldo(e, datos);
  canvasBalance.ontouchmove = (e) => manejarInteraccionGraficoSaldo(e, datos, true);
  canvasBalance.onmouseleave = ocultarTooltipGrafico;
  canvasBalance.ontouchend = ocultarTooltipGrafico;
}

function manejarInteraccionGraficoSaldo(e, datos, esTouch = false) {
  if (!datos.length) return;
  if (esTouch) e.preventDefault();

  const rect = canvasBalance.getBoundingClientRect();
  const punto = esTouch ? e.touches[0] : e;

  const xReal = punto.clientX - rect.left;
  const escalaX = canvasBalance.width / rect.width;
  const xCanvas = xReal * escalaX;

  const paddingLeft = 80;
  const paddingRight = 24;
  const chartWidth = canvasBalance.width - paddingLeft - paddingRight;
  const xStep = datos.length > 1 ? chartWidth / (datos.length - 1) : chartWidth;

  let indiceMasCercano = 0;
  let distanciaMinima = Infinity;

  datos.forEach((_, index) => {
    const xPunto = paddingLeft + xStep * index;
    const distancia = Math.abs(xCanvas - xPunto);
    if (distancia < distanciaMinima) {
      distanciaMinima = distancia;
      indiceMasCercano = index;
    }
  });

  const dato = datos[indiceMasCercano];
  mostrarTooltipGrafico(dato, indiceMasCercano, datos);
  redibujarGraficoConIndicador(datos, indiceMasCercano);
}

function redibujarGraficoConIndicador(datos, indiceActivo) {
  dibujarGraficoSaldoAcumulado(datos);

  const width = canvasBalance.width;
  const paddingLeft = 80;
  const paddingRight = 24;
  const paddingTop = 26;
  const paddingBottom = 50;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = canvasBalance.height - paddingTop - paddingBottom;

  const valores = datos.map((item) => item.saldo);
  const minValor = Math.min(...valores, 0);
  const maxValor = Math.max(...valores, 0);

  const xStep = datos.length > 1 ? chartWidth / (datos.length - 1) : chartWidth;
  const dato = datos[indiceActivo];
  const x = paddingLeft + xStep * indiceActivo;
  const y = convertirValorAY(dato.saldo, minValor, maxValor, paddingTop, chartHeight);

  ctxBalance.beginPath();
  ctxBalance.arc(x, y, 6, 0, Math.PI * 2);
  ctxBalance.fillStyle = "#6ea8ff";
  ctxBalance.fill();
  ctxBalance.strokeStyle = "#ffffff";
  ctxBalance.lineWidth = 2;
  ctxBalance.stroke();
}

function mostrarTooltipGrafico(dato, indice, datos) {
  chartTooltipDate.textContent = formatearFechaHumana(dato.fechaISO);
  chartTooltipValue.textContent = formatearMoneda(dato.saldo);
  chartTooltip.classList.add("show");

  const paddingLeft = 80;
  const paddingRight = 24;
  const chartWidth = canvasBalance.width - paddingLeft - paddingRight;
  const xStep = datos.length > 1 ? chartWidth / (datos.length - 1) : chartWidth;
  const xCanvas = paddingLeft + xStep * indice;

  const rect = canvasBalance.getBoundingClientRect();
  const leftVisual = (xCanvas / canvasBalance.width) * rect.width;

  chartTooltip.style.left = `${Math.max(12, Math.min(leftVisual - 50, rect.width - 130))}px`;
  chartTooltip.style.top = "12px";
}

function ocultarTooltipGrafico() {
  chartTooltip.classList.remove("show");
  const datos = obtenerDatosSaldoAcumulado(obtenerMovimientosFiltrados());
  if (datos.length >= 2) dibujarGraficoSaldoAcumulado(datos);
}

// GRÁFICO CIRCULAR
function renderGraficoCategorias(lista) {
  const egresos = lista.filter((mov) => mov.tipo === "egreso");
  const datos = obtenerDatosCategorias(egresos);

  limpiarCanvasGrafico();
  chartLegend.innerHTML = "";

  if (datos.length === 0) {
    chartWrapper.classList.add("hidden");
    chartEmptyState.classList.remove("hidden");
    return;
  }

  chartWrapper.classList.remove("hidden");
  chartEmptyState.classList.add("hidden");

  dibujarGraficoCircular(datos);
  renderLeyendaGrafico(datos);
}

function obtenerDatosCategorias(egresos) {
  const agrupado = {};
  egresos.forEach((mov) => {
    agrupado[mov.categoria] = (agrupado[mov.categoria] || 0) + mov.monto;
  });

  const totalEgresos = egresos.reduce((acc, mov) => acc + mov.monto, 0);

  return Object.entries(agrupado)
    .sort((a, b) => b[1] - a[1])
    .map(([categoria, total], index) => ({
      categoria,
      total,
      porcentaje: totalEgresos > 0 ? (total / totalEgresos) * 100 : 0,
      color: COLORES_GRAFICO[index % COLORES_GRAFICO.length]
    }));
}

function dibujarGraficoCircular(datos) {
  const centroX = canvasGrafico.width / 2;
  const centroY = canvasGrafico.height / 2;
  const radio = 110;
  let anguloInicial = -Math.PI / 2;

  datos.forEach((item) => {
    const anguloFinal = anguloInicial + (Math.PI * 2 * item.porcentaje) / 100;

    ctxGrafico.beginPath();
    ctxGrafico.moveTo(centroX, centroY);
    ctxGrafico.arc(centroX, centroY, radio, anguloInicial, anguloFinal);
    ctxGrafico.closePath();
    ctxGrafico.fillStyle = item.color;
    ctxGrafico.fill();

    ctxGrafico.lineWidth = 3;
    ctxGrafico.strokeStyle = "#ffffff";
    ctxGrafico.stroke();

    anguloInicial = anguloFinal;
  });

  ctxGrafico.beginPath();
  ctxGrafico.arc(centroX, centroY, 58, 0, Math.PI * 2);
  ctxGrafico.fillStyle = "#ffffff";
  ctxGrafico.fill();

  const totalGeneral = datos.reduce((acc, item) => acc + item.total, 0);

  ctxGrafico.fillStyle = "#64748b";
  ctxGrafico.font = "600 14px Arial";
  ctxGrafico.textAlign = "center";
  ctxGrafico.textBaseline = "middle";
  ctxGrafico.fillText("Total egresos", centroX, centroY - 12);

  ctxGrafico.fillStyle = "#0f172a";
  ctxGrafico.font = "700 18px Arial";
  ctxGrafico.fillText(formatearMoneda(totalGeneral), centroX, centroY + 14);
}

function renderLeyendaGrafico(datos) {
  chartLegend.innerHTML = datos.map((item) => `
    <div class="legend-item">
      <span class="legend-color" style="background: ${item.color};"></span>
      <div class="legend-content">
        <div class="legend-title-row">
          <span class="legend-name">${escapeHTML(item.categoria)}</span>
          <span class="legend-amount">${formatearMoneda(item.total)}</span>
        </div>
        <span class="legend-percent">${item.porcentaje.toFixed(1)}% del egreso</span>
      </div>
    </div>
  `).join("");
}

function limpiarCanvasGrafico() {
  ctxGrafico.clearRect(0, 0, canvasGrafico.width, canvasGrafico.height);
}

// CATEGORÍAS
function renderResumenCategorias(lista) {
  const egresos = lista.filter((mov) => mov.tipo === "egreso");
  const datos = obtenerDatosCategorias(egresos);

  if (datos.length === 0) {
    categoriasResumenEl.innerHTML = `<div class="empty-state">No hay egresos para mostrar en categorías con los filtros actuales.</div>`;
    return;
  }

  categoriasResumenEl.innerHTML = datos.map((item) => `
    <div class="category-item">
      <div class="category-top">
        <div class="category-name">${escapeHTML(item.categoria)}</div>
        <div class="category-meta">
          <span class="category-amount">${formatearMoneda(item.total)}</span>
          <span class="category-percent">${item.porcentaje.toFixed(1)}% del egreso</span>
        </div>
      </div>
      <div class="progress-track">
        <div class="progress-fill" style="width: ${item.porcentaje.toFixed(2)}%;"></div>
      </div>
    </div>
  `).join("");
}

// HISTORIAL
function renderHistorial(lista) {
  contadorMovimientosEl.textContent = lista.length === 1 ? "1 movimiento" : `${lista.length} movimientos`;

  if (lista.length === 0) {
    historyListEl.innerHTML = `<div class="empty-state">No hay movimientos para mostrar con los filtros actuales.</div>`;
    return;
  }

  historyListEl.innerHTML = lista.map((mov) => {
    const esIngreso = mov.tipo === "ingreso";
    const esInversion = mov.tipo === "egreso" && mov.subtipo === "inversion";

    const claseBadge = esIngreso ? "badge-ingreso" : esInversion ? "badge-inversion" : "badge-gasto";
    const claseMonto = esIngreso ? "monto-ingreso" : esInversion ? "monto-inversion" : "monto-gasto";
    const signo = esIngreso ? "+" : "-";

    let claseTipo = "egreso";
    if (esIngreso) claseTipo = "ingreso";
    if (esInversion) claseTipo = "inversion";

    const tipoVisible = esIngreso
      ? "Ingreso"
      : `Egreso${mov.subtipo ? ` • ${capitalizarTexto(mov.subtipo)}` : ""}`;

    return `
      <article class="movimiento-item ${claseTipo}">
        <div class="movimiento-top">
          <span class="movimiento-badge ${claseBadge}">${tipoVisible}</span>
          <strong class="movimiento-monto ${claseMonto}">${signo}${formatearMoneda(mov.monto)}</strong>
        </div>

        <div class="movimiento-body">
          <div class="movimiento-categoria">${escapeHTML(mov.categoria)}</div>
          <div class="movimiento-descripcion">${escapeHTML(mov.descripcion)}</div>
          <div class="movimiento-fecha">${escapeHTML(mov.fecha)} • ${escapeHTML(mov.hora)}</div>
        </div>

        <div class="movimiento-actions">
          <button class="btn btn-edit" type="button" onclick="editarMovimiento(${mov.id})">Editar</button>
          <button class="btn btn-delete" type="button" onclick="eliminarMovimiento(${mov.id})">Eliminar</button>
        </div>
      </article>
    `;
  }).join("");
}

// CRUD
function editarMovimiento(id) {
  const movimiento = movimientos.find((mov) => mov.id === id);
  if (!movimiento) {
    mostrarMensaje("No se encontró el movimiento.", "error");
    mostrarToast("No se encontró el movimiento", "error");
    return;
  }

  editandoId = id;
  tipoInput.value = movimiento.tipo;
  actualizarUIEgreso();
  subtipoEgresoInput.value = movimiento.subtipo || "";
  categoriaInput.value = movimiento.categoria;
  descripcionInput.value = movimiento.descripcion;
  montoInput.value = movimiento.monto;
  fechaInput.value = movimiento.fechaISO;

  btnSubmit.textContent = "Guardar cambios";
  btnCancelarEdicion.classList.remove("hidden");
  modalTitle.textContent = "Editar movimiento";

  mostrarMensaje("Estás editando un movimiento.", "success");
  abrirModalNuevoMovimiento();
}

function eliminarMovimiento(id) {
  if (!confirm("¿Seguro que quieres eliminar este movimiento?")) return;

  movimientos = movimientos.filter((mov) => mov.id !== id);

  if (editandoId === id) {
    resetFormulario();
  }

  guardarMovimientos();
  renderApp();
  mostrarMensaje("Movimiento eliminado correctamente.", "success");
  mostrarToast("Movimiento eliminado", "success");
}

function cancelarEdicion() {
  resetFormulario();
  cerrarModal();
  mostrarMensaje("Edición cancelada.", "success");
  mostrarToast("Edición cancelada", "success");
}

// EXPORTAR
function exportarMovimientosCSV() {
  const lista = obtenerMovimientosFiltrados();

  if (lista.length === 0) {
    mostrarToast("No hay movimientos para exportar", "error");
    return;
  }

  const encabezados = ["id", "tipo", "subtipo", "categoria", "descripcion", "monto", "fecha", "hora", "fechaISO"];
  const filas = lista.map((mov) => [
    mov.id,
    mov.tipo,
    mov.subtipo || "",
    mov.categoria,
    mov.descripcion,
    mov.monto,
    mov.fecha,
    mov.hora,
    mov.fechaISO
  ]);

  const csv = [encabezados, ...filas]
    .map((fila) => fila.map((valor) => `"${String(valor).replaceAll('"', '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = `movimientos-finanzas-${obtenerFechaInput(new Date())}.csv`;
  enlace.click();
  URL.revokeObjectURL(url);

  mostrarToast("CSV exportado", "success");
}

// UTILIDADES
function resetFormulario() {
  form.reset();
  editandoId = null;
  btnSubmit.textContent = "Guardar movimiento";
  btnCancelarEdicion.classList.add("hidden");
  modalTitle.textContent = "Nuevo movimiento";
  colocarFechaActualPorDefecto();
  actualizarUIEgreso();
  hintCategoria.textContent = "";
  hintDescripcion.textContent = "";
}

function validarFormulario({ tipo, subtipo, categoria, descripcion, monto, fecha }) {
  const errores = [];
  if (!tipo) errores.push("Debes seleccionar el tipo de movimiento.");
  if (tipo === "egreso" && !subtipo) errores.push("Debes seleccionar si el egreso es gasto o inversión.");
  if (!categoria) errores.push("Debes escribir una categoría.");
  if (categoria.length < 2) errores.push("La categoría debe tener al menos 2 caracteres.");
  if (!descripcion) errores.push("Debes escribir una descripción.");
  if (descripcion.length < 3) errores.push("La descripción debe tener al menos 3 caracteres.");
  if (!monto || isNaN(monto) || monto <= 0) errores.push("El monto debe ser mayor que 0.");
  if (!fecha) errores.push("Debes seleccionar una fecha.");
  return errores;
}

function colocarFechaActualPorDefecto() {
  fechaInput.value = obtenerFechaInput(new Date());
}

function guardarMovimientos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(movimientos));
}

function construirFechas(fechaInputValue) {
  const fechaBase = new Date(`${fechaInputValue}T12:00:00`);
  return {
    fechaVisible: fechaBase.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" }),
    horaVisible: new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }),
    fechaISO: fechaInputValue
  };
}

function obtenerFechaInput(fecha) {
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, "0");
  const day = String(fecha.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function obtenerMesActual() {
  const hoy = new Date();
  return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}`;
}

function formatearFechaCorta(fechaISO) {
  const fecha = new Date(`${fechaISO}T00:00:00`);
  return fecha.toLocaleDateString("es-PE", { day: "2-digit", month: "short" }).replace(".", "");
}

function formatearFechaHumana(fechaISO) {
  const fecha = new Date(`${fechaISO}T00:00:00`);
  const texto = fecha.toLocaleDateString("es-PE", { day: "2-digit", month: "long", year: "numeric" });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function formatearMesTitulo(mesISO) {
  const [year, month] = mesISO.split("-");
  const fecha = new Date(Number(year), Number(month) - 1, 1);
  const texto = fecha.toLocaleDateString("es-PE", { month: "long", year: "numeric" });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function formatearMoneda(valor) {
  return `S/ ${Number(valor).toFixed(2)}`;
}

function formatearMonedaCorta(valor) {
  const numero = Number(valor);
  if (Math.abs(numero) >= 1000) return `S/ ${(numero / 1000).toFixed(1)}k`;
  return `S/ ${numero.toFixed(0)}`;
}

function capitalizarTexto(texto) {
  return texto
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(" ");
}

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = `mensaje ${tipo}`;

  clearTimeout(mostrarMensaje.timeoutId);
  mostrarMensaje.timeoutId = setTimeout(() => {
    mensaje.textContent = "";
    mensaje.className = "mensaje";
  }, 3000);
}

function escapeHTML(texto) {
  return String(texto)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

window.editarMovimiento = editarMovimiento;
window.eliminarMovimiento = eliminarMovimiento;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js");
  });
}