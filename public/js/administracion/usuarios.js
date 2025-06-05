
$(document).ready(function () {

    $('#formulario_edicion_usuario').prop('disabled', true);

    if ($('#usuarios').length > 0) {
        $.ajax({
            url: '../../ajax/administrador.php?op=listar',
            type: 'POST',
            success: function (respuesta) {


                respuesta = JSON.parse(respuesta);

                $('#tablaUsuarios').dataTable({
                    data: respuesta,
                    columns: [
                        { data: 'nombre' },
                        { data: 'apellido' },
                        { data: 'email' },
                        { data: 'rol' },
                        {
                            data: null,
                            render: function (data, type, row) {
                                if (row.rol === 'admin') {
                                    // Si es admin, no mostramos el botón de eliminar
                                    return `
                                        <button class="btn btn-warning btn-sm editar"
                                        data-id="${data.usuario_id}"
                                        data-nombre="${row.nombre}"
                                        data-apellido="${row.apellido}"
                                        data-email="${row.email}"
                                        data-rol="${row.rol}">
                                     ✏️ Editar
                                        </button>

                                        <button class="btn btn-primary btn-sm resetear" data-email="${row.email}">🔄 Reset Contraseña</button>
                                    `;
                                } else {
                                    // Si no es admin, mostramos todos los botones
                                    return `
                                        <button class="btn btn-warning btn-sm editar"
                                        data-id="${data.usuario_id}"
                                        data-nombre="${row.nombre}"
                                        data-apellido="${row.apellido}"
                                        data-email="${row.email}"
                                        data-rol="${row.rol}">
                                     ✏️ Editar
                                        </button>

                                        <button class="btn btn-primary btn-sm resetear" data-email="${row.email}">🔄 Reset Contraseña</button>
                                        <button class="btn btn-danger btn-sm eliminar" data-email="${row.email}">⛔ Eliminar usuario</button>
                                    `;
                                }
                            }
                        }
                    ],
                    dom: 'Bfrtip', // Define donde se colocan los botones (B es para los botones)
                    buttons: [
                        {
                            extend: 'pdfHtml5',
                            text: '📄 PDF',
                            orientation: 'landscape',
                            pageSize: 'A4',
                            className: 'btn btn-info btn-sm',
                            exportOptions: {
                                columns: [0, 1, 2]
                            }
                        },
                        {
                            extend: 'excelHtml5',
                            text: '📊 Excel',
                            className: 'btn btn-success btn-sm',
                            exportOptions: {
                                columns: [0, 1, 2]
                            }
                        },
                        {
                            extend: 'print',
                            text: '🖨️ Imprimir',
                            className: 'btn btn-primary btn-sm',
                            exportOptions: {
                                columns: [0, 1, 2]
                            }
                        }
                    ]
                });
            },

            error: function (xhr, status, error) {
                console.error('Error: ' + error);
            }
        });
    }

    // Evento para editar usuario

$(document).on('click', '.editar', function () {
    const btn = $(this);
    PonerValoresenCampos(
        btn.data('id'),
        btn.data('nombre'),
        btn.data('apellido'),
        btn.data('email'),
        btn.data('rol')
    );
});


    // Evento para eliminar usuario
    $(document).on('click', '.eliminar', function () {
        let email = $(this).data('email');
        if (confirm('¿Seguro que deseas eliminar al usuario con email ' + email + '?')) {
            $.post('../../ajax/administrador.php?op=eliminar', { email: email }, function (respuesta) {

                let datos = JSON.parse(respuesta);

                alert(datos.mensaje);
                location.reload();
            });
        }
    });

    // Evento para resetear contraseña
    $(document).on('click', '.resetear', function () {
        let email = $(this).data('email');
        if (confirm('¿Restablecer la contraseña del usuario con email ' + email + '?')) {





            $.post('../../ajax/administrador.php?op=reestablecerContrasena', { email: email }, function (respuesta) {

                let datos = JSON.parse(respuesta);

                alert(datos.mensaje);

            });
        }
    });
});




function PonerValoresenCampos(id, nombre, apellido, email, rol) {
    $('#formulario_edicion_usuario').prop('disabled', false);
    $('#usuario_id').val(id);
    $('#nombre').val(nombre);
    $('#apellido').val(apellido);
    $('#correo').val(email);
    $('#rol').val(rol);

}

$('#formEditarUsuario').submit(function (e) {
    e.preventDefault();
    var formulario = new FormData(this);

    $.ajax({
        url: '../../ajax/administrador.php?op=editar',
        type: 'POST',
        data: formulario,
        contentType: false,
        processData: false,
        beforeSend: function () {
            console.log('Enviando datos...');
        },
        success: function (respuesta) {

            respuesta = JSON.parse(respuesta);
            console.log('Respuesta recibemaila:', respuesta.mensaje);

            if (respuesta.tipo === 1) {
                alert(respuesta.mensaje);

                // recargar la tabla
                location.reload();
                // limpiar el formulario


                $('#formEditarUsuario').trigger('reset');
                $('#formulario_edicion_usuario').prop('disabled', true);

            } else {
                alert('Error: ' + respuesta.mensaje);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error: ' + error);
        }
    });
});
