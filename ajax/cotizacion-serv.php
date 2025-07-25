<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
session_start();

require("../modelo/cotizacion.php");
require("../mail/mailer.php");
$cotizacion = new Cotizacion();

switch ($_GET["op"]) {

    case 'solicitar':

        $email = $_POST['email'];
        $productos = json_decode($_POST['productos'], true);
        $idCot = $cotizacion->registrarCotizacion($email);

        if (!$idCot) {
            echo json_encode(['status' => 'error', 'message' => 'Error al registrar la cotización' . $idCot]);
            exit;
        }

        $exito = true;

        foreach ($productos as $p) {
            $producto_id = $p['id'];
            $cantidad = $p['cantidad'];

            $ok = $cotizacion->registrarDetalle($idCot, $producto_id, $cantidad);
            if (!$ok) {
                $exito = false;
                break;
            }
        }

        echo json_encode(['status' => $exito ? 'ok' : 'error']);
        break;

    case 'listarPendientes':
        $res = $cotizacion->listar("espera");
        $data = array();

        while ($reg = $res->fetch_object()) {
            $data[] = array(
                "cotizacion_id" => $reg->cotizacion_id,
                "correo" => $reg->email_cliente,
                "productos_solicitados" => $reg->productos_solicitados
            );
        }

        echo json_encode($data);
        break;

    case 'listarEnviados':
        $res = $cotizacion->listar("enviado");
        $data = array();

        while ($reg = $res->fetch_object()) {
            $data[] = array(
                "cotizacion_id" => $reg->cotizacion_id,
                "correo" => $reg->email_cliente,
                "productos_solicitados" => $reg->productos_solicitados
            );
        }

        echo json_encode($data);
        break;

    case 'listarConfirmados':
        $res = $cotizacion->listar("vendido");
        $data = array();

        while ($reg = $res->fetch_object()) {
            $data[] = array(
                "cotizacion_id" => $reg->cotizacion_id,
                "correo" => $reg->email_cliente,
                "productos_solicitados" => $reg->productos_solicitados
            );
        }

        echo json_encode($data);
        break;



    case 'listarDetalle':

        $res = $cotizacion->listar_detalle($_POST['id']);
        $data = array();

        while ($reg = $res->fetch_object()) {
            $data[] = array(
                "id" => $reg->detalle_id,
                "producto" => $reg->producto,
                "cantidad" => $reg->cantidad_solicitada,
                "stock" => $reg->stock_total,
                "precio" => $reg->precio_unitario_crudo
            );
        }

        echo json_encode($data);

        break;

    case 'listarDetalleEnviado':

        $res = $cotizacion->listar_detalle_enviado($_POST['id']);
        $data = array();

        while ($reg = $res->fetch_object()) {
            $data[] = array(
                "id" => $reg->detalle_id,
                "producto" => $reg->producto,
                "cantidad" => $reg->cantidad,
                "stock" => $reg->stock_total,
                "precio" => $reg->pvp,
                "total" => $reg->total
            );
        }

        echo json_encode($data);

        break;



    case 'listarDetalleVendido':


        $id = $_POST['id'];

        // 1. Obtener detalles vendidos
        $resDetalle = $cotizacion->listar_detalle_vendido($id);
        $detalles = [];

        while ($reg = $resDetalle->fetch_object()) {
            $detalles[] = array(
                "id" => $reg->detalle_id,
                "producto" => $reg->producto,
                "cantidad" => $reg->cantidad,
                "stock" => $reg->stock_total,
                "precio" => $reg->pvp,
                "total" => $reg->total
            );
        }


        // 2. Obtener datos del cliente
        $resCliente = $cotizacion->listar_datos_cliente($id);
        $cliente = null;

        if ($row = $resCliente->fetch_object()) {
            $cliente = array(
                "nombre" => $row->nombre_cliente,
                "correo" => $row->email_cliente,
                "telefono" => $row->telefono_cliente,
                "direccion" => $row->direccion_cliente,
                "cedula" => $row->cedula_cliente
                // agrega más campos si los tienes
            );
        }


        // 3. Unir en una sola respuesta
        $respuesta = array(
            "detalles" => $detalles,
            "cliente" => $cliente
        );

        echo json_encode($respuesta);

        break;

    case 'listarproductos':
        $res = $lotes->listarNombresProductos();

        if (!$res) {
            echo json_encode(["error" => "La consulta no se ejecutó"]);
            break;
        }

        $data = array();

        while ($reg = $res->fetch_object()) {
            $data[] = array("producto" => $reg->nombre);
        }

        if (empty($data)) {
            echo json_encode(["error" => "Consulta vacía"]);
        } else {
            echo json_encode($data);
        }

        break;

    case 'enviarCotizacion':
        $datos    = json_decode(file_get_contents('php://input'), true);
        $productos = $datos['productos'];
        $idCot     = $datos['cotizacion_id'];
        $usuarioId = $_SESSION['usuario_id'];


        foreach ($productos as $producto) {
            $cotizacion->colocar_precio(
                $producto['id'],
                $producto['precio_final'],
                $producto['subtotal']
            );
        }


        $resultadoMail = enviarCorreo($datos);

        if (!empty($resultadoMail['success']) && $resultadoMail['success'] === true) {

            $cotizacion->cambio_estado($usuarioId, $idCot, 'enviado');
        } else {

            error_log("Error al enviar cotización #{$idCot}: " . ($resultadoMail['mensaje'] ?? 'Sin detalle'));
        }


        echo json_encode($resultadoMail);
        break;


    case 'confirmarVenta':

        $confirmar = $cotizacion->confirmar_datos_cot(
            $_POST['cotizacion_id'],
            $_POST['nombre'],
            $_POST['identificacion'],
            $_POST['direccion'],
            $_POST['correo'],
            $_POST['telefono']
        );

        if (!$confirmar) {
            echo json_encode(['status' => 'error', 'message' => 'Error al confirmar la cotización']);
            exit;
        } else {
            $cotizacion->cambio_estado($_SESSION['usuario_id'], $_POST['cotizacion_id'], 'vendido');
            echo json_encode(['status' => 'ok', 'message' => 'Cotización confirmada con éxito']);
        }


        break;

    case 'correoStockInsuficiente':
    $datos = json_decode(file_get_contents('php://input'), true);
    $idCot = $datos['cotizacion_id'];
    $productos = $datos['productos'];    // array de nombres
    $correo    = $datos['correo'];

    // 1) Enviar correo de rechazo
    $resultado = enviarCorreoStockInsuficiente($correo, $idCot, $productos);

    // 2) Si tuvo éxito, marcar cancelada
    if (!empty($resultado['success']) && $resultado['success'] === true) {
        $cotizacion->cambio_estado($_SESSION['usuario_id'], $idCot, 'cancelada');
    }
    echo json_encode($resultado);
    break;

}
