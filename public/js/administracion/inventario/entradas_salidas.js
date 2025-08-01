$('#formReporte').on('submit', function (e) {
  e.preventDefault();

  const fechaInicio = $('#fechaInicio').val();
  const fechaFin = $('#fechaFin').val();

  if (fechaInicio > fechaFin) {
    Swal.fire('Fechas inválidas', 'La fecha de inicio no puede ser mayor que la fecha final.', 'warning');
    return;
  }

  $.ajax({
    
    url: '../../../ajax/reporte-serv.php?op=entradasSalidas',
    method: 'POST',
    data: { fechaInicio, fechaFin },
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
