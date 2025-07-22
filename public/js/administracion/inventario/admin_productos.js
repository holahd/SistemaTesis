
$(document).ready(function () {

    $('#formulario_edicion').prop('disabled', true);

    if ($('#productos2').length > 0) {
        $('#tablaProductos').DataTable({
            ajax: {
                url: '../../../ajax/catalogo-serv.php?op=listarProductos',
                type: 'POST',
                dataSrc: ''
            },
            columns: [
                { data: 'nombre' },
                { data: 'descripcion' },
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
            ],
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


    $('#formEditarProducto').submit(function (e) {
        e.preventDefault();



        // Unir unidad a capacidad
        $(".capacidad-input").each(function () {
            const unidad = $(this).closest(".input-group").find(".capacidad-unidad").val();
            this.value = `${this.value} ${unidad}`;
        });

        // Agregar PSI
        $(".presion-input").each(function () {
            if (!this.value.includes("PSI")) {
                this.value += " PSI";
            }
        });


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
});


function PonerValoresenCampos(producto_id, nombre, descripcion, categoria_id, subcategoria_id, imagen) {
    $('#formulario_edicion').prop('disabled', false);
    $('#producto_id').val(producto_id);
    $('#nombre').val(nombre);
    $('#descripcion').val(descripcion);
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


            $categoria.val(categoria_id).trigger('change');


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


                    $subcategoria.val(subcategoria_id);

                    // Procesar características desde descripción
                    const lineas = descripcion.split("\n").filter(Boolean);

                    $caracteristicasObligatorias.empty();
                    $caracteristicasExtras.empty();
                    extrasEditarCount = 0;

                    const obligatoriasCategoria = obligatorias[categoria_id] || [];

                    console.log("Descripción cruda:", descripcion);
                    console.log("Líneas detectadas:", lineas);

                    lineas.forEach(linea => {
                        const partes = linea.split(":");
                        if (partes.length < 2) return;

                        const nombreCampo = partes[0].trim();
                        const valorCampo = partes.slice(1).join(":").trim();

                        const campoObligatorio = obligatoriasCategoria.find(obj => obj.nombre.toLowerCase() === nombreCampo.toLowerCase());

                        if (campoObligatorio) {
                            const $campo = crearCampo(campoObligatorio.nombre, true, campoObligatorio.tipo, subcategoria_id);
                            asignarValorCampo($campo, valorCampo, campoObligatorio.tipo);
                            $caracteristicasObligatorias.append($campo);
                        } else if (extrasEditarCount < 3) {
                            const tipoExtra = isNaN(parseFloat(valorCampo)) ? "texto" : "numero";
                            const $campoExtra = crearCampo(nombreCampo, false, tipoExtra, subcategoria_id);

                            asignarValorCampo($campoExtra, valorCampo, tipoExtra);

                            // --- Agregar botón de eliminar igual que en el add handler ---
                            const $btnEliminar = $("<button>")
                                .attr("type", "button")
                                .addClass("btn btn-outline-danger btn-sm eliminarCaracteristica")
                                .text("Eliminar");

                            const $colEliminar = $("<div>").addClass("col-md-2 text-end").append($btnEliminar);
                            $campoExtra.append($colEliminar);
                            // -------------------------------------------------------------

                            $caracteristicasExtras.append($campoExtra);
                            extrasEditarCount++;
                        }


                        console.log("Procesando línea:", linea);
                        console.log("Nombre detectado:", nombreCampo);
                        console.log("Valor detectado:", valorCampo);

                    });




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


const $categoria = $("#categoria");
const $subcategoria = $("#subcategoria");
const $caracteristicasObligatorias = $("#caracteristicasObligatorias");
const $caracteristicasExtras = $("#caracteristicasExtras");
const $btnAgregar = $("#agregarCaracteristica");

let extrasEditarCount = 0;

// Mostrar campos obligatorios (como en registrar)
$("#categoria").on("change", function () {
    const categoria = $(this).val();
    $caracteristicasObligatorias.empty();

    if (obligatorias[categoria]) {
        obligatorias[categoria].forEach(car => {
            const subID = $subcategoria.val();
            const $campo = crearCampo(car.nombre, true, car.tipo, subID);
            $caracteristicasObligatorias.append($campo);
        });
    }
});

// Cambiar placeholder si cambia subcategoría
$subcategoria.on("change", function () {
    const subID = $(this).val();
    const nuevoPlaceholder = getPlaceholderTalla(subID);

    $caracteristicasObligatorias.find("input").each(function () {
        const $nombreInput = $(this).closest(".caracteristica-group").find("input[name='caracteristica_nombre[]']");
        if ($nombreInput.val() === "Tallas disponibles") {
            $(this).attr("placeholder", nuevoPlaceholder);
        }
    });
});

// Agregar campo extra en editar
$btnAgregar.on("click", async function () {
    if (extrasEditarCount >= 3) return;

    const { value: tipoCampo } = await Swal.fire({
        title: "Tipo de característica",
        input: "select",
        inputOptions: {
            texto: "Texto",
            numero: "Número"
        },
        inputPlaceholder: "Selecciona tipo",
        showCancelButton: true,
        confirmButtonText: "Agregar",
        cancelButtonText: "Cancelar",
        customClass: {
            input: 'swal2-select-bootstrap'
        },
        inputValidator: (value) => {
            if (!value) return "Debes seleccionar un tipo de característica";
        }
    });

    if (!tipoCampo) return;

    const tipo = tipoCampo === "numero" ? "numero" : "texto";
    const subID = $subcategoria.val();
    const $campoExtra = crearCampo("", false, tipo, subID);

    const $btnEliminar = $("<button>")
        .attr("type", "button")
        .addClass("btn btn-outline-danger btn-sm eliminarCaracteristica")
        .text("Eliminar");

    const $colEliminar = $("<div>").addClass("col-md-2 text-end").append($btnEliminar);
    $campoExtra.append($colEliminar);

    $caracteristicasExtras.append($campoExtra);
    extrasEditarCount++;
});

// Eliminar extra
$(document).on("click", ".eliminarCaracteristica", function () {
    $(this).closest(".caracteristica-group").remove();
    extrasEditarCount--;
});


function asignarValorCampo($campo, valor, tipo) {
    if (tipo === "capacidad") {
        // input + select unidad
        const [num, unidad] = valor.split(" ");
        $campo.find("input.capacidad-input").val(num || "");
        if (unidad) {
            $campo.find("select.capacidad-unidad").val(unidad).trigger("change");
        }
    } else if (tipo === "presion") {
        // input + sufijo PSI
        const num = valor.replace("PSI", "").trim();
        $campo.find("input.presion-input").val(num);
    } else if (tipo === "numero") {
        $campo.find("input.solo-numero").val(valor);
    } else if (tipo === "tallas") {
        $campo.find("input[name='caracteristica_descripcion[]']").val(valor);
    }
    else if ($campo.find("select.caracteristica-select").length) {
        // campo con select2
        $campo.find("select.caracteristica-select").val(valor).trigger("change");
    } else {
        // campo input texto normal
        $campo.find("input[name='caracteristica_descripcion[]']").val(valor);
    }

}
