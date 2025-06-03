<?php
ini_set( 'display_errors', 1 );
ini_set( 'display_startup_errors', 1 );
error_reporting( E_ALL );





require( 'global.php' );

function Fn_getConnectSiDB() {


  if ( !( $conecion1 = new MySQLi( DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME ) ) )


  {
    echo "Error Conectando la base de Datos ";
    exit();
  }
  return $conecion1;
}

function Fn_getConnectNoDB() {


  if ( !( $conecion1 = new MySQLi( DB_HOST, DB_USERNAME, DB_PASSWORD ) ) )

  {
    echo "Error Conectando la base de Datos ";
    exit();
  }
  return $conecion1;
}


function ejecutarCreacion( $sql ) {
  $Cn = Fn_getConnectNoDB();
  $query = $Cn->query( $sql );
  $Cn->close();

  return $query;

}

function ejecutarConsultaSP( $sql ) {

  $Cn = Fn_getConnectSiDB();
  $query = $Cn->query( $sql );
  $Cn->close();

  return $query;

}


?>