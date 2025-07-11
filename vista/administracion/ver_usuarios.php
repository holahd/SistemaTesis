<?php

session_start();
if (!isset($_SESSION['nombre'])) {
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
    <title>Gestión de Usuarios</title>

    <!-- Bootstrap CSS -->
    <link href="../../public/css/bootstrap.css" rel="stylesheet" />
    <link rel="stylesheet" href="../../public/css/datatables.css" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet" />

    <style>
        body {
            padding: 20px;
        }


        .table-bordered th,
        .table-bordered td {
            border: 1px solid #dee2e6;
            /* cambia este color si quieres otro */
        }

        .table thead th {
            background-color:rgb(34, 34, 34);
            /* oscuro elegante */
            color: #fff;
        }


        /* Opcional: estilos para los botones del DataTable */
        .btn-outline-warning,
        .btn-outline-primary,
        .btn-outline-danger {
            border-width: 2px;
        }

        .btn-outline-warning:hover {
            background-color: #ffc107;
            color: #212529;
        }

        .btn-outline-primary:hover {
            background-color: #0d6efd;
            color: #fff;
        }

        .btn-outline-danger:hover {
            background-color: #dc3545;
            color: #fff;
        }

        .btn i {
            vertical-align: middle;
            font-size: 1rem;
        }
    </style>
</head>

<body id="usuarios" class="bg-light">

    <div class="container">
        <h2 class="mb-4 text-center text-primary">Gestión de Usuarios</h2>

        <!-- Tabla de Usuarios -->
        <table id="tablaUsuarios" class="table table-striped table-bordered text-center align-middle">
            <thead class="bg-warning text-dark">
                <tr>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>

    <!-- Modal de Edición de Usuario -->
    <div class="modal fade" id="modalEditarUsuario" tabindex="-1" aria-labelledby="tituloModalUsuario" aria-hidden="true">
        <div class="modal-dialog modal-md modal-dialog-centered">
            <div class="modal-content shadow-lg rounded-4">
                <div class="modal-header bg-dark text-white">
                    <h5 class="modal-title fw-bold" id="tituloModalUsuario">
                        <i class="bi bi-person-lines-fill me-2"></i>Editar Usuario
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                </div>
                <div class="modal-body bg-light">
                    <form id="formEditarUsuario" method="POST">
                        <fieldset id="formulario_edicion_usuario">
                            <input type="hidden" id="usuario_id" name="usuario_id" />

                            <div class="mb-3">
                                <label for="nombre" class="form-label fw-semibold">Nombre</label>
                                <input type="text" class="form-control" id="nombre" name="nombre" required />
                            </div>

                            <div class="mb-3">
                                <label for="apellido" class="form-label fw-semibold">Apellido</label>
                                <input type="text" class="form-control" id="apellido" name="apellido" required />
                            </div>

                            <div class="mb-3">
                                <label for="correo" class="form-label fw-semibold">Correo</label>
                                <input type="email" class="form-control" id="correo" name="correo" required />
                            </div>

                            <div class="mb-3">
                                <label for="rol" class="form-label fw-semibold">Rol</label>
                                <select class="form-select" id="rol" name="rol" required>
                                    <option value="" disabled selected>Seleccione una opción</option>
                                    <option value="ventas">Encargado de ventas</option>
                                    <option value="inventario">Encargado de inventario</option>
                                </select>
                            </div>
                        </fieldset>
                    </form>
                </div>
                <div class="modal-footer bg-white">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        <i class="bi bi-x-circle"></i> Cancelar
                    </button>
                    <button type="submit" form="formEditarUsuario" class="btn btn-primary">
                        <i class="bi bi-save"></i> Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    </div>




</body>


<script src="../../public/js/jquery-3.7.1.min.js"></script>

<!-- DataTables JS -->
<script src="../../public/js/datatables.js"></script>
<script src="../../public/js/bootstrap.js"></script>
<script src="../../public/js/sweetalert2.all.js"></script>
<script src="../../public/js/validaciones.js"></script>
<script src="../../public/js/administracion/usuarios.js"></script>

</html>