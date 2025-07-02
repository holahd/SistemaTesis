<?php

require_once('../config/conexion.php');

class Notificaciones {

    public function construct() {
      
    }

    

    public function listar_notificaciones($UmbralExpiracion, $UmbralStock) {
        $sql = "CALL sp_get_notificaciones($UmbralExpiracion, $UmbralStock);";
        return ejecutarConsultaSP($sql);
    }

    

}


?>