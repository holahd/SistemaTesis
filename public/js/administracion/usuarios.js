
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
                                    <button class="btn btn-outline-dark btn-sm editar" title="Editar usuario"
                                        data-id="${data.usuario_id}"
                                        data-nombre="${row.nombre}"
                                        data-apellido="${row.apellido}"
                                        data-email="${row.email}"
                                        data-rol="${row.rol}">
                                        <i class="bi bi-pencil-square"></i>
                                    </button>

                                    <button class="btn btn-outline-primary btn-sm resetear" title="Resetear contraseña" data-email="${row.email}">
                                        <i class="bi bi-arrow-repeat"></i>
                                    </button>
                                `;
                                } else {
                                    // Si no es admin, mostramos todos los botones
                                    return `
                                    <button class="btn btn-outline-dark btn-sm editar" title="Editar usuario"
                                        data-id="${data.usuario_id}"
                                        data-nombre="${row.nombre}"
                                        data-apellido="${row.apellido}"
                                        data-email="${row.email}"
                                        data-rol="${row.rol}">
                                        <i class="bi bi-pencil-square"></i>
                                    </button>

                                    <button class="btn btn-outline-primary btn-sm resetear" title="Resetear contraseña" data-email="${row.email}">
                                        <i class="bi bi-arrow-repeat"></i>
                                    </button>

                                    <button class="btn btn-outline-danger btn-sm eliminar" title="Eliminar usuario" data-email="${row.email}">
                                        <i class="bi bi-trash"></i>
                                    </button>
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
 const modal = new bootstrap.Modal(document.getElementById('modalEditarUsuario'));
  
    if (rol === 'admin') {
        // Si no existe la opción "admin", agregarla temporalmente
        if ($('#rol option[value="admin"]').length === 0) {
            let opcionAdmin = $('<option>', {
                value: 'admin',
                text: 'Admin'
            });
            $('#rol').append(opcionAdmin);
        }

        $('#rol').val('admin');
        $('#rol').prop('disabled', true);
    } else {
        $('#rol option[value="admin"]').remove();

        $('#rol').val(rol);
        $('#rol').prop('disabled', false);
    }


modal.show();
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
                swal.fire({
                    title: 'Éxito',
                    text: respuesta.mensaje,
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });


                location.reload();



                $('#formEditarUsuario').trigger('reset');
                $('#formulario_edicion_usuario').prop('disabled', true);

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
});
