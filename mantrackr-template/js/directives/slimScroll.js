'use strict';

angular.module('mantrackrApp')
    .directive('slimScroll', ['$timeout', function($timeout) {
        return {
            restrict: 'EA',
            transclude: true,
            template:  '<div><div ng-transclude></div></div>',
            replace: true,
            link: function(scope, element, attr) {
                $timeout(function() {
                    element.slimScroll({
                        height: attr.height + 'px'
                    });
                }, 10);
            }
        }
    }]);