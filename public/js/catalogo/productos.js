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
                                <p class="card-text">${respuesta.descripcion}</p>
                                <p class="card-text"><strong>$${respuesta.precio}</strong></p>
                                <p class="card-text"><strong>Categoría:</strong> ${respuesta.categoria}</p>
                                <p class="card-text"><strong>Sub Categoría:</strong> ${respuesta.subCategoria}</p>
                                 <a href="detalle_producto.php" class="btn btn-primary ver-mas" 
                                   data-nombre="${respuesta.nombre}" 
                                   data-descripcion="${respuesta.descripcion}"
                                   data-precio="${respuesta.precio}" 
                                   data-categoria="${respuesta.categoria}" 
                                   data-subcategoria="${respuesta.subCategoria}"
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
                        nombre: $(this).data("nombre"),
                        descripcion: $(this).data("descripcion"),
                        precio: $(this).data("precio"),
                        categoria: $(this).data("categoria"),
                        subCategoria: $(this).data("subcategoria"),
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

            var subCategoria = $('#subcategoria option:selected').text();

            filtroTarjetasSubCategoria(categoria, subCategoria);
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
                            <p class="card-text">${respuesta.descripcion}</p>
                            <p class="card-text"><strong>$${respuesta.precio}</strong></p>
                            <p class="card-text"><strong>Categoría:</strong> ${respuesta.categoria}</p>
                            <p class="card-text"><strong>Sub Categoría:</strong> ${respuesta.subCategoria}</p>
                             <a href="detalle_producto.php" class="btn btn-primary ver-mas" 
                                   data-nombre="${respuesta.nombre}" 
                                   data-descripcion="${respuesta.descripcion}"
                                   data-precio="${respuesta.precio}" 
                                   data-categoria="${respuesta.categoria}" 
                                   data-subcategoria="${respuesta.subCategoria}"
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
                    nombre: $(this).data("nombre"),
                    descripcion: $(this).data("descripcion"),
                    precio: $(this).data("precio"),
                    categoria: $(this).data("categoria"),
                    subCategoria: $(this).data("subcategoria"),
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

function filtroTarjetasSubCategoria(categoria, subCategoria) {

    $.ajax({

        url: '../../ajax/catalogo-serv.php?op=listarProductos',
        type: 'POST',
        success: function (respuesta) {
            respuesta = JSON.parse(respuesta);


            respuesta.forEach(function (respuesta) {


                if (respuesta.categoria === categoria && respuesta.subCategoria === subCategoria || subCategoria === "Seleccione una subcategoría" && respuesta.categoria === categoria) {


                    // Crear la estructura HTML para cada tarjeta
                    var tarjetaHTML = `
                <div class="col-md-4 mb-3">
                    <div class="card">
                        <img src="../../img/${respuesta.foto}" class="card-img-top" alt="${respuesta.nombre}">
                        <div class="card-body">
                            <h5 class="card-title">${respuesta.nombre}</h5>
                            <p class="card-text">${respuesta.descripcion}</p>
                            <p class="card-text"><strong>$${respuesta.precio}</strong></p>
                            <p class="card-text"><strong>Categoría:</strong> ${respuesta.categoria}</p>
                            <p class="card-text"><strong>Sub Categoría:</strong> ${respuesta.subCategoria}</p>
                             <a href="detalle_producto.php" class="btn btn-primary ver-mas" 
                                   data-nombre="${respuesta.nombre}" 
                                   data-descripcion="${respuesta.descripcion}"
                                   data-precio="${respuesta.precio}" 
                                   data-categoria="${respuesta.categoria}" 
                                   data-subcategoria="${respuesta.subCategoria}"
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
                    nombre: $(this).data("nombre"),
                    descripcion: $(this).data("descripcion"),
                    precio: $(this).data("precio"),
                    categoria: $(this).data("categoria"),
                    subCategoria: $(this).data("subcategoria"),
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
    var iframe = document.getElementById('product-frame'); // Asegúrate de tener el ID correcto del iframe

    if (!iframe || !iframe.contentWindow || !iframe.contentDocument) {
        console.error("No se puede acceder al contenido del iframe.");
        return;
    }

    var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    var productList = iframeDoc.getElementById('product-list'); // Asegúrate de que el div esté dentro del iframe

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
            console.log("Respuesta recibida:", respuesta); // Para depuración

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
                                <p class="card-text">${respuesta.descripcion}</p>
                                <p class="card-text"><strong>$${respuesta.precio}</strong></p>
                                <p class="card-text"><strong>Categoría:</strong> ${respuesta.categoria}</p>
                                <p class="card-text"><strong>Sub Categoría:</strong> ${respuesta.subCategoria}</p>
                                 <a href="detalle_producto.php" class="btn btn-primary ver-mas" 
                                   data-nombre="${respuesta.nombre}" 
                                   data-descripcion="${respuesta.descripcion}"
                                   data-precio="${respuesta.precio}" 
                                   data-categoria="${respuesta.categoria}" 
                                   data-subcategoria="${respuesta.subCategoria}"
                                   data-foto="${respuesta.foto}">Ver más</a>
                            </div>
                        </div>
                    </div>
                `;
                productList.innerHTML += tarjetaHTML;
            });

            // Evento para capturar clic en "Ver más"
            $(".ver-mas").click(function (e) {
                e.preventDefault(); // Evita que el enlace recargue la página

                // Guardar datos en localStorage
                localStorage.setItem("producto", JSON.stringify({
                    nombre: $(this).data("nombre"),
                    descripcion: $(this).data("descripcion"),
                    precio: $(this).data("precio"),
                    categoria: $(this).data("categoria"),
                    subCategoria: $(this).data("subcategoria"),
                    foto: $(this).data("foto")
                }));

                // Redirigir a la página de detalles
                window.location.href = "detalle_producto.php";
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error("Error en la petición AJAX:", textStatus, errorThrown);
            productList.innerHTML = '<p class="text-center text-danger">Hubo un error al cargar los productos.</p>';
        }
    });
}

$(document).ready(function () {

    if ($('#detalleProducto').length > 0) {


        let producto = JSON.parse(localStorage.getItem("producto"));

        if (producto) {
            $("#nombre").text(producto.nombre);
            $("#descripcion").text(producto.descripcion);
            $("#precio").text("$" + producto.precio);
            $("#categoria").text(producto.categoria);
            $("#subCategoria").text(producto.subCategoria);
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


$(document).ready(function () {
    if ($('#productos2').length > 0) {
        $('#tablaProductos').DataTable({
            ajax: {
                url: '../../ajax/catalogo-serv.php?op=listarProductos',
                type: 'POST',
                dataSrc: ''
            },
            columns: [
                { data: 'nombre' },
                { data: 'descripcion' },
                { data: 'precio' },
                { data: 'categoria' },
                { data: 'subCategoria' },
                { data: 'fecha_caducidad' },
                { data: 'codigo' },
                {
                    data: null,
                    render: function (data, type, row) {
                        return `
                            <button class="btn btn-warning btn-sm editar" onclick="PonerValoresenCampos('${row.nombre}','${row.descripcion}','${row.precio}','${row.categoria}','${row.subCategoria}','${row.fecha_caducidad}','${row.codigo}','${row.foto}')">✏️ Editar</button>
                        `;
                    }
                }
            ],
            dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'pdfHtml5',
                    text: '📄 PDF',
                    orientation: 'landscape',
                    pageSize: 'A4',
                    className: 'btn btn-info btn-sm',
                    exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6] }
                },
                {
                    extend: 'excelHtml5',
                    text: '📊 Excel',
                    className: 'btn btn-success btn-sm',
                    exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6] }
                },
                {
                    extend: 'print',
                    text: '🖨️ Imprimir',
                    className: 'btn btn-primary btn-sm',
                    exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6] }
                }
            ]
        });
    }
});


// Evento delegado para eliminar producto
$(document).on('click', '.eliminar', function () {
    let codigo = $(this).data('codigo');
    eliminarProducto(codigo);
});

function eliminarProducto(codigo) {
    if (confirm('¿Seguro que deseas eliminar el producto con código ' + codigo + '?')) {
        $.post('../../ajax/catalogo-serv.php?op=eliminar', { codigo: codigo }, function (respuesta) {
            respuesta = JSON.parse(respuesta);
            alert(respuesta.mensaje);
            location.reload();
        }).fail(function () {
            alert("Error al eliminar el producto.");
        });
    }
}



// Función para cargar datos en el formulario
function PonerValoresenCampos(nombre, descripcion, precio, categoria, subcategoria, fecha_mantenimiento, codigo, imagen) {
    $('#nombre').val(nombre);
    $('#descripcion').val(descripcion);
    $('#precio').val(precio);

    setDatosEdicion(categoria, subcategoria);

    $('#fecha_mantenimiento').val(fecha_mantenimiento);
    $('#codigo').val(codigo);
    $('#imagen_producto').attr('src', "../" + imagen);
}

// Manejo del formulario de edición
$('#formEditarProducto').submit(function (e) {
    e.preventDefault();
    
    var formulario = new FormData(this);

    
    $.ajax({
        url: '../../ajax/catalogo-serv.php?op=editar',
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
                
                
                // Limpiar el formulario y la imagen

                $('#formEditarProducto').trigger('reset');

                $('#imagen_producto').attr('src', '../../img/default.jpg');

                // Recargar la tabla
                var tabla = $('#tablaProductos').DataTable();
if (tabla) {
    tabla.ajax.reload(null, false);
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



async function setDatosEdicion(categoria, subcategoria) {
    $('#categoria option').each(function() {
        if ($(this).text() === categoria) {
            $(this).prop('selected', true);  // Seleccionamos la categoría
            // Mostrar u ocultar el div de mantenimiento basado en la categoría
            if (categoria === "Extintores") {
                document.getElementById('fechaMantenimientoDiv').style.display = "block"; // Mostrar el div
            } else {
                document.getElementById('fechaMantenimientoDiv').style.display = "none"; // Ocultar el div
            }
            return false; // Salimos del loop cuando encontramos la categoría
        }
    });

    // Espera a que las subcategorías se carguen antes de seleccionar la correcta
     cargarSubCategorias(categoria);

    setTimeout(() => { // Retrasa la selección para asegurar que las opciones estén listas
        $('#subcategoria option').each(function() {
            if ($(this).text() === subcategoria) {
                $(this).prop('selected', true);
                return false; // Salir del loop
            }
        });
    }, 100); // Pequeño retraso para que jQuery termine de actualizar el DOM
}


$(document).ready(function () {
    $("#input_imagen").change(function (event) {
        let archivo = event.target.files[0]; // Obtiene el archivo seleccionado
        if (archivo) {
            let reader = new FileReader(); // Permite leer el archivo
            reader.onload = function (e) {
                $("#imagen_producto").attr("src", e.target.result); // Muestra la imagen
            };
            reader.readAsDataURL(archivo); // Convierte el archivo en base64
        }
    });
});

