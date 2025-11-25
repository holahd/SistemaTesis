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
        $nombre = $_POST['nombre'];
        $telefono = $_POST['telefono'];
        $productos = json_decode($_POST['productos'], true);
        $idCot = $cotizacion->registrarCotizacion($email, $nombre, $telefono);

        if (!$idCot) {
            echo json_encode(['status' => 'error', 'message' => 'Error al registrar la cotización' . $idCot]);
            exit;
        }

        $exito = true;

        foreach ($productos as $p) {
            $producto_id = $p['id'];
            $cantidad = $p['cantidad'];
            $talla = isset($p['talla']) ? $p['talla'] : null;

            $ok = $cotizacion->registrarDetalle($idCot, $producto_id, $cantidad, $talla);
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
                "nombre" => $reg->nombre_cliente,
                "telefono" => $reg->telefono_cliente,
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
                "nombre" => $reg->nombre_cliente,
                "telefono" => $reg->telefono_cliente,
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
                "nombre" => $reg->nombre_cliente,
                "telefono" => $reg->telefono_cliente,
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
                "precio" => $reg->precio_unitario_crudo,
                "talla" => $reg->talla 
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
                "total" => $reg->total,
                "talla" => $reg->talla 
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
                "total" => $reg->total,
                "talla" => $reg->talla 
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

            $cotizacion->cambio_estado($usuarioId, $idCot, 'enviado', $resultadoMail['pdfPath']);

            $respuesta = [
                'success' => true,
                'message' => 'Cotización enviada con éxito',
                'pdfPath' => $resultadoMail['pdfPath']
            ];

        } else {

            error_log("Error al enviar cotización #{$idCot}: " . ($resultadoMail['mensaje'] ?? 'Sin detalle'));

            $respuesta = [
                'success' => false,
                'message' => 'Error al enviar la cotización: ' . ($resultadoMail['error'] ?? 'Sin detalle')
            ];
        }



        echo json_encode($respuesta);
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
            $cotizacion->cambio_estado($_SESSION['usuario_id'], $_POST['cotizacion_id'], 'vendido', null);
            echo json_encode(['status' => 'ok', 'message' => 'Cotización confirmada con éxito']);
        }


        break;

    case 'correoStockInsuficiente':
    $datos = json_decode(file_get_contents('php://input'), true);
    $idCot = $datos['cotizacion_id'];
    $productos = $datos['productos'];    // array de nombres
    $correo    = $datos['correo'];
    $nombre    = $datos['nombre'];

    // 1) Enviar correo de rechazo
    $resultado = enviarCorreoStockInsuficiente($correo, $idCot, $productos, $nombre);

    // 2) Si tuvo éxito, marcar cancelada
    if (!empty($resultado['success']) && $resultado['success'] === true) {
        $cotizacion->cambio_estado($_SESSION['usuario_id'], $idCot, 'cancelada', null);
    }
    echo json_encode($resultado);
    break;

    case 'rutaCotizacion':
        $idCot = $_POST['idcot'];
        $ruta = $cotizacion->rutaCotizacion($idCot);
        $status = 'ok';
        while ($row = $ruta->fetch_object()) {
            $pdfPath = $row->pdfCot;
        }

        if (!$pdfPath) {
            $status = 'error';
        }
        echo json_encode(['status' => $status,'pdfPath' => $pdfPath]);
        break;

}
