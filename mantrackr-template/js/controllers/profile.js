'use strict';

angular.module('mantrackrApp')
    .controller('ProfileCtrl', ['$scope', '$rootScope', '$timeout', '$http',  function ($scope, $rootScope, $timeout, $http) {

    $scope.photoTab = true;
    $scope.profileContentWidth = 0;
    $scope.bProfileOwner = true;
    
    
    $scope.$on('profilePhotosRenderFinish', function(ngRepeatFinishedEvent){
    	
    	$scope.swipeProfilePhotoList();
		
	});
    
    
    $scope.filterPublicPhotos = function(){
    	
    	var photos = $rootScope.memberInfo.member_photo_list;
    	
    	var result = [];
    	
    	for (var photo in photos){
    		
    		if (photos[photo].is_public == '1') result.push(photos[photo]);
	
    	}
    	
    	return result;
    	
    }
    
    $scope.getEmptyPublicPhotosCount = function(){
    	
    	var public_photos = $scope.filterPublicPhotos();
    	
    	var arrayCount = $scope.maxPublicPhotoCount - public_photos.length;
    	
    	var result = [];
    	
    	for (var i = 0 ;  i < arrayCount; i++)
    		result.push(i);
    	
    	return result;
    	
    }
    
    $scope.filterPrivatePhotos = function(){
    	
    	var photos = $rootScope.memberInfo.member_photo_list;
    	
    	var result = [];
    	
    	for (var photo in photos){
    		
    		if (photos[photo].is_public == '0') result.push(photos[photo]);
	
    	}
    	
    	return result;
    	
    }
    
    $scope.getEmptyPrivatePhotosCount = function(){
    	
    	var private_photos = $scope.filterPrivatePhotos();
    	
    	var arrayCount = $scope.maxPrivatePhotoCount - private_photos.length;
    	
    	var result = [];
    	
    	for (var i = 0 ;  i < arrayCount; i++)
    		result.push(i);
    	
    	return result;
    	
    }
    
    $scope.maxPublicPhotoCount = 9;
    $scope.maxPrivatePhotoCount = 9;   
    
    $scope.$on("profileContentPageLoaded", function(event, args){
    
    	 $scope.profileContentWidth = args;
    	 
    	 $('#profileStatsChangeModal').on('show.bs.modal', function(e){
    		
    		 //$rootScope.customSelectBox();
    		 
    	 });
    	 
    	 
    	 $('#profileOpenToChangeModal').on('show.bs.modal', function(e){
     		
    		 //$rootScope.customSelectBox();
    		 
    	 });
    	 
    });
    
        
    $scope.showProfilePhotosDialog = function(){
    
    	$scope.photoListViewMode = 'List';
    	$('#myPhotosDialog').modal('show');
    	
    }
    
    $scope.$watch("photoListViewMode", function(newVal, oldVal){
    
    	var totalWidth = getScreenTotalWidth();
    	
    	if (newVal == 'ChangePrimary'){
    		
    		$('#replacePrimaryPhotoBtn').imgPicker({
 				el: '#primaryPhotoImgPreview',
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
 				complete: $scope.onPrimaryPhotoReplaced,
 				frontModal : '#myPhotosDialog',
 				
 			});
    		
    	}else if (newVal == 'List'){
    		
    		
    		var emptyPublicPhotos = $scope.getEmptyPublicPhotosCount();
    		
    		for(var emptyPhotoNum in emptyPublicPhotos){
    			
    			$('#newPublicPhotoBtn_'+emptyPhotoNum).imgPicker({
     				el: '#none',
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
     				complete: $scope.onPublicPhotoAdded,
     				frontModal : '#myPhotosDialog',
     				fileInputId : '#newPublicPhoto_file_' + emptyPhotoNum
     			});
    			
    		}
    		
    		var emptyPrivatePhotos = $scope.getEmptyPrivatePhotosCount();
    		
    		for(var emptyPhotoNum in emptyPrivatePhotos){
    			
    			$('#newPrivatePhotoBtn_'+emptyPhotoNum).imgPicker({
     				el: '#none',
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
     				complete: $scope.onPrivatePhotoAdded,
     				frontModal : '#myPhotosDialog',
     				fileInputId : '#newPrivatePhoto_file_' + emptyPhotoNum
     			});
    			
    		}
    		
    	}
    	
    });
    
    $scope.onPhotoListInitialized = function(){
    	
    	if ($scope.profilePhotoSwiper) $timeout($scope.profilePhotoSwiper.reInit, 100);
    	
    	$scope.selectFirstProfilePhoto();
    }
    
    $scope.onPhotoItemDeleted = function(){
    
    	if ($scope.profilePhotoSwiper && $scope.profilePhotoSwiper.swipeTo)
    		$scope.profilePhotoSwiper.swipeTo(0);
    }
    
    $scope.showPhotoEditDialog = function(type, index, id){
    	
    	if (id == $rootScope.memberInfo.primary_photo_id){
    		//$('#myPhotosDialog').modal('hide');
    		//$scope.showPrimaryPhotoReplaceDialog();
    		//return;
    		$scope.initPrimaryPhotoReplaceValues();
    		$scope.photoListViewMode = 'ChangePrimary';
    		return;
    	}
    	
    	$scope.currentPhotoEditIndex = index;
    	$scope.currentPhotoEditType = type;
    	$scope.currentPhotoEditId = id;
    	$scope.currentPhotoDeleted = false;
    	$scope.currentPhotoEditUrl = $rootScope.photoupload_baseuri + $rootScope.memberInfo.member_photo_list[id].path; 
    		
    	$scope.currentPhotoEditTitle = type + ' Photo #' + (index + 1);
    	
    	$scope.photoListViewMode = 'ChangePhoto';
    	
    	//$('#photoChangeModal').modal('show');
    }
    
    $scope.showCurrentPhotoEditDialog = function(){
    	
    	if ($scope.currentViewPhoto == '') return;
    	
    	$scope.showProfilePhotosDialog();
    	
    	$scope.showPhotoEditDialog($scope.currentViewPhotoType, parseIntegerNumber($scope.currentViewPhotoIndex), parseIntegerNumber($scope.currentViewPhotoId));
    	
    }
    
    $scope.saveCurrentProfilePhoto = function(){
    
    	if ($scope.currentPhotoDeleted){
    		
    		$rootScope.showLoadingDialog();
    		
    		$http({ method: 'POST', url: $rootScope.webservice_baseuri + "/member/removePhoto",
    			params: {'token' : $rootScope.userToken, 'photo_id' : $scope.currentPhotoEditId}
    		}).success(function (data, status, headers, config){
    						
    			if (data.code == undefined) {
    				$rootScope.hideLoadingDialog();
    				//$('#photoChangeModal').modal('hide');
    				$scope.photoListViewMode = 'List';
    				$rootScope.showAlert(1, "Upload error", "Network error.", "Ok");
    				return;
    			}
    			
    			if (data.code !== 0){
    				$rootScope.hideLoadingDialog();
    				//$('#photoChangeModal').modal('hide');
    				$scope.photoListViewMode = 'List';
    				$rootScope.showAlert(1, "Upload error", data.msg, "Ok");
    				return;
    			}
    			
    			delete $rootScope.memberInfo.member_photo_list[$scope.currentPhotoEditId];
    			//$rootScope.memberInfo.member_photo_list[$scope.currentPhotoEditId] = undefined;
    			
    			$rootScope.hideLoadingDialog();
    			
    			//$('#photoChangeModal').modal('hide');
    			$scope.photoListViewMode = 'List';
    			
    			$scope.onPhotoListInitialized();
    			
    			$scope.onPhotoItemDeleted();
    			    				
    		}).error(function(data, status, headers, config){
    		
    			$rootScope.hideLoadingDialog();
    			//$('#photoChangeModal').modal('hide');
    			$scope.photoListViewMode = 'List';
    			$rootScope.showAlert(1, "Upload error", "Network error.", "Ok");
    		
    		});
    		
    		
    		return;
    		
    	}
    	
    	
    	var prevPublicStatus = ($rootScope.memberInfo.member_photo_list[$scope.currentPhotoEditId].is_public == '1') ? 'Public' : 'Private';
    	
    	if (prevPublicStatus != $scope.currentPhotoEditType){
    		
    		$rootScope.showLoadingDialog();
    		
    		var photoPrivacyVal = ($scope.currentPhotoEditType == 'Public') ? "1" : "0";
    		
    		$http({ method: 'POST', url: $rootScope.webservice_baseuri + "/member/setPhotoPrivacy",
    			params: {'token' : $rootScope.userToken, 'photo_privacy' : photoPrivacyVal, 'photo_id' : $scope.currentPhotoEditId}
    		}).success(function (data, status, headers, config){
    						
    			if (data.code == undefined) {
    				$rootScope.hideLoadingDialog();
    				//$('#photoChangeModal').modal('hide');
    				$scope.photoListViewMode = 'List';
    				$rootScope.showAlert(1, "Upload error", "Network error.", "Ok");
    				return;
    			}
    			
    			if (data.code !== 0){
    				$rootScope.hideLoadingDialog();
    				//$('#photoChangeModal').modal('hide');
    				$scope.photoListViewMode = 'List';
    				$rootScope.showAlert(1, "Upload error", data.msg, "Ok");
    				return;
    			}
    			
    			$rootScope.memberInfo.member_photo_list[$scope.currentPhotoEditId].is_public = photoPrivacyVal;
    			    			
    			$rootScope.hideLoadingDialog();
    			
    			//$('#photoChangeModal').modal('hide');
    			$scope.photoListViewMode = 'List';
    			
    			$scope.onPhotoListInitialized();
    			    				
    		}).error(function(data, status, headers, config){
    		
    			$rootScope.hideLoadingDialog();
    			//$('#photoChangeModal').modal('hide');
    			$scope.photoListViewMode = 'List';
    			$rootScope.showAlert(1, "Upload error", "Network error.", "Ok");
    		
    		});
    		
    		
    		return;
    		
    	}
    	
    	//$('#photoChangeModal').modal('hide');
    	$scope.photoListViewMode = 'List';
    }
    
    
    $scope.initPrimaryPhotoReplaceValues = function(){
    	
    	$scope.primaryPhotoReplaceUrl = '';
    	//$scope.prevDialogID = '';
    	
    	$('#primaryPhotoImgPreview').prop("src", $rootScope.getMemberPhotoFullUrl(true));
    }
    
    $scope.onPrimaryPhotoReplaced = function(url){
    	
    	$scope.primaryPhotoReplaceUrl = url;
    }
    
    
    
    $scope.$on("$includeContentLoaded", function(e){
    	   	
    	$('#profilePhotoContainer .profilePhotoImg').width($scope.profileContentWidth);
    	$scope.swipeProfileInfoContainer();
    	
    })
    
    $scope.uploadNewProfilePhoto = function(is_public, url, callback){
    	
    	$rootScope.showLoadingDialog();
    	
    	$http({ method: 'POST', url: $rootScope.webservice_baseuri + "/member/uploadCroppedPhoto",
			params: {'token' : $rootScope.userToken, 'photo_file' : url, 'is_public' : is_public}
		}).success(function (data, status, headers, config){
						
			if (data.code == undefined) {
				$rootScope.hideLoadingDialog();
				$rootScope.showAlert(1, "Upload error", "Network error.", "Ok");
				if (callback) callback(false);
				return;
			}
			
			if (data.code !== 0){
				$rootScope.hideLoadingDialog();
				$rootScope.showAlert(1, "Upload error", data.msg, "Ok");
				if (callback) callback(false);
				return;
			}
			
			$rootScope.memberInfo.member_photo_list[data.photo_id] = data.photo_record;
			
			$rootScope.hideLoadingDialog();
			
			if (callback) callback(true, data.photo_record);
			    				
		}).error(function(data, status, headers, config){
		
			$rootScope.hideLoadingDialog();
			$rootScope.showAlert(1, "Upload error", "Network error.", "Ok");
		
			if (callback) callback(false);
		});
    	
    	
    }
    
    $scope.prevPhotoSaveUrl = '';
    
    $scope.onPublicPhotoAdded = function(url){
    	
    	if ($scope.prevPhotoSaveUrl == url) return;
    	
    	$scope.prevPhotoSaveUrl = url;
    	
    	$scope.uploadNewProfilePhoto(1, url, function(success, photo_record){
    		
    		$scope.onPhotoListInitialized();
    		
    	});
    	
    }
    
    $scope.onPrivatePhotoAdded = function(url){
    	
    	if ($scope.prevPhotoSaveUrl == url) return;
    	
    	$scope.prevPhotoSaveUrl = url;
    	
    	$scope.uploadNewProfilePhoto(0, url, function(success, photo_record){
    		
    		$scope.onPhotoListInitialized();
    		
    	});
    }
    
    
    $scope.uploadNewPrimaryPhoto = function(){
    	
    	$scope.uploadNewProfilePhoto(1, $scope.primaryPhotoReplaceUrl, function(success, photo_record){
    		
    		if (!success) return;
    		
    		//$rootScope.showLoadingDialog();
    		
    		$http({ method: 'POST', url: $rootScope.webservice_baseuri + "/member/updateProfile", params: {'token': $rootScope.userToken, 'primary_photo' : photo_record.id} }).
			success(function (data, status, headers, config){
				
				//$rootScope.hideLoadingDialog();
					    				
				if (data.code == undefined) {
					$rootScope.showAlert(1, "Update profile error", "Network error.", "Ok");
					return;
				}
				
				if (data.code !== 0){
					$rootScope.showAlert(1, "Update profile error", data.msg, "Ok");
					return;
				}
				
				//$rootScope.memberInfo.member_photo_list[photo_record.id] = photo_record;
				$rootScope.memberInfo.primary_photo_id = photo_record.id;
				$rootScope.memberInfo.primary_photo_approved = 0;
				    				
			}).error(function(data, status, headers, config){
			
				//$rootScope.hideLoadingDialog();
					    				
				$rootScope.showAlert(1, "Update profile error", "Network error.", "Ok");
		
			});
    		
    	});
    	
    }
    
    $scope.replacePrimaryPhoto = function(){
    
    	if ($scope.primaryPhotoReplaceUrl == ''){
    		//$('#primaryPhotoChangeModal').modal('hide');
    		$scope.photoListViewMode = 'List';
    		return;
    	}
    	
    	$rootScope.showLoadingDialog();
    	
    	
    	$http({ method: 'POST', url: $rootScope.webservice_baseuri + "/member/replacePhoto",
			params: {'token' : $rootScope.userToken, 'photo_file' : $scope.primaryPhotoReplaceUrl, 'replacePhotoId' : $rootScope.memberInfo.primary_photo_id}
		}).success(function (data, status, headers, config){
						
			if (data.code == undefined) {
				$rootScope.hideLoadingDialog();
				//$('#primaryPhotoChangeModal').modal('hide');
				$scope.photoListViewMode = 'List';
				$rootScope.showAlert(1, "Upload error", "Network error.", "Ok");
				return;
			}
			
			if (data.code !== 0){
				$rootScope.hideLoadingDialog();
				//$('#primaryPhotoChangeModal').modal('hide');
				$scope.photoListViewMode = 'List';
				if (data.code == 44){
					$scope.uploadNewPrimaryPhoto();
					return;
				}
				
				$rootScope.showAlert(1, "Upload error", data.msg, "Ok");
				return;
			}
			
			$rootScope.memberInfo.member_photo_list[data.photo_id] = data.photo_record;
			$rootScope.memberInfo.primary_photo_id = data.photo_id;
			$rootScope.memberInfo.primary_photo_approved = 0;
			
			$rootScope.hideLoadingDialog();
			//$('#primaryPhotoChangeModal').modal('hide');
			$scope.photoListViewMode = 'List';
			
			$scope.onPhotoListInitialized();
			    				
		}).error(function(data, status, headers, config){
		
			$rootScope.hideLoadingDialog();
			//$('#primaryPhotoChangeModal').modal('hide');
			$scope.photoListViewMode = 'List';
			$rootScope.showAlert(1, "Upload error", "Network error.", "Ok");
		
		});
    	
    }
    
    $scope.openStandoutStripPurchaseDlg = function(){
    	
    
    }
    
    $scope.$watch('photoTab', function (newVal, oldVal){
    	
    	$scope.reInitSwipers();
    	
    });
    
    $scope.$watch('memberInfo.age', function(newVal, oldVal){
    	
    	if (newVal == '' || newVal == null)
    		$scope.ageText = "Unknown";
    	else
    		$scope.ageText = newVal + "yo";
    });
    
    $scope.$watch('memberInfo.weight', function(newVal, oldVal){
    	
    	if (newVal == '' || newVal == null)
    		$scope.weightText = "Unknown";
    	else
    		$scope.weightText = newVal + "#";
    });


    $scope.$watch('memberInfo.height', function(newVal, oldVal){
    	
    	$scope.heightText = $rootScope.getHeightString(newVal);
    });
    
    $scope.$watch('memberInfo.ethnicity_id', function(newVal, oldVal){
    	
    	$scope.ethnicityText = $rootScope.getEthnicityString(newVal);
    });
    
    
    $scope.$watch('memberInfo.relationship_status_id', function(newVal, oldVal){
    	
    	$scope.relationshipText = $rootScope.getRelationshipStatusString(newVal);
    });
    
    $scope.$watch('memberInfo.opento_ids', function(newVal, oldVal){
    	
    	$scope.openToListText = $rootScope.getOpentoListText(newVal);
    });

    $scope.$watch('memberInfo.lookingfor', function(newVal, oldVal){
    	
    	$scope.lookingforText = newVal;
    	
    });
    
    $scope.$watch('memberInfo.description', function(newVal, oldVal){
    	
    	$scope.descriptionText = newVal;
    	
    });
    
    $scope.$watch('memberInfo.interests', function(newVal, oldVal){
    	
    	$scope.interestsText = newVal;
    	
    });

    
    $scope.$watch('profile_openTo_idlist', function(newVal, oldVal){
    	
    	$scope.chkOpenTo = [];
    	
    	for (var i = 0; i < $rootScope.opentoOptionList.length; i++){
    		
    		$scope.chkOpenTo[$rootScope.opentoOptionList[i].id] = false;
    		
    	}
    	
    	if (newVal == undefined || newVal.length == undefined) return;   	
    	
    	for (var i = 0; i < newVal.length; i++){
    		
    		var index = parseIntegerNumber(newVal[i]);
    		
    		if (index > 0) $scope.chkOpenTo[index] = true;
    	}
    		
    	
    });
    
    $scope.getOpenToListFromCheckbox = function(){
    	
    	var newValueArray = [];
    	
    	for (var i = 0; i < $rootScope.opentoOptionList.length; i++){
    		
    		if ($scope.chkOpenTo[$rootScope.opentoOptionList[i].id])
    			newValueArray.push($rootScope.opentoOptionList[i].id);
    	}
    	
    	$scope.profile_openTo = newValueArray.join(",");
    	
    };
    
    $scope.reInitSwipers = function(){
    	if ($scope.profilePhotoSwiper) $timeout($scope.profilePhotoSwiper.reInit, 100);
    	if ($scope.profileInfoSwiper) $timeout($scope.profileInfoSwiper.reInit, 100);
    }
    
    $scope.swipeProfilePhotoList = function(){
		
    	if ($scope.profilePhotoSwiper) return;
    	
		$scope.profilePhotoSwiper = new Swiper('#profilePhotoContainer', {
			mode: 'horizontal',
			slidesPerView: 1,
			pagination: '.profilePhotoPagination',
			paginationClickable: true,
			onSlideChangeEnd: function(swiper, direction){
				$scope.currentViewPhoto = getPhotoUrlOfSwiperSlide(swiper.activeSlide());
				$scope.currentViewPhotoType = getPhotoTypeOfSwiperSlide(swiper.activeSlide());
		    	$scope.currentViewPhotoId = getPhotoIdOfSwiperSlide(swiper.activeSlide());
		    	$scope.currentViewPhotoIndex = getPhotoIndexOfSwiperSlide(swiper.activeSlide());
		    	//$scope.$digest();
			}
		});
		
		$scope.selectFirstProfilePhoto();
		
	}
    
    $scope.currentViewPhoto = '';
    $scope.currentViewPhotoType = '';
    $scope.currentViewPhotoId = '';
    $scope.currentViewPhotoIndex = '';
    
    $scope.selectFirstProfilePhoto = function(){
    	
    	if (!$scope.profilePhotoSwiper || !$scope.profilePhotoSwiper.getSlide) return;
    	
    	var firstSlide = $scope.profilePhotoSwiper.getSlide(0);
    	
    	$scope.currentViewPhoto = getPhotoUrlOfSwiperSlide(firstSlide);
    	$scope.currentViewPhotoType = getPhotoTypeOfSwiperSlide(firstSlide);
    	$scope.currentViewPhotoId = getPhotoIdOfSwiperSlide(firstSlide);
    	$scope.currentViewPhotoIndex = getPhotoIndexOfSwiperSlide(firstSlide);
    	
    	//$scope.$digest();
    }

    
    $scope.swipePrevProfilePhoto = function(){
    	
    	if (!$scope.profilePhotoSwiper || !$scope.profilePhotoSwiper.swipePrev) return;
    	
    	$scope.profilePhotoSwiper.swipePrev();
    }
    
    
    $scope.swipeNextProfilePhoto = function(){
    	
    	if (!$scope.profilePhotoSwiper || !$scope.profilePhotoSwiper.swipeNext) return;
    	
    	$scope.profilePhotoSwiper.swipeNext();
    }
    
 
    $scope.swipeProfileInfoContainer = function(){
    	
    	//if ($scope.profileInfoSwiper) return;
    	
    	$scope.profileInfoSwiper = new Swiper('#profileInfoContainerSwiper', {
			mode: 'vertical',
			scrollContainer: true
		});
    }
    
    $scope.saveMemberName = function(){
    	
    	$rootScope.showLoadingDialog();
    	
    	$http({ method: 'POST', url: $rootScope.webservice_baseuri + "/member/updateProfile", params: {'token': $rootScope.userToken, 'name' : $scope.member_name} }).
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
			
			$('#nameChangeModal').modal('hide');
			
			$rootScope.memberInfo.name = $scope.member_name;
			    				
		}).error(function(data, status, headers, config){
		
			$rootScope.hideLoadingDialog();
				    				
			$rootScope.showAlert(1, "Update profile error", "Network error.", "Ok");
	
		});
    }
    
    $scope.saveMyStatus = function(){
    	
    	$rootScope.showLoadingDialog();
    	
    	
    	$http({ method: 'POST', url: $rootScope.webservice_baseuri + "/member/updateProfile", params: {'token': $rootScope.userToken, 'age' : $scope.profile_age, 'height' : $scope.profile_height, 'weight' : $scope.profile_weight, 'ethnicity_id' : $scope.profile_ethnicity} }).
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
			
			$('#profileStatsChangeModal').modal('hide');
			
			$rootScope.memberInfo.age = $scope.profile_age;
			$rootScope.memberInfo.height = $scope.profile_height;
			$rootScope.memberInfo.weight = $scope.profile_weight;
			$rootScope.memberInfo.ethnicity_id = $scope.profile_ethnicity;
			    				
		}).error(function(data, status, headers, config){
		
			$rootScope.hideLoadingDialog();
				    				
			$rootScope.showAlert(1, "Update profile error", "Network error.", "Ok");
	
		});
    }
    
    $scope.saveOpenToValues = function(){
    	
    	$rootScope.showLoadingDialog();
    	
    	$scope.getOpenToListFromCheckbox();
    	    	
    	$http({ method: 'POST', url: $rootScope.webservice_baseuri + "/member/updateProfile", params: {'token': $rootScope.userToken, 'relationship_status_id' : $scope.profile_relationship, 'opento_ids' : $scope.profile_openTo}}).
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
			
			$('#profileOpenToChangeModal').modal('hide');
			
			$rootScope.memberInfo.relationship_status_id = $scope.profile_relationship;
			$rootScope.memberInfo.opento_ids = $scope.profile_openTo;
			
			    				
		}).error(function(data, status, headers, config){
		
			$rootScope.hideLoadingDialog();
				    				
			$rootScope.showAlert(1, "Update profile error", "Network error.", "Ok");
	
		});    	
    }
    
    $scope.saveLookingFor = function(){
    	
    	$rootScope.showLoadingDialog();
    	    	
    	$http({ method: 'POST', url: $rootScope.webservice_baseuri + "/member/updateProfile", params: {'token': $rootScope.userToken, 'lookingfor' : $scope.profile_lookfor}}).
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
			
			$('#profileLookforDialog').modal('hide');
			
			$rootScope.memberInfo.lookingfor = $scope.profile_lookfor;
						
			    				
		}).error(function(data, status, headers, config){
		
			$rootScope.hideLoadingDialog();
				    				
			$rootScope.showAlert(1, "Update profile error", "Network error.", "Ok");
	
		});    	
    	
    }
    
    $scope.saveDescription = function(){
    	
    	$rootScope.showLoadingDialog();
    	
    	$http({ method: 'POST', url: $rootScope.webservice_baseuri + "/member/updateProfile", params: {'token': $rootScope.userToken, 'description' : $scope.profile_description}}).
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
			
			$('#profileAboutMeDialog').modal('hide');
			
			$rootScope.memberInfo.description = $scope.profile_description;
						
			    				
		}).error(function(data, status, headers, config){
		
			$rootScope.hideLoadingDialog();
				    				
			$rootScope.showAlert(1, "Update profile error", "Network error.", "Ok");
	
		});    	
    	
    }
    
    $scope.saveInterests = function(){
    	
    	$rootScope.showLoadingDialog();
    	
    	$http({ method: 'POST', url: $rootScope.webservice_baseuri + "/member/updateProfile", params: {'token': $rootScope.userToken, 'interests' : $scope.profile_interests}}).
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
			
			$('#profileMyInterestDialog').modal('hide');
			
			$rootScope.memberInfo.interests = $scope.profile_interests;
						
			    				
		}).error(function(data, status, headers, config){
		
			$rootScope.hideLoadingDialog();
				    				
			$rootScope.showAlert(1, "Update profile error", "Network error.", "Ok");
	
		});    	
    	
    }
    
    $('#nameChangeModal').on('show.bs.modal', function(e){
    
    	$scope.member_name = $rootScope.memberInfo.name;
    	
    });
    
    
    $('#profileStatsChangeModal').on('show.bs.modal', function(e){
        
    	$scope.profile_age = $rootScope.memberInfo.age;
    	
    	var height = parseFloatNumber($rootScope.memberInfo.height);
    	
    	$scope.profile_height = height.toFixed(1);
    	
    	$scope.profile_weight = $rootScope.memberInfo.weight;
    	$scope.profile_ethnicity = $rootScope.memberInfo.ethnicity_id;
    	
    });
    
    $('#profileOpenToChangeModal').on('show.bs.modal', function(e){
        
    	$scope.profile_relationship = $rootScope.memberInfo.relationship_status_id;
    	$scope.profile_openTo = $rootScope.memberInfo.opento_ids + "";
    	$scope.profile_openTo_idlist = $scope.profile_openTo.split(",");
    	
    });
    
    
    $('#profileLookforDialog').on('show.bs.modal', function(e){
        
    	$scope.profile_lookfor = $rootScope.memberInfo.lookingfor;
    	
    });
    
    $('#profileAboutMeDialog').on('show.bs.modal', function(e){
        
    	$scope.profile_description = $rootScope.memberInfo.description;
    	
    });
    
    $('#profileMyInterestDialog').on('show.bs.modal', function(e){
        
    	$scope.profile_interests = $rootScope.memberInfo.interests;
    	
    });

    
    
    $scope.photos_tab_public = true;
    
    
    
    $scope.showStandoutStatusDialog = function(){
		
		var standoutStatusDialog = $('#standoutStatusDialog');

		if (standoutStatusDialog) standoutStatusDialog.modal('show');
	}
    
    

    	
}]);