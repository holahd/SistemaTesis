$('#registroProducto').submit(function (e) {
  e.preventDefault();

  const nombre = $('#nombre').val().trim();
  localStorage.setItem('nombreProducto', nombre);
  

  var formulario = new FormData(this);


  $.ajax({
    url: '../../../ajax/catalogo-serv.php?op=registrarProducto',
    type: 'POST',
    data: formulario,
    contentType: false,
    processData: false,
    beforeSend: function () {
      console.log('Enviando datos...');
    },
    success: function (respuesta) {

      respuesta = JSON.parse(respuesta);


      if (respuesta.tipo === 1) {
        $('#registroProducto').trigger('reset');
        
        
        
       

        swal.fire({
          title: 'Producto registrado correctamente',
          icon: 'success',
          text: 'Desea registrar un lote para este producto?',
          showCancelButton: true,
          confirmButtonText: 'Sí, registrar lote',
          cancelButtonText: 'No, gracias'
        }).then((result) => {
          if (result.isConfirmed) {

            // guardar el nombre del producto en el localStorage


            window.location.href = '../../../vista/administracion/inventario/registrar_lote.php';
          }
        });

      } else {
        swal.fire({
          title: 'Error',
          text: 'Error: ' + respuesta.mensaje,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }

    },
    error: function (xhr, status, error) {
      console.error('Error: ' + error);
    }

  });
});


$(document).ready(function () {

  if ($('#reg_productos').length > 0)
    document.getElementById('foto').addEventListener('change', function () {
      const file = this.files[0];
      const maxSize = 2 * 1024 * 1024;

      if (file && file.size > maxSize) {
        swal.fire({
          title: 'Error',
          text: 'El archivo es demasiado grande. El tamaño máximo permitido es 2 MB.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        this.value = '';
      } else {

      }

    });


});

document.getElementById('ficha_pdf').addEventListener('change', function () {
    const archivo = this.files[0];

    if (archivo && archivo.size > 2 * 1024 * 1024) { // 2MB
        swal.fire({
            title: 'Error',
            text: 'El archivo PDF no puede ser mayor a 2MB.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        this.value = ''; // Limpia el campo
    }
});

