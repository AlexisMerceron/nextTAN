$(document).ready(function() {
    function getHoraires(code) {
        var lignes = [];
        $.getJSON('http://open_preprod.tan.fr/ewp/tempsattente.json/' + code).done(function(data) {
            $.each(data, function(i, field) {
                var option = '<option value="' + field.libelle + '">';
                
            })
        })
    }

    $('#choix_arret').on('input', function() {
        var val = document.getElementById("choix_arret").value;
        var opts = document.getElementById('arret').childNodes;
        for (var i = 0; i < opts.length; i++) {
            if (opts[i].value === val) {
                var code = opts[i].getAttribute('data-value');
                break;
            }
        }
    });

    navigator.geolocation.getCurrentPosition(function(position) {
        lat = ('' + position.coords.latitude).replace('.', ',');
        long = ('' + position.coords.longitude).replace('.', ',');
        $.getJSON('http://open_preprod.tan.fr/ewp/arrets.json/' + lat + '/' + long).done(function(data) {
            $.each(data, function(i, field) {
                var option = '<option data-value="' + field.codeLieu + '" value="' + field.libelle + '">';
                $('#arret').append(option);
            })
        })
    });
});
