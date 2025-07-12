
// caracteristicas.js
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

// función getPlaceholderTalla y crearCampo como te di antes


function getPlaceholderTalla(subcategoriaID) {
    switch (subcategoriaID) {
        case "8": return "Ej: 7, 8, 9, 10"; // Guantes
        case "9": return "Ej: 39, 40, 41, 42"; // Calzado
        case "10": return "Ej: S, M, L, XL"; // Chalecos
        case "11": return "Ej: Ajustable o M/L"; // Cascos
        case "12": return "Tamaño único o ajustable"; // Protección ocular
        default: return "Ej: S, M, L";
    }
}

function crearCampo(nombre = "", esObligatorio = false, tipo = "texto", subcategoriaID = "") {
    const $group = $("<div>").addClass("row mb-2 caracteristica-group align-items-center");

    const $inputNombre = $("<input>")
        .attr("type", "text")
        .addClass("form-control")
        .attr("placeholder", "nombre")
        .attr("name", "caracteristica_nombre[]")
        .val(nombre)
        .prop("readonly", esObligatorio);

    // Sólo los obligatorios bloquean el foco y puntero
    if (esObligatorio) {
        $inputNombre
            .attr("tabindex", "-1")
            .css("pointer-events", "none");
    } else {
        $inputNombre
            .attr("tabindex", "0")
            .css("pointer-events", "");
    }

    const $colNombre = $("<div>").addClass("col-md-5").append($inputNombre);


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
            const placeholderTalla = getPlaceholderTalla(subcategoriaID);
            $inputDesc = $(`<input type="text" class="form-control" name="caracteristica_descripcion[]" placeholder="${placeholderTalla}" />`);
            break;

        default:
            let opciones = [];

            // ↓↓↓ reemplázalo por esto
            if (nombre === "Color") {
                // si es extintor (subcategorías 3–7) sólo colores típicos de extintores
                const extintorSubs = ["3", "4", "5", "6", "7"];
                if (subcategoriaID && extintorSubs.includes(subcategoriaID.toString())) {
                    opciones = ["Rojo", "Plateado", "Blanco", "Negro", "Amarillo", "Azul", "Naranja", "Verde"];
                } else {
                    // todos los colores posibles en seguridad contra incendios
                    opciones = [
                        "Rojo", "Blanco", "Negro",
                        "Amarillo", "Azul", "Naranja",
                        "Verde", "Gris", "Beige","Marrón"
                    ];
                }
            } else if (nombre === "Tipo de agente") {
                opciones = [
                    "ABC", "CO₂", "Agua", "H₂O-Formulato",
                    "Espuma AFFF", "Espuma FFFP",
                    "Polvo químico seco", "CO₂ limpio",
                    "Agente limpio (Halotrón)", "Niebla de agua"
                ];
            } else if (nombre === "Material") {
                opciones = [
                    "Acero inoxidable", "Aluminio",
                    "Fibra de vidrio", "PVC",
                    "Nylon", "Poliéster",
                    "Latón", "Polietileno", "Cuero", "Tela", "Plástico", "Nitrilo"
                ];
            } else if (nombre === "Tipo de protección") {
                opciones = [
                    "Corte", "Impacto", "Térmica",
                    "Eléctrica", "Química", "Antiestático",
                    "Resistente a llamas", "Resistente al calor"
                    ,"Ocular", "Auditiva", "Respiratoria"
                ];
            }


            if (opciones.length > 0) {
                const $select = $('<select class="form-select caracteristica-select" name="caracteristica_descripcion[]"></select>');
                $select.append(`<option value="" disabled selected>Seleccione una opción</option>`);
                opciones.forEach(op => $select.append(`<option value="${op}">${op}</option>`));
                $inputDesc = $select;
            } else {
                $inputDesc = $(`<input type="text" class="form-control" name="caracteristica_descripcion[]" placeholder="descripción" />`);
            }
    }

    $colDescripcion.append($inputDesc);
    $group.append($colNombre, $colDescripcion);

    // Inicializa select2 si es select
    if ($inputDesc.is("select")) {
        setTimeout(() => {
            $inputDesc.select2({
                placeholder: "Seleccione una opción",
                allowClear: true,
                width: '100%'
            });
        }, 0);
    }

    return $group;
}

// Validación común
$(document).on("input", ".capacidad-input, .presion-input, .solo-numero", function () {
    this.value = this.value.replace(/\D/g, "");
});
