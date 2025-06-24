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
    <title>Solicitudes Enviadas</title>
    <link href="./../../../public/css/bootstrap.css" rel="stylesheet">

    <style>
        .card-text {
            max-height: 3em;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    </style>
</head>

<body class="bg-light">
    <div class="container mt-4">
       <h3 class="mb-4">Solicitudes de Cotización Enviadas</h3>
        <div id="cotizaciones-container" class="d-flex flex-column gap-3">
            <!-- Tarjetas se insertan aquí -->
        </div>
    </div>

    <!-- Modal Bootstrap -->
    <div class="modal fade" id="modalDetalle" tabindex="-1" aria-labelledby="modalDetalleLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalDetalleLabel">Detalle de la Cotización</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                </div>
                <div class="modal-body" id="detalle-modal-body">
                    <!-- Contenido dinámico -->
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-success" onclick="enviarCotizacion()">Confirmar Venta</button>


                </div>
            </div>
        </div>
    </div>
</body>
<script src="./../../../public/js/jquery-3.7.1.min.js"></script>
<script src="./../../../public/js/bootstrap.bundle.js"></script>
<!-- Script personalizado -->
<script src="./../../../public/js/administracion/ventas/cotizaciones_funciones.js"></script>
<script>
    $(document).ready(function() {
     cargarCotizaciones(
  '../../../ajax/cotizacion-serv.php?op=listarEnviados',
  '#cotizaciones-container',
  'mostrarDetalleConfirmacion'
);

    });
</script>
</html>