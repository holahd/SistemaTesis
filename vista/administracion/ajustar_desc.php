<?php 
session_start();
if (!isset($_SESSION['nombre']) ) {
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
    <title>Ajuste de descuentos por cantidad</title>
    <link href="../../public/css/bootstrap.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">

    <style>
        .tooltip-inner {
            max-width: 280px;
            text-align: left;
            font-size: 0.9rem;
        }
        .form-control,
        .form-select {
            border: 1px solid #000;
            border-radius: 0.375rem;
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .form-control:focus,
        .form-select:focus {
            border-color: #0d6efd;
            box-shadow: 0 0 5px rgba(13, 110, 253, 0.5);
            outline: none;
        }
        .input-group-text {
            background-color: #e9ecef;
            border: 1px solid #000;
            border-radius: 0.375rem 0 0 0.375rem;
        }
        .btn-outline-success {
            font-weight: 600;
            transition: background-color 0.3s ease;
        }
        .btn-outline-success:hover {
            background-color: #198754;
            color: white;
        }
        .btn-warning {
            font-weight: 600;
        }
        .btn-primary {
            font-weight: 600;
        }
        .threshold-item {
            border: 1px solid #dee2e6;
            border-radius: 0.5rem;
            padding: 1rem;
            background-color: #fefefe;
            box-shadow: 0 2px 6px rgba(0,0,0,0.05);
            transition: box-shadow 0.3s ease;
        }
        .threshold-item:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        label .bi-info-circle {
            cursor: pointer;
            margin-left: 4px;
            color: #0d6efd;
            transition: color 0.2s ease;
        }
        label .bi-info-circle:hover,
        label .bi-info-circle:focus {
            color: #0a58ca;
        }
    </style>
</head>
<body class="bg-light">
    <div class="container my-5">
        <div class="card shadow-lg">
            <div class="card-header bg-dark text-white text-center">
                <h4 class="mb-1">
                    <i class="bi bi-tag-fill me-2"></i> Configuración de descuentos por cantidad
                </h4>
                <p class="mb-0 fs-6">
                    Establezca los descuentos que se aplican según la cantidad comprada.
                </p>
            </div>
            <div class="card-body bg-white">
                <form id="form_ajuste_descuentos">
                    <div class="mb-4">
                        <label for="margen_ganancia" class="form-label fw-bold">
                            Margen de ganancia general (%)
                            <span tabindex="0" data-bs-toggle="tooltip" title="Este margen se aplica sobre el costo base del producto para calcular el precio de venta antes del descuento.">
                                <i class="bi bi-info-circle"></i>
                            </span>
                        </label>
                        <div class="input-group">
                            <input type="number" class="form-control" id="margen_ganancia" name="margen_ganancia" step="0.01" min="0" required>
                            <span class="input-group-text">%</span>
                        </div>
                    </div>

                    <h5 class="mb-3 fw-bold">Descuentos por cantidad:</h5>

                    <div id="contenedor_thresholds">
                        <!-- Umbrales insertados aquí -->
                    </div>

                    <div class="d-flex justify-content-between mt-4">
                        <button type="button" id="agregar_threshold" class="btn btn-outline-success">
                            <i class="bi bi-plus-circle me-1"></i> Añadir umbral
                        </button>
                        <div>
                            <button type="button" id="revertir_cambios" class="btn btn-warning me-2">
                                <i class="bi bi-arrow-counterclockwise me-1"></i> Revertir
                            </button>
                            <button type="submit" class="btn btn-primary">
                                <i class="bi bi-save me-1"></i> Guardar cambios
                            </button>
                        </div>
                    </div>
                </form>

                <template id="template_threshold">
                    <div class="row gx-3 gy-3 align-items-end mb-3 threshold-item">
                        <div class="col-md-5">
                            <label class="form-label fw-semibold">
                                Cantidad mínima
                                <span tabindex="0" data-bs-toggle="tooltip" title="Cantidad mínima de unidades para que se aplique este descuento.">
                                    <i class="bi bi-info-circle"></i>
                                </span>
                            </label>
                            <div class="input-group">
                                <input type="number" class="form-control cantidad_minima" name="cantidad_minima[]" required min="1">
                                <span class="input-group-text">unidades</span>
                            </div>
                        </div>
                        <div class="col-md-5">
                            <label class="form-label fw-semibold">
                                Descuento (%)
                                <span tabindex="0" data-bs-toggle="tooltip" title="Porcentaje de descuento aplicado al precio con margen.">
                                    <i class="bi bi-info-circle"></i>
                                </span>
                            </label>
                            <div class="input-group">
                                <input type="number" class="form-control descuento" name="descuento[]" step="0.01" min="0" required>
                                <span class="input-group-text">%</span>
                            </div>
                        </div>
                        <div class="col-md-2 d-grid">
                            <button type="button" class="btn btn-danger btn-sm eliminar_threshold" title="Eliminar umbral">
                                <i class="bi bi-trash"></i> Eliminar
                            </button>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>

    <script src="../../public/js/bootstrap.bundle.js"></script>
    <script src="../../public/js/jquery-3.7.1.min.js"></script>
    <script src="../../public/js/sweetalert2.all.js"></script>
    <script src="../../public/js/administracion/ajustar_desc.js"></script>
    <script>
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
          return new bootstrap.Tooltip(tooltipTriggerEl)
        })
    </script>
</body>
</html>
