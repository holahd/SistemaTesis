<?php
session_start();
require_once './../public/libs/dompdf/autoload.inc.php'; 
use Dompdf\Dompdf;


if (!isset($_SESSION['reporte_data'])) {
    echo "No hay datos para mostrar.";
    exit;
}

$datos = $_SESSION['reporte_data'];
$fechas = $_SESSION['reporte_fechas'];

// Empieza la construcción del HTML del PDF
$html = '
<style>
    body { font-family: Arial, sans-serif; font-size: 12px; }
    h2 { text-align: center; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #444; padding: 6px; text-align: center; }
    th { background-color: #f2f2f2; }
</style>

<h2>Reporte de Entradas y Salidas</h2>
<p><strong>Rango de fechas:</strong> ' . $fechas['inicio'] . ' al ' . $fechas['fin'] . '</p>

<table>
    <thead>
        <tr>
            <th>Producto</th>
            <th>Lote</th>
            <th>Talla</th>
            <th>Proveedor</th>
            <th>Entrada</th>
            <th>Salida</th>
            <th>Fecha y hora</th>
        </tr>
    </thead>
    <tbody>';

foreach ($datos as $row) {
    $html .= '<tr>
        <td>' . $row['producto'] . '</td>
        <td>' . $row['numero_lote'] . '</td>
        <td>' . $row['talla'] . '</td>
        <td>' . $row['proveedor'] . '</td>
        <td>' . $row['cantidad_entrada'] . '</td>
        <td>' . $row['cantidad_salida'] . '</td>
        <td>' . $row['fecha_hora'] . '</td>
    </tr>';
}

$html .= '</tbody></table>';

// Crear el PDF
$dompdf = new Dompdf();
$dompdf->loadHtml($html);
$dompdf->setPaper('A4', 'landscape'); // o portrait si prefieres
$dompdf->render();

// Descargar
$dompdf->stream("reporte_inventario_" . date('Ymd_His') . ".pdf", ["Attachment" => true]);

// Limpiar sesión para evitar que se descargue el mismo PDF luego
unset($_SESSION['reporte_data']);
unset($_SESSION['reporte_fechas']);