<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <title>Resumen de Cotización</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Bootstrap CSS (puedes usar tu propia versión si ya tienes) -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <style>
        body {
            padding: 20px;
            font-family: Arial, sans-serif;
        }

        td .btn {
            padding: 0.25rem 0.5rem;
        }

        .cantidad {
            min-width: 30px;
            display: inline-block;
            text-align: center;
        }
    </style>
</head>

<body>
    <button class="btn btn-secondary mb-3" onclick="history.back()">Regresar</button>

    <h3 class="mb-4">Resumen de Cotización</h3>

    <table class="table table-bordered align-middle">
        <thead class="table-secondary">
            <tr>
                <th>Producto</th>
                <th>Descripción</th>
                <th style="width: 160px;">Cantidad</th>
                <th style="width: 100px;">Acciones</th>
            </tr>
        </thead>
        <tbody id="tablaResumen">
            <!-- Aquí se cargan los productos -->
        </tbody>
    </table>

    <div class="mb-3">
        <label for="correoContacto" class="form-label">Correo de contacto</label>
        <input type="email" id="correoContacto" class="form-control" placeholder="cliente@ejemplo.com" required>
    </div>

    <button id="enviarCotizacion" class="btn btn-primary">Enviar solicitud de cotización</button>

    <!-- jQuery + Bootstrap JS -->
    <script src="../../public/js/jquery-3.7.1.min.js"></script>
    <script src="../../public/js/bootstrap.js"></script>
    <script src="./../../public/js/catalogo/resumen.js"></script>

</body>

</html>