<?php

session_start();
if (!isset($_SESSION['nombre'])) {
    header("Location: login.html");
}
if (!isset($_SESSION['acceso_permitido']) || $_SESSION['acceso_permitido'] !== true) {

    header("Location: panel_administrador.php");

    exit();
}


?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro de Usuarios</title>
    <link href="../../public/css/bootstrap.css" rel="stylesheet">

    <style>
        /* Contenedor en forma de pestañas */
        .nav-tabs-custom {
            background: #f8f9fa;
            border-radius: 5px;
            padding: 5px;
            display: flex;
            justify-content: center;
        }

        /* Estilo para las pestañas */
        .nav-tabs-custom .nav-link {
            padding: 10px 20px;
            margin: 5px;
            border-radius: 5px;
            transition: all 0.3s ease-in-out;
            color: #007bff;
            border: 1px solid transparent;
        }

        /* Cuando está seleccionada */
        .nav-tabs-custom .nav-link.active {
            background-color: #007bff;
            color: lightgray !important;
            border-color: #007bff;
            font-weight: bold;
            position: relative;
        }

        /* Subrayado grueso */
        .nav-tabs-custom .nav-link.active::after {
            content: "";
            position: absolute;
            left: 0;
            bottom: -3px;
            width: 100%;
            height: 4px;
            background-color: white;
            border-radius: 2px;
        }

        /* Efecto hover */
        .nav-tabs-custom .nav-link:hover {
            background-color: rgba(0, 123, 255, 0.1);
            border-color: #007bff;
        }
    </style>

</head>

<body>
    <div class="container mt-3 ">
        <div class="nav-tabs-custom">

            <a class="nav-link" href="#" onclick="cambiarPagina(this, 'registrar_productos.php')">Registrar productos</a>
            <a class="nav-link active" href="#" onclick="cambiarPagina(this, 'ver_productos.php')">Ver productos</a>

        </div>
    </div>

    <iframe id="contentFrame" src="ver_productos.php" style="width: 100%; height: 85vh; border: none;"></iframe>

    <script src="../../public/js/bootstrap.js"></script>
    <script>
        function cambiarPagina(element, url) {
            document.getElementById('contentFrame').src = url;

            // Quita la clase "active" de todas las pestañas
            document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));

            // Agrega "active" solo a la pestaña clickeada
            element.classList.add('active');
        }
    </script>
</body>

</html>