// --- 2.1: Clave de almacenamiento ---
const STORAGE_KEY = 'notificaciones';
const DELETED_KEY = 'notificaciones_eliminadas';


// Cola FIFO de notificaciones por mostrar
const colaNotis = [];
let notiTimeout = null;

// Llamamos a este método para “encolar” una notificación
function encolarNotificacion(noti) {
    // Evita duplicados (tipo+id_ref)
    if (!notificaciones.some(n => n.tipo === noti.tipo && n.id_ref == noti.id_ref)) {
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

    // Si el rol no corresponde, descartamos y pasamos a la siguiente
    if (!(USER_ROLE === 'admin' || noti.tipo === USER_ROLE)) {
        colaNotis.shift();
        return mostrarSiguientePopup();
    }

    // Renderiza el mensaje
    document.getElementById("noti-popup-msg").textContent = noti.mensaje;
    document.getElementById("noti-popup").style.display = "block";

    // Limpia cualquier timeout previo
    if (notiTimeout) clearTimeout(notiTimeout);

    // Programa cierre automático a los 2 segundos
    notiTimeout = setTimeout(() => {
        cerrarNotificacionPopup();
    }, 2000);
}


// Al hacer clic en “✖” cerramos y pasamos al siguiente
document.getElementById("noti-popup-close").addEventListener("click", () => {
    if (notiTimeout) clearTimeout(notiTimeout);
    cerrarNotificacionPopup();
});


function cerrarNotificacionPopup() {
    // Oculta el popup
    document.getElementById("noti-popup").style.display = "none";

    // Elimina de la cola la noti mostrada
    colaNotis.shift();

    // (Opcional) renderiza en lista lateral
    if (typeof renderUnaNotiEnLista === 'function') {
        renderUnaNotiEnLista(colaNotis[0]);
    }

    // Muestra la siguiente, si la hay
    mostrarSiguientePopup();
}



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
    const id = `noti-${noti.tipo}-${noti.id_ref}`;

    // 1️⃣ Si ya existe, salimos
    if (document.getElementById(id)) return;

    const li = document.createElement("li");
    li.className = "d-flex justify-content-between align-items-start mb-1";
    li.id = id;
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
        text: "No se podrá recuperar hasta la siguiente sesión o cuando se resuelva el problema.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then(res => {
        if (res.isConfirmed) {
            notificaciones = notificaciones.filter(n => !(n.tipo === tipo && n.id_ref == id_ref));
            guardarNotificaciones();
            const elim = cargarEliminadas();
            elim.push({ tipo, id_ref });
            guardarEliminadas(elim);
            document.getElementById(`noti-${tipo}-${id_ref}`)?.remove();
            actualizarBadge();

            let msg;
            if (tipo === 'stock') {
                msg = 'Esta alerta de stock volverá a aparecer en la próxima sesión si el nivel se mantiene bajo.';
            } else if (tipo === 'caducidad') {
                msg = 'Esta alerta de fecha volverá a reaparecer en la próxima sesión hasta que la fecha de caducidad pase o se haga un mantenimiento de los extintores.';
            } else if (tipo === 'cotizacion') {
                msg = 'Esta notificación de cotización volverá a aparecer en la próxima sesión mientras siga pendiente.';
            } else {
                msg = 'Esta notificación volverá a aparecer en la próxima sesión si sigue vigente.';
            }

            Swal.fire({
                icon: 'info',
                title: 'Notificación eliminada',
                text: msg,
                confirmButtonText: 'Entendido'
            });
        }
    });
}

// --- 2.6: Eliminar todas las filtradas (ya tienes eliminarTodas) ---
function eliminarTodas() {
    const pendientes = notificaciones.filter(n =>
        USER_ROLE === 'admin' || n.tipo === USER_ROLE
    ).length;
    if (pendientes === 0) {
        Swal.fire({
            icon: 'info',
            title: 'Sin notificaciones',
            text: 'No hay notificaciones para eliminar.',
            confirmButtonText: 'Aceptar'
        });
        return;
    }
    Swal.fire({
        title: '¿Eliminar todas las notificaciones?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then(res => {
        if (res.isConfirmed) {
            // 📌 Marca todas las que eliminas
            const elim = cargarEliminadas();
            notificaciones
                .filter(n => USER_ROLE === 'admin' || n.tipo === USER_ROLE)
                .forEach(n => elim.push({ tipo: n.tipo, id_ref: n.id_ref }));
            guardarEliminadas(elim);

            // Quitamos solo las de este rol (o todas si admin)
            if (USER_ROLE === 'admin') {
                notificaciones = [];
            } else {
                notificaciones = notificaciones.filter(n => n.tipo !== USER_ROLE);
            }
            guardarNotificaciones();
            document.getElementById("notificaciones-lista").innerHTML = '';
            actualizarBadge();
            Swal.fire({
                icon: 'info',
                title: 'Notificaciones eliminadas',
                text: 'Estas notificaciones volverán a aparecer en la próxima sesión mientras sus condiciones se mantengan.',
                confirmButtonText: 'Entendido'
            });
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

        encolarNotificacion(noti);
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
            UmbralExpiracion: 60,
            UmbralStock: 15
        },
        success(data) {
            const elim = cargarEliminadas();
            data
                .filter(noti =>
                    !elim.some(e => e.tipo === noti.tipo && e.id_ref == noti.id_ref)
                )
                .forEach(noti => {
                    encolarNotificacion(noti);
                    if (USER_ROLE === 'admin' || noti.tipo === USER_ROLE) {
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

function guardarEliminadas(lista) {
    localStorage.setItem(DELETED_KEY, JSON.stringify(lista));
}

function cargarEliminadas() {
    const data = localStorage.getItem(DELETED_KEY);
    return data ? JSON.parse(data) : [];
}
