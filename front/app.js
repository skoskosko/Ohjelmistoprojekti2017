var myapp = angular.module('myapp', ["ui.router","ngAnimate", "ui.bootstrap"])
myapp.config(function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise("/servers")

  $stateProvider
    .state('Servers', {
        url: "/servers",
        controller: 'route1',
        templateUrl: "route1.html"
    }) .state('Services', {
        url: "/Services",
        controller: 'route2',
        templateUrl: "route2.html"
      })

});
