<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Cambio de contraseña</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="">
    <link rel="stylesheet" href="../../public/css/bootstrap.css">

</head>

<body>

    <form id="cambiocontra" name="cambiocontra">
        <div class="container my-5">
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="container p-4 shadow rounded-2 bg-success-subtle">
                        <h4 class="text-center mb-4">Cambio de contraseña</h4>
                            <div class="mb-3 row-cols-4">
                                <label for="contraseña" class="form-label">Nueva contraseña&nbsp;</label>
                                <input type="password" class="form-control" id="nueva_contrasena" name="nueva_contrasena" required
                                    placeholder="Ingresa tu nueva contraseña">
                            </div>
                            <div class="mb-3 row-cols-4">
                                <label for="contraseña" class="form-label">Confirma tu nueva contraseña&nbsp;</label>
                                <input type="password" class="form-control" id="confirmar_contrasena" name="confirmar_contrasena" required
                                    placeholder="Confirma tu nueva contraseña">
                            </div>
                            <div class="d-grid gap-2">
                               
                            </div>
                            <div class="d-flex justify-content-center">
                                <button type="submit" class="btn btn-primary col-md-6">Cambiar contraseña</button>
                            </div>
                    </div>
                </div>
            </div>
        </div>
        
    </form>

</body>
<script src="../../public/js/bootstrap.js"></script>
<script src="../../public/js/jquery-3.7.1.min.js"></script>
<script src="../../public/js/administracion/cambioContra.js"></script>

</html>