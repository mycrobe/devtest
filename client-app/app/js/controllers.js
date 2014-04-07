'use strict';

/* Controllers */

angular.module('myApp.controllers', [])

    .controller('HeaderController', function ($scope, $location) {
        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };
    })
    .controller('CustomersController', function ($scope, $http) {
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
        $scope.parts = [];
        $http.get('http://localhost:3000/parts').
            success(function (data, status, headers, config) {
                $scope.parts = data.json.rows;
            }).
            error(function (data, status, headers, config) {
                console.log(status);
            });
    })
    .controller('OrdersController', function ($scope, $http) {
        $scope.hello = "Hello World!";
        $scope.orders = [];
        $http.get('http://localhost:3000/orders').
            success(function (data, status, headers, config) {
                $scope.orders = data.json.rows;
            }).
            error(function (data, status, headers, config) {
                console.log(status);
            });
    });
