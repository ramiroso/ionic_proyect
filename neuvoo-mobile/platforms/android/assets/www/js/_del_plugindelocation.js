
  if(window.cordova.plugins){
    if(window.cordova){
    window.cordova.require('cordova/plugin/diagnostic').switchToLocationSettings()
  }
  window.cordova.plugins.diagnostic.isLocationEnabled(function(enabled){
    $scope.entra ="NEUVOOOOOOOO";
      if(!enabled){
        $scope.entra ="no habilitado";

          cordova.plugins.diagnostic.switchToLocationSettings();
          console.log("no habilitado");
      }else{
        $scope.entra ="HHabilitado";
      }
    }, function(error){

        console.error("The following error occurred: "+error);
    });
  }
}