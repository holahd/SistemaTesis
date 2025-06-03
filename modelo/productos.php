<?php



require('../config/conexion.php');

class productos{


    public function construct(){
        }

    public function listar(){

        $sql="call sp_producto(1,00,'aaaaa','aaaaa',1,'aaaaaa');";
        
        return ejecutarConsultaSP($sql);

    }

    public function insertar($no, $des, $cat, $foto){

        $sql="call sp_producto(2,00,'$no','$des', $cat ,'$foto');";

        return ejecutarConsultaSP($sql);

    }

    public function actualizar($no, $des,  $cat, $foto){

        
            $sql="call sp_producto(1,00,'$no','$des', $cat ,'$foto');";
    
            return ejecutarConsultaSP($sql);
    }

    public function eliminar($id){

        $sql="call sp_producto(1, 00,'aaaaa','aaaaa',1,'aaaaaa');";
    
        return ejecutarConsultaSP($sql);
    }
        
    public function listarCategorias(){

        $sql="call sp_categoria(5,00,'aaaaa',0);";

        return ejecutarConsultaSP($sql);

    }
    public function listarSubCategorias($id_categoria){

        $sql="call sp_categoria(6,$id_categoria,'aaaaa',111);";

        return ejecutarConsultaSP($sql);

    }

    public function buscar(){
        $sql="call sp_producto(1,00,'aaaaa','aaaaa',1,'aaaaaa');";
    
        return ejecutarConsultaSP($sql);
    }
}