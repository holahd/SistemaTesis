
$(document).ready(function () {
  const $container = $('#cotizaciones-container');

  $(document).ready(function () {
    $.ajax({
      url: '../../../ajax/cotizacion-serv.php?op=listarPendientes',
      method: 'POST',
      contentType: false,
      processData: false,
      success: function (data) {
        const cotizacion = JSON.parse(data);


        cotizacion.forEach(cot => {
          const card = `
        <div class="card shadow-sm">
         <div class="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
             <h5 class="card-title mb-1">Cotización #${cot.cotizacion_id}</h5>
             <p class="card-text mb-0">${cot.productos_solicitados}</p>
             <p class="card-text text-muted mb-0"><small>${cot.correo}</small></p>
           </div>
           <button class="btn btn-primary mt-2 mt-md-0" onclick="abrirDetalle(${cot.cotizacion_id}, '${encodeURIComponent(cot.correo)}')">Revisar</button>
          </div>
         </div>
        `;
          $container.append(card);
        });



      },
      error: function (xhr, status, error) {
        console.error('Error al cargar productos:', error);
      }
    });
  });


});

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
          <input type="number" class="form-control form-control-sm" min="0" step="0.01"
            name="precio_final_${index}" placeholder="Ej: 25.00">
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

