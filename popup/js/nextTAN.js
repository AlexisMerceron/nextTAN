'use strict';

$(document).ready(function() {
    function getHoraires(code) {
        var arrets = [];
        $.getJSON('http://open_preprod.tan.fr/ewp/tempsattente.json/' + code).done(function(data) {
            $.each(data, function(i, ligne) {
                if (arrets.indexOf(ligne.arret.codeArret) === -1) {
                    var option = '<option data-value="' + ligne.arret.codeArret + '" value="' + ligne.ligne.numLigne + ' - ' + ligne.terminus + '">';
                    $('#ligne').append(option);
                    arrets.push(ligne.arret.codeArret);
                }
            })
        })
    }

    $('#choix_arret').on('input', function() {
        var val = document.getElementById("choix_arret").value;
        var opts = document.getElementById('arret').childNodes;
        for (var i = 0; i < opts.length; i++) {
            if (opts[i].value === val) {
                var code = opts[i].getAttribute('data-value');
                getHoraires(code);
                break;
            }
        }
    });

    navigator.geolocation.getCurrentPosition(function(position) {
        var lat = ('' + position.coords.latitude).replace('.', ',');
        var long = ('' + position.coords.longitude).replace('.', ',');
        $.getJSON('http://open_preprod.tan.fr/ewp/arrets.json/' + lat + '/' + long).done(function(data) {
            $.each(data, function(i, field) {
                var option = '<option data-value="' + field.codeLieu + '" value="' + field.libelle + '">';
                $('#arret').append(option);
            })
        })
    });
});
