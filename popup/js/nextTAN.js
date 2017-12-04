$(document).ready(function() {
    navigator.geolocation.getCurrentPosition(function(position) {
        lat = ('' + position.coords.latitude).replace('.', ',');
        long = ('' + position.coords.longitude).replace('.', ',');
        alert('http://open_preprod.tan.fr/ewp/arrets.json/' + lat + '/' + long);
        $.getJSON('http://open_preprod.tan.fr/ewp/arrets.json/' + lat + '/' + long).done(function(data) {
            $.each(data, function(i, field) {
                var option = '<option data-value="' + field.codeLieu + '" value="' + field.libelle + '">';
                $('#arret').append(option);
            })
        })
    });
});
