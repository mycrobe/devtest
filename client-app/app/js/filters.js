'use strict';

/* Filters */

angular.module('myApp.filters', []).
//    https://gist.github.com/dcsg/2478654;
    filter('truncate', function () {
        return function (text, length, end) {
            if (text == null || text.length == 0)
                return null;

            if (isNaN(length))
                length = 10;

            if (end === undefined)
                end = "…";

            if (text.length <= length || text.length - end.length <= length) {
                return text;
            }
            else {
                return String(text).substring(0, length-end.length) + end;
            }

        };
    });