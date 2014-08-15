'use strict';

angular.module('mantrackrApp')
    .directive('fileUpload', function() {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, element, attrs, ngModel) {
                element.filestyle({
                    buttonText: 'Choose file'
                });

                if(ngModel) {
                    element.change(function() {
                        scope.$apply(function() {
                            ngModel.$setViewValue(element.val());
                        });
                    });

                    ngModel.$render = function() {
                        element.filestyle({'input': ngModel.$viewValue});
                    }
                }


            }
        };
    });
