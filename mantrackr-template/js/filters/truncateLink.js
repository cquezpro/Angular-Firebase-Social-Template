'use strict';

angular.module('mantrackrApp').
    filter('truncateLink', function() {
        return function(input, length) {

            input = input.replace(/(ht|f)tp(s|):\/\//i, '').replace('.html', '');

            var parts = input.split('/');
            var host = parts[0];
            var filename = parts[parts.length-1];

            var shortened = host + '/' + filename;

            if(shortened.length > length) {
                var first = shortened.substr(0, length / 2);
                var last = shortened.substr(shortened.length - (length / 2), length / 2);
                shortened = first + '...' + last;
            }

            return shortened;

        }
    });