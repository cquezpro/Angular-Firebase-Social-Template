'use strict';

angular.module('mantrackrAdminApp')
    .controller('MemberCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
      
    
    	$scope.premiumDurationTypes = ['', '1 Month', '3 Months', '6 Months', '1 Year'];
        
        $scope.premiumType = 1;
        
        $scope.premiumDurationText = $scope.premiumDurationTypes[$scope.premiumType]; 
        
        $scope.$watch('premiumType', function(){
        	
        	$scope.premiumDurationText = $scope.premiumDurationTypes[$scope.premiumType];
        });
        
        
        $scope.standoutDurationTypes = ['', '2 Days', '4 Days', '1 Week'];
        
        $scope.standoutType = 1;
        
        $scope.standoutDurationText = $scope.standoutDurationTypes[$scope.standoutType]; 
        
        $scope.$watch('standoutType', function(){
        	
        	$scope.standoutDurationText = $scope.standoutDurationTypes[$scope.standoutType]; 
        });
        
    
}]);



function upgradePremiumMembership(form){
	
	if (!confirm("Are you sure to upgrade/extend premium membership?")) return;
	
	form.submit();
	
}


function upgradeStandoutStrip(form){
	
	if (!confirm("Are you sure to upgrade/extend SOS?")) return;
	
	form.submit();
	
}