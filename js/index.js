import { geoJsonURLs } from './constant';
import { styles } from './styles';

var currentLayerId;

var eventHandlers = {
    click: (event) => {
        if (currentLayerId !== undefined && currentLayerId !== event.target._leaflet_id) {
            var lastLayer = geojson.getLayer(currentLayerId);
            geojson.resetStyle(lastLayer);
        }

        event.target.setStyle(styles.click);
        currentLayerId = event.target._leaflet_id;
    },
    mouseover: (event) => {
        event.target.setStyle(styles.hover);
    },
    mouseout: (event) => {
        var id = event.target._leaflet_id;
        if (id !== currentLayerId) {
            geojson.resetStyle(event.target);
        }
    }
};

var map = L.map('map', {
    preferCanvas: true
}).setView([23.6, 121], 8);;
var geojson = L.geoJSON(null, {
    onEachFeature: (feature, layer) => {
        layer.on(eventHandlers);
    },
    style: styles.default
}).addTo(map);

// TODO: GeoJSON data is quite big, we need a loading indicator!
fetch(geoJsonURLs.county.small).then((response) => {
    if (!response.ok) {
        // TODO: display error screen
    }
    return response.json();
}).then((feature) => {
    geojson.addData(feature);
});