'use strict';

angular.module('mantrackrApp')
    .controller('MembersGridCtrl', ['$scope', '$rootScope', '$http', '$timeout', '$firebase', function ($scope, $rootScope, $http, $timeout, $firebase) {

    	$scope.$on("memberGridContentPageLoaded", function(event, args){
    	    		
    		$timeout($scope.swipeMemberPhotoGrid, 100);
    		
    		//$scope.bindMembers();
    		
    		//$rootScope.bindMembers();
    		
    		$scope.stripoutSwiper = undefined;
    		
    	});
    	
    	$scope.$on("hideCurrentStandoutStripDialog", function(event, args){
    		$scope.hideStandoutPopupDialog();
    	})
    	
    	$scope.$on("$includeContentLoaded", function(e){
    	   	
    		$timeout($scope.displayStandout, 100);
        	
        })
        
    	
    	$scope.memberGridSelectedId = 0;
    	
    	$scope.$on("members", function(newVal, oldVal){
    		
    		$scope.swipeMemberPhotoGrid();
    		//$timeout($scope.memberGridSwiper.resizeFix, 2000);
    	
    	});
    	
    	/*$scope.bindMembers = function(){
    		  		
    		var rootRef = $rootScope.firebaseRef;
    		
    		var membersFirebaseRef = rootRef.child('members/');
    		
    		$scope.members = $firebase(membersFirebaseRef);
    		
    	}*/
    	
    	$scope.memberGridSwiper = undefined;
    	
    	$scope.$on('memberPhotoGridRenderDone', function(ngRepeatFinishedEvent){
    	
    		if ($scope.memberGridSwiper) {
    			$scope.memberGridSwiper.reInit();
    			return;
    		}
    		
    	});
    	
    	$scope.swipeMemberPhotoGrid = function(){
    		
    		if ($scope.memberGridSwiper) {
    			$scope.memberGridSwiper.reInit();
    			return;
    		}
    		
    		$scope.memberGridSwiper = new Swiper('#member-photo-grid', {
    			mode: 'vertical',
    			slidesPerView: 'auto',
        	    onSlideClick: function (swiper){
        	    	if ($scope.memberGridSelectedId != 0)
        	    		$rootScope.gotoMemberProfilePage($scope.memberGridSelectedId);
        	    }
    		});
    		
    		//$timeout($scope.memberGridSwiper.resizeFix, 500);
    	}
    	
    	$scope.showMemberProfilePage = function(param){
    		
    		$rootScope.gotoMemberProfilePage(param);
    	}
    	
    	$scope.displayStandout = function(){
    	
    		if ($scope.stripoutSwiper && $scope.stripoutSwiper.swipeNext) return;
    		
    		$scope.stripoutSwiper = new Swiper('#standout-container',{
        	    mode: 'horizontal',
        	    loop: true,
        	    slidesPerView: 'auto',
        	    loopedSlides: 10,
        	    onSlideChangeEnd: function (swiper, direction){
        	    	$scope.hideStandoutPopupDialog();
        	    }
        	});
    		    		
    	
    		$timeout($scope.autoSwipeStripout, 3000);
    	}
    	
    	$scope.isAutoSwipeStripout = true;
    	
    	$scope.autoSwipeStripout = function(){
    		
    		if (!$scope.stripoutSwiper) return;
    		
    		if ($scope.isAutoSwipeStripout) $scope.stripoutSwiper.swipeNext();
    		
    		$timeout($scope.autoSwipeStripout, 2000);
    		
    	}
    	
    	$scope.hiddenStandoutPopupDialog = function(){
    	
    		$scope.isAutoSwipeStripout = true;
    		
    		$('#photoMemberGridBackdrop').removeClass("in");
    		
    		$rootScope.isStandoutPopupDialogShown = false;
    	
    		$scope.removeCurrentStandoutItemMask();
    	}
    	
    	$scope.hideStandoutPopupDialog = function(){
    		if ($rootScope.isStandoutPopupDialogShown) $('#memberStandoutDialog').modal('hide');
    	}
    	
    	
    	
    	$scope.currentStandoutMask = undefined;
    	
    	$scope.showCurrentStandoutItemMask = function(element){
    		
    		$scope.currentStandoutMask = $('<div class="standout-item-mask"><i class="fa fa-angle-up"></i></div>');
    		 
    		element.append($scope.currentStandoutMask);
    	}
    	
    	$scope.removeCurrentStandoutItemMask = function(){
    		
    		if ($scope.currentStandoutMask){
    		
    			$scope.currentStandoutMask.remove();
    			$scope.currentStandoutMask = undefined;
    		}
    		
    	}
  
    	$scope.showStandoutPopupDialog = function(element){
    		
    		if ($rootScope.isStandoutPopupDialogShown){
    		
    			$('#memberStandoutDialog').modal('hide');
    			return;
    		}
    		
    		
    		
    		$scope.isAutoSwipeStripout = false;
    		
    		$('#memberStandoutDialog').modal({backdrop: false, show: true});
    		
    		$rootScope.isStandoutPopupDialogShown = true;
    		
    		$scope.showCurrentStandoutItemMask(element);
    		
    		$('#memberStandoutDialog').on('hidden.bs.modal', function(e){$scope.hiddenStandoutPopupDialog()});
    		
    		$('#photoMemberGridBackdrop').addClass("in");
    		
    		$('#photoMemberGridBackdrop').click(function(){$('#memberStandoutDialog').modal('hide');});
    	}
    	
    	
    }]);