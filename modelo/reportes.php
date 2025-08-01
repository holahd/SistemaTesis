<?php

require('../config/conexion.php');

class reportes {

    public function __construct() {
        
    }

    public function entradaSalida($fechainicio, $fechafin) {
        $sql = "CALL sp_reporte_auditoria_inv('$fechainicio', '$fechafin');";
        return ejecutarConsultaSP($sql);
    }
}