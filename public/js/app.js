'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    
    $routeProvider.when('/home', {	templateUrl: 'partials/home', 
    							  	controller: MyHomeCtrl,
    							  	activetab: 'home'
    });
    
    $routeProvider.when('/about', {	templateUrl: 'partials/about', 
    								controller: MyAboutCtrl,
    								activetab: 'about'
    });

    $routeProvider.otherwise({redirectTo: '/home'});
    $locationProvider.html5Mode(true);
  }]);