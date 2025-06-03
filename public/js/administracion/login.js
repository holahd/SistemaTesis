// Objetivo: Validar el inicio de sesión del administrador
$('#fom1').submit(function (e) {
    e.preventDefault();
    var formulario = new FormData(this);

    $.ajax({
        url: '../../ajax/administrador.php?op=login',
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
                if (respuesta.estado === "1") {
                    alert(respuesta.mensaje);
                    window.location.href = 'panel_administrador.php';
                } else {
                    alert('Cambie su contraseña');
                    window.location.href = 'log_cambioContra.php';
                }
            } else {
                alert('Error: ' + respuesta.mensaje);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error: ' + error);
        }
    });
});