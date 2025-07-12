<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Catálogo de Productos</title>
    <link rel="stylesheet" href="../../public/css/bootstrap.css">
    <style>
        /* Diseño de los productos */
        .card {
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .card img {
            object-fit: cover;
            height: 200px;
            width: 100%;
        }

        .card-body {
            text-align: center;
            padding: 15px;
        }

        .card-title {
            font-size: 1.2rem;
            font-weight: bold;
        }

        .card-text {
            color: #555;
            margin-bottom: 10px;
        }

        /* Estilo para los filtros de los productos */
        .filters {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }

        .filters select {
            width: 48%;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
    </style>
</head>

<body id="productos">

    <div class="container mt-4">

        <!-- Filtros de categoría y tipo -->
        <div class="filters">
            <select class="form-select" id="categoria">
                
                <!-- Opciones se agregarán dinámicamente -->
            </select>
            <select class="form-select" id="subcategoria">
                <option value="">Seleccionar tipo</option>
                <!-- Opciones se agregarán dinámicamente -->
            </select>
        </div>

        <!-- Fila de productos -->
        <div class="row" id="product-list">
            <!-- Producto 1 -->
           
        </div>

    </div>

    <script src="../../public/js/jquery-3.7.1.min.js"></script>
    <script src="../../public/js/bootstrap.bundle.js"></script>
     <script src="../../public/js/sweetalert2.all.js"></script>
    <script src="./../../public/js/catalogo/combosAnidados.js"></script>
    <script src="../../public/js/catalogo/productos.js"></script>

</body>

</html>
