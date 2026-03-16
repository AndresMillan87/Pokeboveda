// =============================================
//   TIENDA POKÉMON TCG — script.js
//   ✏️ Solo cambia TU_NUMERO_WHATSAPP abajo
// =============================================

// ✏️ CAMBIA ESTE NÚMERO POR EL TUYO (solo dígitos, con código de país)
// Colombia = 57 + tu número sin el 0 inicial
// Ejemplo: si tu número es 311 234 5678 → pon 573112345678
const TU_NUMERO_WHATSAPP = "573112345678";

// --- Estado del carrito ---
let carrito = [];

// --- Agregar carta al carrito ---
function agregarAlCarrito(nombre, precio, set) {
  const existente = carrito.find(item => item.nombre === nombre);

  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ nombre, precio, set, cantidad: 1 });
  }

  actualizarCarrito();

  // Animación visual en el botón
  const botones = document.querySelectorAll('.btn-agregar');
  botones.forEach(btn => {
    if (btn.getAttribute('onclick').includes(nombre)) {
      btn.textContent = '✓ Agregado';
      btn.classList.add('agregado');
      setTimeout(() => {
        btn.textContent = '+ Agregar';
        btn.classList.remove('agregado');
      }, 1200);
    }
  });

  // Abrir carrito automáticamente
  abrirCarrito();
}

// --- Cambiar cantidad de un ítem ---
function cambiarCantidad(nombre, delta) {
  const item = carrito.find(i => i.nombre === nombre);
  if (!item) return;

  item.cantidad += delta;

  if (item.cantidad <= 0) {
    carrito = carrito.filter(i => i.nombre !== nombre);
  }

  actualizarCarrito();
}

// --- Actualizar la vista del carrito ---
function actualizarCarrito() {
  const contenedor = document.getElementById('carrito-items');
  const footer     = document.getElementById('carrito-footer');
  const totalEl    = document.getElementById('carrito-total');
  const countEl    = document.getElementById('carrito-count');

  // Contar ítems totales
  const totalItems = carrito.reduce((acc, i) => acc + i.cantidad, 0);
  countEl.textContent = totalItems;

  if (carrito.length === 0) {
    contenedor.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>';
    footer.style.display = 'none';
    return;
  }

  // Construir lista de ítems
  contenedor.innerHTML = carrito.map(item => `
    <div class="carrito-item">
      <div>
        <div class="item-nombre">${item.nombre}</div>
        <div class="item-set">${item.set}</div>
      </div>
      <div class="item-controles">
        <button onclick="cambiarCantidad('${item.nombre}', -1)">−</button>
        <span class="item-cantidad">${item.cantidad}</span>
        <button onclick="cambiarCantidad('${item.nombre}', +1)">+</button>
      </div>
      <div class="item-precio">${formatearPrecio(item.precio * item.cantidad)}</div>
    </div>
  `).join('');

  // Calcular total
  const total = carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  totalEl.textContent = formatearPrecio(total);
  footer.style.display = 'flex';
}

// --- Formatear precio en pesos colombianos ---
function formatearPrecio(valor) {
  return '$' + valor.toLocaleString('es-CO');
}

// --- Abrir / cerrar carrito ---
function abrirCarrito() {
  document.getElementById('carrito-panel').classList.add('abierto');
  document.getElementById('carrito-overlay').classList.add('visible');
}

function toggleCarrito() {
  document.getElementById('carrito-panel').classList.toggle('abierto');
  document.getElementById('carrito-overlay').classList.toggle('visible');
}

// --- Vaciar carrito ---
function vaciarCarrito() {
  carrito = [];
  actualizarCarrito();
}

// --- Enviar pedido a WhatsApp ---
function enviarWhatsApp() {
  if (carrito.length === 0) return;

  const total = carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0);

  // Armar el mensaje
  let mensaje = '¡Hola! Quiero hacer el siguiente pedido:\n\n';

  carrito.forEach(item => {
    mensaje += `• ${item.cantidad}x ${item.nombre} (${item.set}) — ${formatearPrecio(item.precio * item.cantidad)}\n`;
  });

  mensaje += `\n*Total: ${formatearPrecio(total)}*`;
  mensaje += '\n\n¿Cómo coordino el pago?';

  // Crear enlace de WhatsApp
  const url = `https://wa.me/${TU_NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}

// --- Filtrar cartas por categoría ---
function filtrar(categoria, boton) {
  // Actualizar botón activo
  document.querySelectorAll('.filtro').forEach(b => b.classList.remove('activo'));
  boton.classList.add('activo');

  // Mostrar u ocultar cartas
  document.querySelectorAll('.carta').forEach(carta => {
    if (categoria === 'todos' || carta.dataset.categoria === categoria) {
      carta.classList.remove('oculta');
    } else {
      carta.classList.add('oculta');
    }
  });
}
