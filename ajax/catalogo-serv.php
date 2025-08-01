<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


require("../modelo/productos.php");

$productos = new productos();

switch ($_GET["op"]) {
    case 'listarProductos':
        $res = $productos->listar(); // llamada al SP con op=1

        $data = array();

        while ($reg = $res->fetch_object()) {
            $producto = array(
                "producto_id" => $reg->producto_id,
                "nombre" => $reg->nombre,
                "descripcion" => $reg->descripcion,
                "categoria" => $reg->categoria,
                "subcategoria" => $reg->subcategoria,
                "categoria_id" => $reg->categoria_id,
                "subcategoria_id" => $reg->subcategoria_id,
                "descontinuado" => $reg->descontinuado,
                "foto" => $reg->imagen,
                "stock_total" => $reg->stock_total
            );

            // Si es vestimenta, agregamos el detalle de tallas
            if ($reg->categoria_id == 2) { // Vestimenta
                $resTallas = $productos->stockTallas($reg->producto_id); // esto llama al antiguo case 7
                $tallas = array();
                while ($t = $resTallas->fetch_object()) {
                    $tallas[] = array(
                        "talla" => $t->talla,
                        "stock" => $t->stock
                    );
                }
                $producto['tallas'] = $tallas;
            }

            $data[] = $producto;
        }

        echo json_encode($data);
        break;


    case 'categorias':
        $res = $productos->listarCategorias();
        $data = array();
        while ($reg = $res->fetch_object()) {
            $data[] = array(
                "categoria_id" => $reg->categoria_id,
                "nombre" => $reg->nombre,
            );
        }
        echo json_encode($data);
        break;

    case 'subcategorias':

        $categoria_id = $_POST['categoria_id'];

        $res = $productos->listarSubCategorias($categoria_id);

        $data = array();
        while ($reg = $res->fetch_object()) {
            $data[] = array(
                "categoria_id" => $reg->categoria_id,
                "nombre" => $reg->nombre,
            );
        }

        echo json_encode($data);

        break;

    case 'registrarProducto':


        if (isset($_FILES["foto"]) && $_FILES["foto"]["error"] === 0) {
            $nombreArchivo = time() . "_" . basename($_FILES["foto"]["name"]);
            $rutaDestino = "../public/img/" . $nombreArchivo;
            $rutaBD = "../public/img/" . $nombreArchivo;

            $caracteristicasTexto = '';
            $caracteristicas = [];
            $nombreArr = $_POST['caracteristica_nombre'] ?? [];
            $descArr = $_POST['caracteristica_descripcion'] ?? [];

            if (move_uploaded_file($_FILES["foto"]["tmp_name"], $rutaDestino)) {

                exec('icacls "' . $rutaDestino . '" /grant IIS_IUSRS:(F)');



                for ($i = 0; $i < count($nombreArr); $i++) {
                    $nombre = trim($nombreArr[$i]);
                    $desc = trim($descArr[$i]);
                    if ($nombre !== '' && $desc !== '') {
                        $caracteristicas[] = "$nombre: $desc";
                    }
                    $caracteristicasTexto = implode("\n", $caracteristicas);
                }

                $res = $productos->insertar(
                    $_POST['nombre'],
                    $caracteristicasTexto,
                    $_POST['subcategoria'],
                    $rutaBD

                );

                if ($res['ok']) {
                    $respuesta['mensaje'] = 'Producto registrado correctamente';
                    $respuesta['tipo'] = 1;
                } else {
                    if ($res['error'] == 1062) {
                        $respuesta['mensaje'] = 'El nombre del producto ingresado ya está registrado.';
                    } else {
                        $respuesta['mensaje'] = 'Error al registrar producto.';
                    }
                    $respuesta['tipo'] = 0;
                }
            } else {
                $respuesta['mensaje'] = 'Error al mover la imagen.';
                $respuesta['tipo'] = 0;
            }
        } else {
            $respuesta['mensaje'] = 'No se recibió ninguna imagen.';
            $respuesta['tipo'] = 0;
        }

        echo json_encode($respuesta);
        break;

    case 'buscar':
        $busqueda = $_POST['buscar'];
        $res = $productos->buscar($busqueda);

        $data = array();

        while ($reg = $res->fetch_object()) {
            $producto = array(
                "producto_id" => $reg->producto_id,
                "nombre" => $reg->nombre,
                "descripcion" => $reg->descripcion,
                "categoria" => $reg->categoria,
                "subcategoria" => $reg->subcategoria,
                "categoria_id" => $reg->categoria_id,
                "subcategoria_id" => $reg->subcategoria_id,
                "descontinuado" => $reg->descontinuado,
                "foto" => $reg->imagen,
                "stock_total" => $reg->stock_total
            );

            // Vestimenta con tallas
            if ($reg->categoria_id == 2) {
                $resTallas = $productos->stockTallas($reg->producto_id);
                $tallas = array();
                while ($t = $resTallas->fetch_object()) {
                    $tallas[] = array(
                        "talla" => $t->talla,
                        "stock" => $t->stock
                    );
                }
                $producto['tallas'] = $tallas;
            }

            $data[] = $producto;
        }

        echo json_encode($data);
        break;


    case 'editar':

        $rutaBD = null;


        $imagenActual = isset($_POST['ruta_imagen']) ? $_POST['ruta_imagen'] : null;
        $caracteristicasTexto = '';
        $caracteristicas = [];
        $nombreArr = $_POST['caracteristica_nombre'] ?? [];
        $descArr = $_POST['caracteristica_descripcion'] ?? [];

        if (isset($_FILES["input_imagen"]) && $_FILES["input_imagen"]["error"] === UPLOAD_ERR_OK) {
            $nombreArchivo = time() . "_" . basename($_FILES["input_imagen"]["name"]);
            $rutaDestino = "../public/img/" . $nombreArchivo;
            $rutaBD = $rutaDestino;

            if (move_uploaded_file($_FILES["input_imagen"]["tmp_name"], $rutaDestino)) {

                exec('icacls "' . $rutaDestino . '" /grant IIS_IUSRS:(F)');


                if (!empty($imagenActual) && file_exists($imagenActual)) {
                    unlink($imagenActual);
                }
            } else {
                $respuesta['mensaje'] = 'Error al mover la imagen.';
                $respuesta['tipo'] = 0;
                echo json_encode($respuesta);
                exit;
            }
        }

        for ($i = 0; $i < count($nombreArr); $i++) {
            $nombre = trim($nombreArr[$i]);
            $desc = trim($descArr[$i]);
            if ($nombre !== '' && $desc !== '') {
                $caracteristicas[] = "$nombre: $desc";
            }
            $caracteristicasTexto = implode("\n", $caracteristicas);
        }

        $res = $productos->actualizar(
            $_POST['producto_id'],
            $_POST['nombre'],
            $caracteristicasTexto,
            $_POST['subcategoria'],
            $rutaBD
        );

        if ($res['ok']) {
            $respuesta['mensaje'] = 'Producto actualizado correctamente';
            $respuesta['tipo'] = 1;
        } else {
            if ($res['error'] == 1062) {
                $respuesta['mensaje'] = 'El nombre del producto ingresado ya está registrado.';
            } else {
                $respuesta['mensaje'] = 'Error al editar producto.';
            }
            $respuesta['tipo'] = 0;
        }

        echo json_encode($respuesta);
        break;



    case 'eliminar':

        $res = $productos->eliminar($_POST['codigo']);

        if ($res) {
            $respuesta['mensaje'] = 'Producto descontinuado correctamente.';
            $respuesta['tipo'] = 1;
        } else {
            $respuesta['mensaje'] = 'Error al descontinuar el producto.';
            $respuesta['tipo'] = 0;
        }

        echo json_encode($respuesta);

        break;

    case 'restaurar':
        $res = $productos->restaurar($_POST['codigo']);

        if ($res) {
            $respuesta['mensaje'] = 'Producto restaurado correctamente.';
            $respuesta['tipo'] = 1;
        } else {
            $respuesta['mensaje'] = 'Error al restaurar el producto.';
            $respuesta['tipo'] = 0;
        }

        echo json_encode($respuesta);
        break;

    case 'obtenerTallas':
        $producto_id = $_POST['producto_id'];
        $res = $productos->obtenerTallas($producto_id);

        $data = array();
        while ($reg = $res->fetch_object()) {
            $data[] = array(
                "talla" => $reg->talla,

            );
        }

        echo json_encode($data);
        break;

    default:

        $respuesta['mensaje'] = 'Acción no válida.';
        echo json_encode($respuesta);
        break;
}
