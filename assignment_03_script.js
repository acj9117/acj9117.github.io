// Leaflet: looping over features in a GeoJSON layer

$(document).ready(function () {
  // Create a map centered on NYC
  var map = L.map('map').setView([40.731649,-73.977814], 10);
  
  // Add a base layer. We're using Stamen's Toner:
  //  http://maps.stamen.com/#toner
  L.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
    maxZoom: 18
}).addTo(map);

  $.getJSON('https://eric.cartodb.com/api/v2/sql?q=SELECT * FROM airbnb2 ORDER BY price DESC LIMIT 25&format=GeoJSON')
    .done(function (data) {
      var airbnbLayer = L.geoJson(data, {
        //
        // Add a popup to each layer
        //
        onEachFeature: function (feature, layer) {
          // Add click handler to dynamically generate popup content
          layer.on('click', function () {
            // Div that will hold popup content
            var $content = $('<div></div>');
            var date = new Date();
            $content.text("I can't believe someone would pay $" + feature.properties.price + ' per night for an AirBnB');
            
            // Add a div with the date so we can style it separately
            var $dateDiv = $('<div></div>')
              .text(date.toTimeString())
              .addClass('date');
            $content.append($dateDiv);
            
            // Leaflet expects HTML, so we ask jQuery for our div's HTML
            layer.bindPopup($content.html()).openPopup();
          });
        },

        style: {
          fillColor: '#0f0f91',
          fillOpacity: 0.5,
          radius: 8,
          stroke: false
        }, 
        
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng);
        }
      }).addTo(map);   
    
      // For each layer on our AirBnB layer (an L.GeoJson), 
      // run some code
      airbnbLayer.eachLayer(function (layer) {
        // The callback takes a layer, and the layer has the feature
        // in it. So you can get the feature properties like this:
        console.log(layer.feature.properties.price);
        
        // console.log() the layer if you're unsure where the feature
        // is or what other properties it contains
      });
    });
});