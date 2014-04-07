'use strict';

/* Controllers */

angular.module('myApp.controllers', ['ngTable', 'ngTableExport'])

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
    .controller('OrdersController', function ($scope, $http, ngTableParams) {
        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: {
                order_number: 'asc'     // initial sorting
            }
        }, {
            total: 0,           // length of data
            getData: function($defer, params) {
                $http.get('http://localhost:3000/orders').
                    success(function (data, status, headers, config) {
                        $defer.resolve(data.json.rows);
                    }).
                    error(function (data, status, headers, config) {
                        console.log(status);
                    });
            }
        });
    })
    .controller('OrderController', function($scope, $routeParams, $http) {
        $http.get('http://localhost:3000/orders/' + $routeParams.id).
            success(function (data, status, headers, config) {
                var orders = data.json.rows;
                if(orders && orders.length){
                    $scope.order = data.json.rows[0];
                }
            }).
            error(function (data, status, headers, config) {
                console.log(status);
            });

    });
