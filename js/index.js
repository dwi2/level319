import { geoJsonURLs } from './constant';

var styles = {
    hover: {
        weight: 6,
        color: '#000',
        opacity: 0
    },
    click: {
        weight: 6,
        color: '#000',
        opacity: 0,
        fillOpacity: 0.5
    },
    default: {
        weight: 2
    }
}

var eventHandlers = {
    click: (event) => {
        event.target.setStyle(styles.click);
    },
    mouseover: (event) => {
        event.target.setStyle(styles.hover);
    },
    mouseout: (event) => {
        geojson.resetStyle(event.target);
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