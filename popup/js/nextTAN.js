$(document).ready(function() {
    var arrets = [];
    $.getJSON('http://open_preprod.tan.fr/ewp/arrets.json').done(function(data) {
        $.each(data, function(i, field) {
            arrets.push(field.libelle);
            console.log(field.libelle)
        })
    }).then(function() {
        $("#tags").autocomplete({
            source: arrets
        });
    });
});
