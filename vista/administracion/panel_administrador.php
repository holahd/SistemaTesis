<?php
session_start();
$_SESSION['acceso_permitido'] = true;
if (!isset($_SESSION['nombre']) || !isset($_SESSION['rol'])) {
    header("Location: login.html");
    exit();
}
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel Administrador</title>
    <link href="../../public/css/bootstrap.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">
    <style>
        body {
            display: flex;
            margin: 0;
            font-family: 'Segoe UI', sans-serif;
            background-color: #f8f9fa;
        }

        .sidebar {
            width: 250px;
            background-color: #212529;
            color: white;
            height: 100vh;
            padding-top: 20px;
            display: flex;
            flex-direction: column;
        }

        .sidebar .logo {
            text-align: center;
            margin-bottom: 20px;
        }

        .sidebar .logo img {
            width: 120px;
            height: auto;
        }

        .sidebar h2 {
            font-size: 1.3rem;
            text-align: center;
            margin-bottom: 15px;
            color: #adb5bd;
        }

        .sidebar a {
            padding: 12px 20px;
            text-decoration: none;
            color: #dee2e6;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: background-color 0.2s, padding-left 0.2s;
        }

        .sidebar a:hover {
            background-color: #343a40;
            padding-left: 25px;
        }

        .sidebar a.active {
            background-color: #495057;
            font-weight: bold;
        }

        .main-content {
            flex-grow: 1;
            padding: 0;
            height: 100vh;
        }

        iframe {
            width: 100%;
            height: 100%;
            border: none;
        }

        .sidebar .spacer {
            flex-grow: 1;
        }

        .sidebar .footer {
            text-align: center;
            font-size: 0.8rem;
            color: #6c757d;
            padding: 10px;
        }
    </style>
</head>

<body>
    <div class="sidebar">
        <div class="logo">
            <img src="./../../public/img/administrador/Pyro_emblem_RED.png" alt="Logo">
        </div>
        <h2>Panel de administración</h2>
        <a href="#" data-page="inicio.php" onclick="cargarPagina(this, 'inicio.php')">
            <i class="bi bi-house-door-fill"></i> Inicio
        </a>
        <?php if (isset($_SESSION['rol']) && $_SESSION['rol'] == 'admin') { ?>
            <a href="#" data-page="ad_usuarios.php" onclick="cargarPagina(this, 'ad_usuarios.php')">
                <i class="bi bi-people-fill"></i> Usuarios
            </a>
        <?php } ?>
        <?php if (isset($_SESSION['rol']) && ($_SESSION['rol'] == 'inventario' || $_SESSION['rol'] == 'admin')) { ?>
            <a href="#" data-page="inventario/inv_gestion.php" onclick="cargarPagina(this, 'inventario/inv_gestion.php')">
                <i class="bi bi-box-seam"></i> Inventario
            </a>
        <?php } ?>
        <?php if (isset($_SESSION['rol']) && ($_SESSION['rol'] == 'ventas' || $_SESSION['rol'] == 'admin')) { ?>
            <a href="#" data-page="ventas/ven_gestion.php" onclick="cargarPagina(this, 'ventas/ven_gestion.php')">
                <i class="bi bi-cart-check-fill"></i> Solicitudes
            </a>
        <?php } ?>
        <?php if (isset($_SESSION['rol']) && $_SESSION['rol'] == 'admin') { ?>
            <a href="#" data-page="ajustar_desc.php" onclick="cargarPagina(this, 'ajustar_desc.php')">
                <i class="bi bi-graph-up-arrow"></i> Umbral de ganancia
            </a>
        <?php } ?>
        <a href="#" data-page="inicio.php" onclick="cerrarSesion()">
            <i class="bi bi-box-arrow-right"></i> Cerrar sesión
        </a>
        <div class="spacer"></div>
        <div class="footer">
            <?php echo $_SESSION['nombre']; ?> | <?php echo $_SESSION['rol']; ?> 
        </div>
    </div>

    <div class="main-content">
        <iframe id="mainFrame" src="inicio.php"></iframe>
    </div>

    <script src="../../public/js/bootstrap.bundle.js"></script>
    <script src="../../public/js/jquery-3.7.1.min.js"></script>
    <script src="./../../public/js/sweetalert2.all.js"></script>
    <script>
        let hayCambiosPendientes = false;

        window.addEventListener('beforeunload', function(e) {
            if (hayCambiosPendientes) {
                e.preventDefault();
                e.returnValue = '';
            }
        });

        window.addEventListener('message', function(event) {
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
    </script>
    <script>
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
                        
                        success: function(response) {
                            if (response.status === 'ok') {
                                window.location.href = 'login.html';
                            } else {
                                Swal.fire('Error', response.message, 'error');
                            }
                        },
                        error: function() {
                            Swal.fire('Error', 'No se pudo cerrar la sesión. Inténtalo de nuevo.', 'error');
                        }
                    });
                    
                }
            });
        }
    </script>
</body>

</html>