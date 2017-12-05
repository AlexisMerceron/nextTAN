'use strict';

$(document).ready(function() {

    // Récupération des prochains départs
    function getHoraires(code){
        var depart =[];
        var d = new Date();
        $.getJSON('http://open_preprod.tan.fr/ewp/tempsattente.json/' + code).done(function(data) {
            $.each(data, function(i, depart) {
                var next = depart.temps;
                if (!isNaN(parseFloat(depart.temps))){
                  var min = parseInt(depart.temps.replace(' mn',''));
                  next = new Date(d.getTime() + (min * 60000));
                }
                $('#list').append('<li>'+next+'</li>');
            })
        })
    };

    // Détect le choix de la ligne et génération de la liste des prochains départs
    $('#choix_ligne').on('input',function(){
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

    // Récupération des ligne passant par l'arret (code)
    function getLines(code) {
        var lignes = [];
        var arrets = [];
        var terminus = [];
        $('#ligne').empty()
        $.getJSON('http://open_preprod.tan.fr/ewp/tempsattente.json/' + code).done(function(data) {
            $.each(data, function(i, ligne) {
                if (arrets.indexOf(ligne.arret.codeArret) === -1) {
                    lignes.push(ligne.ligne.numLigne);
                    arrets.push(ligne.arret.codeArret);
                    terminus.push([ligne.terminus]);
                }
                else {
                    if (terminus[arrets.indexOf(ligne.arret.codeArret)].indexOf(ligne.terminus) === -1) {
                        terminus[arrets.indexOf(ligne.arret.codeArret)].push(ligne.terminus);
                    }
                }
            });
            $.each(arrets, function(i, arret) {
                var option = '<option data-value="' + arret + '" value="' + lignes[i] + ' - ';
                $.each(terminus[arrets.indexOf(arret)], function(i, term) {
                    option += term + ' / ';
                });
                option = option.slice(0, -3) + '">';
                $('#ligne').append(option);
            });
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
