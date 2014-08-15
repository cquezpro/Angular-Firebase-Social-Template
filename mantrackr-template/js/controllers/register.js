'use strict';

angular.module('mantrackrApp')
    .controller('RegisterCtrl', ['$scope', '$rootScope', '$http', '$upload', function ($scope, $rootScope, $http, $upload) {
      
    	$scope.email = '';
    	$scope.password = '';
    	$scope.confirm_password = '';
    	
    	$scope.currentLat = 0;
    	$scope.currentLng = 0;
    	$scope.currentAddress = '';
    	
    	$scope.register = function(){
    		
    		if ($scope.email == '') {
    			$rootScope.showAlert(1, "Registration error", "Please enter email address.", "Ok");
    			return;
    		}
    		
    		if ($scope.password == ''){
    			$rootScope.showAlert(1, "Registration error", "Please enter password.", "Ok");
    			return;
    		}
    		
    		if ($scope.password != $scope.confirm_password){
    			$rootScope.showAlert(1, "Registration error", "Password mismatch.", "Ok");
    			return;
    		}
    		
    		$rootScope.showLoadingDialog();
    		
    		$http({ method: 'POST', url: $rootScope.webservice_baseuri + "/member/register", params: {'email': $scope.email, 'password' : $scope.password, 'confirm_password' : $scope.confirm_password, 'lat' : $scope.currentLat, 'lng': $scope.currentLng, 'location': $scope.currentAddress} }).
    			success(function (data, status, headers, config){
    				
    				$rootScope.hideLoadingDialog();
    				
    				if (data.code == undefined) {
    					$rootScope.showAlert(1, "Registration error", "Network error.", "Ok");
    					return;
    				}
    				
    				if (data.code !== 0){
    					$rootScope.showAlert(1, "Registration error", data.msg, "Ok");
    					return;
    				}
    				
    				$scope.regStep1Result = data;
    				
    				$scope.regStep2 = true;
    				
    				$scope.initializeCropper();
    				    				
    			}).error(function(data, status, headers, config){
    			
    				$rootScope.hideLoadingDialog();
    				
    				$rootScope.showAlert(1, "Registration error", "Network error.", "Ok");
    			
    		});
    		
    		/*$scope.regStep2 = true;
    		$scope.initializeCropper();*/
    	}
    	
    	
    	$scope.selectedPhotoUrl = '';
    	$scope.primaryPhotoSelected = false;
    	
    	$scope.onPhotoSelected = function(url){
    	
    		$scope.selectedPhotoUrl = url;
    		
    		if (url != '')
    			$scope.primaryPhotoSelected = true;
    		else 
    			$scope.primaryPhotoSelected = false;
    		
    		$scope.$digest();
    	}
    	
    	$scope.initializeCropper = function(){
    	
    		/*var cropWnd = $('#photo-crop-window');
    		
    		if (!cropWnd) return;
    		
    		cropWnd.fadeIn();*/
    		
    		var totalWidth = getScreenTotalWidth();
    		
			$('#addPrimaryPhotoBtn').imgPicker({
				el: '#avatar_preview',
				type: 'avatar',
				title: 'Change your avatar',
				// Inline selector
				customInline: '#photo-crop-window',
				inline: '#cropper',
				yesButton: '#cropPhotoYes',
				api: $rootScope.webservice_baseuri + "/member/uploadTempPhoto",
				photoupload_baseuri: $rootScope.photoupload_baseuri,
				aspectRatio: '1:1',
				width: totalWidth,
				complete: $scope.onPhotoSelected,
				frontModal : '#registrationModal',
			});	
    		
			
    		/*$('#addPrimaryPhotoBtn').imgPicker({
				el: '#avatar_preview',
				type: 'avatar',
				width: 200,
				title: 'Change your avatar',
				// Inline selector
				inline: '#cropper',
				api: $rootScope.webservice_baseuri + "/member/uploadTempPhoto",
				photoupload_baseuri: $rootScope.photoupload_baseuri,
				aspectRatio: '1:1'
			});*/
    		
    	}
    	
    	
    	$scope.regStep2 = false;
    	    	
    	/*$('#registrationModal').on('hidden.bs.modal', function(e){
    		
    		$scope.regStep2 = false;
    		$scope.$digest();
    		
    	});*/
    	
    	$scope.termsChk = false;
    	
    	$scope.register_step2 = function(){
    	
    		if (!$scope.termsChk){
    			$rootScope.showAlert(1, "Registration error", "You should be over the age of 18 to continue.", "Ok");
    			return;
    		}
    		
    		var primaryPhotoFile = $('#userProfilePhoto');
    		
    		if (primaryPhotoFile[0].files == undefined || primaryPhotoFile[0].files[0] == undefined){
    			$rootScope.showAlert(1, "Registration error", "Please select your primary photo.", "Ok");
    			return;
    		}
    		
    		var photoFile =  primaryPhotoFile[0].files[0];
    		
    		$rootScope.showLoadingDialog();
    		
    		$upload.upload({
    			url: $rootScope.webservice_baseuri + "/member/uploadPhoto",
    			data: {'token': $scope.regStep1Result.token, 'is_public': 1 },
    			file: photoFile
    		}).success(function(data, status, headers, config){
    			
    			
    			
    			if (data.code == undefined) {
					$rootScope.showAlert(1, "Upload error", "Network error.", "Ok");
					return;
				}
				
				if (data.code !== 0){
					$rootScope.showAlert(1, "Upload error", data.msg, "Ok");
					return;
				}
				
				$scope.regStep1Result.member_info.member_photo_list[data.photo_id] = data.photo_record;
				$scope.regStep2Result = data;
				
								
				$http({ method: 'POST', url: $rootScope.webservice_baseuri + "/member/updateProfile", params: {'token': $scope.regStep1Result.token, 'primary_photo' : $scope.regStep2Result.photo_id} }).
	    			success(function (data, status, headers, config){
	    				
	    				$rootScope.hideLoadingDialog();
	    					    				
	    				if (data.code == undefined) {
	    					$rootScope.showAlert(1, "Update profile error", "Network error.", "Ok");
	    					return;
	    				}
	    				
	    				if (data.code !== 0){
	    					$rootScope.showAlert(1, "Update profile error", data.msg, "Ok");
	    					return;
	    				}
	    				
	    				$('#registrationModal').modal('hide');
	    				
	    				$scope.regStep1Result.member_info.primary_photo_id = $scope.regStep2Result.photo_id;
	    				
	    				$rootScope.setUserToken($scope.regStep1Result.token);
	    				
	    				$rootScope.setMemberInfo($scope.regStep1Result.member_info);
	    				
	    				$rootScope.gotoNearbyPage();
	    				    				
	    				$rootScope.bindMembers();
	    				
	    			}).error(function(data, status, headers, config){
	    			
	    				$rootScope.hideLoadingDialog();
	    					    				
	    				$rootScope.showAlert(1, "Update profile error", "Network error.", "Ok");
    			
    			});
				
    		}).error(function(data, status, headers, config){
    			
    			$rootScope.hideLoadingDialog();
				
				$rootScope.showAlert(1, "Upload error", "Network error.", "Ok");
    		});
    		
    	}
    	
    	
    	
    	
    	
    	$scope.register_step2_v2 = function(){
        	
    		if (!$scope.termsChk){
    			$rootScope.showAlert(1, "Registration error", "You should be over the age of 18 to continue.", "Ok");
    			return;
    		}
    		
    		if (!$scope.primaryPhotoSelected){
    			
    			$rootScope.showAlert(1, "Registration error", "Please select your primary photo.", "Ok");
    			return;
    		}
    		
    		
    		$rootScope.showLoadingDialog();
    		
    		$http({ method: 'POST', url: $rootScope.webservice_baseuri + "/member/uploadCroppedPhoto",
    				params: {'token' : $scope.regStep1Result.token, 'is_public' : 1, 'photo_file' : $scope.selectedPhotoUrl}
    			}).success(function (data, status, headers, config){
					
    				
    				if (data.code == undefined) {
    					$rootScope.hideLoadingDialog();
    					$rootScope.showAlert(1, "Upload error", "Network error.", "Ok");
    					return;
    				}
    				
    				if (data.code !== 0){
    					$rootScope.hideLoadingDialog();
    					$rootScope.showAlert(1, "Upload error", data.msg, "Ok");
    					return;
    				}
    				
    				$scope.regStep1Result.member_info.member_photo_list[data.photo_id] = data.photo_record;
    				$scope.regStep2Result = data;
    				
    				$http({ method: 'POST', url: $rootScope.webservice_baseuri + "/member/updateProfile", params: {'token': $scope.regStep1Result.token, 'primary_photo' : $scope.regStep2Result.photo_id} }).
	    			success(function (data, status, headers, config){
	    				
	    				$rootScope.hideLoadingDialog();
	    					    				
	    				if (data.code == undefined) {
	    					$rootScope.showAlert(1, "Update profile error", "Network error.", "Ok");
	    					return;
	    				}
	    				
	    				if (data.code !== 0){
	    					$rootScope.showAlert(1, "Update profile error", data.msg, "Ok");
	    					return;
	    				}
	    				
	    				$('#registrationModal').modal('hide');
	    				
	    				$scope.regStep1Result.member_info.primary_photo_id = $scope.regStep2Result.photo_id;
	    				
	    				$rootScope.setUserToken($scope.regStep1Result.token);
	    				
	    				$rootScope.setMemberInfo($scope.regStep1Result.member_info);
	    				
	    				$rootScope.setMemberSettings($scope.regStep1Result.member_settings);
	    					    				
	    				$rootScope.gotoNearbyPage();
	    				
	    				$rootScope.bindMembers();
	    				    				
	    			}).error(function(data, status, headers, config){
	    			
	    				$rootScope.hideLoadingDialog();
	    					    				
	    				$rootScope.showAlert(1, "Update profile error", "Network error.", "Ok");
    			
	    			});
    				
					    				
				}).error(function(data, status, headers, config){
				
					$rootScope.hideLoadingDialog();
					
					$rootScope.showAlert(1, "Upload error", "Network error.", "Ok");
				
				
			});
	
    	}
    	
    	$scope.selectPhoto = function(){
    		
    		$('#photoSelectOptionModal').modal();
    	}
    	
    	
    	$scope.getCurrentLocationInfo = function(){
    		
    		if (navigator.geolocation)
    			navigator.geolocation.getCurrentPosition($scope.onCurrentLocationFetched, $scope.onCurrentLocationFetched);
    		else
    			$scope.onCurrentLocationFetched(null);
    	}
    	
    	$scope.onCurrentLocationFetched = function(position){
    		
    		if (position){
    			if (position.code && position.code != 0) return;
    			if (position.coords && position.coords.latitude) $scope.currentLat = position.coords.latitude;
    			if (position.coords && position.coords.longitude) $scope.currentLng = position.coords.longitude;
    			
    			if ($scope.currentLat && $scope.currentLng){
    				
    				var latlng = new google.maps.LatLng($scope.currentLat, $scope.currentLng);
    				var geocoder = new google.maps.Geocoder();
    				
    				geocoder.geocode({'latLng': latlng}, function(results, status) {
				      if (status == google.maps.GeocoderStatus.OK) {
				        if (results[1]) {
				          $scope.currentAddress = results[1].formatted_address;
				        }
				      }
				    });
    				
    			}
    		}
    		
    	}
    	
    	$scope.getCurrentLocationInfo();
    	
    }]);