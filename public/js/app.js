'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    
    $routeProvider.
      when('/home', {	templateUrl: 'partials/home', 
    							  	controller: MyHomeCtrl,
    							  	activetab: 'home'
      }).
      when('/about', {	templateUrl: 'partials/about', 
    								controller: MyAboutCtrl,
    								activetab: 'about'
      }).
      when('/games', {	templateUrl: 'partials/games', 
    								controller: MyGamesCtrl,
    								activetab: 'games'
      }).
      when('/login', {redirectTo: '/auth/facebook'
      }).
      otherwise({redirectTo: '/home'
      });
    
    $locationProvider.html5Mode(true);
  }]);