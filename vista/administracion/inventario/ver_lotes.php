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


        .btn-outline-warning,
        .btn-outline-danger,
        .btn-outline-success {
            border-width: 2px;
        }

        .table-bordered th,
        .table-bordered td {
            border: 1px solid #dee2e6;
            /* cambia este color si quieres otro */
        }

        .table thead th {
            background-color:rgb(33, 37, 41);
            /* oscuro elegante */
            color: #fff;
        }

        .btn i {
            vertical-align: middle;
        }

        .modal .form-control:disabled {
            background-color: #f8f9fa;
        }

        .btn-outline-warning:hover {
            background-color: #ffc107;
            color: #212529;
        }
    </style>
</head>

<body id="gestionLotes" class="bg-light">

    <div class="container">
        <h2 class="mb-4 text-center text-primary">Gestión de Lotes</h2>

        <!-- Tabla de Lotes -->
        <div class="card shadow-sm border-0">
            <div class="card-body">
                <table id="tablaLotes" class="table table-hover align-middle text-center table-bordered">
                    <thead class="bg-dark text-white">
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
        </div>
    </div>

    <!-- Modal de Edición de Lote -->
    <div class="modal fade" id="modalEditarLote" tabindex="-1" aria-labelledby="tituloModalLote" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content shadow-lg rounded-4">
                <div class="modal-header bg-dark text-white">
                    <h5 class="modal-title fw-bold" id="tituloModalLote">
                        <i class="bi bi-pencil-square me-2"></i>Editar Lote
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                </div>
                <div class="modal-body bg-light">
                    <form id="formEditarLote" method="POST">
                        <fieldset id="fromularioEdicionLote">

                            <input type="hidden" id="lote_id" name="lote_id">

                            <div class="mb-3">
                                <label for="productoEditar" class="form-label">Producto</label>
                                <select class="form-control" id="productoEditar" name="productoEditar" required>
                                    <option selected disabled>Seleccione un producto</option>
                                </select>
                            </div>

                            <div class="mb-3">
                                <label for="numeroLoteEditar" class="form-label">Número de lote</label>
                                <input type="text" class="form-control solo-numeros" id="numeroLoteEditar" name="numeroLoteEditar" required>
                            </div>

                            <div class="mb-3">
                                <label for="unidadesEditar" class="form-label">Unidades</label>
                                <input type="text" class="form-control solo-numeros" id="unidadesEditar" name="unidadesEditar" required>
                            </div>

                            <div class="mb-3">
                                <label for="fechaIngresoEditar" class="form-label">Fecha de ingreso</label>
                                <input type="date" class="form-control" id="fechaIngresoEditar" name="fechaIngresoEditar" required>
                            </div>

                            <div class="mb-3">
                                <label for="proveedorEditar" class="form-label">Proveedor</label>
                                <input type="text" class="form-control" id="proveedorEditar" name="proveedorEditar" required>
                            </div>

                            <div class="form-check form-switch mb-3">
                                <input class="form-check-input" type="checkbox" id="esPerecibleEditar" name="esPerecibleEditar">
                                <label class="form-check-label" for="esPerecibleEditar">¿Es perecible?</label>
                            </div>

                            <div class="mb-3">
                                <label for="fechaCaducidadEditar" class="form-label">Fecha de caducidad</label>
                                <input type="date" class="form-control" id="fechaCaducidadEditar" name="fechaCaducidadEditar" disabled>
                            </div>

                            <div class="mb-3">
                                <label for="precioUnitarioEditar" class="form-label">Precio por unidad</label>
                                <input type="text" class="form-control solo-decimales" id="precioUnitarioEditar" name="precioUnitarioEditar" required>
                            </div>

                        </fieldset>
                    </form>
                </div>
                <div class="modal-footer bg-white">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        <i class="bi bi-x-circle"></i> Cancelar
                    </button>
                    <button type="submit" form="formEditarLote" class="btn btn-primary">
                        <i class="bi bi-save"></i> Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script src="../../../public/js/jquery-3.7.1.min.js"></script>
    <script src="../../../public/js/datatables.js"></script>
    <script src="../../../public/js/sweetalert2.all.js"></script>
    <script src="../../../public/js/validaciones.js"></script>
    <script src="../../../public/js/bootstrap.js"></script>
    <script src="../../../public/js/administracion/inventario/admin_lotes.js"></script>

    <script>
        // Activar/desactivar campo de caducidad según checkbox
        $(document).ready(function() {
            $('#esPerecibleEditar').on('change', function() {
                $('#fechaCaducidadEditar').prop('disabled', !this.checked);
            });

            $('#fromularioEdicionLote').prop('disabled', true);
        });
    </script>
</body>

</html>