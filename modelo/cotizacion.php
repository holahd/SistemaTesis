<?php

require('../config/conexion.php');

class Cotizacion
{

    public function __construct() {}

    public function registrarCotizacion($email)
    {
        // Paso 1: Insertar la cotización (op 2)
        $sqlInsert = "CALL sp_cotizacion(2, 0, '$email', NULL, NULL, NULL);";
        $result = ejecutarConsultaSP($sqlInsert);
        $row = $result->fetch_assoc();
        return $row['cotizacion_id'];
    }


    public function registrarDetalle($cotizacion_id, $producto_id, $cantidad)
    {
        $sql = "CALL sp_detalle_cotizacion(
        2,
        0,
        $cotizacion_id,
        $producto_id,
        $cantidad,
        NULL,
        NULL
    );";
        return ejecutarConsultaSP($sql);
    }


    public function listarNombresProductos()
    {
        $sql = "CALL sp_lote(5,00,'', 0, 0, '2000-01-01', '', NULL, 0);";
        return ejecutarConsultaSP($sql);
    }

    public function listar($estado)
    {

        $sql = "CALL sp_cotizacion(5, 0, ' ', NULL, '$estado', NULL);";
        return ejecutarConsultaSP($sql);
    }

    public function listar_detalle($idCot)
    {
        $sql = "CALL sp_cotizacion(6, $idCot, ' ', NULL, 'espera', NULL);";
        return ejecutarConsultaSP($sql);
    }

    public function cambio_estado($idVen, $idcot, $estado)
    {

        $sql = "CALL sp_cotizacion(3, $idcot, ' ', NULL, '$estado', $idVen);";
        return ejecutarConsultaSP($sql);
    }

    public function colocar_precio($id, $precio, $sTotal)
    {
        $sql = "CALL sp_detalle_cotizacion(3, $id, NULL , NULL, NULL , $precio, $sTotal);";
        return ejecutarConsultaSP($sql);
    }


    public function listar_detalle_enviado($id)
    {
        $sql = "CALL sp_detalle_cotizacion(1, NULL, $id , NULL, NULL , NULL, NULL);";
        return ejecutarConsultaSP($sql);
    }



    public function confirmar_datos_cot($idCot, $nombre, $identificacion, $direccion, $correo, $telefono)
    {
        $sql = "CALL confirmar_cot('$correo' , '$nombre', '$identificacion', '$direccion','$telefono' , $idCot);";
        return ejecutarConsultaSP($sql);
    }


    public function listar_detalle_vendido($id)
    {
        $sql = "CALL sp_detalle_cotizacion(1, NULL, $id , NULL, NULL , NULL, NULL);";
        return ejecutarConsultaSP($sql);
    }
    public function listar_datos_cliente($id)
    {
         $sql = "CALL sp_cotizacion(1, $id, NULL , NULL, NULL , NULL);";
        return ejecutarConsultaSP($sql);
    }
}


// Instancia de la clase Cotizacion