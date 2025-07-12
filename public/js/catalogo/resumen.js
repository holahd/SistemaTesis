function actualizarEstadoBoton() {
    const lista = JSON.parse(localStorage.getItem("listaCotizacion")) || [];

    // Buscar el botón en el documento padre
    if (window.parent && window.parent.document) {
        const botonVaciar = $(window.parent.document).find("#vaciarLista");
        const botonCotizar = $(window.parent.document).find("#cotizarAhora");
        botonVaciar.prop("disabled", lista.length === 0);
        botonCotizar.prop("disabled", lista.length === 0);
    }
}

$(document).ready(function () {
    console.log(localStorage.getItem("listaCotizacion"));
    function cargarResumen() {
        let lista = JSON.parse(localStorage.getItem("listaCotizacion")) || [];
        let html = "";

        if (lista.length === 0) {
            html = `<tr><td colspan="4" class="text-center">No hay productos en la lista.</td></tr>`;
        } else {
            lista.forEach((item, index) => {
                html += `
                            <tr data-index="${index}">
                                <td>${item.nombre}</td>
                                <td>${item.descripcion.replace(/\n/g, "<br>")}</td>
                                <td>
                                    <div class="d-flex align-items-center justify-content-center">
                                        <button class="btn btn-sm btn-secondary btn-restar">-</button>
                                        <span class="mx-2 cantidad">${item.cantidad}</span>
                                        <button class="btn btn-sm btn-secondary btn-sumar">+</button>
                                    </div>
                                </td>
                                <td class="text-center">
                                    <button class="btn btn-danger btn-sm btn-eliminar">Eliminar</button>
                                </td>
                            </tr>
                        `;
            });
        }

        $("#tablaResumen").html(html);
    }

    cargarResumen();

    // Aumentar cantidad
    $(document).on("click", ".btn-sumar", function () {
        let index = $(this).closest("tr").data("index");
        let lista = JSON.parse(localStorage.getItem("listaCotizacion")) || [];
        lista[index].cantidad = parseInt(lista[index].cantidad) + 1;
        localStorage.setItem("listaCotizacion", JSON.stringify(lista));
        cargarResumen();
    });

    // Disminuir cantidad
    $(document).on("click", ".btn-restar", function () {
        let index = $(this).closest("tr").data("index");
        let lista = JSON.parse(localStorage.getItem("listaCotizacion")) || [];
        if (lista[index].cantidad > 1) {
            lista[index].cantidad = parseInt(lista[index].cantidad) - 1;
            localStorage.setItem("listaCotizacion", JSON.stringify(lista));
            cargarResumen();
        }
    });

    // Eliminar producto
    $(document).on("click", ".btn-eliminar", function () {
        let index = $(this).closest("tr").data("index");
        let lista = JSON.parse(localStorage.getItem("listaCotizacion")) || [];
        lista.splice(index, 1);
        localStorage.setItem("listaCotizacion", JSON.stringify(lista));
        cargarResumen();
        actualizarEstadoBoton();
    });

    // Enviar cotización
    $("#enviarCotizacion").click(function () {
        let correo = $("#correoContacto").val().trim();
        let lista = JSON.parse(localStorage.getItem("listaCotizacion")) || [];

        if (!correo) {
           swal.fire({
                title: 'Error',
                text: 'Por favor, ingrese un correo electrónico.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        if (!esEmailValido(correo)) {
            swal.fire({
                title: 'Error',
                text: 'El correo electrónico ingresado no es válido.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        if (lista.length === 0) {
            swal.fire({
                title: 'Error',
                text: 'No hay productos en la lista de cotización.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        $.ajax({
            url: './../../ajax/cotizacion-serv.php?op=solicitar',
            type: 'POST',
            data: {
                email: correo,
                productos: JSON.stringify(lista)
            },
            dataType: 'json',
            success: function (respuesta) {
                if (respuesta.status === 'ok') {
                    swal.fire({
                        title: 'Éxito',
                        text: 'La cotización ha sido enviada correctamente.',
                        icon: 'success',
                        confirmButtonText: 'Aceptar'
                    });

                    // Limpiar todo
                    localStorage.removeItem("listaCotizacion");
                    cargarResumen();
                    $("#correoContacto").val("");
                    actualizarEstadoBoton();
                } else {
                    swal.fire({
                        title: 'Error',
                        text: respuesta.message,
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                    console.error("Error del servidor:", respuesta);
                }
            },
            error: function (error) {
               swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al enviar la cotización. Por favor, inténtalo de nuevo más tarde.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
                console.error(error);
            }
        });

    });
});