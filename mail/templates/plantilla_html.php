<?php
function getEmailBody()
{

    $telefono = "+593 99 999 9999"; // tu número de contacto
    $empresa = "FireSafe"; // nombre de tu empresa

    return '
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
          
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="cid:logoCID" alt="Logo de la empresa" style="max-width: 150px;">

            <h2 style="margin: 10px 0 0 0; color: #333;">' . $empresa . '</h2>
          </div>

          <p style="font-size: 16px; color: #333;">
            Estimado/a <strong>' . htmlspecialchars("cliente") . '</strong>,
          </p>

          <p style="font-size: 16px; color: #333;">
            Gracias por solicitar una cotización con nosotros. Adjunto a este correo encontrará el documento con el detalle de los artículos solicitados.
          </p>

          <p style="font-size: 16px; color: #333;">
            Si tiene preguntas o desea confirmar la compra de los productos, no dude en contactarnos al siguiente número:
          </p>

          <p style="font-size: 18px; font-weight: bold; color: #0055aa;">
            ' . $telefono . '
          </p>

          <p style="font-size: 16px; color: #555;">
            Atentamente,<br>
            <strong>Equipo de ' . $empresa . '</strong>
          </p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ccc;">

          <p style="font-size: 12px; color: #999;">
                Este mensaje fue generado automáticamente por nuestro sistema de cotizaciones. Por favor, no responda a este correo.<br>
                Si necesita asistencia, contáctenos al número proporcionado.
          </p>
          <p style="font-size: 12px; color: #bbb; margin-top: 5px;">
                Enviado el ' . date("d/m/Y \a \l\a\s H:i") . '
          </p>
        </div>
      </body>
    </html>
    ';
}

function getEmailBodyStockInsuficiente($clienteNombre, $cotId, array $productos) {
    $telefono = "+593 99 999 9999";
    $empresa  = "FireSafe";

    // Construye la lista de productos faltantes
    $itemsHtml = '';
    foreach ($productos as $p) {
        $itemsHtml .= "<tr>
            <td style=\"padding:8px;border:1px solid #ddd;\">{$p}</td>
        </tr>";
    }

    return '
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
          
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="cid:logoCID" alt="Logo de la empresa" style="max-width: 150px;">
            <h2 style="margin: 10px 0 0 0; color: #333;">' . $empresa . '</h2>
          </div>

          <p style="font-size: 16px; color: #333;">
            Estimado/a cliente
          </p>

          <p style="font-size: 16px; color: #333;">
            Tu solicitud de cotización <strong>#' . $cotId . '</strong> ha sido <strong style="color:#d9534f;">cancelada</strong> porque no hay stock suficiente de los siguientes productos:
          </p>

          <table style="width:100%;border-collapse:collapse;margin-top:10px;">
            <thead>
              <tr>
                <th style="padding:8px;background:#f7f7f7;border:1px solid #ddd;text-align:left;">Producto</th>
              </tr>
            </thead>
            <tbody>
              ' . $itemsHtml . '
            </tbody>
          </table>

          <p style="font-size: 16px; color: #333; margin-top:20px;">
            Lamentamos las molestias. Si tienes dudas o deseas alternativas, contáctanos al:
          </p>

          <p style="font-size: 18px; font-weight: bold; color: #0055aa;">
            ' . $telefono . '
          </p>

          <p style="font-size: 16px; color: #555;">
            Atentamente,<br>
            <strong>Equipo de ' . $empresa . '</strong>
          </p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ccc;">

          <p style="font-size: 12px; color: #999;">
            Este mensaje fue generado automáticamente. Por favor, no respondas a este correo.
          </p>
          <p style="font-size: 12px; color: #bbb; margin-top: 5px;">
            Enviado el ' . date("d/m/Y \a \l\a\s H:i") . '
          </p>
        </div>
      </body>
    </html>
    ';
}