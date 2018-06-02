import { geoJsonURLs } from './constant';
import { styles } from './styles';

let currentLayerId;
window.levels = {};

let map = L.map('map', {
    preferCanvas: true
}).setView([23.6, 121], 8);

let popup = L.popup();

let eventHandlers = {
    click: (event) => {
        let layer = event.target;
        if (currentLayerId !== undefined && currentLayerId !== layer._leaflet_id) {
            let currentLayer = geojson.getLayer(currentLayerId);
            let styleName = getStatusById(currentLayer.feature.properties.county_id);
            currentLayer.setStyle(styles[styleName]);
        }
        // layer.setStyle(styles.click);
        currentLayerId = layer._leaflet_id;

        let center = layer.getCenter();
        let properties = layer.feature.properties;
        popup.setLatLng(center).setContent(`<h1>${properties.county}</h1>`);
        popup.openOn(map);
    },
    mouseover: (event) => {
        let layer = event.target;
        layer.setStyle(styles.hover);
    },
    mouseout: (event) => {
        let layer = event.target;
        let id = layer._leaflet_id;
        if (id !== currentLayerId) {
            let styleName = getStatusById(layer.feature.properties.county_id);
            layer.setStyle(styles[styleName]);
        }
    }
};

// TODO: this is for generating different color for now
// Should be replace by a real stateful service
let gen = () => {
    const values = ['lived', 'stayed', 'travelled', 'visited', 'passedBy', 'default'];
    const result = Math.floor(Math.random() * Math.floor(values.length));
    return values[result];
};

let getStatusById = (countyId) => {
    if (!window.levels[countyId]) {
        return 'default';
    }
    return window.levels[countyId].status;
};

let geojson = L.geoJSON(null, {
    onEachFeature: (feature, layer) => {
        let properties = feature.properties;
        let countyId = properties.county_id;
        if (!window.levels[countyId]) {
            window.levels[properties.county_id] = {
                properties: properties,
                // status: 'default'
                status: gen()
            };
        }
        layer.setStyle(styles[window.levels[countyId].status]);
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