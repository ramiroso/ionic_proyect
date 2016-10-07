/*
  NOMBRE: MainCtrl
  FUNCIÓN: controlador que muestra el listado de trabajos al iniciar la pagina.
*/
app.controller('listCtrl', function($scope, $state, $http, $ionicSideMenuDelegate, 
  $ionicPopover, $ionicScrollDelegate, Dictionary, $timeout, $ionicLoading){

  $scope.keyword = "";
  $scope.flagFavorite = false;
  $scope.location2 = "";
  $scope.percentajeScroll = 50;
  $scope.iteration = 1;
  $scope.endList = true;
  $scope.isFar = false;
  $scope.scrollPos = 0;
  $scope.selected = {'fav': '', 'l0': '', 'l1': '', 'l2': ''};
  

  $scope.$ionicSideMenuDelegate = $ionicSideMenuDelegate;
  $scope.popover = $ionicPopover.fromTemplate("templates/popover.html", {
    scope: $scope
  });

  if(window.localStorage['lastSearch'] == null){
    $scope.lastSearch = [];
    window.localStorage['lastSearch'] = JSON.stringify($scope.lastSearch);
  }
  else{
    $scope.lastSearch = JSON.parse(window.localStorage['lastSearch']);
    if($scope.lastSearch.length >0){
      $scope.location2  = $scope.lastSearch[0].location2;
      $scope.keyword    = $scope.lastSearch[0].keyword;
      window.localStorage['keyword'] = $scope.lastSearch[0].keyword;
      $scope.selected.l0 = "selected"; //Mostrar primera busqueda seleccionada
    }
  }

  if(window.localStorage['location'] != null && window.localStorage['location'] != "" &&
    !isALastSearch()){
    $scope.location2  = window.localStorage['location'];
  }
  else{
    if($scope.lastSearch.length>0){
      window.localStorage['location'] = $scope.lastSearch[0].location2;
    }
    else{
      window.localStorage['location'] = "";
    }
  }

  $scope.dictionary = Dictionary.currentDictionary();
  $scope.time = JSON.parse(window.localStorage['time']);

  //window.localStorage['jobsFavorites'] = null;
  if(window.localStorage['jobsFavorites'] == null){
    $scope.favorites = [];
  }else{
    $scope.favorites = JSON.parse(window.localStorage['jobsFavorites']);
    if($scope.favorites == null){
      $scope.favorites = [];
    }
  }

  var firstTime = true;
  if($scope.currentFavorite == null || !$scope.currentFavorite){
    $scope.jobs = [];
    $scope.flagFavorite = false;
    listStart(0,$scope.keyword,$scope.location2);
  }
  else{
    $scope.currentFavorite = false;
    $scope.flagFavorite = true;
    $scope.totalresults = $scope.favorites.length;
    $scope.jobs = $scope.favorites;
    $scope.endList = false;
  }
  /*==============================

      NOMBRE:  listJobs.
      FUNCIÓN: hace una busqueda de trabajos, tomando los parametros de 'keyword' y 'location' 
      de los input.
      POST-CONDICIÓN:
        devuelve en la variable '$scope.list' el listado de trabajos obtenido.   

  ========================================================================================*/
  $scope.listJobs = function() {
    $scope.selected = {'fav': '', 'l0': '',  'l1': ''};
    var l = "l"+0;
    $scope.selected[l] = "selected";
   
    var keyword = document.getElementById("job").value;
    var location = document.getElementById("location").value;
    $timeout(function() {
        $scope.keyword = keyword;
        $scope.location2 = location;
    })
    firstTime = true;
    $scope.endList = true;
    window.localStorage['location'] = location;
    window.localStorage['keyword'] = keyword;
    $scope.lastSearch.unshift({"location2":location,"keyword":keyword});
    var limit = 3;
    var lenghtSearch = $scope.lastSearch.length;
    $scope.lastSearch = $scope.lastSearch.slice(0,Math.min(limit,lenghtSearch)); 
    window.localStorage['lastSearch'] = JSON.stringify($scope.lastSearch);
    $scope.jobs = [];
    $ionicLoading.show();    
    listStart(0,keyword,location);
  };



  $scope.listRefresh = function() {
    var start = $scope.jobs.length;
    var location2 = "";
    if(window.localStorage['location'] != null){    
      location2 = window.localStorage['location'];
    }
    var keyword = window.localStorage['keyword'];
    listStart(start,keyword, location2);
  };

  function listStart(start,keyword,location) {
    console.log(firstTime);

    if ((firstTime && start == 0) || start != 0){
      $scope.flagFavorite = false;
      firstTime = false;
      //console.log("start"+start+", keyword: "+keyword+", location: "+location);
      $scope.iteration = $scope.iteration + 1;
      $scope.percentajeScroll = 100/$scope.iteration;
      var country = window.localStorage['country'];
      var url = "http://api.neuvoo.com/apisearch?publisher=neuvoomob&q="+keyword;
      url = url + "&l="+location+"&userip=1.2.3.4&useragent=neuvooapp&v=2&co="+country+"&start="+start+"&limit=20&format=json&border=1";

      $http.get(url).then(function(resp) { 

        window.localStorage['list'] = JSON.stringify(resp.data);
        $scope.list = JSON.parse(window.localStorage['list'] || '{}');
        $scope.totalresults = $scope.list.totalresults;

        var results = $scope.list.results;
        $scope.jobsRefresh = [];
        for (var i in results){
          var date = String(results[i].date).split(" ");
          var timeJson = {"hour":parseInt(date[4].split(":")[0]),"day":parseInt(date[1]),"month":date[2]};
          var time = timeCaculo(timeJson);

          $scope.jobsRefresh[i]= {"id":results[i].jobkey,"jobtitle":results[i].jobtitle,"company":results[i].company,"logo":results[i].logo,"time":time,"description":results[i].snippet,"location":results[i].formattedLocation, "border":results[i].border}; 
          $scope.jobs.push($scope.jobsRefresh[i]);
          //break;
        }
        
        $scope.endList = $scope.totalresults > $scope.jobs.length;
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $timeout( function(){
            $ionicLoading.hide(); //Ocultar loading
        }, 500);
        //$scope.jobs = $scope.jobs.concat($scope.jobsRefresh);
      }, function(err) { 

        $scope.error = "Error= "+err;

      });

    }else{
      $scope.$broadcast('scroll.infiniteScrollComplete'); 
    }
  };

  $scope.moreDataCanBeLoaded = function(){
    return $scope.endList;
  };

  /*===========================================================================

      NOMBRE:  toggleLeftSideMenu.
      FUNCIÓN: despliega menu de opciones al lado de izquierdo de la pantalla.   
  ============================================================================*/
  $scope.toggleLeftSideMenu = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.scrollTop = function() {
    $ionicScrollDelegate.$getByHandle('scroll').scrollTop('true');
  };

   $scope.getScrollPosition = function() {
      $scope.moveData = $ionicScrollDelegate.getScrollPosition().top;
      var subiendo = 0;
      if ($scope.moveData >  $scope.scrollPos) subiendo = 0;
      if ($scope.moveData <  $scope.scrollPos) subiendo = 1;
      $scope.scrollPos = $scope.moveData ;
      if($scope.moveData>=1200 && subiendo){
           $timeout(function() { $scope.isFar  = true;});
            
      }else if(!subiendo){
           $timeout(function() {  $scope.isFar = false; });
      }
   };
   
   //Refreshing the page
   $scope.doRefresh = function() {
        $timeout( function() {
            listStart(0,$scope.keyword , $scope.location2 );
            $scope.$broadcast('scroll.refreshComplete');
        }, 1000);
  };
   
   $scope.stopEvent = function() {
     console.log("stop");
   };

  function timeCaculo(timeJson){
    var time = parseInt(timeJson.hour)+"h ago";
    if($scope.time.day == timeJson.day){
      time = $scope.time.hour - timeJson.hour;
      time = time+"h ago";
    }else{
      time = $scope.time.day - timeJson.day;
      if(time < 0){
        time = $scope.time.day + (31-timeJson.day);
        if((($scope.time.month%2 == 1 && $scope.time.month <=7) || 
        ($scope.time.month%2 == 0 && $scope.time.month > 7)) && 
        $scope.time.month != 1){
          
          time = time - 1;
        }else if($scope.time.month == 1){
          time = time - 3;
        }
      }
      
      time = time + "d ago";
    }
    return time;
  }


  $scope.currentLocation = function(){
    console.log("entro");
    window.localStorage['currentLanguage'] = "en";
    var urlCountries = "http://neuvoo.ca/services/mobile/fn.php?action=getAllCountriesInfo";
    navigator.geolocation.getCurrentPosition(function(objPosition){ //localización del dispositivo         
      var lon = objPosition.coords.longitude;
      var lat = objPosition.coords.latitude;
      console.log("cosigue");
      //lat =  45.508056; //coor in canada
      //lon = -73.555;
      var foundCountryValid = false;
      var latlng = new google.maps.LatLng(lat, lon);
      geocoder = new google.maps.Geocoder();
      geocoder.geocode({"latLng": latlng}, function(results, status){
        
        $http.get(urlCountries).then(function(resp) {         //petición de paises validos en la aplicación
          var countries = resp.data;      
         console.log(resp.data);                   //paises validos en la aplicación
          if (status == google.maps.GeocoderStatus.OK){       //localización exitosa
            if (results[0]){
              var country = results.pop().formatted_address;  //pais actual
              country = country.replace("United Kingdom","UK").replace("United States","USA");
              for(var i in countries){
                if(country == countries[i].country_name ){    //verificando si la localizacion actual es valida.
                  foundCountryValid = true;
                  console.log("location: "+results[4].formatted_address.trim());
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
      console.log(objPositionError);
      var urlCountries = "http://neuvoo.ca/services/mobile/fn.php?action=getAllCountriesInfo";
      $http.get(urlCountries).then(function(resp) {  
        window.localStorage['countries'] = JSON.stringify(resp.data);
        window.location = "countries.html";
      }, function(err) {
          console.log(err);
        });
    }, {
      maximumAge: 86400000,
      timeout: 30000
    });
  }

  
  $ionicPopover.fromTemplateUrl('templates/popover.html', {
    scope: $scope,
  }).then(function(popover) {
    $scope.popover = popover;
  });

  $scope.popoverShow = function($event,index) {  
    $scope.favorite = index;
    $scope.popover.show($event);
  };

  function exists(elem, array){
    for(var i in array){
      if(array[i].id === elem.id){
        return true;
      }
    }
    return false;
  }

  $scope.addFavorites = function(){ 

    if(window.localStorage['jobsFavorites'] == null){

      $scope.favorites = [];
      $scope.favorites.push($scope.jobs[$scope.favorites]);
      window.localStorage['jobsFavorites'] = JSON.stringify($scope.favorites);
    
    }
    else{     
      console.log(window.localStorage['jobsFavorites']);
      $scope.favorites = JSON.parse(window.localStorage['jobsFavorites']|| '{}');
      
      if($scope.favorites == null){
        $scope.favorites = [];
      }

      var elem = $scope.jobs[$scope.favorite];
      if(!exists(elem,$scope.favorites)){
        $scope.favorites.push($scope.jobs[$scope.favorite]);
      }  

      window.localStorage['jobsFavorites'] = JSON.stringify($scope.favorites);
    }

    $scope.popover.hide();
    $scope.showIndicator(); //Mensaje de agregado a favoritos
  };

  $scope.removeFavorites = function(){
    if($scope.favorites != null  && $scope.favorites.length > 0){
      $scope.favorites.splice($scope.favorite, 1);
      window.localStorage['jobsFavorites'] = JSON.stringify($scope.favorites);
    }
    $scope.popover.hide();
  };

  $scope.listFavorites = function(){
    $scope.location2  = "";
    $scope.keyword    = "";
    $scope.flagFavorite = true;
    $scope.currentFavorite = true;
    $scope.jobs = $scope.favorites;
    $scope.totalresults = $scope.favorites.length;
    $scope.endList = false;
    $scope.selected = {'fav': 'selected', 'l0': '',  'l1': ''};
    $state.go("main");
  };

  $scope.listLastSearch = function(index){
    $scope.selected = {'fav': '', 'l0': '',  'l1': ''};
    var l = "l"+index;
    $scope.selected[l] = "selected";
    $scope.keyword = $scope.lastSearch[index].keyword;
    $scope.location2 = $scope.lastSearch[index].location2;
    firstTime = true;
    $scope.endList = true;
    window.localStorage['location'] = $scope.lastSearch[index].location2;
    window.localStorage['keyword'] = $scope.lastSearch[index].keyword;
    $scope.jobs = [];
    $ionicLoading.show();
    listStart(0,$scope.keyword,$scope.location2);
  };
  
  //Mostra el mensaje "job added";
  $scope.showIndicator = function(){ 
    //Ocultar boton de subir, en caso de que este 
    var button = $scope.isFar;
    if (button  == true){
        $scope.isFar  = false;
    }
    console.log(button);
    $scope.data = { isLoading: true};
    $timeout(function() {
      $scope.data = { isLoading: false};
      //Volver a mostrar
      if (button  == true){
        $scope.isFar  = true;
      }
    }, 2000);
  };  
  
  $scope.loadingIndicator = $ionicLoading.show({
    content: 'Loading Data',
    animation: 'fade-in',
    showBackdrop: false,
    maxWidth: 200,
    showDelay: 500,
    template: '<ion-spinner icon="ios"/>'
    });  

  function isALastSearch(){
    for(var i in $scope.lastSearch){
      if(window.localStorage['location'] == $scope.lastSearch[i]){
        return true;
      }
    }  
    return false;
  }
  
    
});
