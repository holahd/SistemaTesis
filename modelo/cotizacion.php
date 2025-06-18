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


    public function registrarDetalle($cotizacion_id, $producto_id, $cantidad) {
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


    public function editar($id, $productoNombre, $numLote, $cantidad, $fechaIngreso, $fechaCad, $proveedor, $precioUnit)
    {
        $fechaCadSQL = empty($fechaCad) ? 'NULL' : "'$fechaCad'";
        $sql = "CALL sp_lote(
            3,
            $id,  
            '$productoNombre', 
            $numLote, 
            $cantidad, 
            '$fechaIngreso', 
            '$proveedor', 
            $fechaCadSQL, 
            $precioUnit
        );";
        return ejecutarConsultaSP($sql);
    }

    public function eliminar($loteId)
    {
        $sql = "CALL sp_lote(4,  '', $loteId, 0, '2000-01-01', '', NULL, 0);";
        return ejecutarConsultaSP($sql);
    }
    public function listarNombresProductos()
    {
        $sql = "CALL sp_lote(5,00,'', 0, 0, '2000-01-01', '', NULL, 0);";
        return ejecutarConsultaSP($sql);
    }

    public function listar_pendientes(){

         $sql = "CALL sp_cotizacion(5, 0, ' ', NULL, 'espera', NULL);";
         return ejecutarConsultaSP($sql);
    }

    public function listar_detalle($idCot)
    {
        $sql = "CALL sp_cotizacion(6, $idCot, ' ', NULL, 'espera', NULL);";
        return ejecutarConsultaSP($sql);
    }
}
