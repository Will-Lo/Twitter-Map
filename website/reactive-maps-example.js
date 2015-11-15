Markers = new Mongo.Collection('markers');

if (Meteor.isClient) {

  Template.map.onCreated(function() {
    GoogleMaps.ready('map', function(map) {

      var latLng = {lat: 43.472848, lng: -80.540266};

      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(latLng.lat, latLng.lng),
        map: map.instance,
        id: document._id,
        title: 'it works'
      });
       // Markers.insert({ lat: 43.472848, lng: -80.540266 });
        //Markers.update(marker.id, { set: { lat: 43.472848, lng: -80.540266 } });

      google.maps.event.addListener(map.instance, 'click', function(event) {
        //Markers.insert({ lat: event.latLng.lat(), lng: event.latLng.lng() });
      });

      var markers = {};

      Markers.find().observe({
        added: function (document) {
          var marker = new google.maps.Marker({
            draggable: true,
            animation: google.maps.Animation.DROP,
            position: new google.maps.LatLng(document.lat, document.lng),
            map: map.instance,
            id: document._id
          });

          google.maps.event.addListener(marker, 'dragend', function(event) {
            Markers.update(marker.id, { set: { lat: event.latLng.lat(), lng: event.latLng.lng() }});
          });

          markers[document._id] = marker;
        },
        changed: function (newDocument, oldDocument) {
          markers[newDocument._id].setPosition({ lat: newDocument.lat, lng: newDocument.lng });
        },
        removed: function (oldDocument) {
          markers[oldDocument._id].setMap(null);
          google.maps.event.clearInstanceListeners(markers[oldDocument._id]);
          delete markers[oldDocument._id];
        }
      });


    });
  });

  Meteor.startup(function() {
    GoogleMaps.load();
  });

  Template.map.helpers({
    mapOptions: function() {
      if (GoogleMaps.loaded()) {
        return {
          center: new google.maps.LatLng(43.472848, -80.540266),
          zoom: 16
        };
      }
    }
  });

}
