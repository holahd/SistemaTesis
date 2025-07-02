// --- 2.1: Clave de almacenamiento ---
const STORAGE_KEY = 'notificaciones';


// Cola FIFO de notificaciones por mostrar
const colaNotis = [];

// Llamamos a este método para “encolar” una notificación
function encolarNotificacion(noti) {
  // Evita duplicados (tipo+id_ref)
  if (!notificaciones.some(n => n.tipo===noti.tipo && n.id_ref==noti.id_ref)) {
    notificaciones.unshift(noti);
    guardarNotificaciones();
  }
  colaNotis.push(noti);
  // Si no hay ninguna mostrando ahora, lanza la primera
  if (colaNotis.length === 1) mostrarSiguientePopup();
}

function mostrarSiguientePopup() {
  if (colaNotis.length === 0) return;
  const noti = colaNotis[0];
  // Si el rol no coincide, la descartamos y pasamos a la siguiente
  if (!(USER_ROLE === 'admin' || noti.tipo === USER_ROLE)) {
    colaNotis.shift();
    mostrarSiguientePopup();
    return;
  }
  // Render Texto
  document.getElementById("noti-popup-msg").textContent = noti.mensaje;
  document.getElementById("noti-popup").style.display = "block";
}

// Al hacer clic en “✖” cerramos y pasamos al siguiente
document.getElementById("noti-popup-close").addEventListener("click", () => {
  document.getElementById("noti-popup").style.display = "none";
  colaNotis.shift();
  // refresca badge/lista visible
  renderUnaNotiEnLista(colaNotis[0]); // opcional: si quieres que cada noti también aparezca en la lista lateral
  mostrarSiguientePopup();
});


// --- 2.2: Array en memoria ---
let notificaciones = [];

// --- 2.3: Helper de guardado y carga ---
function guardarNotificaciones() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notificaciones));
}

function cargarNotificaciones() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) notificaciones = JSON.parse(data);
    // Renderiza solo las que le corresponden a USER_ROLE
    notificaciones
        .filter(n => USER_ROLE === 'admin' || n.tipo === USER_ROLE)
        .forEach(renderNotificacionUI);
    actualizarBadge();
}

// --- 2.4: Renderizado en DOM ---
function renderNotificacionUI(noti) {
    const lista = document.getElementById("notificaciones-lista");
    const li = document.createElement("li");
    li.className = "d-flex justify-content-between align-items-start mb-1";
    li.id = `noti-${noti.tipo}-${noti.id_ref}`;
    li.innerHTML = `
      <span>• ${noti.mensaje}</span>
      <button class="btn btn-sm btn-link text-danger p-0 ms-2"
              onclick="eliminarNotificacion('${noti.tipo}','${noti.id_ref}')">
        ✖
      </button>`;
    lista.prepend(li);
}

// --- 2.5: Eliminar una sola ---
function eliminarNotificacion(tipo, id_ref) {
    Swal.fire({
        title: '¿Eliminar esta notificación?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then(res => {
        if (res.isConfirmed) {
            notificaciones = notificaciones.filter(n => !(n.tipo === tipo && n.id_ref == id_ref));
            guardarNotificaciones();
            document.getElementById(`noti-${tipo}-${id_ref}`)?.remove();
            actualizarBadge();
        }
    });
}

// --- 2.6: Eliminar todas las filtradas (ya tienes eliminarTodas) ---
function eliminarTodas() {
    Swal.fire({
        title: '¿Eliminar todas las notificaciones?',
        text: "No se podrán recuperar.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then(res => {
        if (res.isConfirmed) {
            // Quitamos solo las de este rol (o todas si admin)
            if (USER_ROLE === 'admin') {
                notificaciones = [];
            } else {
                notificaciones = notificaciones.filter(n => n.tipo !== USER_ROLE);
            }
            guardarNotificaciones();
            document.getElementById("notificaciones-lista").innerHTML = '';
            actualizarBadge();
            Swal.fire('Hecho', 'Notificaciones eliminadas.', 'success');
        }
    });
}

// --- 2.7: Badge de contador ---
function actualizarBadge() {
    const count = notificaciones.filter(n => USER_ROLE === 'admin' || n.tipo === USER_ROLE).length;
    const badge = document.getElementById("badge-noti");
    if (count) {
        badge.style.display = "inline-block";
        badge.textContent = count;
    } else {
        badge.style.display = "none";
    }
}

// --- 2.8: Procesar llegada nueva(not server) y mostrar burbuja solo si aplica ---
function procesarNotificacion(noti) {
    // noti = { tipo, id_ref, mensaje }
    const existe = notificaciones.some(n => n.tipo === noti.tipo && n.id_ref == noti.id_ref);
    if (existe) return;
    notificaciones.unshift(noti);
    guardarNotificaciones();

    // Si al rol le corresponde verla...
    if (USER_ROLE === 'admin' || noti.tipo === USER_ROLE) {
        renderNotificacionUI(noti);
        actualizarBadge();

        // Burbuja XP
        const popup = document.getElementById("noti-popup");
        document.getElementById("noti-popup-msg").textContent = noti.mensaje;
        popup.style.display = "block";
        setTimeout(() => popup.style.display = "none", 5000);
    }
}


// --- Abre/cierra la lista de notificaciones ---
function toggleNotificaciones() {
    const lista = document.getElementById("lista-notificaciones");
    // Alterna entre mostrar y ocultar
    lista.style.display = (lista.style.display === 'block') ? 'none' : 'block';
}


// --- 2.9: Al cargar, traigo del servidor y proceso cada una ---
document.addEventListener("DOMContentLoaded", () => {
    cargarNotificaciones();

    $.ajax({
        url: './../../ajax/administrador.php?op=notificaciones',
        method: 'POST',
        dataType: 'json',
        data: {
            UmbralExpiracion: 500,
            UmbralStock: 500
        },
        success(data) {
            data.forEach(noti => {
      encolarNotificacion(noti);
      // también podrías renderizar ya la lista lateral:
      if (USER_ROLE==='admin' || noti.tipo===USER_ROLE) {
        renderNotificacionUI(noti);
      }
    });
    actualizarBadge();
        },
        error(xhr, st, err) {
            console.error("Error notificaciones:", st, err);
        }
    });
});

