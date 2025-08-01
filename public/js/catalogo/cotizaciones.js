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

    actualizarEstadoBoton();
    // 🛒 Añadir a la lista de cotización
    $(document).on("click", "#añadirLista", function () {
        let id = $("#producto_id").val();
        let nombre = $("#nombre").text();
        let descripcion = $("#descripcion").html();
        console.log(descripcion);
        let cantidad = $("#cantidad").val();

        let talla = $("#talla").length > 0 ? $("#talla").val() : null;

        if ($("#contenedorTallas").is(":visible") && !talla) {
            Swal.fire("Falta seleccionar talla", "Por favor, selecciona una talla.", "warning");
            return;
        }
        // Obtener la lista actual desde localStorage
        let listaProductos = JSON.parse(localStorage.getItem("listaCotizacion")) || [];
        let yaExiste = listaProductos.find(p => p.id === id && p.talla === talla);

        if (yaExiste) {
            yaExiste.cantidad = parseInt(yaExiste.cantidad) + parseInt(cantidad);
        } else {
            listaProductos.push({ id, nombre, descripcion, cantidad, talla });
        }





        // Guardar la lista actualizada en localStorage
        localStorage.setItem("listaCotizacion", JSON.stringify(listaProductos));
        actualizarEstadoBoton();


        $('#alerta').fadeIn();  // Muestra la alerta de manera gradual


        setTimeout(function () {
            $('#alerta').fadeOut();
        }, 3000);




        // Verificamos que estamos en un iframe y si el iframe puede acceder al DOM del padre
        if (window.parent && window.parent.document) {
            // Usamos jQuery para acceder al botón fuera del iframe
            var boton = $(window.parent.document).find('#verLista');  // Seleccionamos el botón por ID

            // Aseguramos que el botón tenga un posicionamiento relativo
            boton.css('position', 'relative');

            // Creamos el span con las clases necesarias
            var span = $('<span></span>', {
                class: 'position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle'
            });

            // Añadimos el span al botón
            boton.append(span);
        }



    });

    // 📋 Mostrar la lista en el modal
    $(document).on("click", "#verLista", function () {
        let listaProductos = JSON.parse(localStorage.getItem("listaCotizacion")) || [];
        let listaHTML = "";

        if (listaProductos.length === 0) {
            listaHTML = `<li class="list-group-item text-center">No hay productos en la lista.</li>`;
        } else {
            listaProductos.forEach((p, index) => {
                listaHTML += `<li class="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>${p.nombre}</strong> - ${p.descripcion.replace(/\n/g, "<br>")}` +
                                    (p.talla ? `<br><span class="badge bg-secondary">Talla: ${p.talla}</span>` : "") + `
                                    <br> Cantidad:
                                    <div class="input-group input-group-sm mt-2 cantidad-control" data-index="${index}">
                                        <button class="btn btn-outline-secondary btn-decrease" type="button">-</button>
                                        <input type="text" class="form-control text-center cantidad-input solo-numeros" value="${p.cantidad}">
                                        <button class="btn btn-outline-secondary btn-increase" type="button">+</button>
                                    </div>
                                </div>
                                <button class="btn btn-danger btn-sm btn-remove" data-index="${index}">X</button>
                              </li>`;
            });
        }

        $("#listaCotizacion").html(listaHTML);
        $("#listaModal").modal("show");


        var boton = $(window.parent.document).find('#verLista');


        boton.css('position', 'relative');


        var span = $('<span></span>', {
            class: 'position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle'
        });


        boton.append(span);

        boton.find('span').remove();

    });


    //desactivar el botón eliminar si no hay productos en la lista'



    // ❌ Eliminar productos de la lista
    $(document).on("click", ".btn-remove", function () {
        let index = $(this).data("index");
        let listaProductos = JSON.parse(localStorage.getItem("listaCotizacion")) || [];
        listaProductos.splice(index, 1);
        localStorage.setItem("listaCotizacion", JSON.stringify(listaProductos));
        $("#verLista").trigger("click"); // Recargar la lista
        actualizarEstadoBoton();
    });

    // ✅ Botón "Cotizar ahora" (esto puede enviar la lista a otra página o un backend)
    $(document).on("click", "#cotizarAhora", function () {

        $("#listaModal").modal("hide");

        $("#product-frame").attr("src", "resumen.php");


    });

    $(document).on("click", "#vaciarLista", function () {
        Swal.fire({
            title: "¿Vaciar lista?",
            text: "Esta acción eliminará todos los productos de la cotización.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, vaciar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6"
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("listaCotizacion");
                $("#verLista").trigger("click");
                Swal.fire("Lista vaciada", "Tu cotización ha sido eliminada.", "success");
                actualizarEstadoBoton();

            }
        });
    });



    // Aumentar cantidad
    $(document).on("click", ".btn-increase", function () {
        let index = $(this).closest(".cantidad-control").data("index");
        let listaProductos = JSON.parse(localStorage.getItem("listaCotizacion")) || [];

        listaProductos[index].cantidad = parseInt(listaProductos[index].cantidad) + 1;
        localStorage.setItem("listaCotizacion", JSON.stringify(listaProductos));

        $("#verLista").trigger("click"); // Refresca el modal
    });

    // Disminuir cantidad
    $(document).on("click", ".btn-decrease", function () {
        let index = $(this).closest(".cantidad-control").data("index");
        let listaProductos = JSON.parse(localStorage.getItem("listaCotizacion")) || [];

        let cantidadActual = parseInt(listaProductos[index].cantidad);
        if (cantidadActual > 1) {
            listaProductos[index].cantidad = cantidadActual - 1;
            localStorage.setItem("listaCotizacion", JSON.stringify(listaProductos));
            $("#verLista").trigger("click"); // Refresca el modal
        }
    });


    // Guardar cantidad mientras escribe (pero no refrescar modal aún)
    $(document).on("input", ".cantidad-input", function () {
        let index = $(this).closest(".cantidad-control").data("index");
        let listaProductos = JSON.parse(localStorage.getItem("listaCotizacion")) || [];
        let nuevaCantidad = $(this).val();

        // Solo actualizar el dato sin recargar modal
        if (!isNaN(nuevaCantidad) && nuevaCantidad > 0) {
            listaProductos[index].cantidad = parseInt(nuevaCantidad);
            localStorage.setItem("listaCotizacion", JSON.stringify(listaProductos));
        }
    });

    // Al salir del campo, ahora sí refrescamos
    $(document).on("blur", ".cantidad-input", function () {
        let index = $(this).closest(".cantidad-control").data("index");
        let listaProductos = JSON.parse(localStorage.getItem("listaCotizacion")) || [];
        let nuevaCantidad = $(this).val();

        if (!isNaN(nuevaCantidad) && nuevaCantidad > 0) {
            // ok, ya está actualizado
            $("#verLista").trigger("click"); // refrescar solo al final
        } else {
            // restaurar valor anterior si el usuario deja vacío
            $(this).val(listaProductos[index].cantidad);
        }
    });


});