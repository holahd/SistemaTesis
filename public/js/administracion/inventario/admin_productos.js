
$(document).ready(function () {
    if ($('#productos2').length > 0) {
        $('#tablaProductos').DataTable({
            ajax: {
                url: '../../../ajax/catalogo-serv.php?op=listarProductos',
                type: 'POST',
                dataSrc: ''
            },
            columns: [
                { data: 'producto_id' },
                { data: 'nombre' },
                { data: 'descripcion' },
                { data: 'categoria' },
                { data: 'subCategoria' },
                { data: 'foto' },
                {
                    data: null,
                    render: function (data, type, row) {
                        return `
                            <button 
                                class="btn btn-warning btn-sm editar"
                                data-producto_id="${row.producto_id}"
                                data-nombre="${row.nombre}"
                                data-descripcion="${row.descripcion}"
                                data-categoria="${row.categoria}"
                                data-subcategoria="${row.subCategoria}"
                                data-foto="${row.foto}">
                                ✏️ Editar
                            </button>
                            <button 
                                class="btn btn-danger btn-sm eliminar"
                                data-nombre="${row.nombre}">
                                🗑 Eliminar
                            </button>
                        `;
                    }
                }
            ],
            dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'pdfHtml5',
                    text: '📄 PDF',
                    orientation: 'landscape',
                    pageSize: 'A4',
                    className: 'btn btn-info btn-sm',
                    exportOptions: { columns: [0, 1, 2, 3, 4, 5] }
                },
                {
                    extend: 'excelHtml5',
                    text: '📊 Excel',
                    className: 'btn btn-success btn-sm',
                    exportOptions: { columns: [0, 1, 2, 3, 4, 5] }
                },
                {
                    extend: 'print',
                    text: '🖨️ Imprimir',
                    className: 'btn btn-primary btn-sm',
                    exportOptions: { columns: [0, 1, 2, 3, 4, 5] }
                }
            ]
        });
    }

    // Evento delegado para botón de eliminar
    $(document).on('click', '.eliminar', function () {
        let nombre = $(this).data('nombre');
        eliminarProducto(nombre);
    });

    // Evento delegado para botón de editar
    $(document).on('click', '.editar', function () {
        let producto_id = $(this).data('producto_id');
        let nombre = $(this).data('nombre');
        let descripcion = $(this).data('descripcion');
        let categoria = $(this).data('categoria');
        let subcategoria = $(this).data('subcategoria');
        let foto = $(this).data('foto');

        PonerValoresenCampos(producto_id, nombre, descripcion, categoria, subcategoria, foto);
    });

    // Vista previa de la imagen cargada
    $("#input_imagen").change(function (event) {
        let archivo = event.target.files[0];
        if (archivo) {
            let reader = new FileReader();
            reader.onload = function (e) {
                $("#imagen_producto").attr("src", e.target.result);
            };
            reader.readAsDataURL(archivo);
        }
    });

    // Manejo del formulario de edición
    $('#formEditarProducto').submit(function (e) {
        e.preventDefault();

        var formulario = new FormData(this);


         for (let [key, value] of formulario.entries()) {
        console.log(`${key}:`, value);
    }

        $.ajax({
            url: '../../../ajax/catalogo-serv.php?op=editar',
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
                    $('#formEditarProducto').trigger('reset');
                    $('#imagen_producto').attr('src', '../../../img/default.jpg');
                    $('#tablaProductos').DataTable().ajax.reload(null, false);
                } else {
                    alert('Error: ' + respuesta.mensaje);
                }
            },
            error: function (xhr, status, error) {
                console.error('Error: ' + error);
            }
        });
    });
});

// Cargar valores en campos del formulario
function PonerValoresenCampos(producto_id, nombre, descripcion, categoria, subcategoria, imagen) {
    $('#producto_id').val(producto_id);  
    $('#nombre').val(nombre);
    $('#descripcion').val(descripcion);
    $('#categoria').val(categoria);
    $('#subcategoria').val(subcategoria);
    $('#imagen_producto').attr('src', "../../../img/" + imagen);
}

// Eliminar producto
function eliminarProducto(nombre) {
    if (confirm('¿Seguro que deseas eliminar el producto "' + nombre + '"?')) {
        $.post('../../ajax/catalogo-serv.php?op=eliminar', { codigo: nombre }, function (respuesta) {
            respuesta = JSON.parse(respuesta);
            alert(respuesta.mensaje);
            $('#tablaProductos').DataTable().ajax.reload(null, false);
        }).fail(function () {
            alert("Error al eliminar el producto.");
        });
    }
}
