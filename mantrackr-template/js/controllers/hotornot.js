'use strict';

angular.module('mantrackrApp')
    .controller('HotOrNotCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
      
    	$scope.currentTab = 0;
    	
    	$scope.$on("hotOrNotContentPageLoaded", function(event, args){
    	    
       	
    	});
    	
   
    }]);