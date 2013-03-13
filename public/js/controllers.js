'use strict';

/* Controllers */

function AppCtrl($scope, $http, $route) {
  $http({method: 'GET', url: '/api/name'}).
  success(function(data, status, headers, config) {
    $scope.name = data.name;
    $scope.$route = $route;
  }).
  error(function(data, status, headers, config) {
    $scope.name = 'Error!'
  });
}

function MyHomeCtrl() {
}
MyHomeCtrl.$inject = [];


function MyAboutCtrl() {
}
MyAboutCtrl.$inject = [];
