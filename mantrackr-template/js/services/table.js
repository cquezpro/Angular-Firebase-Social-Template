'use strict';

angular.module('mantrackrApp')
    .service('table', ['$http', '$rootScope', function($http, $rootScope) {

        function Table() {
            this.endPoint = false;

            this.result = false;

            this.searchText = '';

            this.tableLoadedCallback = function() {}

            this.options = {
                search_text: '',
                limit: 10,
                page: 1,
                sorting_field: '',
                sorting_direction: 'asc'
            };

            this.setRowLimit = function(limit) {
                this.options.limit = limit;
                this.options.page = 1;
                this.queryData();
            }

            this.setSearchText = function(text) {
                this.options.search_text = text;
                this.options.page = 1;
                this.queryData();
            }

            this.setPage = function(page) {
                this.options.page = page;
                this.queryData();
            }

            this.setSortingField = function(field) {
                this.options.sorting_direction = (field == this.options.sorting_field && this.options.sorting_direction == 'asc') ? 'desc' : 'asc'
                this.options.sorting_field = field;
                this.queryData();
            }

            this.queryData = function() {
                if(!this.endPoint) throw 'You must set an endpoint!';

                console.log(this.options);

                var self = this;
                this.result = false;

                $http.post(this.endPoint, this.options).success(function(result) {

                    self.result = result;
                    $rootScope.$broadcast('table.pageChanged', self.options.page);
                    self.tableLoadedCallback();

                });
            }

            this.checkAllRows = function(value) {
                angular.forEach(this.result.results, function(row, key) {
                    row.isChecked = value;
                });
            }

            this.getInstance = function(endPoint) {
                var table = new Table();
                table.endPoint = endPoint;
                return table;
            }
        }

        return new Table();

    }]);