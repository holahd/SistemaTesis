<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Catálogo</title>
    <link rel="stylesheet" href="../../public/css/bootstrap.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <style>
        /* Ajusta el tamaño del menú superior */
        .navbar {
            background-color: #343a40;
            padding: 10px 20px;
        }

        /* Ajuste para hacer que el iframe ocupe el espacio adecuado */
        #product-frame {
            width: 100%;
            height: 80vh;
            /* Ocupa un 80% de la altura de la ventana */
            border: none;
        }

        /* Asegura que los productos y menú se ajusten bien en pantallas pequeñas */
        .container {
            max-width: 1200px;
        }
    </style>
</head>

<body id="principal">

    <!-- Barra de navegación superior -->
    <div class="navbar navbar-dark text-white">
        <div class="container d-flex justify-content-between align-items-center">
            <!-- Imagen al lado izquierdo -->
            <div>
                <img src="../../public/img/catalogo/Pyro_emblem_RED.png" alt="Logo" class="img-fluid" width="64" height="64" id="logo">

            </div>

            <!-- Título centrado -->
            <h1 class="text-center" style="font-size: 20px;">FireSafe - Catálogo de seguridad contra incendios</h1>

            <!-- Barra de búsqueda y filtros -->
            <div class="d-flex">
                <input type="text" id="barraBusqueda" name="barraBusqueda" class="form-control me-2" placeholder="Buscar productos...">
                <button class="btn btn-primary me-2" id="buscarProducto">Buscar</button>
                <button class="btn btn-primary" id="verLista">
                
                    <i class="fas fa-clipboard-list"></i> 
                </button>
            </div>
        </div>
    </div>

    <div class="modal fade" id="listaModal" tabindex="-1" aria-labelledby="listaModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="listaModalLabel">Lista de cotización</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div class="modal-body">
                <ul id="listaCotizacion" class="list-group">
                    <!-- Aquí se insertarán los productos -->
                </ul>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                <button type="button" class="btn btn-success" id="cotizarAhora">Cotizar ahora</button>
                <button type="button" class="btn btn-danger" id="vaciarLista">Vaciar lista</button>
            </div>
        </div>
    </div>
</div>

    <!-- iframe para mostrar productos -->
    <div class="container mt-4">
        <iframe id="product-frame" src="productos.php"></iframe>
    </div>
    <script src="../../public/js/sweetalert2.all.js"></script>
    <script src="../../public/js/jquery-3.7.1.min.js"></script>
    <script src="../../public/js/bootstrap.bundle.js"></script>
    <script src="../../public/js/catalogo/productos.js"></script>
    <script src="../../public/js/catalogo/cotizaciones.js"></script>

</body>

</html>