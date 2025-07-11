<?php

require('../config/conexion.php');

class Lotes {

    public function __construct() {
      
    }

    public function registrar($productoNombre, $numLote, $cantidad, $fechaIngreso, $fechaCad, $proveedor, $precioUnit) {
        
        $fechaCadSQL = empty($fechaCad) ? 'NULL' : "'$fechaCad'";
        $sql = "CALL sp_lote(
            2,
            00, 
            '$productoNombre', 
            $numLote, 
            $cantidad, 
            '$fechaIngreso', 
            '$proveedor', 
            $fechaCadSQL, 
            $precioUnit
        );";
        return ejecutarConsultaSPConError($sql);
    }

    public function listar() {
        $sql = "CALL sp_lote(1, 0, '', 0, 0, '2000-01-01', '', NULL, 0);";
        return ejecutarConsultaSP($sql);
    }

    public function editar( $id,$productoNombre, $numLote, $cantidad, $fechaIngreso, $fechaCad, $proveedor, $precioUnit) {
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
        return ejecutarConsultaSPConError($sql);
    } 

    public function eliminar($loteId) {
        $sql = "CALL sp_lote(4,  '', $loteId, 0, '2000-01-01', '', NULL, 0);";
        return ejecutarConsultaSP($sql);
    }
	public function listarNombresProductos() {
    $sql = "CALL sp_lote(5,00,'', 0, 0, '2000-01-01', '', NULL, 0);";
    return ejecutarConsultaSP($sql);
}

}


?>