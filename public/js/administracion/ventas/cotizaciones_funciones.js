function cargarCotizaciones(url, containerId, botonCallback) {
  const $container = $(containerId);
  $container.empty();

  $.ajax({
    url: url,
    method: 'POST',
    contentType: false,
    processData: false,
    success: function (data) {
      const cotizaciones = JSON.parse(data);

      cotizaciones.forEach(cot => {
        const card = `
          <div class="card shadow-sm">
            <div class="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
              <div>
                <h5 class="card-title mb-1">Cotización #${cot.cotizacion_id}</h5>
                <p class="card-text mb-0">${cot.productos_solicitados}</p>
                <p class="card-text text-muted mb-0"><small>${cot.correo}</small></p>
              </div>
              <button class="btn btn-primary mt-2 mt-md-0"
                onclick="${botonCallback}(${cot.cotizacion_id}, '${encodeURIComponent(cot.correo)}')">
                Revisar
              </button>
            </div>
          </div> 
        `;
        $container.append(card);
      });
    },
    error: function () {
      console.error('Error al cargar cotizaciones');
    }
  });
}



function abrirDetalle(id, email) {
  email = decodeURIComponent(email);
  $(document).ready(function () {
    $.ajax({
      url: '../../../ajax/cotizacion-serv.php?op=listarDetalle',
      method: 'POST',
      data: { id: id },
      success: function (data) {
        const detalle = JSON.parse(data);

        if (!detalle) return;

        let tabla = `
          <div class="table-responsive">
            <table class="table table-bordered align-middle">
              <thead class="table-light">
                <tr>
                  <th>Producto</th>
                  <th>Cantidad solicitada</th>
                  <th>Stock disponible</th>
                  <th>Precio de compra</th>
                  <th>Precio final (unidad)</th>
                </tr>
              </thead>
              <tbody>
        `;

        detalle.forEach((item, index) => {
          tabla += `
            <tr>
              <td>${item.producto}</td>
              <td>${item.cantidad}</td>
              <td>${item.stock}</td>
              <td>$${item.precio}</td>
              <td>
                <input type="text" class="form-control form-control-sm precio_final solo-decimales" min="0" step="0.01"
                  name="precio_final_${index}" placeholder="Ej: 25.00"
                  data-precio="${item.precio}" data-cantidad="${item.cantidad}">
                  <input type="hidden" name="detalle_id_${index}" value="${item.id}">
               </td>
            </tr>
          `;
        });

        tabla += `
              </tbody>
            </table>
          </div>
          <input type="hidden" id="cotizacion_id_oculto" value="${id}">
          <div class="mt-3">
            <label class="form-label">Correo electrónico del cliente:</label>
            <div id="correo"><strong>${email}</strong></div>
          </div>
        `;

        $('#detalle-modal-body').html(tabla);

        // Para cada input precio_final calculamos precio sugerido
        $('.precio_final').each(function () {
          const $input = $(this);
          const precioBase = parseFloat($input.data('precio'));
          const cantidad = parseInt($input.data('cantidad'));

          $.ajax({
            url: '../../../ajax/umbral-serv.php?op=obtenerUmbral',
            method: 'POST',
            data: { cantidad: cantidad },
            dataType: 'json',
            success: function (umbral) {
              const costo = precioBase;
              const margen = (parseFloat(umbral.ganancia) || 0) / 100; // ej. 0.35
              const descuento = (parseFloat(umbral.descuento) || 0) / 100; // ej. 0.25

              let precioSugerido = costo + (costo * margen * (1 - descuento));


              // No permitir que precio sugerido sea menor que el precio base (costo)
              if (precioSugerido < precioBase) {
                precioSugerido = precioBase;
              }
              console.log('margen:', margen, 'descuento:', descuento, 'precioBase:', precioBase);

              $input.val(precioSugerido.toFixed(2));
            },
            error: function () {
              // Si hay error, simplemente pone el precio base
              $input.val(precioBase.toFixed(2));
            }
          });
        });

        const modal = new bootstrap.Modal(document.getElementById('modalDetalle'));
        modal.show();
      },
      error: function (xhr, status, error) {
        console.error('Error al cargar productos:', error);
      }
    });
  });
}


function enviarCotizacion() {
  const productos = [];
  let errores = [];

  $('#detalle-modal-body table tbody tr').each(function (i) {
    const $fila = $(this);
    const nombre = $fila.find('td:eq(0)').text();
    const cantidad = parseInt($fila.find('td:eq(1)').text());
    const stock = parseInt($fila.find('td:eq(2)').text());
    const precioBase = parseFloat($fila.find('input.precio_final').data('precio'));
    const precioFinalStr = $fila.find('input.precio_final').val();
    const precioFinal = parseFloat(precioFinalStr);
    const detalleId = $fila.find('input[type="hidden"]').val();


    // Validaciones
    if (precioFinalStr.trim() === '') {
      $fila.addClass('table-danger');
      errores.push(`El precio del producto "${nombre}" no puede estar vacío.`);
    } else if (isNaN(precioFinal)) {
      $fila.addClass('table-danger');
      errores.push(`El precio del producto "${nombre}" no es válido.`);
    } else if (precioFinal <= 0) {
      $fila.addClass('table-danger');
      errores.push(`El precio del producto "${nombre}" debe ser mayor que cero.`);
    } else if (precioFinal < precioBase) {
      $fila.addClass('table-danger');
      errores.push(`El precio del producto "${nombre}" no puede ser menor al precio de compra ($${precioBase.toFixed(2)}).`);
    } else if (precioFinal > precioBase * 5) {
      $fila.addClass('table-danger');
      errores.push(`El precio del producto "${nombre}" parece demasiado alto. Verifique el valor ingresado.`);
    }

    if (cantidad > stock) {
      $fila.addClass('table-danger');
      errores.push(`No hay suficiente stock para el producto "${nombre}". Solicitado: ${cantidad}, disponible: ${stock}.`);
    }

    const subtotal = (cantidad * precioFinal).toFixed(2);
    productos.push({
      producto: nombre,
      cantidad: cantidad,
      precio_final: precioFinal,
      subtotal: parseFloat(subtotal),
      id: detalleId
    });
  });

  if (errores.length > 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Errores en los precios',
      html: '<ul style="text-align:left;">' + errores.map(e => `<li>${e}</li>`).join('') + '</ul>'
    });
    return;
  }

  const email = $('#correo').text().trim();
  const cotizacionId = $('#cotizacion_id_oculto').val();
  // Confirmar antes de enviar
  Swal.fire({
    title: '¿Enviar cotización?',
    text: "Se enviará la cotización al cliente.",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#28a745',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, enviar'
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: '../../../ajax/cotizacion-serv.php?op=enviarCotizacion',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          correo: email,
          asunto: 'Cotización solicitada',
          cotizacion_id: cotizacionId,
          productos: productos
        }),
        success: function (response) {
          const r = JSON.parse(response);
          if (r.success) {
            Swal.fire('Éxito', 'La cotización fue enviada correctamente.', 'success');
          } else {
            Swal.fire('Error', 'No se pudo enviar el correo: ' + r.error, 'error');
          }
        },
        error: function () {
          Swal.fire('Error', 'Falló la conexión con el servidor.', 'error');
        }
      });

    }
  });
}


function mostrarDetalleConfirmacion(id, correo) {
  correo = decodeURIComponent(correo);

  $.ajax({
    url: '../../../ajax/cotizacion-serv.php?op=listarDetalleEnviado',
    method: 'POST',
    data: { id },
    success: function (data) {
      const detalle = JSON.parse(data);
      if (!detalle) return;

      let contenido = `
        <div class="table-responsive mb-3">
          <table class="table table-bordered">
            <thead class="table-light">
              <tr>
                <th>Producto</th><th>Cantidad</th><th>Stock disponible</th><th>Precio</th><th>Total</th>
              </tr>
            </thead>
            <tbody>
      `;

      detalle.forEach(d => {
        contenido += `
          <tr>
            <td>${d.producto}</td>
            <td>${d.cantidad}</td>
            <td>${d.stock}</td>
            <td>$${d.precio}</td>           
            <td>$${d.total}</td>
          </tr>`;
      });

      contenido += `</tbody></table></div>
      <h5>Datos del cliente</h5>
      <form id="form-confirmacion">
        <input type="hidden" id="cotizacion_id" value="${id}">
        <div class="mb-2"><label class="form-label">Nombre</label>
          <input type="text" class="form-control" id="nombre" required>
        </div>
        <div class="mb-2"><label class="form-label">Cédula</label>
          <input type="text" class="form-control solo-numeros" id="identificacion" required>
        </div>
        <div class="mb-2"><label class="form-label">Dirección</label>
          <input type="text" class="form-control" id="direccion" required>
        </div>
        <div class="mb-2"><label class="form-label">Correo</label>
          <input type="email" class="form-control" id="correo" value="${correo}" required>
        </div>
        <div class="mb-2"><label class="form-label">Teléfono</label>
          <input type="text" class="form-control solo-numeros" id="telefono" required>
        </div>
      </form>
      `;

      $('#detalle-modal-body').html(contenido);
      const modal = new bootstrap.Modal(document.getElementById('modalDetalle'));
      modal.show();
    }
  });
}

function confirmarventa() {
  const errores = [];

  const nombre = $('#nombre').val().trim();
  const identificacion = $('#identificacion').val().trim();
  const direccion = $('#direccion').val().trim();
  const correo = $('#correo').val().trim();
  const telefono = $('#telefono').val().trim();
  const cotizacionId = $('#cotizacion_id').val();

  // Validaciones básicas
  if (nombre === '') {
    errores.push('El nombre o razón social no puede estar vacío.');
  }
  if (identificacion === '') {
    errores.push('La cédula no puede estar vacía.');
  } else if (!/^\d{10,13}$/.test(identificacion)) {
    errores.push('La cédula debe tener entre 10 y 10 dígitos');
  }
  if (direccion === '') {
    errores.push('La dirección no puede estar vacía.');
  }
  if (correo === '') {
    errores.push('El correo no puede estar vacío.');
  } else if (!/^\S+@\S+\.\S+$/.test(correo)) {
    errores.push('El formato del correo no es válido.');
  }
  if (telefono === '') {
    errores.push('El teléfono no puede estar vacío.');
  } else if (!/^\d{10}$/.test(telefono)) {
    errores.push('El teléfono debe tener 10 dígitos.');

  }
  $('#detalle-modal-body table tbody tr').each(function () {
    const $fila = $(this);
    const nombreProducto = $fila.find('td:eq(0)').text().trim();
    const cantidad = parseInt($fila.find('td:eq(1)').text());
    const stock = parseInt($fila.find('td:eq(2)').text());

    if (cantidad > stock) {
      $fila.addClass('table-danger');
      errores.push(`No hay suficiente stock para el producto "${nombreProducto}". Solicitado: ${cantidad}, disponible: ${stock}.`);
    }
  });
  if (errores.length > 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Errores en los datos del cliente',
      html: '<ul style="text-align:left;">' + errores.map(e => `<li>${e}</li>`).join('') + '</ul>'
    });
    return;
  }

  // Enviar datos por AJAX
  $.ajax({
    url: '../../../ajax/cotizacion-serv.php?op=confirmarVenta',
    method: 'POST',
    data: {
      cotizacion_id: cotizacionId,
      nombre: nombre,
      identificacion: identificacion,
      direccion: direccion,
      correo: correo,
      telefono: telefono
    },
    success: function (response) {
      const r = JSON.parse(response);
      if (r.status === 'ok') {
        Swal.fire('Éxito', r.message, 'success');
        location.reload();
      } else {
        Swal.fire('Error', r.message, 'error');
      }
    },
    error: function () {
      Swal.fire('Error', 'Falló la conexión con el servidor.', 'error');
    }
  });
}


function mostrarDetalleVendida(id, correo) {
  correo = decodeURIComponent(correo);

  $.ajax({
    url: '../../../ajax/cotizacion-serv.php?op=listarDetalleVendido',
    method: 'POST',
    data: { id },
    success: function (data) {
      const venta = JSON.parse(data);
      const productos = venta.detalles;
      const cliente = venta.cliente;

      let tabla = `
        <div class="table-responsive mb-3">
          <table class="table table-bordered">
            <thead class="table-light">
              <tr><th>Producto</th><th>Cantidad</th><th>Precio unitario</th><th>Total</th></tr>
            </thead>
            <tbody>
      `;

      productos.forEach(prod => {
        const total = (prod.precio * prod.cantidad).toFixed(2);
        tabla += `
          <tr>
            <td>${prod.producto}</td>
            <td>${prod.cantidad}</td>
            <td>$${prod.precio}</td>
            <td>$${total}</td>
          </tr>`;
      });

      tabla += `
            </tbody>
          </table>
        </div>
        <h5>Datos del cliente</h5>
        <ul>
          <li><strong>Nombre:</strong> ${cliente.nombre}</li>
          <li><strong>Cédula:</strong> ${cliente.cedula ?? 'No disponible'}</li>
          <li><strong>Correo:</strong> ${cliente.correo}</li>
          <li><strong>Dirección:</strong> ${cliente.direccion}</li>
          <li><strong>Teléfono:</strong> ${cliente.telefono}</li>
        </ul>
      `;

      $('#detalle-modal-body').html(tabla);
      new bootstrap.Modal(document.getElementById('modalDetalle')).show();
    },
    error: function (xhr, status, error) {
      console.error("Error al cargar detalle vendido:", error);
      console.log(xhr.responseText);
    }
  });
}


