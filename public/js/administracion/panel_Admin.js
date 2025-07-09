let hayCambiosPendientes = false;

window.addEventListener('beforeunload', function (e) {
    if (hayCambiosPendientes) {
        e.preventDefault();
        e.returnValue = '';
    }
});

window.addEventListener('message', function (event) {
    console.log("Mensaje recibido en panel padre:", event.data);
    if (event.data === 'cambiosPendientes') {
        hayCambiosPendientes = true;
    } else if (event.data === 'cambiosGuardados') {
        hayCambiosPendientes = false;
    }
});

function cargarPagina(elemento, page) {
    if (hayCambiosPendientes) {
        Swal.fire({
            title: 'Cambios sin guardar',
            text: "Tienes cambios sin guardar. ¿Seguro que quieres cambiar de sección y perderlos?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, continuar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                hayCambiosPendientes = false;
                document.getElementById('mainFrame').src = page;
                document.querySelectorAll('.sidebar a').forEach(link => link.classList.remove('active'));
                elemento.classList.add('active');
            }
            // Si cancela, no hace nada, se queda en la página actual
        });
    } else {
        document.getElementById('mainFrame').src = page;
        document.querySelectorAll('.sidebar a').forEach(link => link.classList.remove('active'));
        elemento.classList.add('active');
    }
}


function cerrarSesion() {
    Swal.fire({
        title: 'Cerrar sesión',
        text: "¿Estás seguro de que quieres cerrar sesión?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: './../../ajax/administrador.php?op=logout',
                type: 'POST',

                success: function (response) {
                    localStorage.removeItem('notificaciones_eliminadas');
                    localStorage.removeItem('notificaciones');
                    // Luego redirige al login:
                    window.location.href = 'login.html';
                },
                error: function () {
                    Swal.fire('Error', 'No se pudo cerrar la sesión. Inténtalo de nuevo.', 'error');
                }
            });

        }
    });
}