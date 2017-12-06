'use strict';

$(document).ready(function() {

    // Récupération des prochains départs
    function getHoraires(code) {
        var depart = [];
        var d = new Date();
        $.getJSON('http://open_preprod.tan.fr/ewp/tempsattente.json/' + code).done(function(data) {
            $.each(data, function(i, depart) {
                var next = depart.temps;
                if (!isNaN(parseFloat(depart.temps))) {
                    var min = parseInt(depart.temps.replace(' mn', ''));
                    next = new Date(d.getTime() + (min * 60000));
                }
                $('#list').append('<li>' + next.getHours() + ':' + next.getMinutes() + ' (' + depart.temps + ')' + '</li>');
            })
        })
    };

    // Détect le choix de la ligne et génération de la liste des prochains départs
    $('#choix_ligne').on('input', function() {
        var val = document.getElementById("choix_ligne").value
        var opts = document.getElementById('ligne').childNodes;
        for (var i = 0; i < opts.length; i++) {
            if (opts[i].value === val) {
                var code = opts[i].getAttribute('data-value');
                getHoraires(code);
                break;
            }
        }
    });

    function getLines(code) {
        var lignes = {};
        $('#ligne').empty()
        $.getJSON('http://open_preprod.tan.fr/ewp/tempsattente.json/' + code).done(function(data) {
            $.each(data, function(i, ligne) {
                if (!(ligne.arret.codeArret in lignes)) {
                    var obj = new Object();
                    obj.ligne = ligne.ligne.numLigne;
                    obj.terminus = [ligne.terminus];
                    lignes[ligne.arret.codeArret] = obj;
                } else {
                    if (lignes[ligne.arret.codeArret].terminus.indexOf(ligne.terminus) === -1) {
                        lignes[ligne.arret.codeArret].terminus.push(ligne.terminus);
                    }
                }
            });
            for (var ligne in lignes) {
                var option = '<option data-value="' + ligne + '" value="' + lignes[ligne].ligne + ' - ';
                $.each(lignes[ligne].terminus, function(i, term) {
                    option += term + ' / ';
                });
                option = option.slice(0, -3) + '">';
                console.log(option);
                $('#ligne').append(option);
            }

            var unordered_options = $("#ligne option");
            unordered_options.sort(function(a, b) {
                if (a.value > b.value) return 1;
                if (a.value < b.value) return -1;
                return 0;
            })
            $("#ligne").empty().append(unordered_options);
        });
    }

    // Détect le choix de l'arret et génération de la liste des lignes passant par cet arret
    $('#choix_arret').on('input', function() {
        var val = document.getElementById("choix_arret").value;
        var opts = document.getElementById('arret').childNodes;
        for (var i = 0; i < opts.length; i++) {
            if (opts[i].value === val) {
                var code = opts[i].getAttribute('data-value');
                getLines(code);
                break;
            }
        }
    });

    // Création de la liste des arrêts à moins de 500 m de l'utilisateur
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
