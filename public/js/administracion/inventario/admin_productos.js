const mapaProductos = new Map();
// luego cargar datos ahí

$(document).ready(function () {


    $('#formulario_edicion').prop('disabled', true);

    if ($('#productos2').length > 0) {
        $('#tablaProductos').DataTable({
            ajax: {
                url: '../../../ajax/catalogo-serv.php?op=listarProductos',
                type: 'POST',
                dataSrc: function (json) {
                    mapaProductos.clear(); // vaciamos el mapa primero
                    json.forEach(p => mapaProductos.set(p.producto_id, p)); // indexamos
                    return json;
                }
            },
            columns: [
                { data: 'producto_id', visible: false },
                { data: 'nombre' },
                {
                    data: null,
                    render: function (data, type, row) {

                        // Botón para ver ficha técnica
                        return `
                <button 
                    class="btn btn-outline-success btn-sm ver-ficha"
                    title="Ver ficha técnica"
                    data-descripcion="${row.descripcion}">
                    <i class="bi bi-file-earmark-fill"></i>
                </button>
            `;
                    }
                },
                {
                    data: null,
                    title: 'Stock',
                    render: function (data, type, row) {
                        if (row.categoria === "Extintores") {
                            return `<span class="fw-semibold">${row.stock_total} unidades</span>`;
                        } else if (row.categoria === "Vestimenta") {
                            return `
                <button 
                    class="btn btn-outline-primary btn-sm ver-tallas"
                    data-producto_id="${row.producto_id}"
                    data-nombre="${row.nombre}">
                    Ver stock por tallas
                </button>
            `;
                        } else {
                            return `<span class="text-muted">N/A</span>`;
                        }
                    }
                },

                { data: 'categoria' },
                { data: 'subcategoria' },
                {
                    data: 'foto',
                    render: function (data, type, row) {
                        if (!data) {
                            return `<span class="text-muted">Sin imagen</span>`;
                        }
                        return `
            <img src="../../${data}"alt="Imagen de ${row.nombre}" 
                 class="img-thumbnail imagen-miniatura" 
                 style="max-height: 60px; cursor: pointer;" 
                 data-bs-toggle="modal" 
                 data-bs-target="#modalImagenAmpliada"
                 data-src="${data}"
                 data-nombre="${row.nombre}">
        `;
                    }
                },

                { data: 'descontinuado' },
                {
                    data: null,
                    render: function (data, type, row) {
                        if (row.descontinuado === 'si') {
                            // Botón restaurar con icono info
                            return `
                <button 
                    class="btn btn-outline-success btn-sm restaurar"
                    title="Restaurar producto"
                    data-producto_id="${row.producto_id}"
                    data-nombre="${row.nombre}">
                    <i class="bi bi-arrow-clockwise"></i>
                </button>
            `;
                        } else {
                            return `
                             <button 
                    class="btn btn-outline-dark btn-sm me-1 editar"
                    title="Editar producto"
                    data-producto_id="${data.producto_id}"
                    data-nombre="${row.nombre}"
                    data-descripcion="${row.descripcion}"
                    data-categoria_id="${data.categoria_id}"
                    data-subcategoria_id="${data.subcategoria_id}"
                    data-foto="${row.foto}">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button 
                    class="btn btn-outline-danger btn-sm eliminar"
                    title="Descontinuar producto"
                    data-nombre="${row.nombre}"
                    data-producto_id="${data.producto_id}">
                    <i class="bi bi-slash-circle"></i>
                </button>
                        `;
                        }
                    }
                }

            ],

            rowCallback: function (row, data) {
                if (data.descontinuado === 'si') {
                    $(row).addClass('fila-desactivada');
                } else {
                    $(row).removeClass('fila-desactivada');
                }
            }
            ,
            dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: '📊 Excel',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4, 5, 7] // incluye columna de producto_id (0) y columna stock (3)
                    },
                    customize: function (xlsx) {
                        const sheet = xlsx.xl.worksheets['sheet1.xml'] || xlsx.xl.worksheets[Object.keys(xlsx.xl.worksheets)[0]];

                        $('row', sheet).each(function () {
                            const $row = $(this);
                            if ($row.attr('r') === '1') return; // saltar encabezado

                            // Producto ID columna A
                            const $cellId = $row.find('c[r^="A"]');
                            const producto_id = $cellId.find('v').text();

                            const producto = mapaProductos.get(producto_id);
                            if (!producto) return;

                            let textoStock = 'N/A';
                            if (producto.categoria === "Vestimenta" || producto.categoria_id == 2) {
                                textoStock = producto.tallas?.length > 0
                                    ? producto.tallas.map(t => `talla ${t.talla}: ${t.stock}`).join(',\n ')
                                    : 'Sin lotes registrados';
                            } else if (producto.categoria === "Extintores") {
                                textoStock = `${producto.stock_total} unidades`;
                            }

                            const $cellStock = $row.find('c[r^="D"]');

                            const $v = $cellStock.find('v');
                            const $is = $cellStock.find('is t');

                            if ($v.length) {
                                $v.text(textoStock);
                            } else if ($is.length) {
                                $is.text(textoStock);
                            } else {
                                $cellStock.append(`<v>${textoStock}</v>`);
                            }
                        });
                    }


                },
                {
                    extend: 'pdfHtml5',
                    text: '📄 PDF',
                    orientation: 'portrait',
                    pageSize: 'A4',
                    exportOptions: { columns: [0, 1, 2, 3, 4, 5, 7] },
                    customize: function (doc) {
                        doc.content[1].table.body.forEach((row, i) => {
                            if (i === 0) return; // Saltar encabezado

                            const producto_id = row[0].text || row[0];
                            const producto = mapaProductos.get(producto_id);
                            const categoria = parseInt(producto?.categoria_id);
                            if (categoria === 2) {
                                if (producto.tallas?.length > 0) {
                                    const textoStock = producto.tallas.map(t => `talla ${t.talla}: ${t.stock}`).join('\n');

                                    // Aplicar salto de línea usando un objeto con preserveLeadingSpaces
                                    row[3] = {
                                        text: textoStock,
                                        preserveLeadingSpaces: true
                                    };
                                } else {
                                    row[3] = { text: 'Sin lotes registrados' };
                                }
                            }
                        });
                    }


                },
                {
                    extend: 'print',
                    text: '🖨️ Imprimir',
                    exportOptions: { columns: [0, 1, 2, 3, 4, 5, 7] },
                    customize: function (win) {
                        const body = $(win.document.body).find('table tbody tr');
                        body.each(function (i, tr) {
                            const tds = $(tr).find('td');
                            const producto_id = tds.eq(0).text();
                            const producto = mapaProductos.get(producto_id);
                            const categoria = parseInt(producto?.categoria_id);
                            if (categoria === 2) { // columna 4: categoria_id
                                if (producto.tallas?.length > 0) {
                                    const textoStock = producto.tallas.map(t => `talla ${t.talla}: ${t.stock}`).join('<br>');
                                    tds.eq(3).html(textoStock); // usamos html en lugar de text
                                } else {
                                    tds.eq(3).text('Sin lotes registrados');
                                }
                            }
                        });
                    }

                }
            ]
            ,
            columnDefs: [
                { targets: -1, className: 'text-center', orderable: false, width: "120px" }
            ]
        });
    }

    $(document).on("click", ".imagen-miniatura", function () {
        const src = $(this).data("src");
        const nombre = $(this).data("nombre");
        $("#imagenAmpliada").attr("src", "../../" + src);
        $("#tituloImagenAmpliada").text(nombre || "Producto");
    });


    $(document).on('click', '.eliminar', function () {
        let id = $(this).data('producto_id');
        let nombre = $(this).data('nombre');
        eliminarProducto(id, nombre);
    });


    $(document).on('click', '.editar', function () {
        let producto_id = $(this).data('producto_id');
        let nombre = $(this).data('nombre');
        let descripcion = $(this).data('descripcion');
        let foto = $(this).data('foto');
        let categoria_id = $(this).data('categoria_id');
        let subcategoria_id = $(this).data('subcategoria_id');

        PonerValoresenCampos(producto_id, nombre, descripcion, categoria_id, subcategoria_id, foto);

    });


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

    $(document).on('click', '.ver-ficha', function () {
        let descripcion = $(this).data('descripcion');

        verFicha(descripcion);
    });


    $('#formEditarProducto').submit(function (e) {
        e.preventDefault();






        var formulario = new FormData(this);




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
                    swal.fire({
                        title: 'Éxito',
                        text: respuesta.mensaje,
                        icon: 'success',
                        confirmButtonText: 'Aceptar'
                    }).then(() => {
                        $('#formEditarProducto').trigger('reset');
                        $('#imagen_producto').attr('src', '../../../img/default.jpg');
                        $('#tablaProductos').DataTable().ajax.reload(null, false);
                        $('#formulario_edicion').prop('disabled', true);
                        // Cerrar modal
                        $('#modalEditarProducto').modal('hide');
                        //actualizar la tabla
                        $('#tablaProductos').DataTable().ajax.reload(null, false);
                    });
                } else {
                    swal.fire({
                        title: 'Error',
                        text: 'Error: ' + respuesta.mensaje,
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

    $(document).on('click', '.ver-tallas', function () {
        const producto_id = $(this).data('producto_id');
        const nombre = $(this).data('nombre');

        const producto = mapaProductos.get(producto_id.toString());

        $('#tituloModalTallas').text(`Stock por tallas - ${nombre}`);

        if (!producto || !producto.tallas || producto.tallas.length === 0) {
            $('#contenedorTallas').html('<p class="text-danger">No hay lotes registrados del producto.</p>');
        } else {
            let html = `<div class="row g-2">`;
            producto.tallas.forEach(item => {
                html += `
                <div class="col-6 col-md-4">
                    <div class="card text-center border-0 shadow-sm bg-light">
                        <div class="card-body">
                            <i class="bi bi-tags-fill fs-3 text-primary"></i>
                            <h6 class="mt-2 mb-0">Talla <strong>${item.talla}</strong></h6>
                            <b>${item.stock} unidades</b>
                        </div>
                    </div>
                </div>`;
            });
            html += `</div>`;
            $('#contenedorTallas').html(html);
        }

        $('#modalTallas').modal('show');
    });

});


function PonerValoresenCampos(producto_id, nombre, descripcion, categoria_id, subcategoria_id, imagen) {
    $('#formulario_edicion').prop('disabled', false);
    $('#producto_id').val(producto_id);
    $('#nombre').val(nombre);
    $('#ruta_ficha_pdf').val(descripcion);
    $('#imagen_producto').attr('src', "../../../img/" + imagen);
    $('#ruta_imagen').val(imagen);

    const modal = new bootstrap.Modal(document.getElementById('modalEditarProducto'), {
        backdrop: 'static',
        keyboard: false,
        focus: false // <-- esto es lo importante
    });


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


                    $categoria.val(categoria_id);
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

    modal.show();
}


function eliminarProducto(id, nombre) {
    Swal.fire({
        title: '¿Descontinuar producto?',
        text: '¿Seguro que deseas descontinuar el producto "' + nombre + '"?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, descontinuar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.post('../../../ajax/catalogo-serv.php?op=eliminar', { codigo: id }, function (respuesta) {
                respuesta = JSON.parse(respuesta);
                Swal.fire({
                    title: 'Éxito',
                    text: respuesta.mensaje,
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
                $('#tablaProductos').DataTable().ajax.reload(null, false);
            }).fail(function () {
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudo descontinuar el producto. Inténtalo más tarde.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            });
        }
    });
}



function restaurarProducto(id, nombre) {
    Swal.fire({
        title: '¿Restaurar producto?',
        text: `¿Seguro que deseas restaurar el producto "${nombre}"?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, restaurar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.post('../../../ajax/catalogo-serv.php?op=restaurar', { codigo: id }, function (respuesta) {
                respuesta = JSON.parse(respuesta);
                Swal.fire({
                    title: 'Éxito',
                    text: respuesta.mensaje,
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });

                $('#tablaProductos').DataTable().ajax.reload(null, false);
            }).fail(function () {
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudo restaurar el producto. Inténtalo más tarde.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            });
        }
    });
}

function verFicha(descripcion) {

    window.open(`../../${descripcion}`, '_blank');
}

document.getElementById('ficha_pdf').addEventListener('change', function () {
    const archivo = this.files[0];

    if (archivo && archivo.size > 2 * 1024 * 1024) { // 2MB
        swal.fire({
            title: 'Error',
            text: 'El archivo PDF no puede ser mayor a 2MB.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        this.value = ''; // Limpia el campo
    }
});

