<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require("../modelo/umbrales.php");

$umbral = new Umbrales();



switch ($_GET["op"]) {

    case 'listar':
        $res = $umbral->listarUmbrales();
        $data = array();

        while ($reg = $res->fetch_object()) {
            $data[] = array(
                "id" => $reg->id,
                "cantidad" => $reg->cantidad,
                "descuento" => $reg->descuento,
                "ganancia" => $reg->ganancia
            );
        }

        echo json_encode($data);
        break;

    case 'mostrarDescuento':
        $cantidad = $_POST['cantidad'];

        if ($umbral->mostrardescuento($cantidad)) {
            echo json_encode(['status' => 'ok']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error al mostrar el descuento']);
        }
        break;


    case 'guardar':
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        $margen = $data['margen_ganancia'];
        $umbrales = $data['umbrales'];
        $eliminados = isset($data['eliminados']) ? $data['eliminados'] : [];

        // Eliminar primero los umbrales borrados
        foreach ($eliminados as $idEliminar) {
            $umbral->eliminarUmbral($idEliminar);
        }

        // Actualizar o insertar umbrales
        foreach ($umbrales as $u) {
            $id = isset($u['id']) ? intval($u['id']) : 0;
            $cantidad = intval($u['cantidad']);
            $descuento = floatval($u['descuento']);

            if ($id > 0) {
                $umbral->editarUmbral($id, $cantidad, $descuento, $margen);
            } else {
                $umbral->registrarUmbral($cantidad, $descuento, $margen);
            }
        }

        echo json_encode(['status' => 'ok']);
        break;

    case 'obtenerUmbral':
        $cantidad = $_POST['cantidad'];
        $res = $umbral->mostrardescuento($cantidad);

        if ($res) {
            $data = $res->fetch_object();
            $data = array(
                "id" => $data->id,
                "cantidad" => $data->cantidad,
                "descuento" => $data->descuento,
                "ganancia" => $data->ganancia
            );
            echo json_encode($data);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Error al mostrar el umbral']);
        }
        break;
        
}
