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
            echo json_encode(['status' => 'error', 'message' => 'Error al registrar la cotización'.$idCot]);
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

        case 'listarDetalleCompleto':

        $res = $cotizacion->listar_detalle_Completo($_POST['id']);
        $data = array();

        while ($reg = $res->fetch_object()) {
            $data[] = array(
                "id" => $reg->detalle_id,
                "producto" => $reg->producto,
                "cantidad" => $reg->cantidad,
                "precio" => $reg->pvp,
                "total" => $reg->total
            );
        }

        echo json_encode($data);

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

        $datos = json_decode(file_get_contents('php://input'), true);

        

        $productos = $datos['productos'];

        $idCot = $datos['cotizacion_id'];

        foreach ($productos as $producto) {
            $idProducto = $producto['id'];
            $precio = $producto['precio_final'];
            $subtotal = $producto['subtotal'];

            $cotizacion->colocar_precio($idProducto, $precio, $subtotal);
        }

        $cotizacion->cambio_estado($_SESSION['usuario_id'], $idCot, 'enviado');

        echo json_encode(enviarCorreo($datos));
        break;
        
}
