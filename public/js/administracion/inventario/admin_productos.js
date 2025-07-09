
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
                { data: 'foto' },
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
                    class="btn btn-outline-warning btn-sm me-1 editar"
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
                    alert(respuesta.mensaje);
                    $('#formEditarProducto').trigger('reset');
                    $('#imagen_producto').attr('src', '../../../img/default.jpg');
                    $('#tablaProductos').DataTable().ajax.reload(null, false);
                    $('#formulario_edicion').prop('disabled', true);
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


function PonerValoresenCampos(producto_id, nombre, descripcion, categoria_id, subcategoria_id, imagen) {
    $('#formulario_edicion').prop('disabled', false);
    $('#producto_id').val(producto_id);
    $('#nombre').val(nombre);
    $('#descripcion').val(descripcion);
    $('#imagen_producto').attr('src', "../../../img/" + imagen);
    $('#ruta_imagen').val(imagen);



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

                    $caracteristicasObligatoriasEditar.empty();
                    $caracteristicasExtrasEditar.empty();
                    extrasEditarCount = 0;

                    const obligatoriasCategoria = obligatoriasEditar[categoria_id] || [];

                    lineas.forEach(linea => {
                        const partes = linea.split(":");
                        if (partes.length < 2) return;

                        const nombre = partes[0].trim();
                        const descripcion = partes.slice(1).join(":").trim();

                        // Buscar si este nombre es una característica obligatoria y su tipo
                        const campoObligatorio = obligatoriasCategoria.find(obj => obj.nombre === nombre);

                        if (campoObligatorio) {
                            $caracteristicasObligatoriasEditar.append(
                                crearCampoEditar(nombre, descripcion, true, campoObligatorio.tipo)
                            );
                        } else if (extrasEditarCount < 3) {
                            // Deduce tipo del extra
                            const tipo = isNaN(parseFloat(descripcion)) ? "texto" : "numero";
                            $caracteristicasExtrasEditar.append(
                                crearCampoEditar(nombre, descripcion, false, tipo)
                            );
                            extrasEditarCount++;
                        }
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
}


function eliminarProducto(id, nombre) {
    if (confirm('¿Seguro que deseas descontinuar el producto "' + nombre + '"?')) {
        $.post('../../../ajax/catalogo-serv.php?op=eliminar', { codigo: id }, function (respuesta) {
            respuesta = JSON.parse(respuesta);
            alert(respuesta.mensaje);
            $('#tablaProductos').DataTable().ajax.reload(null, false);
        }).fail(function () {
            alert("Error al descontinuar el producto.");
        });
    }
}



function restaurarProducto(id, nombre) {
    if (confirm(`¿Seguro que deseas restaurar el producto "${nombre}"?`)) {
        $.post('../../../ajax/catalogo-serv.php?op=restaurar', { codigo: id }, function (respuesta) {
            respuesta = JSON.parse(respuesta);
            alert(respuesta.mensaje);
            $('#tablaProductos').DataTable().ajax.reload(null, false);
        }).fail(function () {
            alert("Error al restaurar el producto.");
        });
    }
}

const $caracteristicasObligatoriasEditar = $("#caracteristicasObligatoriasEditar");
const $caracteristicasExtrasEditar = $("#caracteristicasExtrasEditar");
const $btnAgregarEditar = $("#agregarCaracteristicaEditar");

let extrasEditarCount = 0;

const obligatoriasEditar = {
    1: [
        { nombre: "Tipo de agente", tipo: "texto" },
        { nombre: "Capacidad", tipo: "capacidad" },
        { nombre: "Color", tipo: "texto" },
        { nombre: "Presión", tipo: "presion" }
    ],
    2: [
        { nombre: "Tallas disponibles", tipo: "tallas" },
        { nombre: "Material", tipo: "texto" },
        { nombre: "Color", tipo: "texto" },
        { nombre: "Tipo de protección", tipo: "texto" }
    ]
};

function crearCampoEditar(nombre = "", descripcion = "", esObligatorio = false, tipo = "texto") {
  descripcion = descripcion || "";
  const $row = $("<div>").addClass("row mb-2 caracteristica-group align-items-center");

  const $colNombre = $("<div>").addClass("col-md-5").append(
    $("<input>")
      .attr("type", "text")
      .addClass("form-control")
      .attr("placeholder", "nombre")
      .attr("name", "caracteristica_nombre[]")
      .val(nombre)
      .prop("readonly", esObligatorio)
      .attr("tabindex", esObligatorio ? "-1" : "0")
      .css("pointer-events", esObligatorio ? "none" : "")
  );

  const $colDesc = $("<div>").addClass("col-md-5");
  let $inputDesc;

  switch (tipo) {
    case "capacidad": {
      // Extraer número y unidad (kg o litros)
      let numero = descripcion.match(/[\d.]+/)?.[0] || "";
      let unidad = descripcion.includes("litros") ? "litros" : "kg";

      $inputDesc = $(`
        <div class="input-group">
          <input type="text" class="form-control capacidad-input" name="caracteristica_descripcion[]" placeholder="Ej: 10" />
          <select class="form-select input-group-text capacidad-unidad">
            <option value="kg">kg</option>
            <option value="litros">litros</option>
          </select>
        </div>
      `);

      $inputDesc.find("input").val(numero);
      $inputDesc.find("select").val(unidad);
      break;
    }

    case "presion": {
      // Extraer número (sin PSI)
      let numero = descripcion.match(/[\d.]+/)?.[0] || "";

      $inputDesc = $(`
        <div class="input-group">
          <input type="text" class="form-control presion-input" name="caracteristica_descripcion[]" placeholder="Ej: 150" />
          <span class="input-group-text">PSI</span>
        </div>
      `);

      $inputDesc.find("input").val(numero);
      break;
    }

    case "tallas": {
      $inputDesc = $(`<input type="text" class="form-control" name="caracteristica_descripcion[]" placeholder="Ej: S, M, L" />`).val(descripcion);
      break;
    }

    case "numero": {
      $inputDesc = $(`<input type="text" class="form-control solo-numero" name="caracteristica_descripcion[]" placeholder="Ingrese valor numérico" />`).val(descripcion);
      break;
    }

    default: {
      $inputDesc = $(`<input type="text" class="form-control" name="caracteristica_descripcion[]" placeholder="descripción" />`).val(descripcion);
    }
  }

  $colDesc.append($inputDesc);
  $row.append($colNombre, $colDesc);

  if (!esObligatorio) {
    const $btnEliminar = $("<button>")
      .attr("type", "button")
      .addClass("btn btn-outline-danger btn-sm eliminarCaracteristica")
      .text("Eliminar");

    const $colEliminar = $("<div>").addClass("col-md-2 text-end").append($btnEliminar);
    $row.append($colEliminar);
  }

  return $row;
}


// Botón para agregar extra
$btnAgregarEditar.on("click", async function () {
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
        confirmButtonText: "Agregar"
    });

    if (!tipoCampo) return;

    const tipo = tipoCampo === "numero" ? "numero" : "texto";
    const $campoExtra = crearCampoEditar("", "", false, tipo);

    $caracteristicasExtrasEditar.append($campoExtra);
    extrasEditarCount++;
});

// Eliminar extra
$(document).on("click", ".eliminarCaracteristica", function () {
    $(this).closest(".caracteristica-group").remove();
    extrasEditarCount--;
});

// Restringir a números
$(document).on("input", ".capacidad-input, .presion-input, .solo-numero", function () {
    this.value = this.value.replace(/\D/g, "");
});


