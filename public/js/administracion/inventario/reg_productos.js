$('#registroProducto').submit(function (e) {
  e.preventDefault();

  const nombre = $('#nombre').val().trim();
localStorage.setItem('nombreProducto', nombre);
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

        swal.fire({
          title: 'Producto registrado correctamente',
          icon: 'success',
          showCancelButton: true,
          confirmButtonText: 'Sí, registrar lote',
          cancelButtonText: 'No, gracias'
        }).then((result) => {
          if (result.isConfirmed) {

            // guardar el nombre del producto en el localStorage
            

            window.location.href = '../../../vista/administracion/inventario/registrar_lote.php';
          }
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


$(document).ready(function () {

  if ($('#reg_productos').length > 0)
    document.getElementById('foto').addEventListener('change', function () {
      const file = this.files[0];
      const maxSize = 2 * 1024 * 1024;

      if (file && file.size > maxSize) {
        swal.fire({
          title: 'Error',
          text: 'El archivo es demasiado grande. El tamaño máximo permitido es 2 MB.',
          icon: 'error',  
          confirmButtonText: 'Aceptar'
        });
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
const $subcategoriaSelect = $("#subcategoria");
const $caracteristicasObligatoriasDiv = $("#caracteristicasObligatorias");
const $caracteristicasExtrasDiv = $("#caracteristicasExtras");
const $btnAgregar = $("#agregarCaracteristica");
let extrasCount = 0;

// Cuando cambie categoría, mostrar campos obligatorios
$categoriaSelect.on("change", function () {
  const categoria = $(this).val();
  $caracteristicasObligatoriasDiv.empty();

  if (obligatorias[categoria]) {
    obligatorias[categoria].forEach(car => {
      const subID = $subcategoriaSelect.val();
      const $campo = crearCampo(car.nombre, true, car.tipo, subID);
      $caracteristicasObligatoriasDiv.append($campo);
    });
  }
});

// Cambiar placeholder de tallas si cambia subcategoría
$subcategoriaSelect.on("change", function () {
  const subID = $(this).val();
  const nuevoPlaceholder = getPlaceholderTalla(subID);

  $caracteristicasObligatoriasDiv.find("input").each(function () {
    const $nombreInput = $(this).closest(".caracteristica-group").find("input[name='caracteristica_nombre[]']");
    if ($nombreInput.val() === "Tallas disponibles") {
      $(this).attr("placeholder", nuevoPlaceholder);
    }
  });
});

// Agregar campo extra
$btnAgregar.on("click", async function () {
  if (extrasEditarCount >= 3) return;

  const { value: tipoCampo } = await Swal.fire({
    // ... tu configuración Swal ...
  });

  if (!tipoCampo) return;

  const tipo = tipoCampo === "numero" ? "numero" : "texto";
  const subID = $subcategoria.val();
  const $campoExtra = crearCampo("", false, tipo, subID);

  // Aquí forzamos que solo el nombre sea editable
  $campoExtra.find("input[name='caracteristica_nombre[]']").prop("readonly", false);
  // El valor puede quedar editable o no, según lo que quieras:
  // Editable:
  $campoExtra.find("input[name='caracteristica_descripcion[]']").prop("readonly", false);

  const $btnEliminar = $("<button>")
    .attr("type", "button")
    .addClass("btn btn-outline-danger btn-sm eliminarCaracteristica")
    .text("Eliminar");

  const $colEliminar = $("<div>").addClass("col-md-2 text-end").append($btnEliminar);
  $campoExtra.append($colEliminar);

  $caracteristicasExtras.append($campoExtra);
  extrasEditarCount++;
});


// Eliminar campo extra
$(document).on("click", ".eliminarCaracteristica", function () {
  $(this).closest(".caracteristica-group").remove();
  extrasCount--;
});
