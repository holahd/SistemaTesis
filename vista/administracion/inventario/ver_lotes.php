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
    <title>Gestión de Lotes</title>

    <link href="../../../public/css/bootstrap.css" rel="stylesheet">
    <link rel="stylesheet" href="../../../public/css/datatables.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">

    <style>
        body {
            padding: 20px;
        }
    </style>
</head>

<body id="gestionLotes">

    <div class="container">
        <h2 class="mb-4 text-center">Gestión de Lotes</h2>

        <!-- Formulario de Edición -->
        <div class="mt-4 p-4 bg-warning bg-opacity-50 rounded shadow-sm mb-3" style="max-width: 600px; margin: 0 auto;">
            <h3 class="text-center mb-4">Editar Lote</h3>
            <form id="formEditarLote" method="POST">
            <fieldset id="fromularioEdicionLote">
                <input type="hidden" id="lote_id" name="lote_id">

                <!-- Producto -->
                <div class="form-group mb-3">
                    <label for="productoEditar" class="form-label">Producto</label>
                    <select class="form-control" id="productoEditar" name="productoEditar" required>
                        <option selected disabled>Seleccione un producto</option>
                    </select>
                </div>

                <!-- Número de lote -->
                <div class="form-group mb-3">
                    <label for="numeroLoteEditar" class="form-label">Número de lote</label>
                    <input type="number" class="form-control" id="numeroLoteEditar" name="numeroLoteEditar" required>
                </div>

                <!-- Unidades -->
                <div class="form-group mb-3">
                    <label for="unidadesEditar" class="form-label">Unidades</label>
                    <input type="number" class="form-control" id="unidadesEditar" name="unidadesEditar" min="1" required>
                </div>

                <!-- Fecha ingreso -->
                <div class="form-group mb-3">
                    <label for="fechaIngresoEditar" class="form-label">Fecha de ingreso</label>
                    <input type="date" class="form-control" id="fechaIngresoEditar" name="fechaIngresoEditar" required>
                </div>

                <!-- Proveedor -->
                <div class="form-group mb-3">
                    <label for="proveedorEditar" class="form-label">Proveedor</label>
                    <input type="text" class="form-control" id="proveedorEditar" name="proveedorEditar" required>
                </div>

                <!-- ¿Es perecible? -->
                <div class="form-check form-switch mb-3">
                    <input class="form-check-input" type="checkbox" id="esPerecibleEditar" name="esPerecibleEditar">
                    <label class="form-check-label" for="esPerecibleEditar">¿Es perecible?</label>
                </div>

                <!-- Fecha de caducidad -->
                <div class="form-group mb-3">
                    <label for="fechaCaducidadEditar" class="form-label">Fecha de caducidad</label>
                    <input type="date" class="form-control" id="fechaCaducidadEditar" name="fechaCaducidadEditar" disabled>
                </div>

                <!-- Precio unitario -->
                <div class="form-group mb-3">
                    <label for="precioUnitarioEditar" class="form-label">Precio por unidad</label>
                    <input type="number" class="form-control" step="0.01" id="precioUnitarioEditar" name="precioUnitarioEditar" required>
                </div>

                <button type="submit" class="btn btn-primary btn-block">Guardar Cambios</button>
            </fieldset>
            </form>
        </div>

        <!-- Tabla de Lotes -->
        <table id="tablaLotes" class="table table-striped">
            <thead>
                <tr> 
                    <th>Producto</th>
                    <th>Lote</th>
                    <th>Unidades</th>
                    <th>Fecha ingreso</th>
                    <th>Proveedor</th>
                    <th>Caducidad</th>
                    <th>Precio U.</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>

    <script src="../../../public/js/jquery-3.7.1.min.js"></script>
    <script src="../../../public/js/datatables.js"></script>
    <script src="../../../public/js/bootstrap.js"></script>
    <script src="../../../public/js/administracion/inventario/admin_lotes.js"></script>

    <script>
        // Activar/desactivar campo de caducidad según checkbox
        $(document).ready(function () {
    $('#esPerecibleEditar').on('change', function () {
        $('#fechaCaducidadEditar').prop('disabled', !this.checked);
    });

    $('#fromularioEdicionLote').prop('disabled', true);
});

    </script>
</body>
</html>
