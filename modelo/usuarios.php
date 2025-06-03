<?php



require('../config/conexion.php');

class usuarios{
	
	public function construct(){
		}
		


	public function validar($u,$c){
		
		$sql="call sp_usuario( 5 , 00, 'que me ves','que me ves','$u','$c','admin');";
		
		return ejecutarConsultaSP($sql);
		
	}


	public function registrar($n,$a,$e,$r){
		
		$sql="call sp_usuario( 2 , 00, '$n','$a','$e','jajaj imaginate ver esto','$r');";
		
		return ejecutarConsultaSP($sql);
		
	}

	public function cambiarContrasena($e,$c){
		
		$sql="call sp_usuario( 6 , 00, 'aaaa','aaa','$e','$c','admin');";
		
		return ejecutarConsultaSP($sql);
		
	}

	public function listar(){
		
		$sql="call sp_usuario( 1 , 00, 'b','a','que me ves','d','admin');";

		
		
		return ejecutarConsultaSP($sql);
		
	}

	public function editar($n,$a,$e,$r){
		
		$sql="call sp_usuario( 3 , 00, '$n','$a','$e','contraseñajajaj','$r');";
		
		return ejecutarConsultaSP($sql);
		
	}

	public function eliminar($e){
		
		

		$sql="call sp_usuario( 4 , 00, 'a','w','$e','con','admin');";
		
		return ejecutarConsultaSP($sql);
		
	}

	public function reestablecerContrasena($e){
		
		
		$sql="call sp_usuario( 7 , 00, 'aaa','aaaa','$e','adad','admin');";
	
		
		return ejecutarConsultaSP($sql);
		
	}
	
	
}

?>