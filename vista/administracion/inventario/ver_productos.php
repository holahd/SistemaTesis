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

        /* Ajustes de íconos dentro del botón para que se vean bien */
        .btn i {
            vertical-align: middle;
            font-size: 1rem;
        }

        .fila-desactivada td:not(:last-child) {
            opacity: 0.5;
        }

        /* También puedes hacer que el texto se vea más gris */
        .fila-desactivada td:not(:last-child) {
            color: #6c757d;
        }
    </style>
</head>

<body id="productos2" class="bg-light">

    <div class="container">
        <h2 class="mb-4 text-center text-primary">Gestión de Productos</h2>

        <!-- Formulario de Edición -->
        <div class="mt-4 p-4 bg-white rounded-4 shadow-lg mb-5" style="max-width: 700px; margin: 0 auto;">
            <h4 class="text-center mb-4 text-secondary fw-bold">Editar Producto</h4>
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
                        <div id="caracteristicasObligatoriasEditar" class="mb-2"></div>
                    </div>

                    <!-- Características adicionales -->
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Características adicionales (máx. 3)</label>
                        <div id="caracteristicasExtrasEditar" class="mb-2"></div>
                        <button type="button" class="btn btn-outline-secondary btn-sm mt-2" id="agregarCaracteristicaEditar">
                            <i class="bi bi-plus-circle"></i> Agregar característica
                        </button>
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

                    <button type="submit" class="btn btn-primary w-100 mt-3 rounded-3">
                        <i class="bi bi-save"></i> Guardar Cambios
                    </button>
                </fieldset>
            </form>
        </div>

        <!-- Tabla de Productos -->
        <div class="card shadow-sm border-0">
            <div class="card-body">
                <table id="tablaProductos" class="table table-hover align-middle text-center table-bordered">
                    <thead class="table-primary">
                        <tr>
                            <th>Nombre</th>
                            <th>Descripción</th>
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
    <script src="../../../public/js/jquery-3.7.1.min.js"></script>
   
    <script src="../../../public/js/sweetalert2.all.js"></script>
    <script src="../../../public/js/datatables.js"></script>
    <script src="../../../public/js/bootstrap.js"></script>
    <script src="../../../public/js/administracion/combosAnidados.js"></script>
    <script src="../../../public/js/administracion/inventario/admin_productos.js"></script>


</body>

</html>