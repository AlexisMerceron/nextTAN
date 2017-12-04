/*var req = new Request('http://open_preprod.tan.fr/ewp/arrets.json');
fetch(req).then(function(res) {
    console.log(res);
});
*/
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
        function(position) {
                console.log(position.coords.latitude, position.coords.longitude);
        }
  );
  
} else {
  console.log("coucou");
}
