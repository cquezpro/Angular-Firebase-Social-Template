'use strict';

angular.module('mantrackrApp')
    .controller('ProfileSyncCtrl', ['$scope', '$rootScope', '$firebase', function ($scope, $rootScope, $firebase) {
      
    	$scope.profileInfo = {};
    	
    	$scope.profileFirebaseConnected = false;
    	$scope.profileFirebase = undefined;
    	
    	$scope.syncProfile = function(userId){
    		
    		$scope.profileFirebaseConnected = false;
        	
        	$scope.profileFirebase = new Firebase($rootScope.firebase_baseuri + '/members/' + userId);
        	
        	$scope.profileFirebase.auth($rootScope.firebase_token, function(error, result) {
        		  if(error) {
        		    console.log("Firebase Login Failed!", error);
        		  } else {
        			  $scope.profileFirebaseConnected = true;
        			  $scope.profileInfo = $firebase($scope.profileFirebase);
        		  }
        	});
    		
    	}
    	
    	
    }]);