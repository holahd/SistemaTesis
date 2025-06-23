<?php

require('../config/conexion.php');

class Umbrales {

    public function __construct() {
        
    }

    public function registrarUmbral($cantidad, $descuento, $ganancia) {
        $sql = "CALL sp_escala_descuento(2, 0, $cantidad, $ganancia ,$descuento);";
        return ejecutarConsultaSP($sql);
    }

    public function listarUmbrales() {
        $sql = "CALL sp_escala_descuento(1, 0, 0, 0, 0);";
        return ejecutarConsultaSP($sql);
    }

    public function editarUmbral($id, $cantidad, $descuento, $ganancia) {
        $sql = "CALL sp_escala_descuento(3, $id, $cantidad, $ganancia, $descuento);";
        return ejecutarConsultaSP($sql);
    }

    public function eliminarUmbral($id) {
        $sql = "CALL sp_escala_descuento(4, $id, 0, 0, 0);";
        return ejecutarConsultaSP($sql);
    }

    public function mostrardescuento($cantidad){
        $sql = "CALL sp_escala_descuento(5, 0, $cantidad, 0, 0);";
        return ejecutarConsultaSP($sql);
    }
}