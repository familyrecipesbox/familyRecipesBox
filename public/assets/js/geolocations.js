//Geo locations code
//Nearby grocery or super market stores in radius 2000

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {

    var latlon = position.coords.latitude + "," + position.coords.longitude;

    var myLatLng = { lat: position.coords.latitude, lng: position.coords.longitude };

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: myLatLng
    });

    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'You are here!'
    });

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyD6nGAQs7IK04Sf-TqRpmQKWBmUEYXBMck&location=" + latlon + "&radius=2000&type=grocery_or_supermarket",
        "method": "GET"
    }

    $.ajax(settings).done(function (response) {
        console.log(response);
        response.results.forEach(function (location) {


            myLatLng = { lat: location.geometry.location.lat, lng: location.geometry.location.lng }
            marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                title: location.name,
                icon: pinSymbol("green")
            });
        });
    });

}

function pinSymbol(color) {
    return {
        path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
        fillColor: color,
        fillOpacity: 1,
        strokeColor: '#000',
        strokeWeight: 2,
        scale: 1,
   };
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred."
            break;
    }
}
