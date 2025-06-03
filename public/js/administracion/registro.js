$('#form_registro').submit(function (e) {
    e.preventDefault();
    var formulario = new FormData(this);

    $.ajax({
        url: '../../ajax/administrador.php?op=register',
        type: 'POST',
        data: formulario,
        contentType: false,
        processData: false,
        beforeSend: function () {
            console.log('Enviando datos...');
        },
        success: function (respuesta) {

            respuesta = JSON.parse(respuesta);
            console.log('Respuesta recibcorreoa:', respuesta.mensaje);

            if (respuesta.tipo === 1) {
                alert(respuesta.mensaje);
            } else {
                alert('Error: ' + respuesta.mensaje);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error: ' + error);
        }
    });
    $('#form_registro').trigger('reset');
});