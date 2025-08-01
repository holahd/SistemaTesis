<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Detalle del Producto</title>
    <link rel="stylesheet" href="../../public/css/bootstrap.css">

</head>

<body class="container mt-4" id="detalleProducto">

    <button class="btn btn-secondary mb-3" onclick="history.back()">Regresar</button>

    <div id="alerta" class="alert alert-success alert-dismissible fade show" role="alert" style="display: none;">
        Producto añadido a la lista de cotización.
    </div>

    <div id="alerta2" class="alert alert-warning alert-dismissible fade show" role="alert" style="display: none;">
        Este producto ya está en la lista.
    </div>

    <div class="row">
        <h6 hidden id="producto_id">12345</h6>
        <div class="col-md-6">
            <img id="foto" src="ruta_de_la_imagen.jpg" class="img-fluid border rounded" alt="Producto">
        </div>
        <div class="col-md-6">
            <h2 id="nombre">Nombre del Producto</h2>
            <p id="descripcion" class="text-muted">Descripción detallada del producto con sus características principales.</p>

            <div class="d-flex">
                <span class="badge bg-info me-2" id="categoria">Categoría</span>
                <span class="badge bg-dark" id="subCategoria">Subcategoría</span>
            </div>
            <div class="mt-3">
                <label for="cantidad" class="form-label">Cantidad:</label>
                <input type="text" id="cantidad" class="form-control w-50 solo-numeros" min="1" value="" placeholder="ingrese una cantidad">
            </div>
            <!-- Agregado debajo de "Cantidad:" -->
            <div class="mt-3" id="contenedorTallas" style="display: none;">
                <label for="talla" class="form-label">Talla:</label>
                <select id="talla" class="form-select w-50">
                    <option value="" disabled selected>Selecciona una talla</option>
                </select>
            </div>

            <div class="mt-3">

                <button class="btn btn-warning mt-3 btn-add-lista" id="añadirLista">Agregar a la lista</button>
            </div>
        </div>
    </div>

    <script src="../../public/js/jquery-3.7.1.min.js"></script>
    <script src="../../public/js/bootstrap.js"></script>
    <script src="../../public/js/sweetalert2.all.js"></script>

    <script src="./../../public/js/validaciones.js"></script>

    <script src="../../public/js/catalogo/productos.js"></script>
    <script src="../../public/js/catalogo/cotizaciones.js"></script>
</body>

</html>