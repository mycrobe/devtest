'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'ngTable'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/customers', {templateUrl: 'partials/customers.html', controller: 'CustomersController'});
  $routeProvider.when('/parts', {templateUrl: 'partials/parts.html', controller: 'PartsController'});
  $routeProvider.when('/orders', {templateUrl: 'partials/orders.html', controller: 'OrdersController'});
  $routeProvider.otherwise({redirectTo: '/customers'});
}]).
// see http://better-inter.net/enabling-cors-in-angular-js/
config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);
