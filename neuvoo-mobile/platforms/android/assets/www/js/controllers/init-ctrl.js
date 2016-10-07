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
app.controller('initCtrl', function($scope,$http){
  var time = new Date();
  time = {"month": time.getMonth(),"day": time.getDate(),"hour": time.getHours()}
  window.localStorage['time'] = JSON.stringify(time);
  if(window.localStorage['country'] == null || window.localStorage['country'] == ""){
    window.localStorage['currentLanguage'] = "en";
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
                  window.localStorage['location'] = results[4].formatted_address.trim();
                  window.localStorage['country'] = countries[i].country;
                  if(countries[i].languages.length>1){        // si tiene mas de un lenguaje 
                    window.localStorage['countries'] = JSON.stringify(resp.data);
                    window.localStorage['languages'] = JSON.stringify(countries[i].languages);      
                    window.location = "countries.html#/languages";
                  }else{      // si tiene solo un lenguaje
                    window.localStorage['currentLanguage'] = countries[i].languages[0].trim();                               
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
        console.log(objPositionError);
      }, function(err) {
        console.log(err);
      });
    }, {
      maximumAge: 86400000,
      timeout: 30000
    });

  }
  else{
    window.location = "list.html";
  }

});