
  $('#formReporte').on('submit', function (e) {
    e.preventDefault();

    const formData = $('#formReporte').serializeArray();

    

    if (fechaInicio > fechaFin) {
      Swal.fire('Fechas inválidas', 'La fecha de inicio no puede ser mayor que la fecha final.', 'warning');
      return;
    }

    $.ajax({
      url: '../../../ajax/reporte-serv.php?op=entradasSalidas',
      method: 'POST',
      data: $.param(formData),
      success: function (response) {
        if (response === 'ok') {
          $('#modalReporte').modal('hide');
          window.open('./../../../pdfReporte/reporte_pdf.php', '_blank');
        } else {
          Swal.fire('Sin registros', 'No se encontraron movimientos en ese rango de fechas.', 'info');
        }
      },
      error: function () {
        Swal.fire('Error', 'Hubo un problema al generar el reporte.', 'error');
      }
    });
  });

  $.ajax({
    url: '../../../ajax/lotes-serv.php?op=listarproductos',
    method: 'POST',
    contentType: false,
    processData: false,
    success: function (data) {
      const nombres = JSON.parse(data);
      window.listaProductos = nombres;
      const $select = $('#nombreProducto');
      $select.empty();
      $select.append('<option></option>');

      nombres.forEach(function (obj) {
        $select.append(`<option value="${obj.producto}">${obj.producto}</option>`);
      });

      $select.select2({
        placeholder: "Seleccione un producto",
        allowClear: true,
        width: '100%'
      });
    },
    error: function (xhr, status, error) {
      console.error('Error al cargar productos:', error);
    }
  });


