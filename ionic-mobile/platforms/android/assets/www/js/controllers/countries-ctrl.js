/*
  NOMBRE: countriesCtrl
  FUNCIÓN: controlador del listado de paises. Obtienen del servidor los paises validos del
           de la aplicación y los despliega en una lista.
*/
app.controller('countriesCtrl', function($scope,$state,$http, Dictionary) {
    $scope.dictionary = Dictionary.currentDictionary();
    $scope.countries = JSON.parse(window.localStorage['countries'] || '{}');
    var urlCountries = "http://neuvoo.ca/services/mobile/fn.php?action=getAllCountriesInfo"; 
  
    $http.get(urlCountries).then(function(resp) {   
      window.localStorage['countries'] = JSON.stringify(resp.data);

      $scope.countries = JSON.parse(window.localStorage['countries'] || '{}');
      $scope.colorCountry = [];
      for(var i in $scope.countries){
        $scope.colorCountry[i] = "";
      }
    }, function(err) { 
      console.error('ERR', err);
      $scope.name = "Error= "+err;
    });
    
    /*==============================

      NOMBRE:  languajes.

      FUNCIÓN: redireciona al listado de leguanjes de un país seleccionado, en caso de poseer
      un solo lenguaje redirecciona al listado de trabajos.

      PARAMETROS:
        countryAbr: abreviatura del pais seleccionado (por ahora se obtiene del domain)
        pos:        posición en el listado de paises   

    ========================================================================================*/

    $scope.languages = function(countryAbr,pos) {
      var id = countryAbr.replace(".neuvoo.","");  //se obtiene del domain la abreviatura del país.
      id = id.replace("neuvoo.","");
      id = id.replace("com","").trim();
      if(id == ""){id = "com";}
      console.log("id= "+id);
      id = id.replace(".br","com.br");
      window.localStorage['country'] = id;
      window.localStorage['languages'] = JSON.stringify($scope.countries[id].languages);
      $scope.colorCountry[pos] = "background-color: rgba(80, 80, 80, 0.1)";
      if($scope.countries[id].languages.length>1){
        $state.go("languages");
      }else{
        window.localStorage['currentLanguage'] = $scope.countries[id].languages[0].trim();
        window.location = "list.html";
      }
    };
  
});