<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require("../modelo/lotes.php");

$lotes = new Lotes();

switch ($_GET["op"]) {

    case 'registrar':
        $Producto = $_POST["producto"];
        $numLot = 1;
        $cantidad = $_POST["cantidad"];
        $fechIng = date('Y-m-d');
        $fechCad = isset($_POST["fechaCaducidad"]) ? $_POST["fechaCaducidad"] : null;
        $talla = isset($_POST["talla"]) ? $_POST["talla"] : null; 
        $proveedor = $_POST["proveedor"];
        $precio = $_POST["precioUnitario"];

        if (isset($_POST["fechaCaducidad"])) {
            $fechCad = empty($fechCad) ? null : $fechCad;
        }
        if (isset($_POST["talla"])) {
            $talla = $_POST["talla"];
        } else {
            $talla = null; // Si no se envía talla, se establece como null
        }

        $res = $lotes->registrar($Producto, $numLot, $cantidad, $fechIng, $fechCad, $talla, $proveedor, $precio);



        if ($res['ok']) {
            $respuesta['mensaje'] = 'lote registrado correctamente';
            $respuesta['tipo'] = 1;
        } else {
            if ($res['error'] == 1062) {
                $respuesta['mensaje'] = 'El numero de lote ingresado ya está registrado.';
            } else {
                $respuesta['mensaje'] = 'Error al registrar lote';
            }
            $respuesta['tipo'] = 0;
        }


        echo json_encode($respuesta);
        break;

    case 'listar':
        $res = $lotes->listar();
        $data = array();

        while ($reg = $res->fetch_object()) {
            $data[] = array(
                "lote_id" => $reg->lote_id,
                "producto" => $reg->producto,
                "numLote" => $reg->numero_lote,
                "cantidad" => $reg->cantidad,
                "fechaIngreso" => $reg->fecha_ingreso,
                "fechaCaducidad" => $reg->fecha_caducidad,
                "talla" => $reg->talla,
                "proveedor" => $reg->proveedor,
                "precioUnitario" => $reg->precio_unit
            );
        }

        echo json_encode($data);
        break;

    case 'editar':
        $loteId = $_POST["lote_id"];
        $Producto = $_POST["productoEditar"];
        $numLot = 1;
        $cantidad = $_POST["unidadesEditar"];
        $fechIng = date('Y-m-d');
        $fechCad = isset($_POST["fechaCaducidadEditar"]) ? $_POST["fechaCaducidadEditar"] : null;
        $proveedor = $_POST["proveedorEditar"];
        $precio = $_POST["precioUnitarioEditar"];

        if (isset($_POST["fechaCaducidadEditar"])) {
            $fechCad = empty($fechCad) ? null : $fechCad;
        }

        if (isset($_POST["tallaEditar"])) {
            $talla = $_POST["tallaEditar"];
        } else {
            $talla = null; // Si no se envía talla, se establece como null
        }


        $res = $lotes->editar($loteId, $Producto, $numLot, $cantidad, $fechIng, $fechCad, $talla, $proveedor, $precio);


        if ($res['ok']) {
            $respuesta['mensaje'] = 'Lote editado correctamente';
            $respuesta['tipo'] = 1;
        } else {
            if ($res['error'] == 1062) {
                $respuesta['mensaje'] = 'El numero de lote ingresado ya está registrado.';
            } else {
                $respuesta['mensaje'] = 'Error al editar lote' . $res['error'];
            }
            $respuesta['tipo'] = 0;
        }


        echo json_encode($respuesta);
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
            $data[] = array(
                "producto" => $reg->producto,
                "subcategoria" => $reg->subcategoria,
                "categoria" => $reg->categoria
            );
        }

        if (empty($data)) {
            echo json_encode(["error" => "Consulta vacía"]);
        } else {
            echo json_encode($data);
        }

        break;
}
