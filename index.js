
   var map;
   var markers = [];
   var infoWindow;

   function initMap() {

     var LosAngeles = {lat: 34.063380, lng: -118.350000};
     map = new google.maps.Map(document.getElementById('map'), {
       zoom: 8,
       center: LosAngeles,
       styles: [
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#242f3e"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#746855"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#242f3e"
            }
          ]
        },
        {
          "featureType": "administrative.locality",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#d59563"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#d59563"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#263c3f"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#6b9a76"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#38414e"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#212a37"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9ca5b3"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#746855"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#1f2835"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#f3d19c"
            }
          ]
        },
        {
          "featureType": "transit",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#2f3948"
            }
          ]
        },
        {
          "featureType": "transit.station",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#d59563"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#17263c"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#515c6d"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#17263c"
            }
          ]
        }
      ]
      
      
     });

     infoWindow = new google.maps.InfoWindow();
     searchstores();
   }


   function searchstores(){
      var foundstores = [];
      var zipcode = document.getElementById('zip-code-input').value;
      if(zipcode) {
        stores.forEach(function(store) {
          var postal = store.address.postalCode.substring(0,5);
            if(postal == zipcode) {
              foundstores.push(store);
            }
        });
      }
      else {
          foundstores = stores;
      }
      clearlocations();
      displaystores(foundstores);
      showstoresmarkers(foundstores);
      setonclicklistener();
   }

   function clearlocations() {
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers.length = 0;
  
  }

  


   function setonclicklistener() {
        var storeElements = document.querySelectorAll('.store-container');
        storeElements.forEach(function(elem, index) {
              elem.addEventListener('click',function(){
                google.maps.event.trigger(markers[index], 'click');
              })

        })

   }


   function displaystores(stores) {

        var storeshtml = "";
        stores.forEach(function(store, index){
            var address = store.addressLines;
            var phone = store.phoneNumber;
            storeshtml += `
                <div class="store-container">
                  <div class="store-container-background">
                      <div class="store-info-container">
                        <div class="store-adress">
                            <span>${address[0]}</span>
                            <span>${address[1]}</span>
                        </div>
                        <div class="store-phone-number"><i class="fas fa-phone"></i>${phone}</div>
                      </div>
                      <div class="store-number-container">
                        <div class="store-number">
                            ${index+1}
                        </div>
                      </div>
                  </div>
                </div>
            ` 
        });
        document.querySelector('.stores-list').innerHTML = storeshtml;

   }

   function showstoresmarkers(stores) {
        var bounds = new google.maps.LatLngBounds();
        stores.forEach(function(store, index){
            var latlng = new google.maps.LatLng(
                store.coordinates.latitude, store.coordinates.longitude);
            var name = store.name;
            var address = store.addressLines[0];
            var phone = store.phoneNumber;
            var statustext = store.openStatusText;
            bounds.extend(latlng);
            createMarker(latlng, name, address, phone, statustext, index);      
              
        });
        map.fitBounds(bounds);
   }

   function createMarker(latlng, name, address, phone, statustext, index ) {
       var html = `
            <div class="store-info-window">
                <div class="store-info-name">
                  ${name}
                </div>
                <div class="store-info-status">
                  ${statustext}
                </div>
                <div class="store-info-address">
                  <div class="circle">
                    <i class="fas fa-street-view"></i>
                  </div>
                    ${address}
                </div>
                <div class="store-info-phone">
                  <div class="circle">
                    <i class="fas fa-phone-alt"></i>
                  </div>
                    ${phone}
                </div>
            </div>
       
       `;
       
       var Marker = new google.maps.Marker({
           map: map,
           position: latlng,
           label: `${index+1}`,
           icon: 'marker.png'
       });
       google.maps.event.addListener(Marker, 'click', function() {
            infoWindow.setContent(html);
            infoWindow.open(map, Marker);

       });
       
       markers.push(Marker);
      }

      


  

      

