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
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registrar Producto</title>
  <link rel="stylesheet" href="../../../public/css/bootstrap.css">
  <style>
    body {
      background-color: #f8f9fa;
    }
    .container {
      background: #fff;
      padding: 30px;
      margin-top: 30px;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(255, 137, 2, 0.7);
    }
    .caracteristica-group {
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
    }
    .caracteristica-group input {
      flex: 1;
    }
    .form-control, .form-select {
  border: 0.5px solid #000; /* borde negro más grueso */
}

.form-control:focus, .form-select:focus {
  border-color: #000;      /* mantener negro al enfocar */
  box-shadow: none;        /* quitar brillos de Bootstrap */
  outline: none;           /* quitar el contorno azul por defecto */
}

  </style>
</head>
<body>

<div class="container">
  <h2 class="text-center mb-4">Registrar Nuevo Producto</h2>

  <form id="registroProducto" method="POST" enctype="multipart/form-data">
    <!-- Nombre del producto -->
    <div class="mb-3">
      <label for="nombre" class="form-label">Nombre del Producto</label>
      <input type="text" class="form-control" id="nombre" name="nombre" required>
    </div>

    <!-- Categoría y Subcategoría -->
    <div class="row mb-3">
      <div class="col-md-6">
        <label for="categoria" class="form-label">Categoría</label>
        <select class="form-select" id="categoria" name="categoria" required>
          <option value="" disabled>Seleccione una categoría</option>
        </select>
      </div>
      <div class="col-md-6">
        <label for="subcategoria" class="form-label">Subcategoría</label>
        <select class="form-select" id="subcategoria" name="subcategoria" required>
          <option value="" disabled>Seleccione una subcategoría</option>
        </select>
      </div>
    </div>

    <!-- Características obligatorias -->
    <div class="mb-3">
      <label class="form-label">Características del Producto</label>
      <div id="caracteristicasObligatorias"></div>
    </div>

    <!-- Características adicionales -->
    <div class="mb-3">
      <label class="form-label">Características adicionales (máx. 3)</label>
      <div id="caracteristicasExtras"></div>
      <button type="button" class="btn btn-outline-secondary btn-sm mt-2" id="agregarCaracteristica">
        Agregar característica
      </button>
    </div>

    <!-- Subir foto -->
    <div class="mb-3">
      <label for="foto" class="form-label">Foto del Producto</label>
      <input type="file" class="form-control" id="foto" name="foto" accept="image/*" required>
      <p id="errorMensaje" style="color: red; display: none;">La imagen debe ser menor a 2MB.</p>
    </div>

    <!-- Botones -->
    <div class="text-center">
      <button type="submit" class="btn btn-primary">Registrar producto</button>
    </div>
    <div class="text-center mt-3">
      <a href="elegir_reg.php" class="btn btn-danger">Regresar</a>
    </div>
  </form>
</div>

</body>
</html>

    <script src="../../../public/js/jquery-3.7.1.min.js"></script>
    <script src="../../../public/js/bootstrap.js"></script>
    <script src="../../../public/js/administracion/inventario/reg_productos.js"></script>
    <script src="../../../public/js/administracion/combosAnidados.js"></script>
</body>
</html>
