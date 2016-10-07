var app = angular.module('list', ['ionic','neuvoo.dictionary','ngAnimate']);

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

app.config(function($ionicConfigProvider, $stateProvider, $urlRouterProvider) {
  if (!ionic.Platform.isIOS()) {
    $ionicConfigProvider.scrolling.jsScrolling(false);
  }

  $stateProvider
    .state('main', {
      cache: false,
      url: '/main',
      templateUrl: 'templates/list2.html',
      controller: 'listCtrl'
    })
  $urlRouterProvider.otherwise('/main');

});
