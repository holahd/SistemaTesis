<?php
    session_start();
    $_SESSION['acceso_permitido'] = true;
    if (!isset($_SESSION['nombre']) || !isset($_SESSION['rol'])) {
    
    header("Location: login.html");
    }


?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel Administrador</title>
    <link href="../../public/css/bootstrap.css" rel="stylesheet">
    <style>
        body {
            display: flex;
            margin: 0;
            font-family: Arial, sans-serif;
        }
        .sidebar {
            width: 250px;
            background-color: #343a40;
            color: white;
            height: 100vh;
            padding-top: 20px;
        }
        .sidebar a {
            padding: 15px;
            text-decoration: none;
            color: white;
            display: block;
            transition: background-color 0.3s;
        }
        .sidebar a.active,
        .sidebar a.active:hover {
            background-color: #495057;
        }
        .main-content {
            flex-grow: 1;
            padding: 20px;
            height: 100vh; /* Se mantiene el tamaño completo */
        }
        iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
    </style>
</head>
<body>
    <div class="sidebar">
        <h2>Panel de administración</h2>
        <a href="#" onclick="cargarPagina(this, 'inicio.php')">Inicio</a>
        <?php 
            if ( isset( $_SESSION['rol']) && $_SESSION['rol'] == 'admin' ) {    
        ?>
        <a href="#" onclick="cargarPagina(this, 'ad_usuarios.php')">Usuarios</a>
        <?php } ?>
        <?php 
            if ( isset( $_SESSION['rol']) && $_SESSION['rol'] == 'inventario' || $_SESSION['rol'] == 'admin' ) {    
        ?>
        <a href="#" onclick="cargarPagina(this, 'inventario/inv_gestion.php')">Inventario</a>
        <?php } ?>
        <?php 
            if ( isset( $_SESSION['rol']) && $_SESSION['rol'] == 'ventas' || $_SESSION['rol'] == 'admin' ) {    
        ?>
        <a href="#" onclick="cargarPagina(this, 'ventas/ven_gestion.php')">Solicitudes</a>
        <?php } ?>
        
        
    </div>
    <div class="main-content">
        <iframe id="mainFrame" src="inicio.php"></iframe>
    </div>

    <script src="../../public/js/bootstrap.bundle.js"></script>
    <script src="../../public/js/bootstrap.js"></script>
    <script src="../../public/js/jquery-3.7.1.min.js"></script>
    <script>
        function cargarPagina(elemento, page) {
            document.getElementById('mainFrame').src = page;
            document.querySelectorAll('.sidebar a').forEach(link => link.classList.remove('active'));
            elemento.classList.add('active');
        }

        document.addEventListener("DOMContentLoaded", function () {
            document.querySelector(".sidebar a").classList.add("active");
        });
    </script>
</body>
</html>
