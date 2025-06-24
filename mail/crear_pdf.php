<?php
require_once './../public/libs/dompdf/autoload.inc.php'; 
use Dompdf\Dompdf;

function generarPDF($datos) {
    $fecha = date("d/m/Y H:i");
    $telefono = "+593 99 999 9999";
    $empresa = "FireSafe"; // nombre de la empresa
    $logo = realpath(__DIR__ . '/../public/img/administrador/Pyro_emblem_RED.png');


    // Construir la tabla de productos
    $tabla = '';
    $total = 0;

    foreach ($datos['productos'] as $item) {
        $subtotal = $item['cantidad'] * $item['precio_final'];
        $total += $subtotal;

        $tabla .= '
        <tr>
            <td>' . htmlspecialchars($item['producto']) . '</td>
            <td>' . $item['cantidad'] . '</td>
            <td>$' . number_format($item['precio_final'], 2) . '</td>
            <td>$' . number_format($subtotal, 2) . '</td>
        </tr>';
    }

    $html = '
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; font-size: 14px; }
            .encabezado { text-align: center; margin-bottom: 30px; }
            .encabezado img { max-width: 120px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: #f0f0f0; }
            .total { text-align: right; font-weight: bold; margin-top: 10px; }
            .despedida { margin-top: 30px; font-size: 13px; color: #555; }
            .fecha { font-size: 12px; color: #999; }
        </style>
    </head>
    <body>
        <div class="encabezado">
            <img src="' . $logo . '" alt="Logo">
            <h2>' . $empresa . '</h2>
            <p>Estimado/a cliente, a continuación encontrará el detalle de su cotización.</p>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>' . $tabla . '</tbody>
        </table>

        <p class="total">Total a pagar: $' . number_format($total, 2) . '</p>

        <p style="font-size: 15px; color: #b22222; font-weight: bold;">
  ⚠️ Nota importante: Los precios indicados <u>no incluyen IVA</u>. El valor final puede variar según la normativa tributaria vigente.
</p>


        <div class="despedida">
            <p>Gracias por su interés. Para más información o para confirmar la compra, contáctenos al <strong>' . $telefono . '</strong>.</p>
        </div>

        <p class="fecha">Cotización generada el ' . $fecha . '</p>
    </body>
    </html>';

    $dompdf = new Dompdf();
    $dompdf->loadHtml($html);
    $dompdf->render();

    $output = $dompdf->output();
    $filePath = '../temp/cotizacion_' . time() . '.pdf';
    file_put_contents($filePath, $output);

    return $filePath;
}
