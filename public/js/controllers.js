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

function MyGamesCtrl($scope, $http, $location) {
  $http.get('/api/games').success(function(data, status, headers, config) {
    $scope.games = data.games;
  });
  $scope.form = {};
  $scope.submitBet = function (game) {
    $scope.form.game = game;
    console.log($scope.form);    
    $http.post('/api/addbet', $scope.form).
      success(function(data) {
        $location.path('/games');
      });
  };
}

function AddGameCtrl($scope, $http, $location) {
  $scope.form = {};
  $scope.submitGame = function () {
    $http.post('/api/addgame', $scope.form).
      success(function(data) {
        $location.path('/games');
      });
  };
}
