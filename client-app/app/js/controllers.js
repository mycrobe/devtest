'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
    .controller('CustomersController', function ($scope, $http) {
        $scope.hello = 'people!';
        $scope.people = [];
        $http.get('http://localhost:3000/people').
            success(function (data, status, headers, config) {
                $scope.people = data.json.rows;
            }).
            error(function (data, status, headers, config) {
                console.log(status);
            });
    })
    .controller('PartsController', function ($scope, $http) {
        $scope.hello = 'parts!';
        $scope.parts = [];
        $http.get('http://localhost:3000/parts').
            success(function (data, status, headers, config) {
                $scope.parts = data.json.rows;
            }).
            error(function (data, status, headers, config) {
                console.log(status);
            });
    });
