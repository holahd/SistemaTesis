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
    <script src="../../../public/js/jquery-3.7.1.min.js"></script>
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
            background-color: rgb(33, 37, 41);
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
        <div class="d-flex justify-content-between align-items-center mt-4 mb-3">
            <h4>Lotes registrados</h4>
            <button class="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modalReporte" hidden>
                <i class="fas fa-file-pdf"></i> Generar reporte de movimientos
            </button>
        </div>


        <!-- Tabla de Lotes -->
        <div class="card shadow-sm border-0">
            <div class="card-body">
                <table id="tablaLotes" class="table table-hover align-middle text-center table-bordered">
                    <thead class="bg-dark text-white">
                        <tr>
                            <th>Producto</th>
                            <th>Lote</th>
                            <th>Unidades</th>
                            <th>Fecha de registro</th>
                            <th>Proveedor</th>
                            <th>Caducidad</th>
                            <th>Talla</th>
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
                                <label for="unidadesEditar" class="form-label">Unidades</label>
                                <input type="text" class="form-control solo-numeros" id="unidadesEditar" name="unidadesEditar" required>
                            </div>

                            

                            <div class="mb-3">
                                <label for="proveedorEditar" class="form-label">Proveedor</label>
                                <input type="text" class="form-control" id="proveedorEditar" name="proveedorEditar" required>
                            </div>


                            <!-- Fecha de caducidad (solo para extintores) -->
                            <div class="mb-3 d-none" id="caducidadContainerEditar">
                                <label for="fechaCaducidadEditar" class="form-label">Fecha de caducidad</label>
                                <input type="date" class="form-control" id="fechaCaducidadEditar" name="fechaCaducidadEditar">
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

    <!-- Modal -->
    <div class="modal fade" id="modalReporte" tabindex="-1" aria-labelledby="modalReporteLabel" aria-hidden="true">
        <div class="modal-dialog">
            <form id="formReporte" class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalReporteLabel">Generar reporte de entradas/salidas</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="producto" class="form-label">Producto (opcional)</label>
                        <select id="nombreProducto" name="nombreProducto" class="form-select">
                            <option value="">-- Todos los productos --</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="fechaInicio" class="form-label">Desde</label>
                        <input type="date" class="form-control" id="fechaInicio" name="fechaInicio" required>
                    </div>
                    <div class="mb-3">
                        <label for="fechaFin" class="form-label">Hasta</label>
                        <input type="date" class="form-control" id="fechaFin" name="fechaFin" required>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary">Generar PDF</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                </div>
            </form>
        </div>
    </div>


    
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
       <script src="./../../../public/js/administracion/inventario/entradas_salidas.js"></script>
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