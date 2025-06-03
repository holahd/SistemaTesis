<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require("../modelo/lotes.php");

$lotes = new Lotes();

switch ($_GET["op"]) {

    case 'registrar':
        $Producto = $_POST["producto"];
        $numLot = $_POST["numeroLote"];
        $cantidad = $_POST["cantidad"];
        $fechIng = $_POST["fechaIngreso"];
        $fechCad = isset($_POST["fechaCaducidad"]) ? $_POST["fechaCaducidad"] : null;
        $proveedor = $_POST["proveedor"];
        $precio = $_POST["precioUnitario"];

        if (isset($_POST["fechaCaducidad"])) {
            $fechCad = empty($fechCad) ? null : $fechCad;
        }

        $res = $lotes->registrar($Producto, $numLot, $cantidad, $fechIng, $fechCad, $proveedor, $precio);
        echo json_encode(["tipo" => 1, "mensaje" => "Lote registrado correctamente"]);
        break;

    case 'listar':
        $res = $lotes->listar();
        $data = array();

        while ($reg = $res->fetch_object()) {
            $data[] = array(
                "id" => $reg->lote_id,
                "producto" => $reg->producto,
                "numLote" => $reg->numero_lote,
                "cantidad" => $reg->cantidad,
                "fechaIngreso" => $reg->fecha_ingreso,
                "fechaCaducidad" => $reg->fecha_cad,
                "proveedor" => $reg->proveedor,
                "precioUnitario" => $reg->precio_unit
            );
        }

        echo json_encode($data);
        break;

    case 'editar':
        $loteId = $_POST["id"];
        $Producto = $_POST["producto"];
        $numLot = $_POST["numeroLote"];
        $cantidad = $_POST["cantidad"];
        $fechIng = $_POST["fechaIngreso"];
        $fechCad = $_POST["fechaCaducidad"];
        $proveedor = $_POST["proveedor"];
        $precio = $_POST["precioUnitario"];

        $fechCad = empty($fechCad) ? null : $fechCad;

        $res = $lotes->editar($loteId, $Producto, $numLot, $cantidad, $fechIng, $fechCad, $proveedor, $precio);
        echo json_encode(["status" => "ok", "mensaje" => "Lote editado correctamente"]);
        break;

    case 'eliminar':
        $loteId = $_POST["id"];
        $res = $lotes->eliminar($loteId);
        echo json_encode(["status" => "ok", "mensaje" => "Lote eliminado"]);
        break;

    case 'listarproductos':
        $res = $lotes->listarNombresProductos();

        if (!$res) {
            echo json_encode(["error" => "La consulta no se ejecutó"]);
            break;
        }

        $data = array();

        while ($reg = $res->fetch_object()) {
            $data[] = array("producto" => $reg->nombre); // Asegúrate de que se llame "nombre"
        }

        if (empty($data)) {
            echo json_encode(["error" => "Consulta vacía"]);
        } else {
            echo json_encode($data);
        }

        break;
}
