<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once("../modelo/usuarios.php");
require_once("../modelo/notificaciones.php");

$usuarios = new usuarios();


switch ($_GET["op"]) {
    case 'login':



        $res = $usuarios->validar($_POST['correo'], $_POST['contraseña']);

        $_SESSION['correo'] = $_POST['correo'];

        while ($reg = $res->fetch_object()) {
            $_SESSION['usuario_id'] = $reg->usuario_id;
            $_SESSION['nombre'] = $reg->nombre;
            $_SESSION['rol'] = $reg->rol;
            $_SESSION['estado'] = $reg->estado;
        }

        if ($res->num_rows > 0) {
            $respuesta['mensaje'] = 'Bienvenido ' . $_SESSION['nombre'];
            $respuesta['tipo'] = 1;
            $respuesta['estado'] = $_SESSION['estado'];
        } else {
            $respuesta['mensaje'] = 'Usuario o contraseña incorrectos';
            $respuesta['tipo'] = 0;
        }
        echo json_encode($respuesta);

        break;

    case 'register':

        $res = $usuarios->registrar($_POST['nombre'], $_POST['apellido'], $_POST['email'], $_POST['rol']);

        if ($res) {
            $respuesta['mensaje'] = 'Usuario registrado correctamente';
            $respuesta['tipo'] = 1;
        } else {
            $respuesta['mensaje'] = 'Error al registrar usuario';
            $respuesta['tipo'] = 0;
        }

        echo json_encode($respuesta);

        break;

    case 'cambiarContraseña':

        $res = $usuarios->cambiarContrasena($_SESSION['correo'], $_POST['nueva_contrasena']);

        if ($res) {
            $respuesta['mensaje'] = 'Contraseña cambiada correctamente';
            $respuesta['tipo'] = 1;
        } else {
            $respuesta['mensaje'] = 'Error al cambiar contraseña';
            $respuesta['tipo'] = 0;
        }

        echo json_encode($respuesta);

        break;

    case 'listar':

        $res = $usuarios->listar();

        $usuariosLista = [];
        while ($fila = $res->fetch_object()) {
            $usuariosLista[] = $fila;
        }
        echo json_encode($usuariosLista);

        break;


    case 'editar':

        $res = $usuarios->editar($_POST['usuario_id'], $_POST['nombre'], $_POST['apellido'], $_POST['correo'], $_POST['rol']);

        if ($res) {
            $respuesta['mensaje'] = 'Usuario editado correctamente';
            $respuesta['tipo'] = 1;
        } else {
            $respuesta['mensaje'] = 'Error al editar usuario';
            $respuesta['tipo'] = 0;
        }

        echo json_encode($respuesta);

        break;

    case 'eliminar':

        $res = $usuarios->eliminar($_POST['email']);

        if ($res) {
            $respuesta['mensaje'] = 'Usuario eliminado correctamente';
            $respuesta['tipo'] = 1;
        } else {
            $respuesta['mensaje'] = 'Error al eliminar usuario';
            $respuesta['tipo'] = 0;
        }

        echo json_encode($respuesta);

        break;

    case 'reestablecerContrasena':

        $res = $usuarios->reestablecerContrasena($_POST['email']);

        if ($res) {

            $respuesta['mensaje'] = 'Contraseña reestablecida correctamente';
            $respuesta['tipo'] = 1;
        } else {
            $respuesta['mensaje'] = 'Error al reestablecer contraseña';
            $respuesta['tipo'] = 0;
        }

        echo json_encode($respuesta);

        break;

    case 'logout':

        session_unset();     // Limpia todas las variables de sesión
        session_destroy();   // Destruye la sesión

        break;

    case 'notificaciones':

        $notificaciones = new notificaciones();
        $cotizaciones = $notificaciones->listar_notificaciones($_POST['UmbralExpiracion'], $_POST['UmbralStock']);

        $respuesta = [];
        while ($fila = $cotizaciones->fetch_object()) {
            $respuesta[] = [
                'mensaje' => $fila->mensaje,
                'tipo' => $fila->tipo,
                'id_ref' => $fila->ref_id
            ];
        }
        echo json_encode($respuesta);


        break;

    default:
        // Acción no reconocida
        $respuesta['mensaje'] = 'Acción no válida.';
        break;
}
