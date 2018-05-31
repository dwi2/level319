var COUNTY_URL = 'https://raw.githubusercontent.com/ronnywang/twgeojson/master/twcounty2010.json';
var TOWN_URL = 'https://raw.githubusercontent.com/ronnywang/twgeojson/master/twtown2010.json';

var map = L.map('map').setView([23.6, 121], 8);;
var layer = L.geoJSON().addTo(map);

// TODO: GeoJSON data is quite big, we need a loading indicator!
fetch(COUNTY_URL).then((response) => {
    if (!response.ok) {
        // TODO: display error screen
    }
    return response.json();
}).then((feature) => {
    layer.addData(feature);
});