<?php

require('../config/conexion.php');

class reportes {

    public function __construct() {
        
    }

    public function entradaSalida($fechainicio, $fechafin, $productoId) {
        $productoId = !empty($productoId) ? "'" . $productoId . "'" : "NULL";

        $sql = "CALL sp_reporte_auditoria_inv('$fechainicio', '$fechafin', $productoId);";
        return ejecutarConsultaSP($sql);
    }
}