$('#registroProducto').submit(function (e) {
    e.preventDefault();


     // Unir capacidad con unidad
  $(".capacidad-input").each(function () {
    const unidad = $(this).closest(".input-group").find(".capacidad-unidad").val();
    this.value = `${this.value} ${unidad}`;
  });

  // Agregar "PSI" a presión
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
        url: '../../../ajax/catalogo-serv.php?op=registrarProducto',
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
                
                $('#registroProducto').trigger('reset');
                $caracteristicasExtrasDiv.empty(); 
                extrasCount = 0; 
                $caracteristicasObligatoriasDiv.empty();
                $categoriaSelect.val('');
                if (confirm('Producto registrado correctamente. ¿Desea registrar un lote para este producto?')) {
                    
                     window.location.href = './../../../../vista/administracion/inventario/registrar_lote.php';
                }

            } else {
                alert('Error: ' + respuesta.mensaje);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error: ' + error);
        }

    });
});


$(document).ready(function () {

    if ($('#reg_productos').length > 0)
        document.getElementById('foto').addEventListener('change', function () {
            const file = this.files[0]; 
            const maxSize = 2 * 1024 * 1024; 

            if (file && file.size > maxSize) {
                alert('El archivo es demasiado grande. El tamaño máximo permitido es 2MB.');
                this.value = ''; 
            } else {

            }

        });


});

$(document).ready(function () {

    if ($('#reg_productos').length > 0)
        document.getElementById('foto').addEventListener('change', function () {
            const file = this.files[0]; 
            const maxSize = 2 * 1024 * 1024; 

            if (file && file.size > maxSize) {
                document.getElementById('errorMensaje').style.display = 'block';
                this.value = ''; 
            } else {
                document.getElementById('errorMensaje').style.display = 'none';
            }
        });



});

const $categoriaSelect = $("#categoria");
const $caracteristicasObligatoriasDiv = $("#caracteristicasObligatorias");
const $caracteristicasExtrasDiv = $("#caracteristicasExtras");
const $btnAgregar = $("#agregarCaracteristica");
let extrasCount = 0;

// Estructura de campos obligatorios con tipo de validación
const obligatorias = {
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

// Función para crear campos dinámicos
function crearCampo(nombre = "", esObligatorio = false, tipo = "texto") {
  const $group = $("<div>").addClass("row mb-2 caracteristica-group align-items-center");

  const $colNombre = $("<div>").addClass("col-md-5").append(
    $("<input>")
      .attr("type", "text")
      .addClass("form-control")
      .attr("placeholder", "nombre")
      .attr("tabindex", "-1")
        .css("pointer-events", "none")
      .attr("name", "caracteristica_nombre[]")
      .val(nombre)
      .prop("readonly", esObligatorio)
  );

  const $colDescripcion = $("<div>").addClass("col-md-5");
  let $inputDesc;

  switch (tipo) {
    case "capacidad":
      $inputDesc = $(`
        <div class="input-group">
          <input type="text" class="form-control capacidad-input" name="caracteristica_descripcion[]" placeholder="Ej: 10" />
          <select class="form-select input-group-text capacidad-unidad">
            <option value="kg">kg</option>
            <option value="litros">litros</option>
          </select>
        </div>
      `);
      break;

    case "presion":
      $inputDesc = $(`
        <div class="input-group">
          <input type="text" class="form-control presion-input" name="caracteristica_descripcion[]" placeholder="Ej: 150" />
          <span class="input-group-text">PSI</span>
        </div>
      `);
      break;

      case "numero":
  $inputDesc = $(`<input type="text" class="form-control solo-numero" name="caracteristica_descripcion[]" placeholder="Ingrese valor numérico" />`);
  break;

    case "tallas":
      $inputDesc = $(`<input type="text" class="form-control" name="caracteristica_descripcion[]" placeholder="Ej: S, M, L" />`);
      break;

    default:
      $inputDesc = $(`<input type="text" class="form-control" name="caracteristica_descripcion[]" placeholder="descripción" />`);
  }

  $colDescripcion.append($inputDesc);
  $group.append($colNombre, $colDescripcion);
  return $group;
}

// Mostrar campos obligatorios según categoría
$categoriaSelect.on("change", function () {
  const categoria = $(this).val();
  $caracteristicasObligatoriasDiv.empty();

  if (obligatorias[categoria]) {
    obligatorias[categoria].forEach(car => {
      const $campo = crearCampo(car.nombre, true, car.tipo);
      $caracteristicasObligatoriasDiv.append($campo);
    });
  }
});

// Agregar campo extra con tipo por SweetAlert
$btnAgregar.on("click", async function () {
  if (extrasCount >= 3) return;

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
      input: 'swal2-select-bootstrap' // Aplica estilo Bootstrap al select
    },
    inputValidator: (value) => {
      if (!value) {
        return "Debes seleccionar un tipo de característica";
      }
    }
  });

  if (!tipoCampo) return;

  const tipo = tipoCampo === "numero" ? "numero" : "texto";

  const $campoExtra = crearCampo("", false, tipo);

  const $btnEliminar = $("<button>")
    .attr("type", "button")
    .addClass("btn btn-outline-danger btn-sm eliminarCaracteristica")
    .text("Eliminar");

  const $colEliminar = $("<div>").addClass("col-md-2 text-end").append($btnEliminar);
  $campoExtra.append($colEliminar);

  $caracteristicasExtrasDiv.append($campoExtra);
  extrasCount++;
});


// Eliminar característica extra
$(document).on("click", ".eliminarCaracteristica", function () {
  $(this).closest(".caracteristica-group").remove();
  extrasCount--;
});

// Restringir entrada solo a números
$(document).on("input", ".capacidad-input, .presion-input, .solo-numero", function () {
  this.value = this.value.replace(/\D/g, "");
});
