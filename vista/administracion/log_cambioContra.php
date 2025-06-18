<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Cambio de contraseña</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="../../public/css/bootstrap.css" />

    <style>
        body {
            background: linear-gradient(to right, #e3f2fd, #e8f5e9);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
        }

        form#cambiocontra {
            width: 100%;
            max-width: 420px;
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            padding: 2rem 2rem 2.5rem;
        }

        h4 {
            color: #2c7be5;
            font-weight: 600;
            margin-bottom: 1.5rem;
            text-align: center;
        }

        .form-label {
            font-weight: 500;
        }

        .btn-primary {
            font-weight: 700;
            padding: 0.6rem;
            font-size: 1.1rem;
        }
    </style>
</head>

<body>
    <form id="cambiocontra" name="cambiocontra" novalidate>
        <h4>Cambio de contraseña</h4>

        <div class="mb-4">
            <label for="nueva_contrasena" class="form-label">Nueva contraseña</label>
            <input type="password" class="form-control" id="nueva_contrasena" name="nueva_contrasena" required
                placeholder="Ingresa tu nueva contraseña" />
        </div>

        <div class="mb-4">
            <label for="confirmar_contrasena" class="form-label">Confirma tu nueva contraseña</label>
            <input type="password" class="form-control" id="confirmar_contrasena" name="confirmar_contrasena" required
                placeholder="Confirma tu nueva contraseña" />
        </div>

        <div class="d-grid">
            <button type="submit" class="btn btn-primary">Cambiar contraseña</button>
        </div>
    </form>

    <script src="../../public/js/bootstrap.js"></script>
    <script src="../../public/js/jquery-3.7.1.min.js"></script>
    <script src="../../public/js/administracion/cambioContra.js"></script>
</body>

</html>
