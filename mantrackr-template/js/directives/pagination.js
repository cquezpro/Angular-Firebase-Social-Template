'use strict';

angular.module('mantrackrApp')
    .directive('pagination', function() {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                paginationOnChange: '=onChange',
                paginationTotalPages: '=totalPages',
                paginationCurrentPage: '=currentPage'
            },
            template: '<div class="pagination" ng-show="totalPages">' +
                        '<ul>' +
                            '<li ng-class="currentPage == 1 && \'disabled\' || \'\'"><a href="javascript:;" ng-click="goToPage(1)"><i class="icon-double-angle-left"></i> First</a></li>' +
                            '<li ng-class="currentPage == 1 && \'disabled\' || \'\'"><a href="javascript:;" ng-click="goToPreviousPage()"><i class="icon-angle-left"></i> Previous</a></li>' +
                            '<li ng-repeat="page in pages" ng-class="page == currentPage && \'active\' || \'\'"><a href="javascript:;" ng-click="goToPage(page)">{{ page }}</a></li>' +
                            '<li ng-class="currentPage == totalPages && \'disabled\' || \'\'"><a href="javascript:;" ng-click="goToNextPage()">Next <i class="icon-angle-right"></i></a></li>' +
                            '<li ng-class="currentPage == totalPages && \'disabled\' || \'\'"><a href="javascript:;" ng-click="goToPage(totalPages)">Last <i class="icon-double-angle-right"></i></a></li>' +
                        '</ul>' +
                        '</div>'
            ,
            link: function(scope, element, attrs) {

                scope.currentPage = 1;
                scope.pages = [];

                var reloadPages = function() {
                    var pages = [];
                    for(var i = scope.currentPage - 3; i <= scope.currentPage; i++) {
                        if(i > 0) {
                            pages.push(i);
                        }

                    }
                    while(pages.length < 7 && pages[pages.length - 1] < scope.totalPages) {
                        pages.push(pages[pages.length - 1] + 1);
                    }
                    while(pages.length < 7 && pages[0] > 1) {
                        pages.unshift(pages[0] - 1);
                    }
                    scope.pages = pages;
                }

                scope.goToPage = function(page) {
                    if(page == scope.currentPage) return;

                    scope.currentPage = page;
                    if(attrs.onChange) {
                        scope.paginationOnChange(page);
                    }
                    reloadPages();
                }

                scope.goToPreviousPage = function() {
                    if(scope.currentPage > 1) {
                        scope.goToPage(scope.currentPage - 1);
                    }
                }

                scope.goToNextPage = function() {
                    if(scope.currentPage < scope.totalPages) {
                        scope.goToPage(scope.currentPage + 1);
                    }
                }

                scope.$watch('paginationTotalPages', function(newValue, oldValue) {
                    if(newValue) {
                        scope.totalPages = Math.ceil(newValue);
                        reloadPages();
                    }
                });

                scope.$watch('paginationCurrentPage', function(newValue, oldValue) {
                    if(newValue) {
                        scope.currentPage = newValue;
                        reloadPages();
                    }
                });

            }
        }
    });