'use strict';

angular.module('mantrackrApp')
    .controller('MemberProfileCtrl', ['$scope', '$rootScope', '$routeParams', '$timeout', '$firebase', function ($scope, $rootScope, $routeParams, $timeout, $firebase) {

    $scope.memberId = $routeParams.memberId;	
    	
    $scope.currentTab = 0;
    
    $scope.profileContentWidth = 0;
    $scope.bProfileOwner = false;
    
    $scope.$on('profilePhotosRenderFinish', function(ngRepeatFinishedEvent){
    	
    	$scope.swipeProfilePhotoList();
		
	});

        
    $scope.$on("memberProfileContentPageLoaded", function(event, args){
    	
    	$scope.profileContentWidth = args;
    	
    	$scope.swipeFooterMenu();
    	
    	$scope.bindMemberInformation();
    	
    	$scope.createOnlineMembersPanel();
    	
    	$scope.swipeOnlineMemberPhotoGrid();
    });
    
    
    
    $scope.$on("$includeContentLoaded", function(e){
	   	
    	$('#profilePhotoContainer .profilePhotoImg').width($scope.profileContentWidth);
    	
    	$scope.swipeProfileInfoContainer();
    	$scope.swipeProfileMessageContainer();
    	
    	$scope.setChatRoom();
    });
    
    
    $scope.myBoxMessages = [];
    $scope.myBoxInfo = [];
    
    $scope.partnerBoxMessages = [];
    $scope.partnerBoxInfo = [];
    
    $scope.chatRoomSet = false;   
    
    $scope.setChatRoom = function(){
    	
    	if ($scope.chatRoomSet) return;
    	
    	var rootRef = $rootScope.firebaseRef;
		
		var myBoxFirebaseRef = rootRef.child('messages/' + $rootScope.memberInfo.id + "/" + $scope.memberId + "/");
		var myBoxInfoFirebaseRef = rootRef.child('messages/' + $rootScope.memberInfo.id + "/" + $scope.memberId + "/info");
		
		$scope.myBoxMessages = $firebase(myBoxFirebaseRef);
		$scope.myBoxInfo = $firebase(myBoxInfoFirebaseRef);
		
		var partnerBoxFirebaseRef = rootRef.child('messages/' + $scope.memberId + "/" + $rootScope.memberInfo.id + "/");
		var partnerBoxInfoFirebaseRef = rootRef.child('messages/' + $scope.memberId + "/" + $rootScope.memberInfo.id + "/info");
		
		$scope.partnerBoxMessages = $firebase(partnerBoxFirebaseRef);
		$scope.partnerBoxInfo = $firebase(partnerBoxInfoFirebaseRef);
		
		$scope.chatRoomSet = true;
		
		$scope.myBoxMessages.$on("change", function(){
			
			if ($scope.profileMessageContainerSwipe) {
				$timeout($scope.profileMessageContainerSwipe.reInit, 500);
				$scope.scrollMessagesToBottom();
				//$scope.profileMessageContainerSwipe.swipeTo(1, 500, false);
			}
			
		})
    }
    
    $scope.createOnlineMembersPanel = function(){
    	
    	$('#onlineMembersPanel').panel({display: "overlay", animate: true, position: "right"});
    	
    	$('.ui-panel-dismiss[data-panelid="onlineMembersPanel"]').hammer().on("touch", function(event){$('#onlineMembersPanel').panel("close");});
		$('.ui-panel-dismiss[data-panelid="onlineMembersPanel"]').hammer().on("tap", function(event){$('#onlineMembersPanel').panel("close");});
		$('.ui-panel-dismiss[data-panelid="onlineMembersPanel"]').hammer().on("swipe", function(event){$('#onlineMembersPanel').panel("close");});
    	
    }
    
    $scope.$on('onlineMemberGridRenderDone', function(ngRepeatFinishedEvent){
    	
    	    	
    	if ($scope.onlineMemberGridSwiper) {
			$scope.onlineMemberGridSwiper.reInit();
			return;
		}
		
    	    	
	});
    
    
    
    $scope.swipeOnlineMemberPhotoGrid = function(){
		
		if ($scope.onlineMemberGridSwiper) {
			$scope.onlineMemberGridSwiper.reInit();
			return;
		}
		
		$scope.onlineMemberGridSwiper = new Swiper('#onlinemember-photo-grid', {
			mode: 'vertical',
			slidesPerView: 'auto',
    	    onSlideClick: function (swiper){
    	    	/*if ($scope.memberGridSelectedId != 0)
    	    		$rootScope.gotoMemberProfilePage($scope.memberGridSelectedId);*/
    	    }
		});
		
	}
    
    
    
    $scope.showOnlineMembersPanel = function(){
		
    	if ($scope.currentTab == 2){
    		$scope.onlineMembersGridView = true;
    		$('#onlineMembersPanel').panel("toggle");
    	}
    		
	}
    
    $scope.hideOnlineMembersPanel = function(){
		
    	$('#onlineMembersPanel').panel("close");
	}
        
    
    $scope.onlineMembersGridView = true;
    $scope.selectedOnlineMemberId = 0;
    $scope.selectedOnlineMemberInfo = [];
    
    $scope.showMemberProfileInitiateMode = true; 
    
    $scope.showOnlineMemberProfilePage = function(memberId){
    	
    	$scope.onlineMembersGridView = false;
    	$scope.selectedOnlineMemberId = memberId;
    	$scope.selectedOnlineMemberInfo = $rootScope.members[$scope.selectedOnlineMemberId];
    	$scope.showMemberProfileInitiateMode = true;
    }
    
    $scope.$watch("selectedOnlineMemberInfo", function(newVal, oldVal){
    	
    	$timeout($scope.swipeOnlineMemberProfileInfoContainer, 100);
    	
    	
    	
    });
    
    $scope.backToOnlineMembersList = function(){
    	$scope.onlineMembersGridView = true;
    }
    
    $scope.showThirdMemberProfilePanel = function(msg){
    	
    	$scope.currentActivatedMsg = msg;
    	
    	var memberId = msg.thirdMemberId;
    	
    	$scope.onlineMembersGridView = false;
    	$scope.selectedOnlineMemberId = memberId;
    	$scope.selectedOnlineMemberInfo = $rootScope.members[$scope.selectedOnlineMemberId];
    	$scope.showMemberProfileInitiateMode = false;
    	
    	$('#onlineMembersPanel').panel("toggle");
    }
    
    $scope.$on("onlineMemberProfilePhotosRenderFinish", function(ngRepeatFinishedEvent){
    	
    	$scope.swipeOnlineMemberProfilePhotoList();
		
	});
    
    $scope.swipeOnlineMemberProfilePhotoList = function(){
    	
    	if ($scope.selectedOnlineMemberPhotosSwiper && $scope.selectedOnlineMemberPhotosSwiper.reInit) {
    		$scope.selectedOnlineMemberPhotosSwiper.reInit();
    		return;
    	}
    	
		$scope.selectedOnlineMemberPhotosSwiper = new Swiper('#onlineMemberPhotoContainer', {
			mode: 'horizontal',
			slidesPerView: 1,
			pagination: '#onlineMemberPhotosPagination',
			paginationClickable: true,			
		});
				
    }
    
    $scope.swipeOnlineMemberProfileInfoContainer = function(){
    	
    	if ($scope.selectedOnlineMemberProfileInfoSwiper && $scope.selectedOnlineMemberProfileInfoSwiper.reInit) {
    		$scope.selectedOnlineMemberProfileInfoSwiper.reInit();
    		return;
    	}
    	
    	$scope.selectedOnlineMemberProfileInfoSwiper = new Swiper('#onlineMemberInfoContainer', {
			mode: 'vertical',
			scrollContainer: true
		});
    }

    
    $scope.$watch('selectedOnlineMemberInfo.age', function(newVal, oldVal){
    	
    	if (newVal == '' || newVal == null)
    		$scope.ageText_selectedMember = "Unknown";
    	else
    		$scope.ageText_selectedMember = newVal + "yo";
    });

    
    $scope.$watch('selectedOnlineMemberInfo.weight', function(newVal, oldVal){
    	
    	if (newVal == '' || newVal == null)
    		$scope.weightText_selectedMember = "Unknown";
    	else
    		$scope.weightText_selectedMember = newVal + "#";
    });


    $scope.$watch('selectedOnlineMemberInfo.height', function(newVal, oldVal){
    	
    	$scope.heightText_selectedMember = $rootScope.getHeightString(newVal);
    });
    
    $scope.$watch('selectedOnlineMemberInfo.ethnicity_id', function(newVal, oldVal){
    	
    	$scope.ethnicityText_selectedMember = $rootScope.getEthnicityString(newVal);
    });
    
    
    $scope.$watch('selectedOnlineMemberInfo.relationship_status_id', function(newVal, oldVal){
    	
    	$scope.relationshipText_selectedMember = $rootScope.getRelationshipStatusString(newVal);
    });
    
    $scope.$watch('selectedOnlineMemberInfo.opento_ids', function(newVal, oldVal){
    	
    	$scope.openToListText_selectedMember = $rootScope.getOpentoListText(newVal);
    });

    $scope.$watch('selectedOnlineMemberInfo.lookingfor', function(newVal, oldVal){
    	
    	$scope.lookingforText_selectedMember = newVal;
    	
    });
    
    $scope.$watch('selectedOnlineMemberInfo.description', function(newVal, oldVal){
    	
    	$scope.descriptionText_selectedMember = newVal;
    	
    });
    
    $scope.$watch('selectedOnlineMemberInfo.interests', function(newVal, oldVal){
    	
    	$scope.interestsText_selectedMember = newVal;
    	
    });
    
    $scope.pushChatMessage = function(myMsgData, partnerMsgData, onlyToMyBox){
    	
    	$scope.myBoxMessages.$add(myMsgData);
    	
    	if (onlyToMyBox == undefined || onlyToMyBox == false)
    	{
	    	$scope.partnerBoxMessages.$add(partnerMsgData);
	    	    	
	    	var keys = $scope.partnerBoxInfo.$getIndex();
	    	
	    	if (keys.indexOf('unread') < 0){
	    		
	    		$scope.partnerBoxInfo.$set({unread: 1});
	    		
	    	}else{
	    		
	    		$scope.partnerBoxInfo.$set({unread: $scope.partnerBoxInfo.unread + 1});
	    		
	    	}
    	
    	}
    	
    	$scope.initMyBoxUnreadCount();
    }
    
    
    $scope.pushTextChatMessage = function(text, senderId, recipientId){
    	
    	var myMsgData = {orient: 'O', body: text, time: Firebase.ServerValue.TIMESTAMP, type: 'T', recipientId: recipientId};
    	var partnerMsgData = {orient: 'I', body: text, time: Firebase.ServerValue.TIMESTAMP, type: 'T', senderId: senderId};
    	
    	if ($scope.thirdPartyChatRoomConnected && $scope.thirdPartyMemberType == "Invited")
    		$scope.pushChatMessage(myMsgData, partnerMsgData, true);
    	else
    		$scope.pushChatMessage(myMsgData, partnerMsgData, false);
    	
    	if ($scope.thirdPartyChatRoomConnected){
    		$scope.pushTextChatMessageToThirdParty(text, senderId, recipientId, $scope.thirdChatMemberId);
    	}
    }
    
    $scope.pushTextChatMessageToThirdParty = function(text, senderId, recipientId, thirdPartyId){
    	
    	var partnerMsgData = {orient: 'I', body: text, time: Firebase.ServerValue.TIMESTAMP, type: 'T', senderId: senderId};
    	
    	if ($scope.thirdPartyMemberType == "Sender")
    		$scope.pushChatMessageToMember(senderId, thirdPartyId, partnerMsgData);
    	else if ($scope.thirdPartyMemberType == "Recipient")
    		$scope.pushChatMessageToMember(recipientId, thirdPartyId, partnerMsgData);
    	else if ($scope.thirdPartyMemberType == "Invited"){
    		$scope.pushChatMessageToMember(thirdPartyId, recipientId, partnerMsgData);
    		$scope.pushChatMessageToMember(recipientId, thirdPartyId, partnerMsgData);
    	}
    }
    
    $scope.groupChatRoomInfo = [];
    
    $scope.thirdChatMemberId = 0;
    $scope.thirdChatBoxMessages = [];
    $scope.thirdChatBoxInfo = [];
    $scope.thirdPartyChatRoomConnected = false;
    
    $scope.thirdPartyMemberType = '';
    
    
    $scope.connectToThirdPartyMsg = function(thirdPartyId, thirdPartyMemberType){
    	
    	$scope.thirdChatMemberId = thirdPartyId;
    	
    	/*if ($scope.thirdPartyChatRoomConnected) return;
    	
    	var rootRef = $rootScope.firebaseRef;
		
		var thirdPartyMessageFirebaseRef = rootRef.child('messages/' + $rootScope.memberInfo.id + "/" + thirdPartyId + "/");
		var thirdPartyMessageInfoFirebaseRef = rootRef.child('messages/' + $rootScope.memberInfo.id + "/" + thirdPartyId + "/info");
				
		$scope.thirdChatBoxMessages = $firebase(thirdPartyMessageFirebaseRef);
		$scope.thirdChatBoxInfo = $firebase(thirdPartyMessageInfoFirebaseRef);*/

		$scope.thirdPartyChatRoomConnected = true;
		
		$scope.thirdPartyMemberType = thirdPartyMemberType;
    	
    }
    
    
    $scope.pushThirdPartyInvitationMessage = function(senderId, recipientId, thirdPartyId, chatRoomId,  approved){
    	
    	var myMsgData = {orient: 'O', time: Firebase.ServerValue.TIMESTAMP, type: 'A3IR', recipientId: recipientId, approved: approved};
    	var partnerMsgData = {orient: 'I', time: Firebase.ServerValue.TIMESTAMP, type: 'A3IR', senderId: senderId, approved: approved};
    	
    	$scope.pushChatMessage(myMsgData, partnerMsgData);
    	
    	if (approved){
    		
    		myMsgData = {orient: 'I', time: Firebase.ServerValue.TIMESTAMP, type: 'A3IT', thirdPartyId: thirdPartyId};
        	partnerMsgData = {orient: 'I', time: Firebase.ServerValue.TIMESTAMP, type: 'A3IT', thirdPartyId: thirdPartyId};
        	
        	$scope.pushChatMessage(myMsgData, partnerMsgData);
        	
        	$scope.pushChatMessageToMember(senderId, thirdPartyId, {orient: 'I',time: Firebase.ServerValue.TIMESTAMP, type: 'A3INV', senderId: senderId, thirdPartyId: recipientId, chatRoomId: chatRoomId});
        	
    	}
    	
    }
    
    
    
    
    $scope.pushChatMessageToMember = function(senderId, recipientId, msgData){
    	
    	var thirdPartyMessageBoxRef = $rootScope.firebaseRef.child('messages/' + recipientId + "/" + senderId + "/");
    	
		thirdPartyMessageBoxRef.push(msgData);
		
		var thirdPartyMessageInfoRef = $rootScope.firebaseRef.child('messages/' + recipientId + "/" + senderId + "/info");
		
		var thirdPartyMessageInfo = $firebase(thirdPartyMessageInfoRef);
		
		var keys = thirdPartyMessageInfo.$getIndex();
    	
    	if (keys.indexOf('unread') < 0){
    		
    		thirdPartyMessageInfo.$set({unread: 1});
    		
    	}else{
    		
    		if (thirdPartyMessageInfo.unread)
    			thirdPartyMessageInfo.$set({unread: thirdPartyMessageInfo.unread + 1});
    		else
    			thirdPartyMessageInfo.$set({unread: 1});
    		
    	}
    }
    

    
    
    $scope.pushThirdPartyIncludeRequestMessage = function(memberId){
    	
    	var currentServerTime = $rootScope.getCurrentFirebaseTimestamp();
    	
    	var newChatRoomId = $rootScope.memberInfo.id + "-" + $scope.currentMemberInfo.id + "-" + currentServerTime;
    	
    	var rootRef = $rootScope.firebaseRef;
    	
    	var newChatRoomFireBaseRef =  rootRef.child('chatrooms/' + newChatRoomId + "/");
    	
    	$scope.groupChatRoomInfo = $firebase(newChatRoomFireBaseRef);
    	
    	$scope.groupChatRoomInfo.$set({senderId: parseIntegerNumber($rootScope.memberInfo.id), 
    								   recipientId: $scope.currentMemberInfo.id,
    								   recipientApproved: false,
    								   thirdPartyId: memberId,
    								   thirdPartyApproved: false});
    	
        $scope.groupChatRoomInfo.$on("change", function(){
			
			if ($scope.groupChatRoomInfo.thirdPartyApproved == true)
			{
				if ($scope.groupChatRoomInfo.senderId == parseIntegerNumber($rootScope.memberInfo.id))
	    			$scope.connectToThirdPartyMsg($scope.groupChatRoomInfo.thirdPartyId, 'Sender');
	    		else if (parseIntegerNumber($rootScope.memberInfo.id) == $scope.groupChatRoomInfo.recipientId)
	    			$scope.connectToThirdPartyMsg($scope.groupChatRoomInfo.thirdPartyId, 'Recipient');
			}
			
		})
		
    	var myMsgData = {orient: 'O', time: Firebase.ServerValue.TIMESTAMP, type: 'A3', thirdMemberId: memberId, chatRoomId: newChatRoomId};
    	var partnerMsgData = {orient: 'I', time: Firebase.ServerValue.TIMESTAMP, type: 'A3', thirdMemberId: memberId, chatRoomId: newChatRoomId};
    	
    	$scope.pushChatMessage(myMsgData, partnerMsgData);
    }
    
    
    $scope.pushThirdPartyApproveStatusMessage = function(thirdPartyId, chatRoomId, approved){
    	
    	$rootScope.firebaseRef.child('chatrooms/' + chatRoomId + "/").update({thirdPartyApproved: approved});
    	
    	var msgData = {orient: 'I', time: Firebase.ServerValue.TIMESTAMP, type: 'A3INVREPLY', approved: approved, senderId: parseIntegerNumber($rootScope.memberInfo.id)};
    	
    	$scope.pushChatMessageToMember($scope.currentMemberInfo.id, thirdPartyId, msgData);
    	$scope.pushChatMessageToMember(thirdPartyId, $scope.currentMemberInfo.id, msgData);
    	
    	if (approved){
    		
    		$scope.connectToThirdPartyMsg(thirdPartyId, "Invited");
    	}
    	
    }
    
    $scope.setGroupChatRequestRoomInfo = function(chatRoomId){
    	
    	var chatRoomFireBaseRef =  $rootScope.firebaseRef.child('chatrooms/' + chatRoomId + "/");
    	
    	$scope.groupChatRoomInfo = $firebase(chatRoomFireBaseRef);
    	
        $scope.groupChatRoomInfo.$on("change", function(){
			
			if ($scope.groupChatRoomInfo.thirdPartyApproved == true)
			{
				if ($scope.groupChatRoomInfo.senderId == parseIntegerNumber($rootScope.memberInfo.id))
	    			$scope.connectToThirdPartyMsg($scope.groupChatRoomInfo.thirdPartyId, 'Sender');
	    		else if (parseIntegerNumber($rootScope.memberInfo.id) == $scope.groupChatRoomInfo.recipientId)
	    			$scope.connectToThirdPartyMsg($scope.groupChatRoomInfo.thirdPartyId, 'Recipient');
			}
			
		})
    }
    
    $scope.currentActivatedMsg = [];
    
    $scope.denyThirdMemberRequest = function(chatRoomInfo){
    	
    	$scope.setGroupChatRequestRoomInfo(chatRoomInfo.chatRoomId);
    	
    	$rootScope.firebaseRef.child('chatrooms/' + chatRoomInfo.chatRoomId + "/").update({recipientApproved: false});
    	
    	$scope.pushThirdPartyInvitationMessage($scope.currentMemberInfo.id, parseIntegerNumber($rootScope.memberInfo.id), chatRoomInfo.thirdMemberId, chatRoomInfo.chatRoomId,  false);
    	
    }
    
    $scope.denyThirdMemberRequestOnDialog = function(){
    	
    	$scope.hideOnlineMembersPanel();
    	$scope.denyThirdMemberRequest($scope.currentActivatedMsg);
    }
    
    $scope.approveThirdMemberRequest = function(chatRoomInfo){
    	
    	$scope.setGroupChatRequestRoomInfo(chatRoomInfo.chatRoomId);
    	
    	$rootScope.firebaseRef.child('chatrooms/' + chatRoomInfo.chatRoomId + "/").update({recipientApproved: true});
    	
    	$scope.pushThirdPartyInvitationMessage($scope.currentMemberInfo.id, parseIntegerNumber($rootScope.memberInfo.id), chatRoomInfo.thirdMemberId, chatRoomInfo.chatRoomId, true);
    }
    
    $scope.approveThirdMemberRequestOnDialog = function(){
    	
    	$scope.hideOnlineMembersPanel();
    	$scope.approveThirdMemberRequest($scope.currentActivatedMsg);
    	
    }
    
    
    
    $scope.denyGroupChatAttend = function(chatRoomInfo){
    
    	$scope.pushThirdPartyApproveStatusMessage(chatRoomInfo.thirdPartyId, chatRoomInfo.chatRoomId, false);
    	
    }
    
    
    $scope.approveGroupChatAttend = function(chatRoomInfo){
    	
    	$scope.pushThirdPartyApproveStatusMessage(chatRoomInfo.thirdPartyId, chatRoomInfo.chatRoomId, true);
    	
    }
    
    
    
    $scope.sendTextChatMessage = function(){
    
    	var $txtInput = $('#profileMessageText');
    	
    	if (!$txtInput) return;
    	    	
    	if ($txtInput.val() == '') return;
    	
    	if (!$scope.chatRoomSet) $scope.setChatRoom();
    	
    	if (!$scope.chatRoomSet) return;
    	
    	$scope.pushTextChatMessage($txtInput.val(), parseIntegerNumber($rootScope.memberInfo.id), $scope.currentMemberInfo.id);
    	    	
    	$txtInput.val('');
    	
    	$scope.scrollMessagesToBottom();
    }
    
    $scope.sendThirdPartyRequestMessage = function(){
    	
    	if ($scope.selectedOnlineMemberId == 0) return;
    	
    	$scope.pushThirdPartyIncludeRequestMessage($scope.selectedOnlineMemberId);
    	
    	$scope.hideOnlineMembersPanel();
    	
    	
    }
    
    $scope.initMyBoxUnreadCount = function(){
    	
    	if ($scope.myBoxInfo && $scope.myBoxInfo.$set){
    		$scope.myBoxInfo.$set({unread: 0});
    	}
    }
    
    $scope.bindMemberInformation = function(){
    	
    	var rootRef = $rootScope.firebaseRef;
		
		var memberFirebaseRef = rootRef.child('members/' + $scope.memberId);
		
		$scope.currentMemberInfo = $firebase(memberFirebaseRef);
    }
    
    $scope.$watch('currentMemberInfo.age', function(newVal, oldVal){
    	
    	if (newVal == '' || newVal == null)
    		$scope.ageText = "Unknown";
    	else
    		$scope.ageText = newVal + "yo";
    });
    
    $scope.memberPhotosCount = 0;
    
        
    $scope.$watch('currentMemberInfo.photos', function(newVal, oldVal){
    	
    	$scope.memberPhotosCount = getObjectMembersCount(newVal);
    });
    
    $scope.currentViewPhoto = '';
    
    /*$scope.selectFirstProfilePhoto = function(){
    	
    	var firstMember = getFirstMemberOfObject($scope.currentMemberInfo.photos); 
    	
    	if (!firstMember)
    		$scope.currentViewPhoto = $rootScope.assets_imagebaseuri + 'avatars/noimage.jpg';
    	
    	$scope.currentViewPhoto = $rootScope.photoupload_baseuri + firstMember.path;
    }*/
    

    $scope.selectFirstProfilePhoto = function(){
    	
    	if (!$scope.profilePhotoSwiper || !$scope.profilePhotoSwiper.getSlide) return;
    	
    	var firstSlide = $scope.profilePhotoSwiper.getSlide(0);
    	
    	$scope.currentViewPhoto = getPhotoUrlOfSwiperSlide(firstSlide);
    	

    }

    $scope.$watch('currentMemberInfo.weight', function(newVal, oldVal){
    	
    	if (newVal == '' || newVal == null)
    		$scope.weightText = "Unknown";
    	else
    		$scope.weightText = newVal + "#";
    });


    $scope.$watch('currentMemberInfo.height', function(newVal, oldVal){
    	
    	$scope.heightText = $rootScope.getHeightString(newVal);
    });
    
    $scope.$watch('currentMemberInfo.ethnicity_id', function(newVal, oldVal){
    	
    	$scope.ethnicityText = $rootScope.getEthnicityString(newVal);
    });
    
    
    $scope.$watch('currentMemberInfo.relationship_status_id', function(newVal, oldVal){
    	
    	$scope.relationshipText = $rootScope.getRelationshipStatusString(newVal);
    });
    
    $scope.$watch('currentMemberInfo.opento_ids', function(newVal, oldVal){
    	
    	$scope.openToListText = $rootScope.getOpentoListText(newVal);
    });

    $scope.$watch('currentMemberInfo.lookingfor', function(newVal, oldVal){
    	
    	$scope.lookingforText = newVal;
    	
    });
    
    $scope.$watch('currentMemberInfo.description', function(newVal, oldVal){
    	
    	$scope.descriptionText = newVal;
    	
    });
    
    $scope.$watch('currentMemberInfo.interests', function(newVal, oldVal){
    	
    	$scope.interestsText = newVal;
    	
    });
    
    
 
    $scope.$watch('currentTab', function (newVal, oldVal){
    	
    	$scope.reInitSwipers();
    	
    	if (newVal == 2) {
    		$scope.initMyBoxUnreadCount();
    		$timeout($scope.scrollMessagesToBottom, 1000);
    	}
    	
    });
    
    $scope.reInitSwipers = function(){
    	if ($scope.profilePhotoSwiper) $timeout($scope.profilePhotoSwiper.reInit, 100);
    	if ($scope.profileMemberInfoSwiper) $timeout($scope.profileMemberInfoSwiper.reInit, 100);
    	if ($scope.profileMessageContainerSwipe) $timeout($scope.profileMessageContainerSwipe.reInit, 100);
    }
    
    $scope.scrollMessagesToBottom = function(){
    
    	if ($scope.profileMessageContainerSwipe && $scope.profileMessageContainerSwipe.scrollToBottom)
    		$scope.profileMessageContainerSwipe.scrollToBottom();
    }
    
    $scope.swipeProfileMessageContainer = function(){
    	
    	if ($scope.profileMessageContainerSwipe && $scope.profileMessageContainerSwipe.reInit){
    		$scope.profileMessageContainerSwipe.reInit();
    		return;
    	}
    	
    	$scope.profileMessageContainerSwipe = new Swiper('#profileMessageContainer', {
			mode: 'vertical',
			scrollContainer: true
		});
    	
    	$scope.scrollMessagesToBottom();
    	
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
			}
		});
		
		$scope.selectFirstProfilePhoto();
	}
    
    $scope.swipePrevProfilePhoto = function(){
    	
    	if (!$scope.profilePhotoSwiper || !$scope.profilePhotoSwiper.swipePrev) return;
    	
    	$scope.profilePhotoSwiper.swipePrev();
    }
    
    
    $scope.swipeNextProfilePhoto = function(){
    	
    	if (!$scope.profilePhotoSwiper || !$scope.profilePhotoSwiper.swipeNext) return;
    	
    	$scope.profilePhotoSwiper.swipeNext();
    }
    
    $scope.swipeFooterMenu = function(){
    	
    	$scope.footerMenuSwiper = new Swiper('#profile-footer-menu', {
    		mode: 'horizontal',
    		scrollContainer: true,
    		onSetWrapperTransform: function (swiper, transform){
    			/*console.log(transform.x);
    			if (swiper.positions.current < 100) $('#footermenu-more-link').hide();
    			else $('#footermenu-more-link').show();*/
    			if (transform.x < -50)  $('#footermenu-more-link').hide();
    			else $('#footermenu-more-link').show();
    		}
		});
    	
    	
    }
    
    $scope.swipeProfileInfoContainer = function(){
    	
    	if ($scope.profileMemberInfoSwiper && $scope.profileMemberInfoSwiper.reInit) {
    		$scope.profileMemberInfoSwiper.reInit();
    		return;
    	}
    	
    	$scope.profileMemberInfoSwiper = new Swiper('#profileInfoContainerSwiper', {
			mode: 'vertical',
			scrollContainer: true
		});
    }
    	
}]);