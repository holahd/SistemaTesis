<?php
function getEmailBody($clienteNombre)
{
    $telefono = "+593 99 999 9999";
    $empresa = "FireSafe";

    return '
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
          
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="cid:logoCID" alt="Logo de la empresa" style="max-width: 150px;">
            <h2 style="margin: 10px 0 0 0; color: #333;">' . $empresa . '</h2>
          </div>

          <p style="font-size: 16px; color: #333;">
            ¡Hola <strong>' . htmlspecialchars($clienteNombre) . '</strong>!
          </p>

          <p style="font-size: 16px; color: #333;">
            Gracias por solicitar una cotización con nosotros. Hemos preparado tu oferta con atención a los detalles que nos compartiste.
          </p>

          <p style="font-size: 16px; color: #333;">
            Descubre el archivo adjunto y revisa los productos que seleccionaste. Estamos listos para ayudarte si deseas continuar con tu pedido.
          </p>

          <p style="font-size: 16px; color: #333;">
            Para confirmar, resolver dudas o ajustar tu cotización, llámanos o escríbenos al:
          </p>

          <p style="font-size: 18px; font-weight: bold; color: #0055aa;">
            ' . $telefono . '
          </p>

          <p style="font-size: 16px; color: #555;">
            Un saludo cordial,<br>
            <strong>El equipo de ' . $empresa . '</strong>
          </p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ccc;">

          <p style="font-size: 12px; color: #999;">
            Este mensaje fue generado automáticamente por nuestro sistema de cotizaciones. No responda a este correo.
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
            Estimado/a <strong>' . htmlspecialchars($clienteNombre) . '</strong>,
          </p>

          <p style="font-size: 16px; color: #333;">
            Tu solicitud de cotización <strong>#' . $cotId . '</strong> no pudo ser procesada debido a falta de stock en los siguientes productos:
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
            Lamentamos los inconvenientes. Si deseas asesoría o conocer productos similares, contáctanos al:
          </p>

          <p style="font-size: 18px; font-weight: bold; color: #0055aa;">
            ' . $telefono . '
          </p>

          <p style="font-size: 16px; color: #555;">
            Un saludo cordial,<br>
            <strong>Equipo de ' . $empresa . '</strong>
          </p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ccc;">

          <p style="font-size: 12px; color: #999;">
            Este mensaje fue generado automáticamente. No respondas a este correo.
          </p>
          <p style="font-size: 12px; color: #bbb; margin-top: 5px;">
            Enviado el ' . date("d/m/Y \a \l\a\s H:i") . '
          </p>
        </div>
      </body>
    </html>
    ';
}
