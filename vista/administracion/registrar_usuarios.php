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
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Registrar Usuario</title>
    <link href="../../public/css/bootstrap.css" rel="stylesheet" />
    <style>
        body {
            padding: 20px;
            background-color: #f8f9fa; /* color claro neutro */
        }
        .card {
            max-width: 500px;
            margin: 0 auto;
            border: 1px solid #dee2e6;
            border-radius: 0.5rem;
        }
        .card-header {
            background-color: #343a40;
            color: white;
            font-weight: 600;
            text-align: center;
            border-bottom: 1px solid #dee2e6;
        }
        .card-body {
            background-color: white;
            padding: 1.5rem;
        }
        label {
            font-weight: 500;
        }
        .btn-primary {
            width: 100%;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card mt-5">
            <div class="card-header">
                <h3>Registrar Usuario</h3>
            </div>
            <div class="card-body">
                <form id="form_registro" name="form_registro">
                    <div class="mb-3">
                        <label for="nombre">Nombre</label>
                        <input type="text" class="form-control" id="nombre" name="nombre" required />
                    </div>
                    <div class="mb-3">
                        <label for="apellido">Apellido</label>
                        <input type="text" class="form-control" id="apellido" name="apellido" required />
                    </div>
                    <div class="mb-3">
                        <label for="email">Correo Electrónico</label>
                        <input type="email" class="form-control" id="email" name="email" required />
                    </div>
                    <div class="mb-3">
                        <label for="rol">Rol</label>
                        <select class="form-select" id="rol" name="rol" required>
                            <option value="" disabled selected>Seleccione un rol</option>
                            <option value="ventas">Encargado de ventas</option>
                            <option value="inventario">Encargado de inventario</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary mt-3">Registrar</button>
                </form>
            </div>
        </div>
    </div>

    <script src="../../public/js/jquery-3.7.1.min.js"></script>
    <script src="../../public/js/bootstrap.js"></script>
    <script src="../../public/js/sweetalert2.all.js"></script>
    <script src="../../public/js/validaciones.js"></script>
    <script src="../../public/js/administracion/registro.js"></script>
</body>
</html>
