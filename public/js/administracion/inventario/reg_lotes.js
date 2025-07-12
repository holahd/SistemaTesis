$('#registrarlote').submit(function (e) {
    e.preventDefault();
    var formulario = new FormData(this);

    for (let [key, value] of formulario.entries()) {
        console.log(`${key}:`, value);
    }

   

    for (let [key, value] of formulario.entries()) {
        console.log(`${key}:`, value);
    }

    $.ajax({
        url: '../../../ajax/lotes-serv.php?op=registrar',
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
                }).then(() => {
                    $('#registrarlote').trigger('reset');
                });
            }
            else {
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
});

$(document).ready(function () {
    $.ajax({
        url: '../../../ajax/lotes-serv.php?op=listarproductos',
        method: 'POST',
        contentType: false,
        processData: false,
        success: function (data) {
            const nombres = JSON.parse(data);

            const $select = $('#producto');
            $select.empty();
            $select.append('<option></option>'); // importante para que Select2 muestre el placeholder

            nombres.forEach(function (obj) {
                $select.append(`<option value="${obj.producto}">${obj.producto}</option>`);
            });

            // Activar Select2 antes de asignar el valor
            $select.select2({
                placeholder: "Seleccione un producto",
                allowClear: true,
                width: '100%'
            });

            const nombreProducto = localStorage.getItem('nombreProducto');

            if (nombreProducto && $select.length) {
                const optionExiste = $select.find('option[value="' + nombreProducto + '"]').length > 0;

                if (!optionExiste) {
                    $select.append(`<option value="${nombreProducto}">${nombreProducto}</option>`);
                }

                $select.val(nombreProducto).trigger('change'); // trigger para que Select2 lo muestre también
            }

            localStorage.removeItem('nombreProducto');
        },
        error: function (xhr, status, error) {
            console.error('Error al cargar productos:', error);
        }
    });
});
