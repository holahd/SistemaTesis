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

    <style>
        body {
            padding: 20px;
        }
    </style>
</head>

<body id="productos2">

    <div class="container">
        <h2 class="mb-4 text-center">Gestión de Productos</h2>

        <!-- Formulario de Edición -->
        <div class="mt-4 p-4 bg-success bg-opacity-50 rounded shadow-sm mb-3" style="max-width: 500px; margin: 0 auto;">
            <h3 class="text-center mb-4">Editar Producto</h3>
            <form id="formEditarProducto" enctype="multipart/form-data">


                <div class="form-group mb-3">
                    <label for="nombre" class="font-weight-bold">Nombre</label>
                    <input type="text" class="form-control" id="nombre" name="nombre" required>
                </div>

                <div class="form-group mb-3">
                    <label for="descripcion" class="font-weight-bold">Descripción</label>
                    <textarea class="form-control" id="descripcion" name="descripcion" rows="3" required></textarea>
                </div>

                <div class="form-group mb-3">
                    <label for="precio" class="font-weight-bold">Precio</label>
                    <input type="number" step="0.01" class="form-control" id="precio" name="precio" required>
                </div>

                <div class="form-group mb-3">
                    <label for="categoria" class="font-weight-bold">Categoría</label>
                    <select class="form-control" id="categoria" name="categoria" required></select>
                </div>

                <div class="form-group mb-3">
                    <label for="subcategoria" class="font-weight-bold">Subcategoría</label>
                    <select class="form-control" id="subcategoria" name="subcategoria" required></select>
                </div>

                <div class="form-group " id="fechaMantenimientoDiv" style="display:none">
                    <label for="fecha_mantenimiento" class="font-weight-bold">Fecha de Mantenimiento</label>
                    <input type="date" class="form-control" id="fecha_mantenimiento" name="fecha_mantenimiento">
                </div>

                <div class="form-group mb-3 mt-3">
                    <label for="codigo" class="font-weight-bold">Código del Producto</label>
                    <input type="text" class="form-control" id="codigo" name="codigo" required>
                </div>

                <!-- Vista Previa de la Imagen -->
                <div class="form-group mb-3 text-center">
                    <label class="font-weight-bold">Imagen Actual</label>
                    <div>
                        <img id="imagen_producto" src="../../public/img/default.jpg" alt="Imagen del Producto" class="img-thumbnail" style="max-width: 200px;">
                    </div>
                </div>


                <!-- Input para subir nueva imagen -->
                <div class="form-group mb-3 text-center">
                    <label class="font-weight-bold">Subir Nueva Imagen</label>
                    <input type="file"  class="form-control" id="input_imagen" name="input_imagen" accept="image/*" >
                    <p id="errorMensaje" style="color: red; display: none;">La imagen debe ser menor a 2MB.</p>
                </div>


                <button type="submit" class="btn btn-primary btn-block">Guardar Cambios</button>
            </form>
        </div>

        <!-- Tabla de Productos -->
        <table id="tablaProductos" class="table table-striped">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Categoría</th>
                    <th>Subcategoría</th>
                    <th>Fecha de Mantenimiento</th>
                    <th>Código</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>

    <script src="../../../public/js/jquery-3.7.1.min.js"></script>
    <script src="../../../public/js/datatables.js"></script>
    <script src="../../../public/js/bootstrap.js"></script>
    <script src="../../../public/js/catalogo/productos.js"></script>

</body>

</html>