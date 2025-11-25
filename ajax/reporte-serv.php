<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


require("../modelo/reportes.php");

$reportes = new reportes();

switch ($_GET["op"]) {
    case 'entradasSalidas':
        $fechaInicio = $_POST['fechaInicio'];
        $fechaFin = $_POST['fechaFin'];
        $nombreProducto = isset($_POST['nombreProducto']) && $_POST['nombreProducto'] !== '' ? $_POST['nombreProducto'] : null;

        //nombre producto llega con un simbolo +, hay que reemplazarlo por un espacio
        if ($nombreProducto) {
            $nombreProducto = str_replace('+', ' ', $nombreProducto);
        }

        $datos = $reportes->entradaSalida($fechaInicio, $fechaFin, $nombreProducto);


        $data = [];

        while ($reg = $datos->fetch_object()) {
            $data[] = array(
                "producto" => $reg->producto,
                "numero_lote" => $reg->numero_lote,
                "talla" => $reg->talla,

                "proveedor" => $reg->proveedor,
                "cantidad_entrada" => $reg->cantidad_entrada,
                "cantidad_salida" => $reg->cantidad_salida,
                "fecha_hora" => $reg->fecha_hora

            );
        }

        // Verificamos si "$data" está definido y no está vacío

        if (!empty($data)) {
            // Guardamos en la sesión para enviarlo al generador de PDF
            session_start();
            $_SESSION['reporte_data'] = $data;
            $_SESSION['reporte_fechas'] = ['inicio' => $fechaInicio, 'fin' => $fechaFin];
            $_SESSION['reporte_producto'] = $nombreProducto;

            echo 'ok';
        } else {
            echo 'no';
        }

        break;
}
