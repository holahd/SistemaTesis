<?php



require('../config/conexion.php');

class productos{


    public function construct(){
        }

    public function listar(){

        $sql="call sp_producto(1,0,'aaaaa','aaaaa',1,'aaaaaa');";
        
        return ejecutarConsultaSP($sql);

    }

    public function insertar($no, $des, $cat, $foto){

        $sql="call sp_producto(2,0,'$no','$des', $cat ,'$foto');";

        return ejecutarConsultaSPConError($sql);

    }

    public function actualizar($id,$no, $des,  $cat, $foto){

        
            $sql="call sp_producto(3,$id,'$no','$des', $cat ,'$foto');";
    
            return ejecutarConsultaSPConError($sql);
    }

    public function eliminar($id){

        $sql="call sp_producto(5,$id,'aaaaa','aaaaa',1,'aaaaaa');";
    
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

    public function buscar($b){
        $sql="call  sp_buscar_producto('$b');";
    
        return ejecutarConsultaSP($sql);
    }

    public function restaurar($id){

        $sql="call sp_producto(6,$id,'aaaaa','aaaaa',1,'aaaaaa');";
    
        return ejecutarConsultaSP($sql);
    }
}