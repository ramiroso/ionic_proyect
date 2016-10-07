angular.module('index', ['ionic'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

/*
  Controlador principal, se ejecuta al inicio de la aplicación.
  función: obtiene localización del dispositivo, 
    -- si es un pais valido y tiene un solo lenguaje: 
        redirecciona a "list.html" (listado de trabajos)
    -- si es un pais valido y tiene mas de un lenguaje: 
        redirecciona a "countries.html#/languages" (listado de lenguajes del país)
    -- si no es un pais valido: 
        redirecciona a "countries.html" (listado de paises validos en la aplicación)
*/
.controller('MainCtrl', function($scope,$http){
  if(window.localStorage['currentLanguaje'] == null){
    window.localStorage['currentLanguaje'] = "en";
    window.localStorage['country'] = "";
    var urlCountries = "http://neuvoo.ca/services/mobile/fn.php?action=getAllCountriesInfo";
    navigator.geolocation.getCurrentPosition(function(objPosition){ //localización del dispositivo         
      var lon = objPosition.coords.longitude;
      var lat = objPosition.coords.latitude;
      //lat =  45.508056; //coor in canada
      //lon = -73.555;
      var foundCountryValid = false;
      var latlng = new google.maps.LatLng(lat, lon);
      geocoder = new google.maps.Geocoder();
      geocoder.geocode({"latLng": latlng}, function(results, status){
        
        $http.get(urlCountries).then(function(resp) {         //petición de paises validos en la aplicación
          var countries = resp.data;                          //paises validos en la aplicación
          if (status == google.maps.GeocoderStatus.OK){       //localización exitosa
            if (results[0]){
              var country = results.pop().formatted_address;  //pais actual
              country = country.replace("United Kingdom","UK").replace("United States","USA");
              for(var i in countries){
                if(country == countries[i].country_name ){    //verificando si la localizacion actual es valida.
                  foundCountryValid = true;
                  window.localStorage['location'] = results[0].formatted_address.trim();
                  window.localStorage['country'] = countries[i].country;
                  if(countries[i].languages.length>1){        // si tiene mas de un lenguaje 
                    window.localStorage['countries'] = JSON.stringify(resp.data);
                    window.localStorage['languages'] = JSON.stringify(countries[i].languages);      
                    window.location = "countries.html#/languages";
                  }else{      // si tiene solo un lenguaje
                    window.localStorage['currentLanguaje'] = countries[i].languages[0].trim();                               
                    window.location = "list.html";
                  }
                }
              }
              if(!foundCountryValid){// pais no valido
                window.localStorage['countries'] = JSON.stringify(resp.data);
                window.location = "countries.html";
              }
            }
          }

        }, function(err) {
          console.log(err);
        });

      });

    }, function(objPositionError){
      var urlCountries = "http://neuvoo.ca/services/mobile/fn.php?action=getAllCountriesInfo";
      $http.get(urlCountries).then(function(resp) {  
        window.localStorage['countries'] = JSON.stringify(resp.data);
        window.location = "countries.html";
        console.log("Error");
      }, function(err) {
          console.log(err);
        });
    }, {
      maximumAge: 86400000,
      timeout: 3000
    });

  }
  else{
    window.location = "list.html";
  }

});