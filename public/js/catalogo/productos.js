$(document).ready(function () {
    if ($('#productos').length > 0) {
        $.ajax({

            url: '../../ajax/catalogo-serv.php?op=listarProductos',
            type: 'POST',
            success: function (respuesta) {


                respuesta = JSON.parse(respuesta);


                respuesta.forEach(function (respuesta) {

                    // Crear la estructura HTML para cada tarjeta
                    var tarjetaHTML = `
                    <div class="col-md-4 mb-3">
                        <div class="card">
                            <img src="../../img/${respuesta.foto}" class="card-img-top" alt="${respuesta.nombre}">
                            <div class="card-body">
                                <h5 class="card-title">${respuesta.nombre}</h5>
                                <p class="card-text"><strong>Categoría:</strong> ${respuesta.categoria}</p>
                            <p class="card-text"><strong>Sub Categoría:</strong> ${respuesta.subcategoria}</p>
                                 <a href="detalle_producto.php" class="btn btn-primary ver-mas" 
                                      data-producto_id="${respuesta.producto_id}"
                                   data-nombre="${respuesta.nombre}" 
                                   data-descripcion="${respuesta.descripcion}"                                  
                                   data-categoria="${respuesta.categoria}" 
                                   data-subcategoria="${respuesta.subcategoria}"
                                   data-foto="${respuesta.foto}">Ver más</a>
                            </div>
                        </div>
                    </div>
                `;

                    // Insertar la tarjeta en el div con id 'product-list'
                    $('#product-list').append(tarjetaHTML);
                });

                // Evento para capturar clic en "Ver más"
                $(".ver-mas").click(function (e) {

                    // Guardar datos en localStorage
                    localStorage.setItem("producto", JSON.stringify({
                        producto_id: $(this).data("producto_id"),
                        nombre: $(this).data("nombre"),
                        descripcion: $(this).data("descripcion"),
                        categoria: $(this).data("categoria"),
                        subcategoria: $(this).data("subcategoria"),
                        foto: $(this).data("foto")
                    }));

                    // Redirigir a la página de detalles
                    window.location.href = "detalle_producto.php";
                });


            }

        });
    }
});

$(document).ready(function () {

    if ($('#productos').length > 0) { 



        $('#categoria').change(function () {

            $('#product-list').empty();

            var categoria = $('#categoria option:selected').text();

            filtroTarjetasCategoria(categoria);



        });

        $('#subcategoria').change(function () {

            $('#product-list').empty();

            var categoria = $('#categoria option:selected').text();

            var subcategoria = $('#subcategoria option:selected').text();

            filtroTarjetasSubCategoria(categoria, subcategoria);
        });



    }


});

function filtroTarjetasCategoria(categoria) {

    $.ajax({

        url: '../../ajax/catalogo-serv.php?op=listarProductos',
        type: 'POST',
        success: function (respuesta) {
            respuesta = JSON.parse(respuesta);
            respuesta.forEach(function (respuesta) {

                if (respuesta.categoria === categoria || categoria === "Seleccione una categoría") {




                    // Crear la estructura HTML para cada tarjeta
                    var tarjetaHTML = `
                <div class="col-md-4 mb-3">
                    <div class="card">
                        <img src="../../img/${respuesta.foto}" class="card-img-top" alt="${respuesta.nombre}">
                        <div class="card-body">
                            <h5 class="card-title">${respuesta.nombre}</h5>
                            <p class="card-text"><strong>Categoría:</strong> ${respuesta.categoria}</p>
                            <p class="card-text"><strong>Sub Categoría:</strong> ${respuesta.subcategoria}</p>
                             <a href="detalle_producto.php" class="btn btn-primary ver-mas" 
                                      data-producto_id="${respuesta.producto_id}"
                                   data-nombre="${respuesta.nombre}" 
                                   data-descripcion="${respuesta.descripcion}"
                                   data-categoria="${respuesta.categoria}" 
                                   data-subcategoria="${respuesta.subcategoria}"
                                   data-foto="${respuesta.foto}">Ver más</a>
                        </div>
                    </div>
                </div>
            `;

                    // Insertar la tarjeta en el div con id 'product-list'
                    $('#product-list').append(tarjetaHTML);
                } else {
                    return;

                }

            });

            // Evento para capturar clic en "Ver más"
            $(".ver-mas").click(function (e) {
                e.preventDefault(); // Evita que el enlace recargue la página

                // Guardar datos en localStorage
                localStorage.setItem("producto", JSON.stringify({
                    producto_id: $(this).data("producto_id"),
                    nombre: $(this).data("nombre"),
                    descripcion: $(this).data("descripcion"),
                   
                    categoria: $(this).data("categoria"),
                    subcategoria: $(this).data("subcategoria"),
                    foto: $(this).data("foto")
                }));

                // Redirigir a la página de detalles
                window.location.href = "detalle_producto.php";
            });

        },

        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error en la petición AJAX:", textStatus, errorThrown);
            $('#product-list').html('<p class="text-center text-danger">Hubo un error al cargar los productos.</p>');
        }

    });


}

function filtroTarjetasSubCategoria(categoria, subcategoria) {

    $.ajax({

        url: '../../ajax/catalogo-serv.php?op=listarProductos',
        type: 'POST',
        success: function (respuesta) {
            respuesta = JSON.parse(respuesta);


            respuesta.forEach(function (respuesta) {


                if (respuesta.categoria === categoria && respuesta.subcategoria === subcategoria || subcategoria === "Seleccione una subcategoría" && respuesta.categoria === categoria) {


                    // Crear la estructura HTML para cada tarjeta
                    var tarjetaHTML = `
                <div class="col-md-4 mb-3">
                    <div class="card">
                        <img src="../../img/${respuesta.foto}" class="card-img-top" alt="${respuesta.nombre}">
                        <div class="card-body">
                            <h5 class="card-title">${respuesta.nombre}</h5>
                            <p class="card-text">${respuesta.descripcion}</p>
                           
                            <p class="card-text"><strong>Categoría:</strong> ${respuesta.categoria}</p>
                            <p class="card-text"><strong>Sub Categoría:</strong> ${respuesta.subcategoria}</p>
                             <a href="detalle_producto.php" class="btn btn-primary ver-mas" 
                                      data-id="${respuesta.producto_id}"
                                   data-nombre="${respuesta.nombre}" 
                                   data-descripcion="${respuesta.descripcion}"
                                 
                                   data-categoria="${respuesta.categoria}" 
                                   data-subcategoria="${respuesta.subcategoria}"
                                   data-foto="${respuesta.foto}">Ver más</a>
                        </div>
                    </div>
                </div>
            `;

                    // Insertar la tarjeta en el div con id 'product-list'
                    $('#product-list').append(tarjetaHTML);
                } else {
                    return;
                }
            });

            // Evento para capturar clic en "Ver más"
            $(".ver-mas").click(function (e) {
                e.preventDefault(); // Evita que el enlace recargue la página

                // Guardar datos en localStorage
                localStorage.setItem("producto", JSON.stringify({
                    producto_id: $(this).data("producto_id"),
                    nombre: $(this).data("nombre"),
                    descripcion: $(this).data("descripcion"),
                    
                    categoria: $(this).data("categoria"),
                    subcategoria: $(this).data("subcategoria"),
                    foto: $(this).data("foto")
                }));

                // Redirigir a la página de detalles
                window.location.href = "detalle_producto.php";
            });


        },

        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error en la petición AJAX:", textStatus, errorThrown);
            $('#product-list').html('<p class="text-center text-danger">Hubo un error al cargar los productos.</p>');
        }

    });


}



$('#buscarProducto').click(function () {

    buscarProducto();

});




function buscarProducto() {
    var buscar = $('#barraBusqueda').val();
    if (!buscar) {
        alert("Por favor, ingresa un término de búsqueda.");
        return;
    }

    var iframe = document.getElementById('product-frame');

    if (!iframe || !iframe.contentWindow || !iframe.contentDocument) {
        console.error("No se puede acceder al contenido del iframe.");
        return;
    }

    var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    var productList = iframeDoc.getElementById('product-list');

    if (!productList) {
        console.error("No se encontró #product-list dentro del iframe.");
        return;
    }

    productList.innerHTML = ""; // Limpiar antes de agregar nuevos resultados

    $.ajax({
        url: '../../ajax/catalogo-serv.php?op=buscar',
        type: 'POST',
        data: { buscar: buscar },
        success: function (respuesta) {
            try {
                respuesta = JSON.parse(respuesta);
            } catch (e) {
                console.error("Error al parsear JSON:", e);
                return;
            }

            respuesta.forEach(function (respuesta) {
                var tarjetaHTML = `
                    <div class="col-md-4 mb-3">
                        <div class="card">
                            <img src="../../img/${respuesta.foto}" class="card-img-top" alt="${respuesta.nombre}">
                            <div class="card-body">
                                <h5 class="card-title">${respuesta.nombre}</h5>                            
                                <p class="card-text"><strong>Categoría:</strong> ${respuesta.categoria}</p>
                                <p class="card-text"><strong>Sub Categoría:</strong> ${respuesta.subcategoria}</p>
                                <a href="detalle_producto.php" class="btn btn-primary ver-mas"
                                      data-producto_id="${respuesta.producto_id}"
                                   data-nombre="${respuesta.nombre}" 
                                   data-descripcion="${respuesta.descripcion}"
                                   data-categoria="${respuesta.categoria}" 
                                   data-subcategoria="${respuesta.subcategoria}"
                                   data-foto="${respuesta.foto}">Ver más</a>
                            </div>
                        </div>
                    </div>
                `;
                productList.innerHTML += tarjetaHTML;
            });

          
            const verMasBtns = iframeDoc.querySelectorAll(".ver-mas");
            verMasBtns.forEach(function (btn) {
                btn.addEventListener("click", function (e) {
                    e.preventDefault();

                    localStorage.setItem("producto", JSON.stringify({
                        producto_id: btn.dataset.producto_id,
                        nombre: btn.dataset.nombre,
                        descripcion: btn.dataset.descripcion,
                        categoria: btn.dataset.categoria,
                        subcategoria: btn.dataset.subcategoria,
                        foto: btn.dataset.foto
                    }));

                    document.getElementById("product-frame").src = "detalle_producto.php";

                });
            });
        },

        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error en la búsqueda:", textStatus, errorThrown);
            productList.innerHTML = '<p class="text-center text-danger">Error al buscar productos.</p>';
        }
    });
}


$(document).ready(function () {

    if ($('#detalleProducto').length > 0) {


        let producto = JSON.parse(localStorage.getItem("producto"));

        if (producto) {
            $("#producto_id").val(producto.producto_id); // Asigna el ID del producto al campo oculto
            $("#nombre").text(producto.nombre);
            $("#descripcion").html(producto.descripcion.replace(/\n/g, "<br>"));
            $("#categoria").text(producto.categoria);
            $("#subCategoria").text(producto.subcategoria);
            $("#foto").attr("src", "../" + producto.foto);
        } else {
            alert("No hay producto seleccionado.");
            window.location.href = "catalogo.php"; // Redirige si no hay datos
        }

    }
});

$(document).ready(function () {
    if ($('#principal').length > 0) {
        $("#logo").click(function () {
            $("#product-frame").attr("src", "productos.php");
        });
    }
});

