'use strict';

angular.module('mantrackrApp').
    filter('range', function() {
        return function(input, start, length) {

            start = parseInt(start);

            do {
                input.push(start);
                start++;
            } while(input.length < length);

            return input;

        }
    });