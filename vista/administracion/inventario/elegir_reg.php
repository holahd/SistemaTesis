<?php
session_start();
if (!isset($_SESSION['nombre']) ) {
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
  <title>Botones con Bootstrap</title>
  <link rel="stylesheet" href="../../../public/css/bootstrap.css">
  <style>
    body, html {
      height: 100%;
      margin: 0;
    }
    .center-container {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .btn-group-custom {
      display: flex;
      gap: 30px; /* separación entre los botones */
    }
  </style>
</head>
<body>
  <div class="center-container">
    <div class="btn-group-custom">
      <a href="registrar_lote.php" class="btn btn-warning btn-lg">Registrar Lote nuevo</a>
      <a href="registrar_productos.php" class="btn btn-success btn-lg">Registrar Producto nuevo</a>
    </div>
  </div>
</body>
</html>
