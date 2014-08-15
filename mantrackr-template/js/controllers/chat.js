'use strict';

angular.module('mantrackrApp')
    .controller('ChatCtrl', ['$scope', '$rootScope', '$firebase', function ($scope, $rootScope, $firebase) {
             
        $scope.chatFromFirebase = undefined;
        $scope.chatToFirebase = undefined;
        
        $scope.chatRoomFromConnected = false;
        $scope.chatRoomToConnected = false;
        
        $scope.messagesFrom = [];
        $scope.messageTo = [];
        
        $scope.newMessage = '';
        
        
        $scope.firebaseConnected = function(rootRef){
        	
        	if (rootRef){
        		
        		alert('ChatRoom Connected!');
        		
        		var fromUserId = $scope.fromUserId;
        		var toUserId = $scope.toUserId;
        		
        		$scope.chatFromFirebase = rootRef.child('messages/' + fromUserId);
            	
            	$scope.chatRoomFromConnected = true;
            	
            	$scope.messagesFrom = $firebase($scope.chatFromFirebase.limit(15));
            	
            	
            	$scope.chatToFirebase = rootRef.child('messages/' + toUserId);
            	
            	$scope.chatRoomToConnected = true;
            	
            	$scope.messageTo = $firebase($scope.chatToFirebase.limit(15));
        	}
        }
        
        $scope.setChatRoom = function(fromUserId, toUserId){
        	
        	$scope.fromUserId = fromUserId;
        	$scope.toUserId = toUserId;
        	
        	var rootFirebase = $rootScope.connectToFirebase($scope.firebaseConnected);
        	
        	/*if (!rootFirebase)	return;
        	
        	$scope.chatFromFirebase = rootFirebase.child('messages/' + fromUserId);
        	
        	$scope.chatRoomFromConnected = true;
        	
        	$scope.messagesFrom = $firebase($scope.chatFromFirebase.limit(15));
        	
        	
        	$scope.chatToFirebase = rootFirebase.child('messages/' + toUserId);
        	
        	$scope.chatRoomToConnected = true;
        	
        	$scope.messageTo = $firebase($scope.chatToFirebase.limit(15));*/
        	
        	/*$scope.chatRoomFromConnected = false;
        	
        	$scope.chatFromFirebase = new Firebase($rootScope.firebase_baseuri + '/messages/' + fromUserId + "/");
        	
        	$scope.chatFromFirebase.auth($rootScope.firebase_token, function(error, result) {
        		  if(error) {
        		    console.log("Firebase Login Failed!", error);
        		  } else {
        			  console.log("connected!");
        			  $scope.chatRoomFromConnected = true;
        			  $scope.messagesFrom = $firebase($scope.chatFromFirebase.limit(15));
        		  }
        	});
        	
        	
        	$scope.chatRoomToConnected = false;
        	
        	$scope.chatToFirebase = new Firebase($rootScope.firebase_baseuri + '/messages/' + toUserId + "/");
        	
        	$scope.chatToFirebase.auth($rootScope.firebase_token, function(error, result) {
        		  if(error) {
        		    console.log("Firebase Login Failed!", error);
        		  } else {
        			  console.log("connected!");
        			  $scope.chatRoomToConnected = true;
        			  $scope.messageTo = $firebase($scope.chatToFirebase.limit(15));
        		  }
        	});*/
        	
        }
        
        $scope.sendMessage = function(fromUserId, toUserId) {
        
          var message = $scope.newMessage;
          
          if (!$scope.chatRoomFromConnected || !$scope.chatRoomToConnected)
          {
        	  alert('Not Connected!');
        	  return;
          }
          
          $scope.messagesFrom.$add({
            'from': toUserId, 'content': message
          });
          
          
          $scope.messageTo.$add({
            'to': fromUserId, 'content': message
          });
         
          $scope.newMessage = '';
        }
        
        
        
    }]);

