var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

var myMap = L.map("map", {
    center: [40, -99],
    zoom: 4.2
});

// add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


function markerSize(magnitude) {
    return magnitude * 4;
};

// create variable for earthquakes as layergroup.
var earthquakes = new L.LayerGroup();

d3.json(url, function (geoJson) {
    L.geoJSON(geoJson.features, {
        pointToLayer: function (geoJsonPoint, latlng) {
            return L.circleMarker(latlng, { radius: markerSize(geoJsonPoint.properties.mag) });
        },

        style: function (geoJsonFeature) {
            return {
                fillColor: Color(geoJsonFeature.properties.mag),
                fillOpacity: 0.7,
                weight: 0.1,
                color: 'black'

            }
        },

        onFeature: function (feature, layer) {
            layer.bindPopup(
                "<h4 style='text-align:center;'>" + new Date(feature.properties.time) +
                "</h4> <hr> <h5 style='text-align:center;'>" + feature.properties.title + "</h5>");
        }
    }).addTo(earthquakes);
    createMap(earthquakes);



});



// Add colors for quakes based on number. These are the colors as shown on the readme.
function Color(magnitude) {
    if (magnitude > 5) {
        return 'red'
    } else if (magnitude > 4) {
        return 'darkorange'
    } else if (magnitude > 3) {
        return 'tan'
    } else if (magnitude > 2) {
        return 'yellow'
    } else if (magnitude > 1) {
        return 'darkgreen'
    } else {
        return 'lightgreen'
    }
};


// Pop up layers
function onFeature(feature, layer) {
    // console.log('Creating pop up'),
    // Time format
    var format = d3.timeFormat('%d-%b-%Y at %H:%M');
    //Pop up layer using title, title and magnitude
    var popupText = (layer.bindPopup('<h2>' + 'Location : ' + '<br>' + feature.properties.title + '</h2>' + '<hr>' + '<h3>' + 'Time : ' + (format(new Date(feature.properties.time))) + '</h3>' + '<h3>' + 'Type : ' + feature.properties.type + '</h3>' + '<h3>' + 'Magnitude (Richter): ' + feature.properties.mag + '</h3>' + '<h3>' + 'Depth (Km): ' + feature.geometry.coordinates[2] + '</h3>'
    )).addTo(myMap)
};


// Create markers
d3.json(url).then(function (data) {
    console.log(data);
    L.geoJSON(data, {
        onFeature: onFeature,
        pointToLayer: function (feature, latlng) {
            console.log('Creatin marker');
            return new L.CircleMarker(latlng, {
                // Define circle radius
                radius: feature.properties.mag * 4,
                fillColor: Color(feature.geometry.coordinates[2]),
                fillOpacity: 0.6,
                weight: 0
            }).addTo(myMap);
        }
    });
});

// Place location


d3.json(url).then(function(response){
    console.log(response);

    for (var i=0; i <response.length; i++){
        var location = response[i].location;

        // count and trap in case location
        if (location){
            L.marker([location.coordinates[1], location.coordinates[0]]).addTo(myMap);
        }
    }
});