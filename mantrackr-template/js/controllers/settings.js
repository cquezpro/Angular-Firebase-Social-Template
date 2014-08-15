'use strict';

angular.module('mantrackrApp')
    .controller('SettingsCtrl', ['$scope', '$rootScope', '$http',  function ($scope, $rootScope, $http) {
    	
    	$scope.$on("settingsContentPageLoaded", function(event, args){
    		$scope.swipeSettingItemsContainer();
    	});
    	
    	$scope.settingItemsContainerSwipe = null;
    	
    	$scope.swipeSettingItemsContainer = function(){
    		
    		if ($scope.settingItemsContainerSwipe && $scope.settingItemsContainerSwipe.reInit){
        		$scope.settingItemsContainerSwipe.reInit();
        		return;
        	}
        	
        	$scope.settingItemsContainerSwipe = new Swiper('#settings-list-container', {
    			mode: 'vertical',
    			scrollContainer: true
    		});
    	}
   
    	
    	$scope.initializeJSliders = function(){
    		
    		jQuery("#filterAgeRangeSlider").slider({ from: 18, to: 98, heterogeneity: ['50/58', '75/78'], step: 1, skin: "mantrackr", dimension: '&nbsp;' });
    		
    		jQuery("#filterAgeRangeSlider").slider('resize');
    		
    		jQuery("#filterDistanceRangeSlider").slider({ from: 18, to: 98, heterogeneity: ['50/58', '75/78'], step: 1, skin: "mantrackr", dimension: '&nbsp;' });
    		
    		jQuery("#filterDistanceRangeSlider").slider('resize');
    	
    	} 
    	
    	
    	$('#settingsBrowsingFiltersDialog').on('shown.bs.modal', function(e){
    	    
    		if ($rootScope.memberInfo.is_premium == 1)
    			$scope.initializeJSliders();
        	
        });
    	
    	$scope.showFeedbackDialog = function(){
    		
    		var settingsRateDialog = $('#settingsRateDialog');

    		if (settingsRateDialog) settingsRateDialog.modal('hide');
    		
    		var settingsFeedbackDialog = $('#settingsFeedbackDialog');

    		if (settingsFeedbackDialog) settingsFeedbackDialog.modal('show');
    	}
    	
    	
    	$scope.showEmailEditDialog = function(){
    		
    		var settingsAccountInfoDialog = $('#settingsAccountInfoDialog');

    		if (settingsAccountInfoDialog) settingsAccountInfoDialog.modal('hide');
    		
    		var settingsEditEmailDialog = $('#settingsEditEmailDialog');

    		if (settingsEditEmailDialog) settingsEditEmailDialog.modal('show');
    		
    		$scope.chg_newEmail = '';
    		$scope.chg_newEmailConfirm = '';
    		
    	}
    	
    	$scope.showPasswordChangeDialog = function(){
    		
    		var settingsAccountInfoDialog = $('#settingsAccountInfoDialog');

    		if (settingsAccountInfoDialog) settingsAccountInfoDialog.modal('hide');
    		
    		var settingsChangePasswordDialog = $('#settingsChangePasswordDialog');

    		if (settingsChangePasswordDialog) settingsChangePasswordDialog.modal('show');
    		
    		$scope.chg_currentPassword = '';
    		$scope.chg_newPassword = '';
    		$scope.chg_newPasswordConfirm = '';
    		
    	}
    	
    	$scope.chg_currentPassword = '';
    	$scope.chg_newPassword = '';
    	$scope.chg_newPasswordConfirm = '';
    	
    	
    	$scope.changePassword = function(){
    		
    		if (!$scope.chg_currentPassword) {
    			$rootScope.showAlert(1, "Change password error", "Please enter your currrent password.", "Ok");
    			return;
    		}
    		
    		if (!$scope.chg_newPassword) {
    			$rootScope.showAlert(1, "Change password error", "Please enter your new password.", "Ok");
    			return;
    		}
    		
    		if ($scope.chg_newPassword != $scope.chg_newPasswordConfirm){
    			$rootScope.showAlert(1, "Change password error", "Password mismatch.", "Ok");
    			return;
    		}
    		
    		$rootScope.showLoadingDialog();
    		
    		$http({ method: 'POST', url: $rootScope.webservice_baseuri + "/member/changePassword", params: {'currentPassword': $scope.chg_currentPassword, 'newPassword' : $scope.chg_newPassword, 'token': $rootScope.userToken} }).
    			success(function (data, status, headers, config){
    				
    				$rootScope.hideLoadingDialog();
    				
    				if (data.code == undefined) {
    					$rootScope.showAlert(1, "Change password error", "Network error.", "Ok");
    					return;
    				}
    				
    				if (data.code !== 0){
    					$rootScope.showAlert(1, "Change password error", data.msg, "Ok");
    					return;
    				}
    				
    				var settingsChangePasswordDialog = $('#settingsChangePasswordDialog');

    	    		if (settingsChangePasswordDialog) settingsChangePasswordDialog.modal('hide');
    	    		
    	    		$rootScope.showAlert(0, "Change password success", "Password changed successfully.", "Ok");
    				    				
    			}).error(function(data, status, headers, config){
    			
    				$rootScope.hideLoadingDialog();
    				
    				$rootScope.showAlert(1, "Change password error", "Network error.", "Ok");
    			
    		});
    	
    	}
    	
    	
    	$scope.chg_newEmail = '';
    	$scope.chg_newEmailConfirm = '';
    	
    	
    	$scope.changeEmail = function(){
    		
    		if (!$scope.chg_newEmail) {
    			$rootScope.showAlert(1, "Change email error", "Please enter new email address.", "Ok");
    			return;
    		}
    		    		
    		if ($scope.chg_newEmail != $scope.chg_newEmailConfirm){
    			$rootScope.showAlert(1, "Change email error", "Email mismatch.", "Ok");
    			return;
    		}
    		
    		$rootScope.showLoadingDialog();
    		
    		$http({ method: 'POST', url: $rootScope.webservice_baseuri + "/member/changeEmail", params: {'newEmail': $scope.chg_newEmail, 'token': $rootScope.userToken} }).
    			success(function (data, status, headers, config){
    				
    				$rootScope.hideLoadingDialog();
    				
    				if (data.code == undefined) {
    					$rootScope.showAlert(1, "Change email error", "Network error.", "Ok");
    					return;
    				}
    				
    				if (data.code !== 0){
    					$rootScope.showAlert(1, "Change email error", data.msg, "Ok");
    					return;
    				}
    				
    				var settingsEditEmailDialog = $('#settingsEditEmailDialog');

    	    		if (settingsEditEmailDialog) settingsEditEmailDialog.modal('hide');
    	    		
    	    		$rootScope.memberInfo.email = $scope.chg_newEmail;
    	    		
    	    		$rootScope.showAlert(0, "Change email success", "Email changed successfully.", "Ok");
    				    				
    			}).error(function(data, status, headers, config){
    			
    				$rootScope.hideLoadingDialog();
    				
    				$rootScope.showAlert(1, "Change email error", "Network error.", "Ok");
    			
    		});
    	
    	}
    	
    }]);