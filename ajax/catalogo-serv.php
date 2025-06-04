<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


require("../modelo/productos.php");

$productos = new productos();

switch ($_GET["op"]) {
    case 'listarProductos':


        $res = $productos->listar();

        $data = array();

        while ($reg = $res->fetch_object()) {
            $data[] = array(
                "producto_id" => $reg->producto_id, 
                "nombre" => $reg->nombre,
                "descripcion" => $reg->descripcion,
                "categoria" => $reg->categoria,
                "subCategoria" => $reg->subcategoria,
                "foto" => $reg->imagen
            );
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
        if (isset($_POST['categoria_id'])) {
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
        } else {
            echo json_encode(['error' => 'ID de categoría no enviado']);
        }
        break;

    case 'registrarProducto':


        if (isset($_FILES["foto"]) && $_FILES["foto"]["error"] === 0) {
            $nombreArchivo = time() . "_" . basename($_FILES["foto"]["name"]);
            $rutaDestino = "../public/img/" . $nombreArchivo;
            $rutaBD = "../public/img/" . $nombreArchivo;

            $caracteristicasTexto = '';
                $caracteristicas= [];
                $nombreArr= $_POST['caracteristica_nombre'] ?? [];
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

                if ($res) {
                    $respuesta['mensaje'] = 'Producto registrado correctamente.';
                    $respuesta['tipo'] = 1;
                } else {
                    $respuesta['mensaje'] = 'Error al registrar el producto.';
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
            $data[] = array(
                "id" => $reg->id,
                "nombre" => $reg->nombre,
                "descripcion" => $reg->descripcion,
                "precio" => $reg->precio,
                "categoria" => $reg->categoria,
                "subCategoria" => $reg->sub_categoria,
                "fecha_caducidad" => ($reg->fecha_caducidad == null) ? "No aplica" : $reg->fecha_caducidad,
                "foto" => $reg->foto
            );
        }


        echo json_encode($data);
        break;

        case 'editar' :

            
            $rutaBD = null; 
        
            // Verificar si se subió una nueva imagen
            if (isset($_FILES["input_imagen"]) && $_FILES["input_imagen"]["error"] === UPLOAD_ERR_OK) {
                $nombreArchivo = time() . "_" . basename($_FILES["input_imagen"]["name"]);
                $rutaDestino = "../public/img/" . $nombreArchivo;
                $rutaBD = "../public/img/" . $nombreArchivo;
        
                if (move_uploaded_file($_FILES["input_imagen"]["tmp_name"], $rutaDestino)) {
                    exec('icacls "' . $rutaDestino . '" /grant IIS_IUSRS:(F)');  
                } else {
                    $respuesta['mensaje'] = 'Error al mover la imagen.';
                    $respuesta['tipo'] = 0;
                    echo json_encode($respuesta);
                    exit;
                }
            }
        
            // Llamar al método actualizar SIN modificar la imagen si no se subió ninguna
            $res = $productos->actualizar(
                $_POST['producto_id'],
                $_POST['nombre'],
                $_POST['descripcion'],
                $_POST['subcategoria'],
                $rutaBD
            );
        
            if ($res) {
                $respuesta['mensaje'] = 'Producto actualizado correctamente.';
                $respuesta['tipo'] = 1;
            } else {
                $respuesta['mensaje'] = 'Error al actualizar el producto.';
                $respuesta['tipo'] = 0;
            }
        
            echo json_encode($respuesta);
            break;
        
    

        case 'eliminar':

            $res = $productos->eliminar($_POST['codigo']);
    
            if ($res) {
                $respuesta['mensaje'] = 'Producto eliminado correctamente.';
                $respuesta['tipo'] = 1;
            } else {
                $respuesta['mensaje'] = 'Error al eliminar el producto.';
                $respuesta['tipo'] = 0;
            }
    
            echo json_encode($respuesta);
    
            break;

    default:
        // Acción no reconocida
        $respuesta['mensaje'] = 'Acción no válida.';
        echo json_encode($respuesta);
        break;
}
