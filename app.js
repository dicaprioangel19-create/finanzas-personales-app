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
const categoriaInput = document.getElementById("categoria");
const descripcionInput = document.getElementById("descripcion");
const montoInput = document.getElementById("monto");
const fechaInput = document.getElementById("fecha");
const btnSubmit = document.getElementById("btn-submit");
const btnCancelarEdicion = document.getElementById("btn-cancelar-edicion");
const mensaje = document.getElementById("mensaje");

// FILTROS
const filtroTipo = document.getElementById("filtro-tipo");
const filtroMes = document.getElementById("filtro-mes");
const btnLimpiarFiltros = document.getElementById("btn-limpiar-filtros");

// DASHBOARD
const totalIngresosEl = document.getElementById("total-ingresos");
const totalGastosEl = document.getElementById("total-gastos");
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
const historialEl = document.getElementById("historial");
const contadorMovimientosEl = document.getElementById("contador-movimientos");

// CATEGORÍAS
const categoriasResumenEl = document.getElementById("categorias-resumen");

// GRÁFICO CIRCULAR
const canvasGrafico = document.getElementById("grafico-categorias");
const ctxGrafico = canvasGrafico.getContext("2d");
const chartWrapper = document.getElementById("chart-wrapper");
const chartLegend = document.getElementById("chart-legend");
const chartEmptyState = document.getElementById("chart-empty-state");

// GRÁFICO SALDO ACUMULADO
const canvasBalance = document.getElementById("grafico-saldo-acumulado");
const ctxBalance = canvasBalance.getContext("2d");
const balanceChartWrapper = document.getElementById("balance-chart-wrapper");
const balanceChartEmptyState = document.getElementById("balance-chart-empty-state");

const COLORES_GRAFICO = [
  "#2563eb", "#16a34a", "#dc2626", "#d97706", "#7c3aed", "#0891b2",
  "#ea580c", "#4f46e5", "#65a30d", "#db2777", "#0f766e", "#9333ea"
];

const COLOR_SALDO_SUBE = "#2563eb";
const COLOR_SALDO_BAJA = "#dc2626";

document.addEventListener("DOMContentLoaded", () => {
  colocarFechaActualPorDefecto();
  inicializarMesPresupuesto();
  configurarSeguridadUI();
  iniciarSistemaPIN();
});

lockForm.addEventListener("submit", manejarLockForm);
form.addEventListener("submit", manejarSubmitFormulario);
btnCancelarEdicion.addEventListener("click", cancelarEdicion);

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
});

// PIN
function iniciarSistemaPIN() {
  if (pinGuardado) {
    mostrarModoUnlock();
  } else {
    mostrarModoSetup();
  }
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
  limpiarCamposLock();
  lockPinNew.focus();
}

function desbloquearApp() {
  lockScreen.classList.add("hidden");
  appContainer.classList.remove("hidden");
  limpiarCamposLock();
  configurarSeguridadUI();
  renderApp();
}

function bloquearAhora() {
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
    return;
  }

  pinGuardado = nuevo;
  localStorage.setItem(PIN_STORAGE_KEY, pinGuardado);
  mostrarMensajeLock("PIN configurado correctamente.", "success");
  setTimeout(() => desbloquearApp(), 500);
}

function validarPinNuevo(nuevo, confirmar) {
  if (!/^\d{4}$/.test(nuevo)) {
    return "El PIN debe tener exactamente 4 dígitos numéricos.";
  }
  if (nuevo !== confirmar) {
    return "La confirmación del PIN no coincide.";
  }
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
    return;
  }

  const error = validarPinNuevo(nuevo, confirmar);
  if (error) {
    mostrarMensajeSeguridad(error, "error");
    return;
  }

  pinGuardado = nuevo;
  localStorage.setItem(PIN_STORAGE_KEY, pinGuardado);
  configurarSeguridadUI();
  mostrarMensajeSeguridad(existePin ? "PIN actualizado correctamente." : "PIN configurado correctamente.", "success");
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

// MOVIMIENTOS
function manejarSubmitFormulario(e) {
  e.preventDefault();

  const tipo = tipoInput.value.trim();
  const categoria = capitalizarTexto(categoriaInput.value.trim());
  const descripcion = descripcionInput.value.trim();
  const monto = Number(montoInput.value);
  const fecha = fechaInput.value;

  const errores = validarFormulario({ tipo, categoria, descripcion, monto, fecha });
  if (errores.length > 0) {
    mostrarMensaje(errores[0], "error");
    return;
  }

  const { fechaVisible, horaVisible, fechaISO } = construirFechas(fecha);

  if (editandoId) {
    const index = movimientos.findIndex((mov) => mov.id === editandoId);

    if (index === -1) {
      mostrarMensaje("No se encontró el movimiento a editar.", "error");
      return;
    }

    movimientos[index] = {
      ...movimientos[index],
      tipo,
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
    mostrarMensaje("Movimiento actualizado correctamente.", "success");
    return;
  }

  movimientos.unshift({
    id: Date.now(),
    tipo,
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
  mostrarMensaje("Movimiento guardado correctamente.", "success");
}

function renderApp() {
  const movimientosFiltrados = obtenerMovimientosFiltrados();
  renderDashboard(movimientosFiltrados);
  renderPresupuestoMensual();
  renderHabitos(movimientosFiltrados);
  renderGraficoSaldoAcumulado();
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
  const totalIngresos = lista.filter((m) => m.tipo === "ingreso").reduce((a, m) => a + m.monto, 0);
  const totalGastos = lista.filter((m) => m.tipo === "gasto").reduce((a, m) => a + m.monto, 0);
  const balance = totalIngresos - totalGastos;

  totalIngresosEl.textContent = formatearMoneda(totalIngresos);
  totalGastosEl.textContent = formatearMoneda(totalGastos);
  balanceTotalEl.textContent = formatearMoneda(balance);
}

// PRESUPUESTO
function manejarSubmitPresupuesto(e) {
  e.preventDefault();

  const mes = presupuestoMesInput.value;
  const monto = Number(presupuestoMontoInput.value);

  if (!mes) {
    mostrarMensajePresupuesto("Debes seleccionar el mes del presupuesto.", "error");
    return;
  }

  if (!monto || isNaN(monto) || monto <= 0) {
    mostrarMensajePresupuesto("El presupuesto debe ser mayor que 0.", "error");
    return;
  }

  presupuestos[mes] = monto;
  guardarPresupuestos();
  renderApp();
  mostrarMensajePresupuesto("Presupuesto guardado correctamente.", "success");
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
}

function renderPresupuestoMensual() {
  const mesActivo = obtenerMesPresupuestoActivo();
  const presupuesto = Number(presupuestos[mesActivo] || 0);
  const gastoReal = obtenerGastoDelMes(mesActivo);

  presupuestoMesInput.value = mesActivo;
  presupuestoMontoInput.value = presupuesto > 0 ? presupuesto : "";

  budgetTitle.textContent = `Resumen del presupuesto de ${formatearMesTitulo(mesActivo)}`;
  budgetTotalEl.textContent = formatearMoneda(presupuesto);
  budgetSpentEl.textContent = formatearMoneda(gastoReal);

  if (presupuesto <= 0) {
    budgetRemainingEl.textContent = "—";
    budgetPercentEl.textContent = "—";
    actualizarEstadoSinPresupuesto(gastoReal);
    btnEliminarPresupuesto.classList.add("hidden");
    return;
  }

  const disponible = presupuesto - gastoReal;
  const porcentajeUsado = (gastoReal / presupuesto) * 100;

  budgetRemainingEl.textContent = formatearMoneda(disponible);
  budgetPercentEl.textContent = `${porcentajeUsado.toFixed(1)}%`;
  actualizarEstadoBarraPresupuesto(gastoReal, porcentajeUsado);
  btnEliminarPresupuesto.classList.remove("hidden");
}

function actualizarEstadoSinPresupuesto(gastoReal) {
  budgetProgressFill.className = "budget-progress-fill";
  budgetProgressFill.style.width = "0%";
  budgetProgressText.textContent = "—";
  budgetStatusLabel.textContent = gastoReal > 0
    ? "Tienes gastos registrados, pero no hay presupuesto configurado"
    : "Sin presupuesto configurado";
}

function obtenerMesPresupuestoActivo() {
  return filtroMes.value || obtenerMesActual();
}

function obtenerGastoDelMes(mesISO) {
  return movimientos
    .filter((mov) => mov.tipo === "gasto" && mov.fechaISO.startsWith(mesISO))
    .reduce((acc, mov) => acc + mov.monto, 0);
}

function actualizarEstadoBarraPresupuesto(gastoReal, porcentajeUsado) {
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

  const gastos = lista.filter((mov) => mov.tipo === "gasto");
  const ingresos = lista.filter((mov) => mov.tipo === "ingreso");

  renderMayorCategoriaGasto(gastos);
  renderPromedioGastos(gastos);
  renderDiaMasGasto(gastos);
  renderConteoMovimientos(lista, ingresos, gastos);
  renderGastoMasRepetido(gastos);
  renderSemanaVsFinDeSemana(gastos);
  renderRachaGastos(gastos);
  renderCategoriaQueMasCrecio();
  renderConclusionesHabitos(lista, ingresos, gastos);
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

function renderMayorCategoriaGasto(gastos) {
  if (gastos.length === 0) {
    habitTopCategory.textContent = "—";
    habitTopCategoryDetail.textContent = "No hay gastos visibles para analizar.";
    return;
  }

  const agrupado = {};
  gastos.forEach((mov) => {
    agrupado[mov.categoria] = (agrupado[mov.categoria] || 0) + mov.monto;
  });

  const [categoria, total] = Object.entries(agrupado).sort((a, b) => b[1] - a[1])[0];
  const totalGastos = gastos.reduce((acc, mov) => acc + mov.monto, 0);
  const porcentaje = totalGastos > 0 ? (total / totalGastos) * 100 : 0;

  habitTopCategory.textContent = categoria;
  habitTopCategoryDetail.textContent = `${formatearMoneda(total)} • ${porcentaje.toFixed(1)}% del gasto visible`;
}

function renderPromedioGastos(gastos) {
  if (gastos.length === 0) {
    habitAverageExpense.textContent = "—";
    habitAverageExpenseDetail.textContent = "No hay gastos visibles para calcular promedio.";
    return;
  }

  const total = gastos.reduce((acc, mov) => acc + mov.monto, 0);
  const promedio = total / gastos.length;

  habitAverageExpense.textContent = formatearMoneda(promedio);
  habitAverageExpenseDetail.textContent = `${gastos.length} gasto(s) visibles en este análisis`;
}

function renderDiaMasGasto(gastos) {
  if (gastos.length === 0) {
    habitTopDay.textContent = "—";
    habitTopDayDetail.textContent = "No hay gastos visibles por día.";
    return;
  }

  const agrupadoPorDia = {};
  gastos.forEach((mov) => {
    agrupadoPorDia[mov.fechaISO] = (agrupadoPorDia[mov.fechaISO] || 0) + mov.monto;
  });

  const [fechaISO, total] = Object.entries(agrupadoPorDia).sort((a, b) => b[1] - a[1])[0];
  habitTopDay.textContent = formatearFechaHumana(fechaISO);
  habitTopDayDetail.textContent = `${formatearMoneda(total)} gastados ese día`;
}

function renderConteoMovimientos(lista, ingresos, gastos) {
  habitMovementCount.textContent = `${lista.length}`;
  habitMovementCountDetail.textContent = `${ingresos.length} ingreso(s) • ${gastos.length} gasto(s) visibles`;
}

function renderGastoMasRepetido(gastos) {
  if (gastos.length === 0) {
    habitMostRepeatedExpense.textContent = "—";
    habitMostRepeatedExpenseDetail.textContent = "No hay gastos visibles para detectar repetición.";
    return;
  }

  const frecuencia = {};
  const montos = {};

  gastos.forEach((mov) => {
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

function renderSemanaVsFinDeSemana(gastos) {
  if (gastos.length === 0) {
    habitWeekPattern.textContent = "—";
    habitWeekPatternDetail.textContent = "No hay gastos visibles para comparar días.";
    return;
  }

  let totalSemana = 0;
  let totalFinSemana = 0;

  gastos.forEach((mov) => {
    const fecha = new Date(`${mov.fechaISO}T00:00:00`);
    const dia = fecha.getDay();

    if (dia === 0 || dia === 6) {
      totalFinSemana += mov.monto;
    } else {
      totalSemana += mov.monto;
    }
  });

  if (totalFinSemana > totalSemana) {
    habitWeekPattern.textContent = "Fines de semana";
    habitWeekPatternDetail.textContent = `${formatearMoneda(totalFinSemana)} vs ${formatearMoneda(totalSemana)} entre semana`;
  } else if (totalSemana > totalFinSemana) {
    habitWeekPattern.textContent = "Días de semana";
    habitWeekPatternDetail.textContent = `${formatearMoneda(totalSemana)} vs ${formatearMoneda(totalFinSemana)} en fin de semana`;
  } else {
    habitWeekPattern.textContent = "Empate";
    habitWeekPatternDetail.textContent = `Mismo gasto en ambos grupos: ${formatearMoneda(totalSemana)}`;
  }
}

function renderRachaGastos(gastos) {
  if (gastos.length === 0) {
    habitExpenseStreak.textContent = "—";
    habitExpenseStreakDetail.textContent = "No hay gastos visibles para calcular racha.";
    return;
  }

  const diasUnicos = [...new Set(gastos.map((g) => g.fechaISO))].sort();
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
  habitExpenseStreakDetail.textContent = "Mayor racha seguida con al menos un gasto";
}

function renderCategoriaQueMasCrecio() {
  const mesActualAnalisis = filtroMes.value || obtenerMesActual();
  const mesAnterior = obtenerMesAnterior(mesActualAnalisis);

  const gastosActual = movimientos.filter((m) => m.tipo === "gasto" && m.fechaISO.startsWith(mesActualAnalisis));
  const gastosAnterior = movimientos.filter((m) => m.tipo === "gasto" && m.fechaISO.startsWith(mesAnterior));

  if (gastosActual.length === 0 || gastosAnterior.length === 0) {
    habitGrowingCategory.textContent = "—";
    habitGrowingCategoryDetail.textContent = "No hay base suficiente entre mes actual y mes anterior.";
    return;
  }

  const actualPorCategoria = agruparMontosPorCategoria(gastosActual);
  const anteriorPorCategoria = agruparMontosPorCategoria(gastosAnterior);

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

function agruparMontosPorCategoria(gastos) {
  const agrupado = {};
  gastos.forEach((mov) => {
    agrupado[mov.categoria] = (agrupado[mov.categoria] || 0) + mov.monto;
  });
  return agrupado;
}

function renderConclusionesHabitos(lista, ingresos, gastos) {
  const insights = [];

  if (gastos.length > 0) {
    const totalGastos = gastos.reduce((acc, mov) => acc + mov.monto, 0);
    const promedio = totalGastos / gastos.length;
    insights.push(`Tus gastos visibles suman ${formatearMoneda(totalGastos)}.`);
    insights.push(`El gasto promedio por movimiento es ${formatearMoneda(promedio)}.`);
  } else {
    insights.push("No hay gastos visibles en los filtros actuales, así que no se puede detectar patrón de gasto.");
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
    gastos.reduce((acc, mov) => acc + mov.monto, 0);

  if (balanceVisible > 0) {
    insights.push(`En el conjunto visible, tu balance es positivo: ${formatearMoneda(balanceVisible)}.`);
  } else if (balanceVisible < 0) {
    insights.push(`En el conjunto visible, tu balance es negativo: ${formatearMoneda(balanceVisible)}.`);
  } else {
    insights.push("En el conjunto visible, tus ingresos y gastos están equilibrados.");
  }

  habitosInsights.innerHTML = insights
    .map((texto) => `<div class="insight-item">${escapeHTML(texto)}</div>`)
    .join("");
}

function generarComparacionMesAnterior() {
  const mesActualAnalisis = filtroMes.value || obtenerMesActual();
  const mesAnterior = obtenerMesAnterior(mesActualAnalisis);

  const gastoMesActual = obtenerGastoDelMes(mesActualAnalisis);
  const gastoMesAnterior = obtenerGastoDelMes(mesAnterior);

  if (gastoMesActual === 0 && gastoMesAnterior === 0) {
    return "No hay gastos en el mes actual ni en el mes anterior para comparar.";
  }

  if (gastoMesAnterior === 0 && gastoMesActual > 0) {
    return `En ${formatearMesTitulo(mesActualAnalisis)} tienes gastos visibles, pero en ${formatearMesTitulo(mesAnterior)} no hay base para comparar.`;
  }

  const diferencia = gastoMesActual - gastoMesAnterior;
  const porcentaje = (Math.abs(diferencia) / gastoMesAnterior) * 100;

  if (diferencia > 0) {
    return `Gastaste ${formatearMoneda(diferencia)} más que en ${formatearMesTitulo(mesAnterior)} (${porcentaje.toFixed(1)}% más).`;
  }

  if (diferencia < 0) {
    return `Gastaste ${formatearMoneda(Math.abs(diferencia))} menos que en ${formatearMesTitulo(mesAnterior)} (${porcentaje.toFixed(1)}% menos).`;
  }

  return `Tus gastos en ${formatearMesTitulo(mesActualAnalisis)} son iguales a los de ${formatearMesTitulo(mesAnterior)}.`;
}

function obtenerMesAnterior(mesISO) {
  const [year, month] = mesISO.split("-").map(Number);
  const fecha = new Date(year, month - 2, 1);
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}`;
}

// SALDO ACUMULADO
function renderGraficoSaldoAcumulado() {
  limpiarCanvasBalance();
  const datos = obtenerDatosSaldoAcumulado();

  if (datos.length < 2) {
    balanceChartWrapper.classList.add("hidden");
    balanceChartEmptyState.classList.remove("hidden");
    return;
  }

  balanceChartWrapper.classList.remove("hidden");
  balanceChartEmptyState.classList.add("hidden");
  dibujarGraficoSaldoAcumulado(datos);
}

function obtenerDatosSaldoAcumulado() {
  const movimientosOrdenados = [...movimientos].sort((a, b) => {
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

  ctxBalance.fillStyle = "#f8fafc";
  ctxBalance.fillRect(0, 0, width, height);

  const lineasGuia = 5;
  for (let i = 0; i <= lineasGuia; i++) {
    const valor = maxValor - (rango / lineasGuia) * i;
    const y = convertirValorAY(valor, minValor, maxValor, paddingTop, chartHeight);

    ctxBalance.beginPath();
    ctxBalance.moveTo(paddingLeft, y);
    ctxBalance.lineTo(width - paddingRight, y);
    ctxBalance.strokeStyle = "#e5e7eb";
    ctxBalance.lineWidth = 1;
    ctxBalance.stroke();

    ctxBalance.fillStyle = "#64748b";
    ctxBalance.font = "12px Arial";
    ctxBalance.textAlign = "right";
    ctxBalance.textBaseline = "middle";
    ctxBalance.fillText(formatearMonedaCorta(valor), paddingLeft - 10, y);
  }

  if (minValor <= 0 && maxValor >= 0) {
    const yCero = convertirValorAY(0, minValor, maxValor, paddingTop, chartHeight);
    ctxBalance.beginPath();
    ctxBalance.moveTo(paddingLeft, yCero);
    ctxBalance.lineTo(width - paddingRight, yCero);
    ctxBalance.strokeStyle = "#94a3b8";
    ctxBalance.lineWidth = 1.5;
    ctxBalance.stroke();
  }

  const xStep = datos.length > 1 ? chartWidth / (datos.length - 1) : chartWidth;
  const cantidadEtiquetas = 6;
  const pasoEtiquetas = Math.max(1, Math.ceil(datos.length / cantidadEtiquetas));

  datos.forEach((dato, index) => {
    const esUltimo = index === datos.length - 1;
    if (index % pasoEtiquetas !== 0 && !esUltimo) return;

    const x = paddingLeft + xStep * index;
    const y = height - paddingBottom + 20;

    ctxBalance.fillStyle = "#64748b";
    ctxBalance.font = "12px Arial";
    ctxBalance.textAlign = "center";
    ctxBalance.textBaseline = "middle";
    ctxBalance.fillText(dato.label, x, y);
  });

  dibujarTramosSaldo(datos, { paddingLeft, xStep, minValor, maxValor, paddingTop, chartHeight });
  dibujarPuntoFinalSaldo(datos, { paddingLeft, xStep, minValor, maxValor, paddingTop, chartHeight });
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

// GRÁFICO CIRCULAR
function renderGraficoCategorias(lista) {
  const gastos = lista.filter((mov) => mov.tipo === "gasto");
  const datos = obtenerDatosCategorias(gastos);

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

function obtenerDatosCategorias(gastos) {
  const agrupado = {};
  gastos.forEach((mov) => {
    agrupado[mov.categoria] = (agrupado[mov.categoria] || 0) + mov.monto;
  });

  const totalGastos = gastos.reduce((acc, mov) => acc + mov.monto, 0);

  return Object.entries(agrupado)
    .sort((a, b) => b[1] - a[1])
    .map(([categoria, total], index) => ({
      categoria,
      total,
      porcentaje: totalGastos > 0 ? (total / totalGastos) * 100 : 0,
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
  ctxGrafico.fillText("Total gastos", centroX, centroY - 12);

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
        <span class="legend-percent">${item.porcentaje.toFixed(1)}% del gasto</span>
      </div>
    </div>
  `).join("");
}

function limpiarCanvasGrafico() {
  ctxGrafico.clearRect(0, 0, canvasGrafico.width, canvasGrafico.height);
}

// CATEGORÍAS
function renderResumenCategorias(lista) {
  const gastos = lista.filter((mov) => mov.tipo === "gasto");
  const datos = obtenerDatosCategorias(gastos);

  if (datos.length === 0) {
    categoriasResumenEl.innerHTML = `<div class="empty-state">No hay gastos para mostrar en categorías con los filtros actuales.</div>`;
    return;
  }

  categoriasResumenEl.innerHTML = datos.map((item) => `
    <div class="category-item">
      <div class="category-top">
        <div class="category-name">${escapeHTML(item.categoria)}</div>
        <div class="category-meta">
          <span class="category-amount">${formatearMoneda(item.total)}</span>
          <span class="category-percent">${item.porcentaje.toFixed(1)}% del gasto</span>
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
    historialEl.innerHTML = `<div class="empty-state">No hay movimientos para mostrar con los filtros actuales.</div>`;
    return;
  }

  historialEl.innerHTML = lista.map((mov) => {
    const claseBadge = mov.tipo === "ingreso" ? "badge-ingreso" : "badge-gasto";
    const claseMonto = mov.tipo === "ingreso" ? "monto-ingreso" : "monto-gasto";
    const signo = mov.tipo === "ingreso" ? "+" : "-";

    return `
      <article class="movimiento-item">
        <div class="movimiento-top">
          <span class="movimiento-badge ${claseBadge}">${mov.tipo}</span>
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
    return;
  }

  editandoId = id;
  tipoInput.value = movimiento.tipo;
  categoriaInput.value = movimiento.categoria;
  descripcionInput.value = movimiento.descripcion;
  montoInput.value = movimiento.monto;
  fechaInput.value = movimiento.fechaISO;

  btnSubmit.textContent = "Guardar cambios";
  btnCancelarEdicion.classList.remove("hidden");

  mostrarMensaje("Estás editando un movimiento.", "success");
  window.scrollTo({ top: 0, behavior: "smooth" });
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
}

function cancelarEdicion() {
  resetFormulario();
  mostrarMensaje("Edición cancelada.", "success");
}

// UTILIDADES
function resetFormulario() {
  form.reset();
  editandoId = null;
  btnSubmit.textContent = "Guardar movimiento";
  btnCancelarEdicion.classList.add("hidden");
  colocarFechaActualPorDefecto();
}

function validarFormulario({ tipo, categoria, descripcion, monto, fecha }) {
  const errores = [];
  if (!tipo) errores.push("Debes seleccionar el tipo de movimiento.");
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