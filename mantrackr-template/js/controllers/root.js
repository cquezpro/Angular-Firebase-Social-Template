'use strict';

angular.module('mantrackrApp')
    .controller('RootCtrl', ['$rootScope', '$timeout', '$location', '$http', '$firebase', function ($rootScope, $timeout, $location, $http, $firebase) {
      
    	/* Begin : Configuration Management */
    	
    	//$rootScope.webservice_hosturi = 'http://mantrackr-7cdltndi.dotcloud.com/';
		$rootScope.webservice_hosturi = 'http://localhost:1111/mantrackr_service/';
    	$rootScope.webservice_baseuri = $rootScope.webservice_hosturi + 'index.php';
    	$rootScope.photoupload_baseuri = $rootScope.webservice_hosturi + 'application/uploads/';
    	$rootScope.assets_baseuri = $rootScope.webservice_hosturi + 'application/assets/';
    	$rootScope.assets_imagebaseuri = $rootScope.assets_baseuri + 'img/';
    	
    	//$rootScope.firebase_baseuri = 'https://mantrackr.firebaseio.com';
    	//$rootScope.firebase_token = 'ToXfevZY5daLQ2BYGBm1bO7lDJMyj38Qw2DoxPX7';// graham's token
        $rootScope.firebase_baseuri = 'https://mantracker.firebaseio.com';
        $rootScope.firebase_token = 'oAZxwpGM3VkOQolL2tDN2KEQT6RO9fzjpCBHXx9b';
        
    	
    	/* End : Configuration Management */
    	
    	
    	/* Begin : Global Variables */
    	$rootScope.userToken = '';
    	$rootScope.memberInfo = [];
    	$rootScope.memberSettings = [];
    	
    	$rootScope.firebaseConnected = false;
    	$rootScope.firebaseRef = undefined;
    	
    	$rootScope.userLoggedIn = false;
    	
    	$rootScope.isUserLoggedIn = function(){
    		
    		return $rootScope.userLoggedIn;
    		
    		//return ($rootScope.userToken == '') ? false : true;
    		
    	}
    	
    	$rootScope.setUserToken = function($token){
    		
    		$rootScope.userToken = $token;
    		
    		if ($token != '')
    			$rootScope.userLoggedIn = true;
    		else
    			$rootScope.userLoggedIn = false;
    	}
    	
    	$rootScope.reorderMenuItems = function(){
    		console.log("reorderMenuItems");
    		var menuOrderArray = getMenuOrderListFromString($rootScope.memberSettings.menu_order);
    		
    		$('#dynamic-left-menu-container li').sortElements(function(a, b){
    			
    			var a_id = $(a).attr("data-mnu-id");
    			var b_id = $(b).attr("data-mnu-id");
    			
    			return menuOrderArray[a_id] > menuOrderArray[b_id];
    		});
    		
    	}
    	
    	$rootScope.getAppMemberPhotoUrl = function(memberId, ignorePending){
    		
    		var errorImageUrl = {'thumb': $rootScope.assets_imagebaseuri + "avatars/noimage.jpg", 'full': $rootScope.assets_imagebaseuri + "avatars/noimage.jpg"};
    		var pendingImageUrl = {'thumb': $rootScope.assets_imagebaseuri + "avatars/pendingPhoto.png", 'full' : $rootScope.assets_imagebaseuri + "avatars/pendingPhoto.png"};
    		
    		var member = $rootScope.members[memberId];
    		
    		if (!member) return errorImageUrl;
    		
    		if (member.primary_photo_approved != '1' && !ignorePending) return pendingImageUrl;
    		
    		if (!member.photos || !member.photos[member.primary_photo_id]) return errorImageUrl;
    		
    		return {'thumb' : $rootScope.photoupload_baseuri + member.photos[member.primary_photo_id].thumb_path,
    				'full' : $rootScope.photoupload_baseuri + member.photos[member.primary_photo_id].path};
    	}
    	
    	$rootScope.getMemberPhotoUrl = function(ignorePending){
    		
    		return $rootScope.getAppMemberPhotoUrl($rootScope.memberInfo.id, ignorePending);
    	}
    	
    	$rootScope.getMemberPhotoThumbUrl = function(ignorePending){
    		
    		var result = $rootScope.getMemberPhotoUrl(ignorePending);
    		return result.thumb;
    		
    	}
    	
    	$rootScope.getMemberPhotoFullUrl = function(ignorePending){
    		
    		var result = $rootScope.getMemberPhotoUrl(ignorePending);
    		return result.full;
    		
    	}
    	
    	$rootScope.getAppMemberPhotoThumbUrl = function(memberId, ignorePending){
    		
    		var result = $rootScope.getAppMemberPhotoUrl(memberId, ignorePending);
    		return result.thumb;
    		
    	}
    	
    	$rootScope.getAppMemberPhotoFullUrl = function(memberId, ignorePending){
    		
    		var result = $rootScope.getAppMemberPhotoUrl(memberId, ignorePending);
    		return result.full;
    		
    	}
    	
    	$rootScope.isStandoutPopupDialogShown = false;
    	

    	$rootScope.bindMembers = function(){
	  		
    		var rootRef = $rootScope.firebaseRef;
    		
    		var membersFirebaseRef = rootRef.child('members/');
    		
    		$rootScope.members = $firebase(membersFirebaseRef);
    		
    	}
    	
    	    	
    	$rootScope.setMemberInfo = function(member_info){
    		$rootScope.memberInfo = member_info;
    		
    		$rootScope.bindMemberMessages();
    	}
    	
    	$rootScope.setMemberSettings = function(member_settings){
    		$rootScope.memberSettings = member_settings;
    		
    		$rootScope.reorderMenuItems();
    	}
    	
    	$rootScope.bindMemberMessages = function(){
    		
    		var rootRef = $rootScope.firebaseRef;
    		
    		var myBoxFirebaseRef = rootRef.child('messages/' + $rootScope.memberInfo.id + "/");
    		
    		$rootScope.memberInfo.myMessageBox = $firebase(myBoxFirebaseRef);
    		
    	}
    	
    	$rootScope.firebaseTimeOffset = 0;
    	
    	
    	$rootScope.connectToFirebase = function(callback){
    		
    		if ($rootScope.firebaseConnected && $rootScope.firebaseRef){
    			callback($rootScope.firebaseRef);
    			return;
    		}
    		
    		$rootScope.firebaseRef = new Firebase($rootScope.firebase_baseuri);
    		
    		$rootScope.firebaseRef.auth($rootScope.firebase_token, function(error, result) {
      		  if(error) {
      		    //console.log("Firebase Login Failed!", error);
      		    $rootScope.firebaseRef = undefined;
      		    callback($rootScope.firebaseRef);
      		  } else {
      			  //console.log("connected!");
      			  $rootScope.firebaseConnected = true;
      			  
      			  $rootScope.firebaseRef.child('.info/serverTimeOffset').on("value", function(snap){
      				  
      				$rootScope.firebaseTimeOffset = snap.val();
      				
      			  });
      			
      			  callback($rootScope.firebaseRef);
      			  
      		  }
      	});
    		
    	}
    	
    	$rootScope.getCurrentFirebaseTimestamp = function(){
    		
    		
    		return $rootScope.getCurrentLocalTimestamp() + $rootScope.firebaseTimeOffset;
    		
    		//return $rootScope.getCurrentLocalTimestamp();
    		
    	}
    	
    	$rootScope.getCurrentLocalTimestamp = function(){
    		
    		return new Date().getTime();
    	}
    	
    	$rootScope.getElapsedFirebaseTime = function(time){
    		
    		var now = $rootScope.getCurrentFirebaseTimestamp();
    		
    		return getElapsedTime(now, time);
    	}
    	
    	
    	$rootScope.logout = function(){
    		
    		if (!$rootScope.isUserLoggedIn()) return;
    		
    		$http({ method: 'POST', url: $rootScope.webservice_baseuri + "/member/logout", params: {'token': $rootScope.userToken} }).
			success(function (data, status, headers, config){
				
				if (data.code == undefined) {
					$rootScope.showAlert(1, "Logout error", "Network error.", "Ok");
					return;
				}
				
				if (data.code !== 0){
					$rootScope.showAlert(1, "Logout error", data.msg, "Ok");
					return;
				}
				
				$rootScope.setUserToken('');
				$rootScope.memberInfo = [];
				
				$('#logoutModal').modal('hide');
				
				$rootScope.gotoHomePage();
								
			});
		
    	}
    	
    	$rootScope.ethnicityOptionList = [];
    	$rootScope.opentoOptionList = [];
    	$rootScope.relationshipStatusList = [];
    	
    	/* End : Global Variables */
    	
    	
    	/* Begin : Location Management */
    	
    	$rootScope.pathList = {
    		rootPath : "/",
    		nearbyPath : "/nearby",
    		profilePath : "/profile",
    		memberProfilePath : "/memberProfile",
    		hotOrNotPath : "/hotNot",
    		onlineMembersPath: "/online",
    		settingsPath:	"/settings",
    		globalMembersPath: "/global",
    		lookingMembersPath: "/looking",
    		favoritesMembersPath: "/favorites",
    		chatsMembersPath: "/chats",
    		woofsMembersPath: "/woofs",
    		tracksMemberPath: "/tracks"
    	};
    	
    	
    	$rootScope.prevPath = "/";
    	$rootScope.currentPath = "/";
    	
    	$rootScope.$on('$locationChangeSuccess', function(angularEvent, newUrl, oldUrl){
    	
    		$rootScope.prevPath = $rootScope.currentPath;
    		$rootScope.currentPath = $location.path();
    		
    		if ($rootScope.currentPath == $rootScope.pathList.nearbyPath)
    			$rootScope.currentPageTitle = "Nearby";
    		if ($rootScope.currentPath == $rootScope.pathList.onlineMembersPath)
    			$rootScope.currentPageTitle = "Online";
    		else if ($rootScope.currentPath == $rootScope.pathList.hotOrNotPath)
    			$rootScope.currentPageTitle = "Hot/Not";
    		else if ($rootScope.currentPath == $rootScope.pathList.globalMembersPath)
    			$rootScope.currentPageTitle = "Global";
    		else if ($rootScope.currentPath == $rootScope.pathList.lookingMembersPath)
    			$rootScope.currentPageTitle = "Looking Now";
    		else if ($rootScope.currentPath == $rootScope.pathList.favoritesMembersPath)
    			$rootScope.currentPageTitle = "Favorites";
    		else if ($rootScope.currentPath == $rootScope.pathList.chatsMembersPath)
    			$rootScope.currentPageTitle = "Chats";
    		else if ($rootScope.currentPath == $rootScope.pathList.woofsMembersPath)
    			$rootScope.currentPageTitle = "Woofs";
    		else if ($rootScope.currentPath == $rootScope.pathList.tracksMemberPath)
    			$rootScope.currentPageTitle = "Tracks";
    		
    	});
    	
    	$rootScope.gotoHomePage = function(){
    		$rootScope.gotoPage($rootScope.pathList.rootPath);
    	}
    	
    	$rootScope.gotoMemberProfilePage = function(memberid){
    		
    		if (memberid == $rootScope.memberInfo.id)
    			$rootScope.gotoProfilePage();
    		else
    			$rootScope.gotoPage($rootScope.pathList.memberProfilePath + "/" + memberid);
    	}
    	
    	$rootScope.gotoProfilePage = function(){
    		$rootScope.gotoPage($rootScope.pathList.profilePath);
    	}
    	
    	$rootScope.gotoNearbyPage = function(){
    		$rootScope.gotoPage($rootScope.pathList.nearbyPath);
    		
    	}
    	
    	$rootScope.gotoHotNotPage = function(){
    		$rootScope.gotoPage($rootScope.pathList.hotOrNotPath);
    	}
    	
    	$rootScope.gotoSettingsPage = function(){
    		$rootScope.gotoPage($rootScope.pathList.settingsPath);
    	}

    	$rootScope.gotoPage = function(path){
    		$location.path(path);
    	}
    	
    	$rootScope.gotoBack = function($path){
    		$location.path($rootScope.prevPath);
    	}
    	
    	/* End : Location Management */
    	
    	
    	/* Begin : UI related */
    	
    	$rootScope.$on('$viewContentLoaded', function(){
    		  
    		if ($rootScope.currentPath == $rootScope.pathList.nearbyPath){
    	        
    			$rootScope.showMainHeader = true;
    			
        		$rootScope.createPanel();
        		
        		$rootScope.$broadcast("memberGridContentPageLoaded");
        		
    		}else if ($rootScope.currentPath == $rootScope.pathList.onlineMembersPath || 
    				$rootScope.currentPath == $rootScope.pathList.globalMembersPath ||
    				$rootScope.currentPath == $rootScope.pathList.lookingMembersPath || 
    				$rootScope.currentPath == $rootScope.pathList.favoritesMembersPath || 
    				$rootScope.currentPath == $rootScope.pathList.chatsMembersPath ||
    				$rootScope.currentPath == $rootScope.pathList.woofsMembersPath || 
    				$rootScope.currentPath == $rootScope.pathList.tracksMemberPath){
    			
    			$rootScope.showMainHeader = true;
        		
        		$rootScope.$broadcast("memberGridContentPageLoaded");
        		
    		}else if ($rootScope.currentPath == $rootScope.pathList.profilePath){
    			
    			$rootScope.showMainHeader = false;

    			$rootScope.$broadcast("profileContentPageLoaded", $('#profileNavTabs').width());
    			
    		}else if ($rootScope.currentPath.indexOf($rootScope.pathList.memberProfilePath) != -1){
    			
    			$rootScope.showMainHeader = false;
    			
    			$rootScope.$broadcast("memberProfileContentPageLoaded", $('#profileNavTabs').width());
    			
    		}else if ($rootScope.currentPath == $rootScope.pathList.hotOrNotPath){
    			
    			$rootScope.showMainHeader = true;
    			
    			$rootScope.$broadcast("hotOrNotContentPageLoaded");
    			
    		}else if ($rootScope.currentPath == $rootScope.pathList.settingsPath){
    			
    			$rootScope.showMainHeader = false;
    			
    			$rootScope.$broadcast("settingsContentPageLoaded");
    		}
    		   		
    		
    		$rootScope.registerVerticalCenterDialogs();
    		
    	});
    	
    	
    	
    	$rootScope.showLeftMenuPanel = function(){
    		
    		$('#leftMenuPanel').panel("toggle");
 
    	}
    	
    	$rootScope.hideLeftMenuPanel = function(){
    		$('#leftMenuPanel').panel("close");
    	}
    	
    	$rootScope.showActivityPanel = function(){
    		
    		$('#activityPanel').panel("toggle");
    	}
    	
    	
    	$rootScope.createPanel = function(){
    		
    		$('#leftMenuPanel').panel({display: "overlay", animate: true});
    		    		
    		$rootScope.swipeLeftMenuPanel();
    		
    		$('.ui-panel-dismiss[data-panelid="leftMenuPanel"]').hammer().on("touch", function(event){$('#leftMenuPanel').panel("close");});
    		$('.ui-panel-dismiss[data-panelid="leftMenuPanel"]').hammer().on("tap", function(event){$('#leftMenuPanel').panel("close");});
    		$('.ui-panel-dismiss[data-panelid="leftMenuPanel"]').hammer().on("swipe", function(event){$('#leftMenuPanel').panel("close");});
    		
    		
    		$('#activityPanel').panel({display: "overlay", animate: true, position: "right"});
    		
    		$rootScope.swipeActivityPanel();
    		
    		$('.ui-panel-dismiss[data-panelid="activityPanel"]').hammer().on("touch", function(event){$('#activityPanel').panel("close");});
    		$('.ui-panel-dismiss[data-panelid="activityPanel"]').hammer().on("tap", function(event){$('#activityPanel').panel("close");});
    		$('.ui-panel-dismiss[data-panelid="activityPanel"]').hammer().on("swipe", function(event){$('#activityPanel').panel("close");});
    		
    		
    		$('#searchResultPanel').panel({display: "overlay", animate: true, position: "right"});
    	
    		$rootScope.swipeSearchMembersPanel();
    		
    		$('.ui-panel-dismiss[data-panelid="searchResultPanel"]').hammer().on("touch", function(event){$('#searchResultPanel').panel("close");});
    		$('.ui-panel-dismiss[data-panelid="searchResultPanel"]').hammer().on("tap", function(event){$('#searchResultPanel').panel("close");});
    		$('.ui-panel-dismiss[data-panelid="searchResultPanel"]').hammer().on("swipe", function(event){$('#searchResultPanel').panel("close");});
    	}
    	
    	
    	$rootScope.doSimpleSearch = function(){
    		
    		$rootScope.memberSearchMode = 'Simple';
    		
    		$('#searchMembersModal').modal('hide');
    		
    		$('#searchResultPanel').panel('toggle');
    		
    	}
    	
    	$rootScope.doAdvancedSearch = function(){
    		
    		$rootScope.memberSearchMode = 'Advanced';
    		
    		$('#searchMembersModal').modal('hide');
    		
    		$('#searchResultPanel').panel('toggle');
    	}
    	
    	$rootScope.closeSearchResultPanel = function(){
    		
    		$('#searchResultPanel').panel('close');
    	}
    	
    	
    	$rootScope.swipeLeftMenuPanel = function(){
    		$rootScope.leftMenuSwiper = new Swiper('#leftMenuContainerSwiper', {
    			mode: 'vertical',
    			scrollContainer: true
    		});
    	}
    	
    	$rootScope.swipeActivityPanel = function(){
    		$rootScope.activityPanelSwiper = new Swiper('#activityPanelSwiper', {
    			mode: 'vertical',
    			scrollContainer: true
    		});
    	}
    	
    	$rootScope.swipeSearchMembersPanel = function(){
    		$rootScope.searchResultContentSwiper = new Swiper('#searchResultContainer', {
    			mode: 'vertical',
    			scrollContainer: true
    		});
    	}

    	$rootScope.showMainHeader = true;
    	
    	$rootScope.centerModal = function(){
    		
			$(this).css('display', 'block');
			
			var $dialog = $(this).find('.modal-dialog');
			var offset = ($(document).height() - $dialog.height()) / 2;
			
			$dialog.css("margin-top", offset);
			    		
    	}
    	
    	
    	$rootScope.registerVerticalCenterDialogs = function(){
    		
    		$('.modal-vertical-center').on('show.bs.modal', $rootScope.centerModal);
    		$('.modal-vertical-center').on('shown.bs.modal', $rootScope.centerModal);
    		
    		/*$(window).on('resize', function(){
    			$('.modal-vertical-center').each($rootScope.centerModal);
    		})*/
    		
    	}
    	
    	$rootScope.registerVerticalCenterDialogs();
    	
    	$rootScope.showLoadingDialog = function(){
    	
    		var $loadingContainer = $('#loading-wrapper');
    		var $loadingDialog = $('#loadingDialog');
    		
    		if (!$loadingContainer || !$loadingDialog) return;
    		
    		$loadingContainer.zIndex(1040);
    		
    		$loadingDialog.modal();
    		
    		$loadingDialog.on('hidden.bs.modal', function(e){
    			$loadingContainer.zIndex(-100);
    		});
    		
    	}
    	
    	$rootScope.hideLoadingDialog = function(){
    		
    		var $loadingDialog = $('#loadingDialog');
    		if ($loadingDialog) $loadingDialog.modal('hide');
    		
    	}
    	
    	$rootScope.showMenuReorderDialog = function(){
    		
    		$rootScope.hideLeftMenuPanel();
    		
    		var menuReorderDialog = $('#menuReorderDialog');

    		if (menuReorderDialog) menuReorderDialog.modal('show');
    		
    	}
    	
    	$rootScope.slipReorderListInitialized = false;
    	
    	$rootScope.initSlipReorderList = function(){
    		
    		if ($rootScope.slipReorderListInitialized) return;
    		
    		$rootScope.menureorder_swiper = new Swiper('#menu-reorder-container-list', {
    			mode: 'vertical',
    			scrollContainer: true,
    			noSwiping: true,
    			noSwipingClass: 'instant'
    		});
    		
    		var ol = document.getElementById('slippylist');
    		
    	    ol.addEventListener('slip:beforereorder', function(e){

    	        if (/demo-no-reorder/.test(e.target.className)) {
    	            e.preventDefault();
    	        }
    	        else if (!/fa/.test(e.target.className)){
    	        	e.preventDefault();
    	        }
    	        
    	    }, false);

    	    ol.addEventListener('slip:beforeswipe', function(e){
    	        if (e.target.nodeName == 'INPUT' || /demo-no-swipe/.test(e.target.className)) {
    	            e.preventDefault();
    	        } else if (!/allow-swipe/.test(e.target.className)){
    	        	e.preventDefault();
    	        }
    	    }, false);

    	    ol.addEventListener('slip:beforewait', function(e){
    	        if (e.target.className.indexOf('instant') > -1) e.preventDefault();
    	    }, false);

    	    ol.addEventListener('slip:afterswipe', function(e){
    	        e.target.parentNode.appendChild(e.target);
    	    }, false);

    	    ol.addEventListener('slip:reorder', function(e){
    	        e.target.parentNode.insertBefore(e.target, e.detail.insertBefore);
    	        return false;
    	    }, false);

    	    new Slip(ol);
    	    
    	    $rootScope.slipReorderListInitialized = true;
    	}
    	
    	$('#menuReorderDialog').on('show.bs.modal', function(e){
            
    		$rootScope.initSlipReorderList();
    		
    		var menuOrderArray = getMenuOrderListFromString($rootScope.memberSettings.menu_order);
    		
    		$('#slippylist li').sortElements(function(a, b){
    			
    			var a_id = $(a).attr("data-mnu-id");
    			var b_id = $(b).attr("data-mnu-id");
    			
    			return menuOrderArray[a_id] > menuOrderArray[b_id];
    		});
        	
        });
    	
    	$rootScope.saveMenuOrderSettings = function(){

    		var menu_order_string = getMenuOrderStringFromElements('#slippylist li');
    		
    		//$rootScope.showLoadingDialog();
    		
        	$http({ method: 'POST', url: $rootScope.webservice_baseuri + "/member/updateSettings", params: {'token': $rootScope.userToken, 'menu_order' : menu_order_string} }).
    		success(function (data, status, headers, config){
    			
    			//$rootScope.hideLoadingDialog();
    				    				
    			if (data.code == undefined) {
    				$rootScope.showAlert(1, "Update settings error", "Network error.", "Ok");
    				return;
    			}
    			
    			if (data.code !== 0){
    				$rootScope.showAlert(1, "Update settings error", data.msg, "Ok");
    				return;
    			}
    			
    			$('#menuReorderDialog').modal('hide');
    			
    			$rootScope.memberSettings.menu_order = menu_order_string;
    			$rootScope.reorderMenuItems();
    			    				
    		}).error(function(data, status, headers, config){
    		
    			//$rootScope.hideLoadingDialog();
    				    				
    			$rootScope.showAlert(1, "Update settings error", "Network error.", "Ok");
    	
    		});
    		
    	}
    	
    	
    	// Location Change Dialog - Begin
    	
    	$rootScope.placeAutoCompleteBound = false;	
    	$rootScope.tempLocationLat = 0;
    	$rootScope.tempLocationLng = 0;
    	$rootScope.tempLocationAddress = '';
    	
    	$rootScope.bindPlaceAutoCompleteInputBox = function(){
    	
    		if ($rootScope.placeAutoCompleteBound) return;
    		
    		var input = document.getElementById('locationInputBox');
    		
    		var autoComplete = new google.maps.places.Autocomplete(input);
    		
    		google.maps.event.addListener(autoComplete, 'place_changed', function() {
    		
    			$rootScope.tempLocationLat = autoComplete.getPlace().geometry.location.lat();
    			$rootScope.tempLocationLng = autoComplete.getPlace().geometry.location.lng();
    			
    		});
    		
    		$rootScope.placeAutoCompleteBound = true;
    	}
    	
    	
    	$('#locationDialog').on('show.bs.modal', function(e){
            
    		$rootScope.bindPlaceAutoCompleteInputBox();
        	
    		$rootScope.tempLocationLat = $rootScope.memberInfo['lat'];
    		$rootScope.tempLocationLng = $rootScope.memberInfo['lng'];
    		$rootScope.tempLocationAddress = $rootScope.memberInfo['location'];
    		
    		$('#locationInputBox').val($rootScope.tempLocationAddress);
        });
    	
    	
    	$rootScope.updateProfileLocation = function(){
    		
    		$rootScope.showLoadingDialog();
        	
    		$rootScope.tempLocationAddress = $('#locationInputBox').val();
    		
        	$http({ method: 'POST', url: $rootScope.webservice_baseuri + "/member/updateProfile", params: {'token': $rootScope.userToken, 'location' : $rootScope.tempLocationAddress, 'lat': $rootScope.tempLocationLat, 'lng' : $rootScope.tempLocationLng} }).
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
    			
    			$('#locationDialog').modal('hide');
    			
    			$rootScope.memberInfo.lat = $rootScope.tempLocationLat;
    			$rootScope.memberInfo.lng = $rootScope.tempLocationLng;
    			$rootScope.memberInfo.location = $rootScope.tempLocationAddress;
    			    				
    		}).error(function(data, status, headers, config){
    		
    			$rootScope.hideLoadingDialog();
    				    				
    			$rootScope.showAlert(1, "Update profile error", "Network error.", "Ok");
    	
    		});
    	}
    	// Location Change Dialog - End
    	
    	
    	$rootScope.showStandoutEditMessageDialog = function(){
        	
        	var standoutStatusDialog = $('#standoutStatusDialog');

    		if (standoutStatusDialog) standoutStatusDialog.modal('hide');
    		
    		var standoutEditMessageDialog = $('#standoutEditMessageDialog');

    		if (standoutEditMessageDialog) standoutEditMessageDialog.modal('show');
        }
    	
    	
    	
    	$rootScope.showPremiumFeatureDialog = function(){
    		
    		$('#leftMenuPanel').panel("close");
    		
    		var premiumFeatureDlg = $('#premiumFeatureDialog');
    		
    		if (premiumFeatureDlg) premiumFeatureDlg.modal('show');
    	}
    	
    	$rootScope.backToPremiumFeatureDialog = function(){
    		
    		var premiumPurchaseDialog = $('#premiumPurchaseDialog');	
    		
    		if (premiumPurchaseDialog) premiumPurchaseDialog.modal('hide');
    		
    		var premiumFeatureDlg = $('#premiumFeatureDialog');
    		
    		if (premiumFeatureDlg) premiumFeatureDlg.modal('show');
    		
    	}
    	
    	$rootScope.showPremiumPurchaseDialog = function(){
    		
    		var premiumFeatureDlg = $('#premiumFeatureDialog');
    		
    		if (premiumFeatureDlg) premiumFeatureDlg.modal('hide');
    		
    		var premiumPurchaseDialog = $('#premiumPurchaseDialog');
    		
    		if (premiumPurchaseDialog) premiumPurchaseDialog.modal('show');
    	}
    	
    	$rootScope.backToPremiumPurchaseDialog = function(){
    		
    		var premiumPayOptionDialog = $('#premiumPayOptionDialog');
    		
    		if (premiumPayOptionDialog) premiumPayOptionDialog.modal('hide');
    		
    		var premiumPurchaseDialog = $('#premiumPurchaseDialog');
    		
    		if (premiumPurchaseDialog) premiumPurchaseDialog.modal('show');
    	}
    	
    	$rootScope.showPremiumPayOptionDialog = function(){
    		
    		var premiumPurchaseDialog = $('#premiumPurchaseDialog');
    		
    		if (premiumPurchaseDialog) premiumPurchaseDialog.modal('hide');
    		
    		var premiumPayOptionDialog = $('#premiumPayOptionDialog');
    		
    		if (premiumPayOptionDialog) premiumPayOptionDialog.modal('show');
    		
    	}
    	
    	$rootScope.showPremiumPurchaseFinishDialog = function(){
    	
    		var premiumPayOptionDialog = $('#premiumPayOptionDialog');
    		
    		if (premiumPayOptionDialog) premiumPayOptionDialog.modal('hide');
    		
    		var premiumPayResultDialog = $('#premiumPayResultDialog');

    		if (premiumPayResultDialog) premiumPayResultDialog.modal('show');
    	}
    	
    	$rootScope.showStandoutFeatureDialog = function(){
    	
    		var standoutFeatureDialog = $('#standoutFeatureDialog');

    		if (standoutFeatureDialog) standoutFeatureDialog.modal('show');
    	}
    	
    	$rootScope.showStandoutFeatureDialogFromTop = function(){
    		$rootScope.showStandoutFeatureDialog();
    		$rootScope.$broadcast("hideCurrentStandoutStripDialog");
    	}
    	    	
    	$rootScope.showStandoutPayOptionDialog = function(){
    		
    		var standoutFeatureDialog = $('#standoutFeatureDialog');

    		if (standoutFeatureDialog) standoutFeatureDialog.modal('hide');
    		
    		var standoutPayOptionDialog = $('#standoutPayOptionDialog');

    		if (standoutPayOptionDialog) standoutPayOptionDialog.modal('show');
    	}
    	
    	$rootScope.showStandoutPurchaseFinishDialog = function(){
    		
    		var standoutPayOptionDialog = $('#standoutPayOptionDialog');

    		if (standoutPayOptionDialog) standoutPayOptionDialog.modal('hide');
    		
    		var standoutPurchaseFinishDialog = $('#standoutPurchaseFinishDialog');

    		if (standoutPurchaseFinishDialog) standoutPurchaseFinishDialog.modal('show');
    	}
    	
    	    	
    	$rootScope.showAlert = function(type, header, msg, buttonText){
    		
    		var $alertContainer = $('#alert-wrapper');
    		var $alertDialog = $('#alertDialog');
    		var $alertMessageContainer = $('.alertmessage-container', $alertDialog);
    		
    		if (!$alertContainer || !$alertDialog || !$alertMessageContainer) return;
    		
    		var $alertIcon = $('i', $alertMessageContainer);
    		var $alertHeading = $('.alertheading', $alertMessageContainer);
    		var $alertMessage = $('.alertmessage', $alertMessageContainer);
    		var $alertButton = $('button', $alertDialog);
    		
    		if (!$alertIcon || !$alertHeading || !$alertMessage || !$alertButton) return;
    		
    		$alertContainer.zIndex(1040);
    		
    		if (type == 1){  // Error
    			
    			$alertMessageContainer.addClass('alert-errormessage');
    			$alertMessageContainer.removeClass('alert-info');
    			
    			$alertIcon.addClass('fa-warning');
    			$alertIcon.removeClass('fa-info-circle');
    			
    		}else if (type == 0){   // Info
    			
    			$alertMessageContainer.addClass('alert-infomessage');
    			$alertMessageContainer.removeClass('alert-error');
    			
    			$alertIcon.addClass('fa-info-circle');
    			$alertIcon.removeClass('fa-warning');
    		}
    		
    		$alertHeading.html(header);
    		$alertMessage.html(msg);
    		
    		$alertButton.html(buttonText);
    		
    		$alertDialog.modal();
    		
    		$alertDialog.on('hidden.bs.modal', function(e){
    			$alertContainer.zIndex(-100);
    		});
    	}
    	
    	
    	$rootScope.getScreenTotalWidth = function(){
    		
    		return getScreenTotalWidth();
    		
    	}
    	
    	$rootScope.customSelectBox = function(){
    		
    		$('select').each(function() {

    		    // Cache the number of options
    		    var $this = $(this),
    		        numberOfOptions = $(this).children('option').length;

    		    // Hides the select element
    		    $this.addClass('s-hidden');

    		    // Wrap the select element in a div
    		    $this.wrap('<div class="select"></div>');

    		    // Insert a styled div to sit over the top of the hidden select element
    		    $this.after('<div class="styledSelect"></div>');

    		    // Cache the styled div
    		    var $styledSelect = $this.next('div.styledSelect');

    		    // Show the first select option in the styled div
    		    $styledSelect.text($this.children('option').eq(0).text());

    		    // Insert an unordered list after the styled div and also cache the list
    		    var $list = $('<ul />', {
    		        'class': 'options'
    		    }).insertAfter($styledSelect);

    		    // Insert a list item into the unordered list for each select option
    		    for (var i = 0; i < numberOfOptions; i++) {
    		        $('<li />', {
    		            text: $this.children('option').eq(i).text(),
    		            rel: $this.children('option').eq(i).val()
    		        }).appendTo($list);
    		    }

    		    // Cache the list items
    		    var $listItems = $list.children('li');

    		    // Show the unordered list when the styled div is clicked (also hides it if the div is clicked again)
    		    $styledSelect.click(function(e) {
    		        e.stopPropagation();
    		        $('div.styledSelect.active').each(function() {
    		            $(this).removeClass('active').next('ul.options').hide();
    		        });
    		        $(this).toggleClass('active').next('ul.options').toggle();
    		    });

    		    // Hides the unordered list when a list item is clicked and updates the styled div to show the selected list item
    		    // Updates the select element to have the value of the equivalent option
    		    $listItems.click(function(e) {
    		        e.stopPropagation();
    		        $styledSelect.text($(this).text()).removeClass('active');
    		        $this.val($(this).attr('rel'));
    		        $list.hide();
    		        /* alert($this.val()); Uncomment this for demonstration! */
    		    });

    		    // Hides the unordered list when clicking outside of it
    		    $(document).click(function() {
    		        $styledSelect.removeClass('active');
    		        $list.hide();
    		    });

    		});
    		
    	}
    	
    	/* End : UI related */
    	
    	
    	$rootScope.getHeightString = function(heightVal){
    		
    		var height = parseFloatNumber(heightVal);
        	
    		height = height.toFixed(1);
    		
    		for (var i = 0; i < $rootScope.heightConstValueList.length; i++){
    			
    			if ($rootScope.heightConstValueList[i].value == height)
    				return $rootScope.heightConstValueList[i].label;
    			
    		}
    		
    		return "Unknown";
    	}
    	
    	$rootScope.getEthnicityString = function(ethnicity_id){
    		
    		for (var i = 0; i < $rootScope.ethnicityOptionList.length; i++){
    			
    			if ($rootScope.ethnicityOptionList[i].id == ethnicity_id)
    				return $rootScope.ethnicityOptionList[i].ethnicity_value;
    		}
    		
    		return "Unknown";
    	}
    	
    	$rootScope.getRelationshipStatusString = function(relationship_status_id){
    		
    		for (var i = 0; i < $rootScope.relationshipStatusList.length; i++){
    			
    			if ($rootScope.relationshipStatusList[i].id == relationship_status_id)
    				return $rootScope.relationshipStatusList[i].relationship + ", ";
    		}
    		
    		return "";
    		
    	}
    	
    	$rootScope.getOpenToItemText = function (opent_to_id){
    		
    		for (var i = 0; i < $rootScope.opentoOptionList.length; i++){
    			
    			if ($rootScope.opentoOptionList[i].id == opent_to_id)
    				return $rootScope.opentoOptionList[i].opento_value;
    		}
    		
    		return "";
    	}
    	
    	$rootScope.getOpentoListText = function(open_to){
    		
    		if (open_to == undefined || open_to == '') return "";
    		
    		var idList = open_to.split(",");
    		
    		if (idList == undefined || idList.length == undefined) return "";
    		
    		var valueList = [];
    		
    		for(var i = 0; i < idList.length; i++){
    			
    			var newVal = $rootScope.getOpenToItemText(idList[i]);
    			
    			if (newVal == '') continue;
    			
    			valueList.push(newVal);
    		}
    		
    		return valueList.join(", ");
    	};
    	
    	$rootScope.heightConstValueList = [
    	     {value: "4.1", label: htmlDecode('4&prime;-1&Prime;')},
    	     {value: "4.2", label: htmlDecode('4&prime;-2&Prime;')},
    	     {value: "4.3", label: htmlDecode('4&prime;-3&Prime;')},
    	     {value: "4.4", label: htmlDecode('4&prime;-4&Prime;')},
    	     {value: "4.5", label: htmlDecode('4&prime;-5&Prime;')},
    	     {value: "4.6", label: htmlDecode('4&prime;-6&Prime;')},
    	     {value: "4.7", label: htmlDecode('4&prime;-7&Prime;')},
    	     {value: "4.8", label: htmlDecode('4&prime;-8&Prime;')},
    	     {value: "4.9", label: htmlDecode('4&prime;-9&Prime;')},
    	     {value: "5.0", label: htmlDecode('5&prime;-0&Prime;')},
    	     {value: "5.1", label: htmlDecode('5&prime;-1&Prime;')},
    	     {value: "5.2", label: htmlDecode('5&prime;-2&Prime;')},
    	     {value: "5.3", label: htmlDecode('5&prime;-3&Prime;')},
    	     {value: "5.4", label: htmlDecode('5&prime;-4&Prime;')},
    	     {value: "5.5", label: htmlDecode('5&prime;-5&Prime;')},
    	     {value: "5.6", label: htmlDecode('5&prime;-6&Prime;')},
    	     {value: "5.7", label: htmlDecode('5&prime;-7&Prime;')},
    	     {value: "5.8", label: htmlDecode('5&prime;-8&Prime;')},
    	     {value: "5.9", label: htmlDecode('5&prime;-9&Prime;')},
    	     {value: "6.0", label: htmlDecode('6&prime;-0&Prime;')},
    	     {value: "6.1", label: htmlDecode('6&prime;-1&Prime;')},
    	     {value: "6.2", label: htmlDecode('6&prime;-2&Prime;')},
    	     {value: "6.3", label: htmlDecode('6&prime;-3&Prime;')},
    	     {value: "6.4", label: htmlDecode('6&prime;-4&Prime;')},
    	     {value: "6.5", label: htmlDecode('6&prime;-5&Prime;')},
    	     {value: "6.6", label: htmlDecode('6&prime;-6&Prime;')},
    	     {value: "6.7", label: htmlDecode('6&prime;-7&Prime;')},
    	     {value: "6.8", label: htmlDecode('6&prime;-8&Prime;')},
    	     {value: "6.9", label: htmlDecode('6&prime;-9&Prime;')},
    	     {value: "7.0", label: htmlDecode('7&prime;-0&Prime;')},
    	     {value: "7.1", label: htmlDecode('7&prime;-1&Prime;')},
    	     {value: "7.2", label: htmlDecode('7&prime;-2&Prime;')},
    	     {value: "7.3", label: htmlDecode('7&prime;-3&Prime;')},
    	     {value: "7.4", label: htmlDecode('7&prime;-4&Prime;')},
    	     {value: "7.5", label: htmlDecode('7&prime;-5&Prime;')},
    	     {value: "7.6", label: htmlDecode('7&prime;-6&Prime;')},
    	     {value: "7.7", label: htmlDecode('7&prime;-7&Prime;')},
    	     {value: "7.8", label: htmlDecode('7&prime;-8&Prime;')},
    	     {value: "7.9", label: htmlDecode('7&prime;-9&Prime;')},
    	     {value: "10.0", label: htmlDecode('8&prime;-0&Prime;+')},
    	 ];
    	
    	$rootScope.ageConstValueList = [];
    	
    	for (var i = 18; i <= 99; i++){
    		$rootScope.ageConstValueList.push({value: i + "", label: i + ""});
    	}
    	
    	
    	$rootScope.weightConstValueList = [];
    	
    	for (var i = 120; i < 250; i++){
    		$rootScope.weightConstValueList.push({value: i + "", label: i + ""});
    	}
    	
    	$rootScope.weightConstValueList.push({value: 250, label: '250+'});
    	
    }]);
