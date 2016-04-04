//jquery waits for doc to load
$(document).ready(function () {

  // variable asking leaflet to create a map around NYC
  var map = L.map('map').setView([40.731649,-73.977814], 10);
  
  //Creates an undefined variable, to be used later in code
  var dataLayer;

  //add base map layer using CartDB tiles
  L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
  attribution: 'Map Data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> Contributors, Map Tiles &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    maxZoom: 18

    //adds tiles to the map
}).addTo(map);

  // Get GeoJSON for CartoDB via API call
  var url = 'https://acj9117.cartodb.com/api/v2/sql?' + $.param({
    q: 'SELECT * FROM traffic_deaths ORDER BY child_adult ASC LIMIT 10',
    format: 'GeoJSON'
  });
  $.getJSON(url)
  
    // Add API results to map
    .done(function (data) {
      dataLayer = L.geoJson(data).addTo(map);   
    });

    $('.limit').change(function () {
    var url = 'https://acj9117.cartodb.com/api/v2/sql?' + $.param({
      q: 'SELECT * FROM traffic_deaths ORDER BY child_adult ASC LIMIT ' + $(this).val(),
      format: 'GeoJSON'
    });
    $.getJSON(url)

      // Add API results to map
      .done(function (data) {
        dataLayer.clearLayers();
        dataLayer.addData(data);
      });
  });

});