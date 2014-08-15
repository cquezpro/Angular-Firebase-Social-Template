'use strict';

angular.module('mantrackrApp')
    .controller('IndexCtrl', ['$scope', '$rootScope', '$timeout', '$http', function ($scope, $rootScope, $timeout, $http) {

    	$scope.splash_show = true;
    	
    	/*$timeout(function(){
    		
    		$scope.splash_show = false;
    		
    	}, 2000);*/
    	   	
    	
    	$scope.ethnicityListLoaded = false;
    	$scope.opentoOptionListLoaded = false;
    	$scope.relationshipStatusListLoaded = false;
    	$scope.firebaseConnected = false;
    	
    	$scope.checkInitializationStatus = function(){
    		
    		if ($scope.ethnicityListLoaded && $scope.opentoOptionListLoaded && $scope.relationshipStatusListLoaded /*&& $scope.firebaseConnected*/){
    			$scope.splash_show = false;
    		}
    		
    	}
    	
    	$scope.$watch("ethnicityListLoaded", function(newVal, oldVal){
    		$scope.checkInitializationStatus();
    	});
    	
    	$scope.$watch("opentoOptionListLoaded", function(newVal, oldVal){
    		$scope.checkInitializationStatus();
    	});
    	
    	$scope.$watch("relationshipStatusListLoaded", function(newVal, oldVal){
    		$scope.checkInitializationStatus();
    	});
    	
    	/*$scope.$watch("firebaseConnected", function(newVal, oldVal){
    		$scope.checkInitializationStatus();
    	});*/
    	
    	
    	$scope.loadConstValues = function(){
    		
    		$http({ method: 'GET', url: $rootScope.webservice_baseuri + "/admin/getEthnicityConstList"}).
			success(function (data, status, headers, config){
				
				if (data.code == undefined) {
					$rootScope.showAlert(1, "Initialization error", "Network error. Try again later", "Ok");
					return;
				}
				
				if (data.code !== 0){
					$rootScope.showAlert(1, "Initialization error", data.msg, "Ok");
					return;
				}
				
				$rootScope.ethnicityOptionList = data.results;
				
				$scope.ethnicityListLoaded = true;
				
			}).error(function(data, status, headers, config){
							
				$rootScope.showAlert(1, "Initialization error", "Network error. Try again later", "Ok");
			
			});
    		
    		    		
    		
    		$http({ method: 'GET', url: $rootScope.webservice_baseuri + "/admin/getOpentoOptionList"}).
			success(function (data, status, headers, config){
				
				if (data.code == undefined) {
					$rootScope.showAlert(1, "Initialization error", "Network error. Try again later", "Ok");
					return;
				}
				
				if (data.code !== 0){
					$rootScope.showAlert(1, "Initialization error", data.msg, "Ok");
					return;
				}
				
				$rootScope.opentoOptionList = data.results;
				
				$scope.opentoOptionListLoaded = true;
				
			}).error(function(data, status, headers, config){
							
				$rootScope.showAlert(1, "Initialization error", "Network error. Try again later", "Ok");
			
			});
    		
    		
    		    		
    		$http({ method: 'GET', url: $rootScope.webservice_baseuri + "/admin/getRelationshipStatusList"}).
			success(function (data, status, headers, config){
				
				if (data.code == undefined) {
					$rootScope.showAlert(1, "Initialization error", "Network error. Try again later", "Ok");
					return;
				}
				
				if (data.code !== 0){
					$rootScope.showAlert(1, "Initialization error", data.msg, "Ok");
					return;
				}
				
				$rootScope.relationshipStatusList = data.results;
				
				$scope.relationshipStatusListLoaded = true;
				
			}).error(function(data, status, headers, config){
							
				$rootScope.showAlert(1, "Initialization error", "Network error. Try again later", "Ok");
			
			});
    		
    	}
    	
    	$scope.loadConstValues();
    	
    	
    	$scope.connectToFirebase = function(){
    		
    		$rootScope.connectToFirebase(function(firebaseRef){
    			
    			if (firebaseRef == undefined) {
    				$rootScope.showAlert(1, "Initialization error", "Unable to connect to firebase back-end. Try again later", "Ok");
    				$scope.firebaseConnected = false;
    			}
    			else $scope.firebaseConnected = true;
    			
    			$scope.checkInitializationStatus();
    			
    		});
    	}
    	
    	$scope.connectToFirebase();
    	
    	$scope.goOffline = function(){
    		
    		$rootScope.hideLeftMenuPanel();
    		
    		$('#logoutModal').modal('show');
    	}

    	
}]);