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
        <div class="mb-4">
            <div class="input-group shadow-sm">
                <span class="input-group-text bg-white border-end-0">
                    <i class="fas fa-search text-muted"></i>
                </span>
                <input
                    type="text"
                    id="filtroBusqueda"
                    class="form-control border-start-0"
                    placeholder="Buscar por número, cliente, correo o producto...">
            </div>
        </div>

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
                     <button type="button" class="btn btn-danger" id="btn-rechazar-stock">Rechazar por falta de stock</button>
                    <button type="button" class="btn btn-success" onclick="confirmarventa()">Confirmar Venta</button>
                    


                </div>
            </div>
        </div>
    </div>
</body>
<script src="./../../../public/js/jquery-3.7.1.min.js"></script>
<script src="./../../../public/js/bootstrap.bundle.js"></script>
<script src="./../../../public/js/sweetalert2.all.js"></script>
<script src="../../../public/js/validaciones.js"></script>
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
<script>
$(document).ready(function() {
  $('#filtroBusqueda').on('input', function() {
    const texto = $(this).val().toLowerCase();

    $('#cotizaciones-container .card').each(function() {
      const contenido = $(this).text().toLowerCase();
      $(this).toggle(contenido.includes(texto));
    });
  });
});
</script>


</html>