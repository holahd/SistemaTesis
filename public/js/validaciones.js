// Solo números enteros
$(document).on("input", ".solo-numeros", function () {
  const original = $(this).val();
  const soloNumeros = original.replace(/[^\d]/g, "");

  if (original !== soloNumeros) {
    $(this).val(soloNumeros);
    mostrarAdvertencia(this, "Solo se permiten números enteros");
  }
});

function esEmailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Solo decimales con punto
$(document).on("input", ".solo-decimales", function () {
  const original = $(this).val();
  
  // Elimina cualquier caracter que no sea número o punto
  let limpio = original.replace(/[^0-9.]/g, '');

  // Asegura que solo haya un punto
  const partes = limpio.split('.');
  if (partes.length > 2) {
    limpio = partes[0] + '.' + partes[1];
    mostrarAdvertencia(this, "Solo se permite un punto decimal");
  }

  // Limita a 2 decimales
  if (partes.length === 2 && partes[1].length > 2) {
    partes[1] = partes[1].slice(0, 2);
    limpio = partes[0] + '.' + partes[1];
    mostrarAdvertencia(this, "Solo se permiten 2 decimales");
  }

  if (original !== limpio) {
    $(this).val(limpio);
  }
});


function mostrarAdvertencia(input, mensaje) {
  const $input = $(input);
  
  if (!$input.next(".aviso-numero").length) {
    const $aviso = $("<div>")
      .addClass("text-danger aviso-numero small")
      .text(mensaje)
      .css({ "margin-top": "3px", "font-size": "0.8em" });

    $input.after($aviso);

    setTimeout(() => {
      $aviso.fadeOut(300, function () {
        $(this).remove();
      });
    }, 2000);
  }
}
