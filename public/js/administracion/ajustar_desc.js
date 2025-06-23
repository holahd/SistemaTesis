let hayCambiosPendientes = false;


let estadoInicial = {
    margen: null,
    umbrales: [] // arreglo de objetos
};

function guardarEstadoInicial(margen, umbrales) {
    estadoInicial.margen = parseFloat(margen);
    estadoInicial.umbrales = umbrales.map(u => ({
        id: u.id,
        cantidad: u.cantidad,
        descuento: u.descuento
    }));
}
// Marcar que hay cambios cuando se modifican valores
$(document).on('input change', '#margen_ganancia, .cantidad_minima, .descuento', function () {
    if (!hayCambiosPendientes) {
        hayCambiosPendientes = true;
        window.parent.postMessage('cambiosPendientes', '*');
    }
});


// Cuando se agrega o elimina umbral
$(document).on('click', '#agregar_threshold, .eliminar_threshold', function () {
    if (!hayCambiosPendientes) {
        hayCambiosPendientes = true;
        window.parent.postMessage('cambiosPendientes', '*');
    }
});




$(document).ready(function () {





    $.ajax({
        url: '../../ajax/umbral-serv.php?op=listar',
        method: 'POST',
        contentType: false,
        processData: false,
        success: function (data) {
            const umbrales = JSON.parse(data);

            if (umbrales.length === 0) {
                console.warn("No se encontraron umbrales.");
                return;
            }

            $('#margen_ganancia').val(umbrales[0].ganancia);

            guardarEstadoInicial(umbrales[0].ganancia, umbrales);

            const contenedor = $('#contenedor_thresholds');
            const template = document.getElementById('template_threshold').content;

            contenedor.empty();

            umbrales.forEach((umbral) => {
                const clone = document.importNode(template, true);
                const thresholdItem = $(clone).find('.threshold-item');

                thresholdItem.attr('data-id', umbral.id); // <- aquí asignas el id

                thresholdItem.find('.cantidad_minima').val(umbral.cantidad);
                thresholdItem.find('.descuento').val(umbral.descuento);

                thresholdItem.find('.eliminar_threshold').click(function () {
                    const id = thresholdItem.data('id');
                    if (id) eliminados.push(id);
                    thresholdItem.remove();
                });

                contenedor.append(clone);
            });

        },
        error: function (xhr, status, error) {
            console.error('Error al cargar los umbrales:', error);
        }
    });
});
// Número máximo de umbrales permitidos
const MAX_THRESHOLDS = 5;

$("#agregar_threshold").click(function () {
    const contenedor = $('#contenedor_thresholds');
    const count = contenedor.find('.threshold-item').length;

    if (count >= MAX_THRESHOLDS) {
       Swal.fire({
        icon: 'warning',
        title: 'Límite alcanzado',
        text: 'Has alcanzado el número máximo de 5 umbrales.',
        confirmButtonText: 'Aceptar'
    });
        return;
    }

    const template = document.getElementById('template_threshold').content;
    const clone = document.importNode(template, true);

    // Configura botón eliminar
    $(clone).find('.eliminar_threshold').click(function () {
        $(this).closest('.threshold-item').remove();
    });

    contenedor.append(clone);
});

$("#form_ajuste_descuentos").submit(function (e) {
    e.preventDefault();

    const margenActual = parseFloat($("#margen_ganancia").val());
    const nuevosUmbrales = [];
    let cambios = false;

    // Validar margen de ganancia
    if (isNaN(margenActual) || margenActual < 0 || margenActual > 100) {
        alert("El margen de ganancia debe estar entre 0% y 100%");
        return;
    }

    let umbralValido = true;
    let advertenciaMargen = false;
    let advertenciaDescuento = false;

    $(".threshold-item").each(function () {
        const id = $(this).data("id") || null;
        const cantidad = parseInt($(this).find(".cantidad_minima").val());
        const descuento = parseFloat($(this).find(".descuento").val());

        if (isNaN(cantidad) || cantidad < 1) {
            alert("Todas las cantidades mínimas deben ser mayores que 0");
            umbralValido = false;
            return false;
        }

        if (isNaN(descuento) || descuento < 0 || descuento > 100) {
            alert("Los descuentos deben estar entre 0% y 100%");
            umbralValido = false;
            return false;
        }

        // Verificar si hay descuentos altos
        if (descuento > 70) advertenciaDescuento = true;

        nuevosUmbrales.push({ id, cantidad, descuento });

        const original = estadoInicial.umbrales.find(u => u.id === id);
        if (!original || original.cantidad !== cantidad || original.descuento !== descuento) {
            cambios = true;
        }
    });

    if (!umbralValido) return;

    // Validar cantidades únicas
    const cantidades = nuevosUmbrales.map(u => u.cantidad);
    const cantidadesUnicas = new Set(cantidades);
    if (cantidades.length !== cantidadesUnicas.size) {
        alert("No puedes tener umbrales con la misma cantidad mínima");
        return;
    }

    // Verificación de margen bajo
    if (margenActual < 5) {
        advertenciaMargen = true;
    }

    if (margenActual !== estadoInicial.margen) cambios = true;
    if (eliminados.length > 0) cambios = true;

    if (!cambios) {
        alert("No se detectaron cambios.");
        return;
    }

    // Mostrar advertencias antes de continuar
    let advertencia = "";
    if (advertenciaMargen) {
        advertencia += "- El margen de ganancia es menor al 5%, podrías no obtener beneficio.\n";
    }
    if (advertenciaDescuento) {
        advertencia += "- Uno o más descuentos superan el 70%, podrías tener pérdidas.\n";
    }

    if (advertencia !== "") {
        advertencia = "Advertencias:\n" + advertencia + "\n¿Deseas continuar?";
        if (!confirm(advertencia)) return;
    }

    // Enviar al backend
    $.ajax({
        url: '../../ajax/umbral-serv.php?op=guardar',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            margen_ganancia: margenActual,
            umbrales: nuevosUmbrales,
            eliminados: eliminados
        }),
        success: function (response) {
            alert("¡Cambios guardados exitosamente!");
            hayCambiosPendientes = false;
            window.parent.postMessage('cambiosGuardados', '*');
            location.reload();

        },
        error: function (xhr, status, error) {
            alert("Error al guardar cambios.");
            console.error(error);
        }
    });
});


$("#revertir_cambios").click(function () {
    hayCambiosPendientes = false;
    window.parent.postMessage('cambiosGuardados', '*');
    location.reload();

});

const eliminados = [];

$(document).on("click", ".eliminar_threshold", function () {
    const item = $(this).closest(".threshold-item");
    const id = item.data("id");
    if (id) {
        eliminados.push(id);
    }
    item.remove();
});



