
$(document).ready(function () {
    if ($('#gestionLotes').length > 0) {
        $('#tablaLotes').DataTable({
            ajax: {
                url: '../../../ajax/lotes-serv.php?op=listar',
                type: 'POST',
                dataSrc: ''
            },
            columns: [
                { data: 'producto' },
                { data: 'numLote' },
                { data: 'cantidad' },
                { data: 'fechaIngreso' },
                { data: 'proveedor' },
                { data: 'fechaCaducidad' },
                { data: 'precioUnitario'},
                {
                    data: null,
                    render: function (data, type, row) {
                        
                            return `
                            <button 
                                class="btn btn-warning btn-sm editar"
                                data-producto_id="${data.producto_id}"
                                data-nombre="${row.nombre}"
                                data-descripcion="${row.descripcion}"
                                data-categoria_id="${data.categoria_id}"
                                data-subcategoria_id="${data.subcategoria_id}"
                                data-foto="${row.foto}"
                                
                                
                                >
                                ✏️ Editar
                            </button>
                        `;
                    }
                }

            ],

            rowCallback: function (row, data) {
                console.log(data);
                if (data.descontinuado === 'si') {
                    $(row).css('opacity', '0.5');
                } else {
                    $(row).css('opacity', '1');
                }
            },
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
        let id = $(this).data('producto_id');
        let nombre = $(this).data('nombre');
        eliminarProducto(id, nombre);
    });

    // Evento delegado para botón de editar
    $(document).on('click', '.editar', function () {
        let producto_id = $(this).data('producto_id');
        let nombre = $(this).data('nombre');
        let descripcion = $(this).data('descripcion');
        let foto = $(this).data('foto');
        let categoria_id = $(this).data('categoria_id');
        let subcategoria_id = $(this).data('subcategoria_id');

        PonerValoresenCampos(producto_id, nombre, descripcion, categoria_id, subcategoria_id, foto);

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

    $(document).on('click', '.restaurar', function () {
        let id = $(this).data('producto_id');
        let nombre = $(this).data('nombre');
        restaurarProducto(id, nombre);
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
function PonerValoresenCampos(producto_id, nombre, descripcion, categoria_id, subcategoria_id, imagen) {
    $('#producto_id').val(producto_id);
    $('#nombre').val(nombre);
    $('#descripcion').val(descripcion);
    $('#imagen_producto').attr('src', "../../../img/" + imagen);
    $('#ruta_imagen').val(imagen);
    alert('Imagen cargada: ' + $('#ruta_imagen').val());

    // Primero cargamos las categorías
    $.ajax({
        url: '../../../ajax/catalogo-serv.php?op=categorias',
        type: 'POST',
        processData: false,
        contentType: false,
        success: function (respuesta) {
            let data = JSON.parse(respuesta);
            let $categoria = $('#categoria');
            $categoria.empty();
            $categoria.append('<option value="" disabled>Seleccione una categoría</option>');

            data.forEach(function (item) {
                $categoria.append(`<option value="${item.categoria_id}">${item.nombre}</option>`);
            });

            // Establecer categoría seleccionada
            $categoria.val(categoria_id).trigger('change');

            // Cargar subcategorías una vez se haya establecido la categoría
            let formulario = new FormData();
            formulario.append('categoria_id', categoria_id);

            $.ajax({
                url: '../../../ajax/catalogo-serv.php?op=subcategorias',
                type: 'POST',
                data: formulario,
                contentType: false,
                processData: false,
                success: function (respuesta) {
                    let data = JSON.parse(respuesta);
                    let $subcategoria = $('#subcategoria');
                    $subcategoria.empty();
                    $subcategoria.append('<option value="" disabled>Seleccione una subcategoría</option>');

                    data.forEach(function (item) {
                        $subcategoria.append(`<option value="${item.categoria_id}">${item.nombre}</option>`);
                    });

                    // Establecer subcategoría seleccionada
                    $subcategoria.val(subcategoria_id);
                },
                error: function (xhr, status, error) {
                    console.error('Error al cargar subcategorías: ' + error);
                }
            });

        },
        error: function (xhr, status, error) {
            console.error('Error al cargar categorías: ' + error);
        }
    });
}