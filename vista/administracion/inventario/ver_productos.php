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
    <title>Gestión de Productos</title>

    <!-- Bootstrap CSS -->
    <link href="../../../public/css/bootstrap.css" rel="stylesheet">
    <link rel="stylesheet" href="../../../public/css/datatables.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">

    <style>
        body {
            padding: 20px;
        }


        /* Asegura que el dropdown de select2 tenga un z-index alto para estar encima del modal */
        .select2-container--open {
            z-index: 10550 !important;
            /* más alto que el modal bootstrap que está en 1050 */
        }


        .table-bordered th,
        .table-bordered td {
            border: 1px solid #dee2e6;
            /* cambia este color si quieres otro */
        }

        .table thead th {
            background-color: rgba(33, 37, 41, 1);
            /* oscuro elegante */
            color: #fff;
        }

        .btn-outline-warning,
        .btn-outline-danger,
        .btn-outline-success {
            border-width: 2px;
        }

        .btn-outline-warning:hover {
            background-color: #ffc107;
            color: #212529;
        }

        .btn-outline-danger:hover {
            background-color: #dc3545;
            color: #fff;
        }

        .btn-outline-success:hover {
            background-color: #198754;
            color: #fff;
        }

        .btn i {
            vertical-align: middle;
            font-size: 1rem;
        }

        .fila-desactivada td:not(:last-child) {
            opacity: 0.5;
            color: #6c757d;
        }
    </style>
</head>

<body id="productos2" class="bg-light">

    <div class="container">
        <h2 class="mb-4 text-center text-primary">Gestión de Productos</h2>
        <div class="d-flex justify-content-between align-items-center mt-4 mb-3">
            <h4>Productos existentes</h4>
            <button class="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modalReporte">
                <i class="fas fa-file-pdf"></i> Generar reporte de movimientos
            </button>
        </div>


        <!-- Tabla de Productos -->
        <div class="card shadow-sm border-0">
            <div class="card-body">
                <table id="tablaProductos" class="table table-hover align-middle text-center table-bordered">
                    <thead class="bg-warning text-dark">
                        <tr>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Stock</th>
                            <th>Categoría</th>
                            <th>Subcategoría</th>
                            <th>Imagen</th>
                            <th>Descontinuado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Modal de Edición -->
    <div class="modal fade" id="modalEditarProducto" tabindex="-1" aria-labelledby="tituloModalEditar" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content shadow-lg rounded-4">
                <div class="modal-header bg-dark text-white">
                    <h5 class="modal-title fw-bold" id="tituloModalEditar">
                        <i class="bi bi-pencil-square me-2"></i>Editar Producto
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                </div>
                <div class="modal-body bg-light">
                    <form id="formEditarProducto" enctype="multipart/form-data" class="validable">
                        <fieldset id="formulario_edicion">

                            <input type="hidden" id="producto_id" name="producto_id" value="">

                            <!-- Nombre -->
                            <div class="mb-3">
                                <label for="nombre" class="form-label fw-semibold">Nombre</label>
                                <input type="text" class="form-control rounded-3 requerido" id="nombre" name="nombre" required>
                            </div>

                            <!-- Categoría -->
                            <div class="mb-3">
                                <label for="categoria" class="form-label fw-semibold">Categoría</label>
                                <select class="form-select rounded-3 requerido" id="categoria" name="categoria" required></select>
                            </div>

                            <!-- Subcategoría -->
                            <div class="mb-3">
                                <label for="subcategoria" class="form-label fw-semibold">Subcategoría</label>
                                <select class="form-select rounded-3 requerido" id="subcategoria" name="subcategoria" required></select>
                            </div>

                            <!-- Características obligatorias -->
                            <div class="mb-3">
                                <label class="form-label fw-semibold">Características del Producto</label>
                                 <input type ="file" class="form-control" id="ficha_pdf" name="ficha_pdf" accept=".pdf" >
                                 <input type="hidden" name="ruta_ficha_pdf" id="ruta_ficha_pdf" value="">

                            </div>



                            <!-- Imagen actual -->
                            <div class="mb-3 text-center">
                                <label class="form-label fw-semibold">Imagen Actual</label>
                                <div>
                                    <img id="imagen_producto" src="../../public/img/default.jpg" alt="Imagen del Producto"
                                        class="img-thumbnail border border-2" style="max-width: 200px;">
                                </div>
                            </div>

                            <input type="hidden" id="ruta_imagen" name="ruta_imagen" value="">

                            <!-- Nueva imagen -->
                            <div class="mb-3">
                                <label class="form-label fw-semibold">Subir Nueva Imagen</label>
                                <input type="file" class="form-control rounded-3" id="input_imagen" name="input_imagen"
                                    accept="image/*">
                                <p id="errorMensaje" class="text-danger mt-1" style="display: none;">La imagen debe ser menor a 2MB.</p>
                            </div>

                        </fieldset>
                    </form>
                </div>
                <div class="modal-footer bg-white">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        <i class="bi bi-x-circle"></i> Cancelar
                    </button>
                    <button type="submit" form="formEditarProducto" class="btn btn-primary">
                        <i class="bi bi-save"></i> Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    </div>


    <!-- Modal para mostrar imagen ampliada -->
    <!-- Modal para mostrar imagen ampliada -->
    <div class="modal fade" id="modalImagenAmpliada" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-sm modal-dialog-centered">
            <div class="modal-content bg-dark text-white">
                <div class="modal-header border-0">
                    <h6 class="modal-title" id="tituloImagenAmpliada" style="font-size: 1rem;">Nombre del producto</h6>
                    <button type="button" class="btn-close btn-close-white ms-auto" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                </div>
                <div class="modal-body text-center p-2">
                    <img id="imagenAmpliada" src="" alt="Imagen ampliada" class="img-fluid rounded shadow" style="max-height: 300px;">
                </div>
            </div>
        </div>
    </div>

    <!-- Modal de tallas por producto -->
    <div class="modal fade" id="modalTallas" tabindex="-1" aria-labelledby="tituloModalTallas" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content shadow rounded-3">
                <div class="modal-header bg-dark text-white">
                    <h5 class="modal-title" id="tituloModalTallas">Stock por tallas</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                </div>
                <div class="modal-body">
                    <div id="contenedorTallas">
                        <p class="text-muted">Cargando...</p>
                    </div>
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
                        <label for="nombreProducto" class="form-label">Producto (opcional)</label>
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

    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
    <!-- Scripts -->
    <script src="./../../../public/js/jquery-3.7.1.min.js"></script>
    
    <script src="../../../public/js/jszip.js"></script>
    <script src="../../../public/js/sweetalert2.all.js"></script>
    <script src="../../../public/js/datatables.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    <script src="../../../public/js/bootstrap.js"></script>
    <script src="./../../../public/js/administracion/inventario/entradas_salidas.js"></script>
    <script src="../../../public/js/administracion/combosAnidados.js"></script>
    <script src="../../../public/js/administracion/inventario/admin_productos.js"></script>
    
    
</body>

</html>