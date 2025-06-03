$('#cambiocontra').submit(function (e) {
    e.preventDefault();
    var formulario = new FormData(this);

    if ($('#nueva_contrasena').val() != $('#confirmar_contrasena').val()) {
        alert('Las contraseñas no coinciden');
        return false;
    }

    $.ajax({
        url: '../../ajax/administrador.php?op=cambiarContraseña',
        type: 'POST',
        data: formulario,
        contentType: false,
        processData: false,
        beforeSend: function () {
            console.log('Enviando datos...');
        },
        success: function (respuesta) {

            respuesta = JSON.parse(respuesta);
            console.log('Respuesta recibida:', respuesta.mensaje);

            if (respuesta.tipo === 1) {
                alert(respuesta.mensaje);
                window.location.href = 'panel_administrador.php';
            } else {
                alert('Error: ' + respuesta.mensaje);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error: ' + error);
        }
    });
});