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
  <title>Registro de Lote</title>
  <link rel="stylesheet" href="../../../public/css/bootstrap.css">
  <style>
    body {
      margin: 20px;
      background-color: rgba(255, 255, 255, 0.97);
    }

    .form-container {
      max-width: 600px;
      margin: auto;
      background-color: #fff;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(255, 137, 2, 0.7);
    }

    .switch {
      position: relative;
      display: inline-block;
      width: 40px;
      height: 20px;
    }

    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      background-color: #ff4d4d;
      border-radius: 34px;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      transition: .4s;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 14px;
      width: 14px;
      background-color: white;
      border-radius: 50%;
      bottom: 3px;
      left: 3px;
      transition: .4s;
    }

    input:checked+.slider {
      background-color: #00cc66;
    }

    input:checked+.slider:before {
      transform: translateX(20px);
    }

    .form-control,
    .form-select {
      border: 0.5px solid #000;
      /* borde negro más grueso */
    }

    .form-control:focus,
    .form-select:focus {
      border-color: #000;
      /* mantener negro al enfocar */
      box-shadow: none;
      /* quitar brillos de Bootstrap */
      outline: none;
      /* quitar el contorno azul por defecto */
    }
  </style>
</head>

<body>

  <div class="form-container">
    <h3 class="mb-4 text-center">Registro de Lote</h3>
    <form id="registrarlote" method="post">
      <!-- Producto -->
      <div class="mb-3">
        <label for="producto" class="form-label">Producto</label>
        <select class="form-select" id="producto" name="producto" required>
          <option selected disabled>Seleccione un producto</option>
        </select>
      </div>

      <!-- Número de lote -->
      <div class="mb-3">
        <label for="numeroLote" class="form-label">Número de lote</label>
        <input type="text" class="form-control solo-numeros" id="numeroLote" name="numeroLote" required>
      </div>

      <!-- Unidades -->
      <div class="mb-3">
        <label for="unidades" class="form-label">Unidades</label>
        <input type="text" class="form-control solo-numeros" id="unidades" name="cantidad" min="1" required>
      </div>

      <!-- Fecha de ingreso -->
      <div class="mb-3">
        <label for="fechaIngreso" class="form-label">Fecha de ingreso</label>
        <input type="date" class="form-control" id="fechaIngreso" name="fechaIngreso" required>
      </div>

      <!-- Proveedor -->
      <div class="mb-3">
        <label for="proveedor" class="form-label">Proveedor</label>
        <input type="text" class="form-control" id="proveedor" name="proveedor" required>
      </div>

      <!-- ¿Es perecible? -->
      <div class="slider-toggle mb-3">
        <label class="switch">
          <input type="checkbox" id="esPerecible" name="esPerecible">
          <span class="slider"></span>
        </label>
        <label class="form-label ms-2 fw-bold">¿Es perecible?</label>
      </div>

      <!-- Fecha de caducidad -->
      <div class="mb-3">
        <label for="fechaCaducidad" class="form-label">Fecha de caducidad</label>
        <input type="date" class="form-control" id="fechaCaducidad" name="fechaCaducidad" disabled>
      </div>

      <!-- Precio por unidad -->
      <div class="mb-3">
        <label for="precioUnidad" class="form-label ">Precio por unidad (antes de PVP)</label>
        <input type="text" step="0.01" class="form-control solo-decimales" id="precioUnidad" name="precioUnitario" required>
      </div>


      <div class="text-center">
        <button type="submit" class="btn btn-success">Registrar lote</button>
      </div>

      <div class="text-center mt-3">
        <a href="elegir_reg.php" class="btn btn-danger">Regresar</a>
      </div>

    </form>
  </div>

  <script>
    // Esto es opcional: activar campo de caducidad si el check está marcado
    document.getElementById('esPerecible').addEventListener('change', function() {
      const caducidad = document.getElementById('fechaCaducidad');
      caducidad.disabled = !this.checked;
    });
  </script>

</body>
<script src="../../../public/js/jquery-3.7.1.min.js"></script>
<script src="../../../public/js/bootstrap.js"></script>
<script src="../../../public/js/sweetalert2.all.js"></script>
<script src="../../../public/js/validaciones.js"></script>
<script src="../../../public/js/administracion/inventario/reg_lotes.js"></script>

</html>