$('#formularioCorreo').submit(function(e) {
    e.preventDefault();
    $.ajax({
        url: './../../../ajax/correos-serv.php',
        method: 'POST',
        data: $(this).serialize(),
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                
            } else {
                alert('Error: ' + response.error);
            }
        }
    });
});
