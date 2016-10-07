
/*======================

  NOMBRE: LanguageCtrl
  FUNCIÓN: controlador que muestra el listado de lenguajes de un pais seleccionado.

=======================*/
app.controller('languageCtrl', function($scope,$state,$ionicHistory,Dictionary) {
  $scope.dictionary = Dictionary.currentDictionary();
  var languages = JSON.parse(window.localStorage['languages'] || '{}');
  $scope.languages = [];
  $scope.colorLanguage = [];
  var language = "";
  for (var i in languages){
    $scope.colorLanguage[i] = "";
    if(languages[i].trim() == "fr"){
      language = "FRANÇAIS";  
    }else if(languages[i].trim() == "en"){
      language = "ENGLISH";
    }else if(languages[i].trim() == "de"){
      language = "DEUTSCH";
    }else if(languages[i].trim() == "it"){
      language = "ITALY";
    }
    else if(languages[i].trim() == "pt"){
      language = "português";
    }
    var lan = {id:languages[i],"name":language,"abr":languages[i].toUpperCase()};
    $scope.languages.push(lan);
  }

 /*========================================================================

      NOMBRE:  list.
      FUNCIÓN: redirecciona al listado de trabajos.
      PARAMETROS:
        pos:        posición en el listado de lenguajes   

  ========================================================================*/
  $scope.list = function(pos,lanAbr) {
    $scope.colorLanguage[pos] = "background-color: rgba(80, 80, 80, 0.1)";
    window.localStorage['currentLanguage'] = lanAbr;
    console.log(lanAbr);
    window.location = "list.html";
  };

  /*========================================================================

      NOMBRE:  backCountry.
      FUNCIÓN: vuelve a listado de paises validos.
        
  ========================================================================*/
  $scope.backCountry = function(){
    $state.go("countries");      
  };
});