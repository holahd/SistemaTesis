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


    <div id="noti-popup" style="
  display: none;
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #fefefe;
  border: 1px solid #888;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0,0,0,0.2);
  padding: 15px;
  z-index: 9999;
  min-width: 250px;
">
  <div style="display:flex; justify-content: space-between; align-items: center;">
    <strong>🔔 Notificación</strong>
    <button id="noti-popup-close" style="
      background: transparent;
      border: none;
      font-size: 1.2rem;
      line-height: 1;
      cursor: pointer;
    ">✖</button>
  </div>
  <p id="noti-popup-msg" style="margin: 10px 0 0;"></p>
</div>


    <!-- Botón flotante y lista de notificaciones -->
    <div id="notificaciones-container" style="position: fixed; top: 20px; right: 20px; z-index: 9998;">
        <button class="btn btn-light border shadow-sm position-relative" onclick="toggleNotificaciones()">
            <i class="bi bi-bell-fill"></i>
            <span id="badge-noti" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="display: none;">1+</span>
        </button>

        <div id="lista-notificaciones" class="bg-white border rounded shadow mt-2 p-2" style="display: none; width: 300px; max-height: 300px; overflow-y: auto;">
            <strong>🔔 Notificaciones</strong>
            <ul id="notificaciones-lista" class="list-unstyled mt-2 mb-2 small"></ul>
            <button onclick="eliminarTodas()" class="btn btn-sm btn-outline-danger w-100">Eliminar todas</button>
        </div>

    </div>

</body>
<script>
  const USER_ROLE = '<?php echo $_SESSION['rol']; ?>'; // "ventas", "inventario" o "admin"
</script>
<script src="../../public/js/bootstrap.bundle.js"></script>
<script src="../../public/js/jquery-3.7.1.min.js"></script>
<script src="./../../public/js/sweetalert2.all.js"></script>
<script src="./../../public/js/administracion/panel_Admin.js"></script>

<script src="./../../public/js/administracion/notificaciones.js"></script>


</html>