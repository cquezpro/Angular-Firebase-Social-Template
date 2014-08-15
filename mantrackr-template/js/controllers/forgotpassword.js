'use strict';

angular.module('mantrackrApp')
    .controller('ForgotPasswordCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
      
    	$scope.email = '';
    	    	    	
    	$scope.requestPassword = function(){
    		
    		if ($scope.email == '') {
    			alert("Email required.");
    			return;
    		}
    		
    		$http({ method: 'POST', url: $rootScope.webservice_baseuri + "/member/forgotpassword", params: {'email': $scope.email} }).
    			success(function (data, status, headers, config){
    				
    				if (data.code == undefined) {
    					alert('Ajax Error!');
    					return;
    				}
    				
    				if (data.code !== 0){
    					alert(data.msg);
    					return;
    				}
    				
    				alert('Password has been sent successfully.');    				
    		});
    		
    		
    	}
    	

    }]);