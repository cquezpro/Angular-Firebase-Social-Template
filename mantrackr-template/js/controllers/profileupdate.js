'use strict';

angular.module('mantrackrApp')
    .controller('ProfileUpdateCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
      
    	$scope.name = '';
    	$scope.age = '';
    	$scope.height = '';
    	$scope.weight = '';
    	$scope.headline = '';
    	$scope.openedto = '';
    	$scope.lookingfor = '';
    	$scope.description = '';
    	$scope.interests = '';
    	$scope.location = '';
    	
    	$scope.updateProfile = function(){
    		
    		if (!$rootScope.isUserLoggedIn()) {
    			console.log("User has not logged in.");
    			return;
    		}
    		
    		var data = {'token' : $rootScope.userToken, 'name' : $scope.name, 'age' : $scope.age, 'height' : $scope.height, 'weight' : $scope.weight, 
    					'headline' : $scope.headline, 'openedto' : $scope.openedto, 'lookingfor' : $scope.lookingfor, 
    					'description' : $scope.description, 'interests' : $scope.interests, 'location' : $scope.location};
    		
    		$http({ method: 'POST', url: $rootScope.webservice_baseuri + "/member/updateProfile", params: data }).
    			success(function (data, status, headers, config){
    				
    				if (data.code == undefined) {
    					alert('Ajax Error!');
    					return;
    				}
    				
    				if (data.code !== 0){
    					alert(data.msg);
    					return;
    				}
    				
    				console.log('Profile updated successfully.');				
    		});
    		
    		
    	}
    	
    	
    }]);