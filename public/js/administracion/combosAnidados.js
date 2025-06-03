$(document).ready(function () {
  $.ajax({
    
    url: '../../../ajax/catalogo-serv.php?op=categorias',
    type: 'POST',
    processData: false,
    contentType: false,
    success: function (respuesta) {
      let data = JSON.parse(respuesta);
      let $categoria = $('#categoria');
      $categoria.empty();
      $categoria.append('<option value="" disabled selected>Seleccione una categoría</option>');
      data.forEach(function (item) {
        $categoria.append(`<option value="${item.categoria_id}">${item.nombre}</option>`);
      });
    },
    error: function (xhr, status, error) {
      console.error('Error al cargar categorías: ' + error);
    }
  });
});


$('#categoria').on('change', function () {
  let formulario = new FormData();
  formulario.append('categoria_id', $(this).val());

  $.ajax({
    url: '../../../ajax/catalogo-serv.php?op=subcategorias',
    type: 'POST',
    data: formulario,
    contentType: false,
    processData: false,
    beforeSend: function () {
      console.log('Enviando datos...');
    },
    success: function (respuesta) {
      let data = JSON.parse(respuesta);
      let $subcategoria = $('#subcategoria');
      $subcategoria.empty();
      $subcategoria.append('<option value="" disabled selected>Seleccione una subcategoría</option>');
      data.forEach(function (item) {
        $subcategoria.append(`<option value="${item.categoria_id}">${item.nombre}</option>`);
      });
    },
    error: function (xhr, status, error) {
      console.error('Error al cargar subcategorías: ' + error);
    }
  });
});
