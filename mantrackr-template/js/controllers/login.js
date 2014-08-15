'use strict';

angular.module('mantrackrApp')
    .controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$location', function ($scope, $rootScope, $http, $location) {
      
    	$scope.email = '';
    	$scope.password = '';
    	    	
    	
    	$scope.login = function(){
    		
    		if ($scope.email == '') {
    			$rootScope.showAlert(1, "Login error", "Please enter login email.", "Ok");
    			return;
    		}
    		
    		if ($scope.password == ''){
    			$rootScope.showAlert(1, "Login error", "Please enter password.", "Ok");
    			return;
    		}
    		
    		$rootScope.showLoadingDialog();
    		
    		$http({ method: 'POST', url: $rootScope.webservice_baseuri + "/member/login", params: {'email': $scope.email, 'password' : $scope.password} }).
    			success(function (data, status, headers, config){
    				
    				$rootScope.hideLoadingDialog();
    				
    				if (data.code == undefined) {
    					$rootScope.showAlert(1, "Login error", "Network error.", "Ok");
    					return;
    				}
    				
    				if (data.code !== 0){
    					$rootScope.showAlert(1, "Login error", data.msg, "Ok");
    					return;
    				}
    				
    				$rootScope.setUserToken(data.token);
    				
    				$rootScope.setMemberInfo(data.member_info);
    				$rootScope.setMemberSettings(data.member_settings);
    				    				
    				$scope.hideLoginDialog();
    				
    				$rootScope.gotoNearbyPage();
    				
    				$rootScope.bindMembers();
    				
    			}).error(function(data, status, headers, config){
    			
    				$rootScope.hideLoadingDialog();
    				
    				$rootScope.showAlert(1, "Login error", "Network error.", "Ok");
    			
    		});
    		
    		
    	}
    	
    	$scope.forgot_password_email = '';
    	
    	$scope.resetPassword = function(){
    		
    		if ($scope.forgot_password_email == '') {
    			$rootScope.showAlert(1, "Password recovery error", "Please enter login email.", "Ok");
    			return;
    		}
    		
    		$rootScope.showLoadingDialog();
    		
    		$http({ method: 'POST', url: $rootScope.webservice_baseuri + "/member/resetPassword", params: {'email': $scope.forgot_password_email} }).
    			success(function (data, status, headers, config){
    				
    				$rootScope.hideLoadingDialog();
    				
    				if (data.code == undefined) {
    					$rootScope.showAlert(1, "Password recovery error", "Network error.", "Ok");
    					return;
    				}
    				
    				if (data.code !== 0){
    					$rootScope.showAlert(1, "Password recovery error", data.msg, "Ok");
    					return;
    				}
    				
    				$rootScope.showAlert(0, "Password recovery", "New password has been sent to your email box.", "Ok");
    				
    			}).error(function(data, status, headers, config){
    			
    				$rootScope.hideLoadingDialog();
    				
    				$rootScope.showAlert(1, "Password recovery error", "Network error.", "Ok");
    			
    		});
    		
    	}
    	
    	$scope.test = function(){
    		
    		$rootScope.setUserToken("test_token");
			
			$scope.hideLoginDialog();
			
			$rootScope.gotoNearbyPage();
    	}
    	    	
    	
    	
    	
    	$scope.forgotPasswordModal = false;
    	
    	$scope.hideLoginDialog = function(){
    		
    		if ($scope.forgotPasswordModal)
    			$scope.forgotPasswordModal = false;
    		else
    			$('#loginModal').modal('hide');
    	}
    	
    	
    	
    	$('#loginModal').on('hidden.bs.modal', function(e){
    		
    		$scope.forgotPasswordModal = false;
    		$scope.$digest();
    		
    	});
    	
    	
    	
    }]);