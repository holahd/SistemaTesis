$('#registroProducto').submit(function (e) {
    e.preventDefault();
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


const obligatorias = {
    1: ["Tipo de agente", "Capacidad", "Color", "Presión"],
    2: ["Tallas disponibles", "Material", "Color", "Tipo de protección"]
};

function crearCampo(nombre, esObligatorio = false) {
    const $group = $("<div>").addClass("caracteristica-group");

    const $inputNombre = $("<input>")
        .attr("type", "text")
        .addClass("form-control")
        .attr("placeholder", "nombre")
        .attr("name", "caracteristica_nombre[]")
        .val(nombre || "");
    if (esObligatorio) $inputNombre.prop("readonly", true);

    const $inputDescripcion = $("<input>")
        .attr("type", "text")
        .addClass("form-control")
        .attr("placeholder", "descripción")
        .attr("name", "caracteristica_descripcion[]");

    if (esObligatorio) $inputDescripcion.prop("required", true);

    $group.append($inputNombre, $inputDescripcion);
    return $group;
}


$categoriaSelect.on("change", function () {
    const categoria = $(this).val();
    $caracteristicasObligatoriasDiv.empty();
    if (obligatorias[categoria]) {
        obligatorias[categoria].forEach(car => {
            const $campo = crearCampo(car, true);
            $caracteristicasObligatoriasDiv.append($campo);
        });
    }
   
});


$btnAgregar.on("click", function () {
    if (extrasCount >= 3) return;
    const $campoExtra = crearCampo("", false);
    $caracteristicasExtrasDiv.append($campoExtra);
    extrasCount++;
});
