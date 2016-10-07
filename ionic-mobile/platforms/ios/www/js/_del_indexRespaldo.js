
angular.module('index', ['ionic'])
/*
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
  if(window.cordova){
    window.cordova.require('cordova/plugin/diagnostic').switchToLocationSettings();
  }
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})
*/
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
  window.localStorage['currentLanguaje'] = "en";
  $scope.entra =window.cordova;
  /*
  if(window.cordova){
    $scope.entra ="N2222222222";
    if( window.cordova.plugins){
      cordova.plugins.diagnostic.isLocationEnabled(function(enabled){
      $scope.entra ="NEUVOOOOOOOO";
        if(!enabled){
          $scope.entra ="no habilitado";
          window.cordova.plugins.diagnostic.switchToLocationSettings();  
        }else{
          $scope.entra ="HHabilitado";
          window.cordova.plugins.diagnostic.switchToLocationSettings();
        }
      }, function(error){

          console.error("The following error occurred: "+error);
      });
    }
  }*/
  var urlCountries = "http://neuvoo.ca/services/mobile/fn.php?action=getAllCountriesInfo";
  navigator.geolocation.getCurrentPosition(function(objPosition){ //localización del dispositivo         
    var lon = objPosition.coords.longitude;
    var lat = objPosition.coords.latitude;
    //lat =  45.508056; //coor in canada      
    //lon = -73.555;
    $scope.entra = "entrando";
    var foundCountryValid = false;
    var latlng = new google.maps.LatLng(lat, lon);
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({"latLng": latlng}, function(results, status){
      $scope.entra = "entrando222";
      $http.get(urlCountries).then(function(resp) {         //petición de paises validos en la aplicación
        var countries = resp.data;                          //paises validos en la aplicación
        if (status == google.maps.GeocoderStatus.OK){       //localización exitosa
          if (results[0]){
            var country = results.pop().formatted_address;  //pais actual
            country = country.replace("United Kingdom","UK").replace("United States","USA");
            for(var i in countries){
              if(country == countries[i].country_name ){    //verificando si la localizacion actual es valida.
                foundCountryValid = true;
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
        $scope.entra =err;
        console.error('ERR', err);
      });

    });

  }, function(objPositionError){
    $scope.entra =objPositionError;
    console.log("Error");
  }, {
    maximumAge: 75000,
    timeout: 15000,
    enableHighAccuracy: false
  });
  //$scope.entra =window.cordova;
});
