// javasrcipt

//initialze map
var map = L.map('map').setView([39.915678, -98.70257], 4);
//load base tile map
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png',
						{
	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
	maxZoom: 9
}).addTo(map);

// // load data layer1
// $.getJSON('https://acj9117.cartodb.com/api/v2/sql?q=SELECT * FROM ne_50m_admin_1_states&format=GeoJSON',function(stateData){
//   L.geoJson( stateData )
		
// 		.addTo(map);
// });

var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
    
      div.innerHTML += 
        '<b>Aircraft Cockpit Laser Illumination Incidents</b><br /> <b>2010–2015</b><br />' +
        '<svg class="left" width="18" height="18"><rect x="5" y="5" height="25" width="25" class="legendSvg4"/></svg><span>More Incidents</span><br />' +
        '<svg class="left" width="18" height="18"><rect x="5" y="5" height="25" width="25" class="legendSvg3"/></svg><span></span><br />' +
        '<svg class="left" width="18" height="18"><rect x="5" y="5" height="25" width="25" class="legendSvg2"/></svg><span></span><br />' +
        '<svg class="left" width="18" height="18"><rect x="5" y="5" height="25" width="25" class="legendSvg1"/></svg><span>Fewer Incidents</span><br /><br />' +
        '<b>Get the FAA Data</b><br />' +
        '<span><a href=\"https://www.faa.gov/about/initiatives/lasers/laws/media/laser_incidents_2010-2014.xls\">Download FAA Laser Incidents Report (XLSX)</a><br />' +
        '</span><br />'
        
;
    return div;
};

legend.addTo(map);



var classes;
  turfLayer = L.geoJson(null, {
    style: function (feature) {
      var style = {
        color: '#ff000',
        fillColor: '#ff0000',
        weight: 0.5
      };
      if (feature.properties.laserIncidentCount <= classes[0]) {
        style.fillOpacity = 0;
      }
      else if (feature.properties.laserIncidentCount <= classes[1]) {
        style.fillOpacity = 0.25;
      }
      else if (feature.properties.laserIncidentCount <= classes[2]) {
        style.fillOpacity = 0.5;
      }
      else if (feature.properties.laserIncidentCount <= classes[3]) {
        style.fillOpacity = 0.75;
      }
      else {
        style.fillOpacity = 1;
      }
      return style;
    },
    onEachFeature: function (feature, layer) {
      layer.bindPopup( feature.properties.name +'<br/>' + feature.properties.laserIncidentCount + ' Incidents');
    }
  }).addTo(map);

  // We nest getJSON() calls here to ensure we have both layers before we use them.
  // It's not exactly ideal, but it works for our purposes.
  $.getJSON('https://acj9117.cartodb.com/api/v2/sql?q=SELECT * FROM ne_50m_admin_1_states&format=GeoJSON', function(stateAdminData){
    $.getJSON('https://acj9117.cartodb.com/api/v2/sql?q=SELECT the_geom FROM faa_laser_incidents WHERE the_geom IS NOT NULL&format=GeoJSON', function(laserIncidentData) {
      var statesWithCounts = turf.count(stateAdminData, laserIncidentData, 'laserIncidentCount');
      
      // Actually set classes here.
      classes = turf.jenks(statesWithCounts, 'laserIncidentCount', 4);
      turfLayer.addData(statesWithCounts);
    });
  });



//load data layer2



$.getJSON('https://acj9117.cartodb.com/api/v2/sql?q=SELECT * FROM faa_laser_incidents WHERE the_geom IS NOT NULL&format=GeoJSON', function(data){
	var airportIcon = L.icon({
    iconUrl: 'data:image/png;base64,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',
    iconSize: [50,50]
  });
  var airports = L.geoJson(data,{
    pointToLayer: function(feature,latlng){
	  var marker= L.marker(latlng,{icon: airportIcon});
 			marker.bindPopup( "Location: " + feature.properties.location + 
                        "<br/>Altitude in feet: " +feature.properties.altitude + 
                        "<br/>Laser Color: " +feature.properties.color + 
                        "<br/>Latitude: " +feature.properties.lat + 
                        "<br/>Longitude: " +feature.properties.lng);
			return marker;
    }
  });
	
var clusters = L.markerClusterGroup();
clusters.addLayer(airports);
map.addLayer(clusters);
 	
});
