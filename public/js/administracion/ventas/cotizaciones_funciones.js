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
                <input type="number" class="form-control form-control-sm precio_final" min="0" step="0.01"
                  name="precio_final_${index}" placeholder="Ej: 25.00"
                  data-precio="${item.precio}" data-cantidad="${item.cantidad}">
              </td>
            </tr>
          `;
        });

        tabla += `
              </tbody>
            </table>
          </div>
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
  // Aquí recolectarás datos, generarás PDF y enviarás correo
  alert("Función de envío en desarrollo...");
}

function mostrarDetalleConfirmacion(id, correo) {
  correo = decodeURIComponent(correo);

  $.ajax({
    url: '../../../ajax/cotizacion-serv.php?op=listarDetalle',
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
                <th>Producto</th><th>Cantidad</th><th>Precio</th>
              </tr>
            </thead>
            <tbody>
      `;

      detalle.forEach(d => {
        contenido += `
          <tr>
            <td>${d.producto}</td>
            <td>${d.cantidad}</td>
            <td>$${d.precio}</td>
          </tr>`;
      });

      contenido += `</tbody></table></div>
      <h5>Datos del cliente</h5>
      <form id="form-confirmacion">
        <input type="hidden" id="cotizacion_id" value="${id}">
        <div class="mb-2"><label class="form-label">Nombre / Razón Social</label>
          <input type="text" class="form-control" id="nombre" required>
        </div>
        <div class="mb-2"><label class="form-label">Cédula o RUC</label>
          <input type="text" class="form-control" id="identificacion" required>
        </div>
        <div class="mb-2"><label class="form-label">Dirección</label>
          <input type="text" class="form-control" id="direccion" required>
        </div>
        <div class="mb-2"><label class="form-label">Correo</label>
          <input type="email" class="form-control" id="correo" value="${correo}" required>
        </div>
        <div class="mb-2"><label class="form-label">Teléfono</label>
          <input type="text" class="form-control" id="telefono" required>
        </div>
      </form>
      `;

      $('#detalle-modal-body').html(contenido);
      const modal = new bootstrap.Modal(document.getElementById('modalDetalle'));
      modal.show();
    }
  });
}

function enviarCotizacion() {
  const datos = {
    cotizacion_id: $('#cotizacion_id').val(),
    nombre: $('#nombre').val(),
    identificacion: $('#identificacion').val(),
    direccion: $('#direccion').val(),
    correo: $('#correo').val(),
    telefono: $('#telefono').val()
  };

  if (Object.values(datos).some(v => !v.trim())) {
    alert('Completa todos los campos');
    return;
  }

  $.ajax({
    url: '../../../ajax/cotizacion-serv.php?op=confirmarVenta',
    method: 'POST',
    data: datos,
    success: () => {
      alert('Venta confirmada correctamente');
      $('#modalDetalle').modal('hide');
      cargarCotizaciones('../../../ajax/cotizacion-serv.php?op=listarPendientes', '#cotizaciones-container', 'mostrarDetalleConfirmacion');
    },
    error: () => alert('Error al confirmar venta')
  });
}


function mostrarDetalleVendida(id, correo) {
  correo = decodeURIComponent(correo);

  $.ajax({
    url: '../../../ajax/cotizacion-serv.php?op=detalleVenta',
    method: 'POST',
    data: { id },
    success: function (data) {
      const venta = JSON.parse(data);
      if (!venta || !venta.productos) return;

      let tabla = `
        <div class="table-responsive mb-3">
          <table class="table table-bordered">
            <thead class="table-light">
              <tr><th>Producto</th><th>Cantidad</th><th>Precio unitario</th><th>Total</th></tr>
            </thead>
            <tbody>
      `;

      venta.productos.forEach(prod => {
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
          <li><strong>Nombre:</strong> ${venta.cliente.nombre}</li>
          <li><strong>Cédula/RUC:</strong> ${venta.cliente.identificacion}</li>
          <li><strong>Correo:</strong> ${venta.cliente.correo}</li>
          <li><strong>Dirección:</strong> ${venta.cliente.direccion}</li>
          <li><strong>Teléfono:</strong> ${venta.cliente.telefono}</li>
        </ul>
      `;

      $('#detalle-modal-body').html(tabla);
      new bootstrap.Modal(document.getElementById('modalDetalle')).show();
    }
  });
}

