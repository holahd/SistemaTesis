
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
                { data: 'talla'},
                { data: 'precioUnitario' },
                {
                    data: null,
                    render: function (data, type, row) {

                        return `
                            <button 
                                class="btn btn-outline-dark btn-sm me-1 editar"
                                title="Editar lote"
                                data-producto="${data.producto}"
                                data-num-lote="${data.numLote}"
                                data-cantidad="${data.cantidad}"
                                data-fecha-ingreso="${data.fechaIngreso}"
                                data-proveedor="${data.proveedor}"
                                data-fecha-caducidad="${data.fechaCaducidad}"
                                data-talla="${data.talla}"
                                data-precio-unitario="${data.precioUnitario}"
                                data-lote_id="${data.lote_id}"
                                >
                                 <i class="bi bi-pencil-square"></i>
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




    $(document).on('click', '.editar', function () {
        let producto = $(this).data('producto');
        let numLote = $(this).data('numLote');
        let cantidad = $(this).data('cantidad');
        let fechaIngreso = $(this).data('fechaIngreso');
        let proveedor = $(this).data('proveedor');
        let fechaCaducidad = $(this).data('fechaCaducidad');
        let talla = $(this).data('talla');
        let precioUnitario = $(this).data('precioUnitario');
        let lote_id = $(this).data('lote_id');

        PonerValoresenCampos(producto, numLote, cantidad, fechaIngreso, proveedor, fechaCaducidad, talla, precioUnitario, lote_id);

    });


    // Manejo del formulario de edición
    $('#formEditarLote').submit(function (e) {
        e.preventDefault();

        var formulario = new FormData(this);


        for (let [key, value] of formulario.entries()) {
            console.log(`${key}:`, value);
        }

        $.ajax({
            url: '../../../ajax/lotes-serv.php?op=editar',
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
                    swal.fire({
                        title: 'Éxito',
                        text: respuesta.mensaje,
                        icon: 'success',
                        confirmButtonText: 'Aceptar'
                    }).then(() => {
                        $('#registrarlote').trigger('reset');
                        $('#modalEditarLote').modal('hide');
                    });

                    $('#formEditarLote').trigger('reset');
                    $('#tablaLotes').DataTable().ajax.reload(null, false);
                    $('#fromularioEdicionLote').prop('disabled', true);
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
});



// Cargar valores en campos del formulario
function PonerValoresenCampos(producto, numLote, cantidad, fechaIngreso, proveedor, fechaCaducidad, talla ,precioUnitario, lote_id) {
    $('#fromularioEdicionLote').prop('disabled', false);
    $('#numeroLoteEditar').val(numLote);
    $('#unidadesEditar').val(cantidad);
    $('#fechaIngresoEditar').val(fechaIngreso);
    $('#proveedorEditar').val(proveedor);
    if (fechaCaducidad != 'No aplica') {
        $('#fechaCaducidadEditar').val(fechaCaducidad);
        $('#esPerecibleEditar').prop('checked', true).trigger('change');

    } else {
        $('#fechaCaducidadEditar').val('');
        $('#esPerecibleEditar').prop('checked', false).trigger('change');
    }
    $('#tallaEditar').val(talla);
    $('#precioUnitarioEditar').val(precioUnitario);
    $('#lote_id').val(lote_id);


    const modal = new bootstrap.Modal(document.getElementById('modalEditarLote'));

    $(document).ready(function () {
        $.ajax({
            url: '../../../ajax/lotes-serv.php?op=listarproductos',
            method: 'POST',
            contentType: false,
            processData: false,
            success: function (data) {
                const nombres = JSON.parse(data);

                window.listaProductosEditar = nombres;
                const $select = $('#productoEditar');
                $select.empty();
                $select.append('<option selected disabled>Seleccione un producto</option>');

                nombres.forEach(function (obj) {
                    $select.append(`<option value="${obj.producto}">${obj.producto}</option>`);
                });
                $('#productoEditar').val(producto);
                 $select.val(producto).trigger('change');
            },
            error: function (xhr, status, error) {
                console.error('Error al cargar productos:', error);
            }
        });
    });
    modal.show();

}

$('#productoEditar').on('change', function () {
    const seleccionado = $(this).val();
    const producto = window.listaProductosEditar.find(p => p.producto === seleccionado);

    if (!producto) return;

    // Mostrar/ocultar fecha de caducidad
    if (producto.categoria === 'Extintores') {
        $('#caducidadContainerEditar').removeClass('d-none');
    } else {
        $('#caducidadContainerEditar').addClass('d-none');
        $('#fechaCaducidadEditar').val('');
    }

    // Mostrar/ocultar campo de talla
    if (producto.categoria === 'Vestimenta') {
        if ($('#tallaContainerEditar').length === 0) {
            $('#precioUnitarioEditar').closest('.mb-3').before(`
                <div class="mb-3" id="tallaContainerEditar">
                    <label for="tallaEditar" class="form-label">Talla</label>
                    <input type="text" class="form-control" id="tallaEditar" name="tallaEditar" placeholder="Ej: S, M, L, 42, etc">
                </div>
            `);
        }
    } else {
        $('#tallaContainerEditar').remove();
    }
});

