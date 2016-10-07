
var app = angular.module('countries', ['ionic','neuvoo.dictionary'])

app.run(function($ionicPlatform) {
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
});
/*
  Estados de la aplicación
*/
app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
     .state('countries', {
      cache: false,
      url: '/countries',
      templateUrl: 'templates/countries.html', //paises
      controller: 'countriesCtrl',
      resolve: "countriesCtrl".resolve
    })
    .state('languages', {
      cache: false,
      url: '/languages',
      templateUrl: 'templates/languages.html', //lenguajes
      controller: 'languageCtrl'
    })
  $urlRouterProvider.otherwise('/countries');

});