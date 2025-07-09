$('#form_registro').submit(function (e) {
    e.preventDefault();
    var formulario = new FormData(this);

    if (!esEmailValido('#email')) {
        swal.fire({
            title: 'Error',
            text: 'El email ingresado no es válido.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

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
            

            if (respuesta.tipo === 1) {
                swal.fire({
                    title: 'Éxito',
                    text: respuesta.mensaje,
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                })
                
                

            } else {
                swal.fire({
                    title: 'Error',
                    text: respuesta.mensaje,
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        },
        error: function (xhr, status, error) {
            console.error('Error: ' + error);
        }
    });
    $('#form_registro').trigger('reset');
});