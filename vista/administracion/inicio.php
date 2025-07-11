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
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido</title>
    <link rel="stylesheet" href="../../public/css/bootstrap.css">
    <style>
        body {
            background: linear-gradient(to left, rgb(184, 56, 59), rgb(245, 148, 87));
            /* Fondo degradado */
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
        }

        .welcome-container {
            background: rgba(255, 255, 255, 0.95);
            /* Fondo semitransparente */
            border-radius: 15px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
            text-align: center;
            padding: 30px;
            max-width: 500px;
            width: 90%;
        }

        .logo {
            max-width: 100px;
            margin-bottom: 15px;
        }

        .title {
            font-size: 28px;
            font-weight: bold;
            color: #333;
        }

        .subtitle {
            font-size: 18px;
            color: #666;
        }
    </style>
</head>

<body>



    <?php

    $role = $_SESSION['rol'] ;

    if ($role === 'admin') {
        echo "<div class='welcome-container'>";
        echo  "<img src='../../public/img/administrador/Pyro_emblem_RED.png' alt='Logo de la Página' class='logo'>";
        echo "<h1 class='title'>¡Bienvenido, Administrador!</h1>";
        echo "<p class='subtitle'>Tienes el control total del sistema.</p>";
    } else if ($role === 'inventario') {
        echo "<div class='welcome-container'>";
        echo  "<img src='../../public/img/administrador/Pyro_emblem_RED.png' alt='Logo de la Página' class='logo'>";
        echo "<h1 class='title'>¡Bienvenido, encargado de inventario!</h1>";
        echo "<p class='subtitle'>Gestiona el inventario y los lotes entrantes.</p>";
    } else if ($role === 'ventas') {
        echo "<div class='welcome-container'>";
        echo  "<img src='../../public/img/administrador/Pyro_emblem_RED.png' alt='Logo de la Página' class='logo'>";
        echo "<h1 class='title'>¡Bienvenido, encargado de ventas!</h1>";
        echo "<p class='subtitle'>Gestiona las solicitudes de cotización y envíalasa los clientes.</p>";
    } 
    ?>
    </div>

</body>

</html>