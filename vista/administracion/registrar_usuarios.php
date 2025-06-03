<?php 

session_start();
if (!isset($_SESSION['nombre']) ) {
    header("Location: login.html");
}
if (!isset($_SESSION['acceso_permitido']) || $_SESSION['acceso_permitido'] !== true) {

    header("Location: panel_administrador.php");
    
    exit();
}

?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registrar Usuario</title>
    <link href="../../public/css/bootstrap.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5 ">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header text-center">
                        <h3>Registrar Usuario</h3>
                    </div>
                    <div class="card-body bg-dark bg-opacity-50 text-white">
                        <form id="form_registro" name="form_registro">
                            <div class="form-group">
                                <label for="nombre">Nombre</label>
                                <input type="text" class="form-control" id="nombre" name="nombre" required>
                            </div>
                            <div class="form-group">
                                <label for="apellido">Apellido</label>
                                <input type="text" class="form-control" id="apellido" name="apellido" required>
                            </div>
                            <div class="form-group">
                                <label for="email">Correo Electrónico</label>
                                <input type="email" class="form-control" id="email" name="email" required>
                            </div>
                            <div class="form-group">
                                <label for="rol">rol</label>
                                <select class="form-control" id="rol" name="rol" required>
                                    <option value="" disabled selected>Seleccione un rol</option>
                                    <option value="ventas">Encargado de ventas</option>
                                    <option value="inventario">Encargado de inventario</option>
                                </select>
                            </div>
                            <div class="d-flex justify-content-center">
                         
                            <button type="submit" class="btn btn-primary btn-block mt-2">Registrar</button>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="../../public/js/bootstrap.js"></script>
    <script src="../../public/js/jquery-3.7.1.min.js"></script>
    <script src="../../public/js/administracion/registro.js"></script>
    
</body>
</html>