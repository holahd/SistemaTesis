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
    <title>Gestión de Usuarios</title>

    <!-- Bootstrap CSS -->
    <link href="../../public/css/bootstrap.css" rel="stylesheet">
    
    
    <link rel="stylesheet" href="../../public/css/datatables.css">

    
    
    <style>
        body {
            padding: 20px;
        }
    </style>
</head>
<body id="usuarios">

    <div class="container">
        <h2 class="mb-4 text-center">Gestión de Usuarios</h2>

        
    <div class="mt-4 p-4 bg-success bg-opacity-50 rounded shadow-sm mb-3" style="max-width: 500px; margin: 0 auto;">
    <h3 class="text-center mb-4">Editar Usuario</h3>
    <form id="formEditarUsuario">

    <input type="hidden" id="usuario_id" name="usuario_id" value="">

        <div class="form-group mb-3">
            <label for="nombre" class="font-weight-bold">Nombre</label>
            <input type="text" class="form-control" id="nombre" name="nombre" required>
        </div>
        <div class="form-group mb-3">
            <label for="apellido" class="font-weight-bold">Apellido</label>
            <input type="text" class="form-control" id="apellido" name="apellido" required>
        </div>
        <div class="form-group mb-3">
            <label for="correo" class="font-weight-bold">correo</label>
            <input type="email" class="form-control" id="correo" name="correo" required>
        </div>
        <div class="form-group mb-3">
            <label for="rol" class="font-weight-bold">Rol</label>
        <select class="form-control" id="rol" name="rol" required>
            <option value="" disabled selected>Seleccione una opcion</option>
            <option value="ventas">Encargado de ventas</option>
            <option value="inventario">Encargado de inventario</option>
        </select>
        </div>
        <button type="submit" class="btn btn-primary btn-block">Guardar Cambios</button>
    </form>
</div>

        <div id="tabla" name="tabla"></div>
        <table id="tablaUsuarios" class="table table-striped">
    <thead>
        <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Rol</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            
        </tr>
    </tbody>
</table>
    </div>




</body>


    <script src="../../public/js/jquery-3.7.1.min.js"></script>
    
    <!-- DataTables JS -->
    <script src="../../public/js/datatables.js"></script>
    <script src="../../public/js/bootstrap.js"></script>
    <script src="../../public/js/administracion/usuarios.js"></script>

</html>