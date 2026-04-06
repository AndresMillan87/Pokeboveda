// =============================================
//   POKEBOVEDA TCG — script.js
//   ✏️ Cambia TU_NUMERO_WHATSAPP por el tuyo
// =============================================

const TU_NUMERO_WHATSAPP = "573112345678";

// --- Subtipos disponibles por cada tipo de carta ---
// ✏️ Puedes agregar o quitar subtipos aquí
const SUBTIPOS = {
  pokemon:   ['Normal', 'Holo', 'Reverse Holo', 'Full Art', 'Special Art', 'Rainbow', 'Gold'],
  ex:        ['Holo', 'Full Art', 'Special Art', 'Hyper Rare', 'Rainbow', 'Gold'],
  item:      ['Normal', 'Reverse Holo', 'Full Art', 'Gold'],
  supporter: ['Normal', 'Reverse Holo', 'Full Art', 'Special Art', 'Gold'],
  estadio:   ['Normal', 'Reverse Holo', 'Full Art'],
  tool:      ['Normal', 'Reverse Holo', 'Full Art', 'Gold'],
  energia:   ['Normal', 'Especial', 'Rainbow', 'Gold'],
};

// Estado actual de filtros
let tipoActivo    = 'todos';
let subtipoActivo = 'todos';

// --- Seleccionar tipo (nivel 1) ---
function seleccionarTipo(tipo, boton) {
  tipoActivo    = tipo;
  subtipoActivo = 'todos';

  // Resaltar botón activo
  document.querySelectorAll('.filtro-tipo').forEach(b => b.classList.remove('activo'));
  boton.classList.add('activo');

  // Construir filtros de subtipo
  const contenedor = document.getElementById('filtros-nivel2');

  if (tipo === 'todos') {
    contenedor.classList.remove('visible');
    contenedor.innerHTML = '';
  } else {
    const opciones = SUBTIPOS[tipo] || [];
    contenedor.innerHTML = `
      <button class="filtro-subtipo activo" onclick="seleccionarSubtipo('todos', this)">Todos</button>
      ${opciones.map(s => `
        <button class="filtro-subtipo"
          onclick="seleccionarSubtipo('${s.toLowerCase().replace(/ /g, '-')}', this)">
          ${s}
        </button>
      `).join('')}
    `;
    // Pequeño delay para que la animación se vea bien
    setTimeout(() => contenedor.classList.add('visible'), 10);
  }

  aplicarFiltros();
}

// --- Seleccionar subtipo (nivel 2) ---
function seleccionarSubtipo(subtipo, boton) {
  subtipoActivo = subtipo;

  document.querySelectorAll('.filtro-subtipo').forEach(b => b.classList.remove('activo'));
  boton.classList.add('activo');

  aplicarFiltros();
}

// --- Aplicar ambos filtros al catálogo ---
function aplicarFiltros() {
  document.querySelectorAll('.carta').forEach(carta => {
    const matchTipo    = tipoActivo === 'todos'    || carta.dataset.tipo    === tipoActivo;
    const matchSubtipo = subtipoActivo === 'todos' || carta.dataset.subtipo === subtipoActivo;

    if (matchTipo && matchSubtipo) {
      carta.classList.remove('oculta');
    } else {
      carta.classList.add('oculta');
    }
  });
}

// --- Carrito ---
let carrito = [];

function agregarAlCarrito(nombre, precio, set) {
  const existente = carrito.find(i => i.nombre === nombre);
  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ nombre, precio, set, cantidad: 1 });
  }
  actualizarCarrito();

  // Feedback visual en el botón
  document.querySelectorAll('.btn-agregar').forEach(btn => {
    if (btn.getAttribute('onclick').includes(nombre.replace(/'/g, "\\'"))) {
      btn.textContent = '✓ Agregado';
      btn.classList.add('agregado');
      setTimeout(() => {
        btn.textContent = '+ Agregar';
        btn.classList.remove('agregado');
      }, 1200);
    }
  });

  abrirCarrito();
}

function cambiarCantidad(nombre, delta) {
  const item = carrito.find(i => i.nombre === nombre);
  if (!item) return;
  item.cantidad += delta;
  if (item.cantidad <= 0) carrito = carrito.filter(i => i.nombre !== nombre);
  actualizarCarrito();
}

function actualizarCarrito() {
  const contenedor = document.getElementById('carrito-items');
  const footer     = document.getElementById('carrito-footer');
  const totalEl    = document.getElementById('carrito-total');
  const countEl    = document.getElementById('carrito-count');

  const totalItems = carrito.reduce((acc, i) => acc + i.cantidad, 0);
  countEl.textContent = totalItems;

  if (carrito.length === 0) {
    contenedor.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>';
    footer.style.display = 'none';
    return;
  }

  contenedor.innerHTML = carrito.map(item => `
    <div class="carrito-item">
      <div>
        <div class="item-nombre">${item.nombre}</div>
        <div class="item-set">${item.set}</div>
      </div>
      <div class="item-controles">
        <button onclick="cambiarCantidad('${item.nombre.replace(/'/g,"\\'")}', -1)">−</button>
        <span class="item-cantidad">${item.cantidad}</span>
        <button onclick="cambiarCantidad('${item.nombre.replace(/'/g,"\\'")}', +1)">+</button>
      </div>
      <div class="item-precio">${fmt(item.precio * item.cantidad)}</div>
    </div>
  `).join('');

  const total = carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  totalEl.textContent = fmt(total);
  footer.style.display = 'flex';
}

function fmt(v) {
  return '$' + v.toLocaleString('es-CO');
}

function abrirCarrito() {
  document.getElementById('carrito-panel').classList.add('abierto');
  document.getElementById('carrito-overlay').classList.add('visible');
}

function toggleCarrito() {
  document.getElementById('carrito-panel').classList.toggle('abierto');
  document.getElementById('carrito-overlay').classList.toggle('visible');
}

function vaciarCarrito() {
  carrito = [];
  actualizarCarrito();
}

function enviarWhatsApp() {
  if (carrito.length === 0) return;
  const total = carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0);

  let mensaje = '¡Hola! Quiero hacer el siguiente pedido:\n\n';
  carrito.forEach(item => {
    mensaje += `• ${item.cantidad}x ${item.nombre} (${item.set}) — ${fmt(item.precio * item.cantidad)}\n`;
  });
  mensaje += `\n*Total: ${fmt(total)}*\n\n¿Cómo coordino el pago?`;

  window.open(`https://wa.me/${TU_NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`, '_blank');
}
