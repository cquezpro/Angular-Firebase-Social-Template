'use strict';

angular.module('mantrackrAdminApp')
    .controller('DashboardCtrl', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
      
    /* Crucial Metrics Data -- Begin */ 
    $scope.crucialMetricRangeOptions = ['Today', 'This Week', 'This Month', 'This Year', 'All Years (Totals)'];
    
    $scope.crucialMetricRange = 0;
    
    $scope.crucialMetricRangeText = $scope.crucialMetricRangeOptions[$scope.crucialMetricRange]; 
    
    $scope.$watch('crucialMetricRange', function(){
    	
    	$scope.crucialMetricRangeText = $scope.crucialMetricRangeOptions[$scope.crucialMetricRange];
    	$scope.updateCrucialMetrics();
    });
    
    $scope.crucialMetrics = {};
    
    $scope.updateCrucialMetrics = function(){
    	
    	$http(
    			{ method: 'POST', 
    			  url: gSiteInfo.siteURL + "/admin/getCrucialMetrics", 
    			  params: {rangeIndex : $scope.crucialMetricRange} 
    			}
    	).success(function (data, status, headers, config){
			
			if (data.code == undefined) {
				console.log('Ajax Error.');
				return;
			}
			if (data.code !== 0){
				alert(data.msg);
				return;
			}	
			
			$scope.crucialMetrics = data.results;
			
			if ($scope.crucialMetrics.new_members_count <= 0)
				$scope.crucialMetrics.new_premium_percent = '0.00';
			else
				$scope.crucialMetrics.new_premium_percent = (( $scope.crucialMetrics.new_premium_count / $scope.crucialMetrics.new_members_count ) * 100 ).toFixed(2);
    	});
    }
    
    
    /* Crucial Metrics Data -- End */
    
    /* Membership Area chart data -- Begin */
        
    $scope.membershipAreaChartStep = 0;
    $scope.membershipAreaChartData = [];
    
    $scope.updateMembershipAreaChartData = function(){
    	
    	$http(
    			{ method: 'POST', 
    			  url: gSiteInfo.siteURL + "/admin/getMembershipAreaChartData", 
    			  params: {stepIndex : $scope.membershipAreaChartStep} 
    			}
    	).success(function (data, status, headers, config){
			
			if (data.code == undefined) {
				console.log('Ajax Error.');
				return;
			}
			if (data.code !== 0){
				alert(data.msg);
				return;
			}	
			
			$scope.membershipAreaChartData = data.results;
			
			$scope.drawMembershipAreaChart();
			
			$(window).resize (App.debounce ($scope.drawMembershipAreaChart, 250));
			
    	});
    }
    
    
    $scope.drawMembershipAreaChart = function(){
    	
    	$('#membership-area-chart').empty ();

		Morris.Area ({
			element: 'membership-area-chart',
			data:$scope.membershipAreaChartData,
			xkey: 'period',
			ykeys: ['tot_members', 'new_members', 'cancellation'],
			labels: ['Total Members', 'New Members', 'Cancelations'],
			pointSize: 3,
			hideHover: 'auto',
			lineColors: [App.chartColors[0], App.chartColors[1], App.chartColors[3]]
		});
    }
    
    $scope.$watch('membershipAreaChartStep', function(){
    	
    	$scope.updateMembershipAreaChartData();
    });
    
    
    /* Membership Area chart data -- End */
    
        
    /* Purchase Volume chart data -- Begin */
    
    $scope.purchaseVolumeChartStep = 0;
    $scope.purchaseVolumeChartData = [];
    
    $scope.updatePurchaseVolumeChartData = function(){
    	
    	$http(
    			{ method: 'POST', 
    			  url: gSiteInfo.siteURL + "/admin/getPurchaseVolumnChartData", 
    			  params: {stepIndex : $scope.purchaseVolumeChartStep} 
    			}
    	).success(function (data, status, headers, config){
			
			if (data.code == undefined) {
				console.log('Ajax Error.');
				return;
			}
			if (data.code !== 0){
				alert(data.msg);
				return;
			}	
			
			$scope.purchaseVolumeChartData = data.results;
			
			$scope.drawPurchaseVolumeChart();
			
			$(window).resize (App.debounce ($scope.drawPurchaseVolumeChart, 250));
			
    	});
    }
    
    
    $scope.drawPurchaseVolumeChart = function(){
    	
    	$('#purchasevolume-area-chart').empty ();

		Morris.Area ({
			element: 'purchasevolume-area-chart',
			data:$scope.purchaseVolumeChartData,
			xkey: 'period',
			ykeys: ['premium_count', 'sos_count', 'gifts_count'],
			labels: ['New Prem Members', 'New SOS orders', 'New Gifts Purchased'],
			pointSize: 3,
			hideHover: 'auto',
			lineColors: [App.chartColors[0], App.chartColors[1], App.chartColors[3]]
		});
    }
    
    $scope.$watch('purchaseVolumeChartStep', function(){
    	
    	$scope.updatePurchaseVolumeChartData();
    });
    
    
    /* Purchase Volume chart data -- End */
    
    
    /* Purchase Selection Chart data -- Start */
    
    $scope.purchaseSelectionChartStep = 0;
    $scope.purchaseSelectionChartType = 0;
    $scope.purchaseSelectionChartData = [];
    
    $scope.purchaseSelectionChartTypeTextArray = ['Premium', 'Standout Strip', 'Gifts'];
    
    $scope.purchaseSelectionChartTypeString = $scope.purchaseSelectionChartTypeTextArray[$scope.purchaseSelectionChartType];
    
    
    $scope.$watch('purchaseSelectionChartType', function(){
    	
    	$scope.purchaseSelectionChartTypeString = $scope.purchaseSelectionChartTypeTextArray[$scope.purchaseSelectionChartType];
    	$scope.updatePurchaseSelectionChartData();
    });
    
    $scope.$watch('purchaseSelectionChartStep', function(){
    	$scope.updatePurchaseSelectionChartData();
    });
    
    $scope.updatePurchaseSelectionChartData = function(){
    	
    	
    	$http(
    			{ method: 'POST', 
    			  url: gSiteInfo.siteURL + "/admin/getPurchaseSelectionChartData", 
    			  params: {stepIndex : $scope.purchaseSelectionChartStep, purchaseTypeIndex: $scope.purchaseSelectionChartType} 
    			}
    	).success(function (data, status, headers, config){
			
			if (data.code == undefined) {
				console.log('Ajax Error.');
				return;
			}
			if (data.code !== 0){
				alert(data.msg);
				return;
			}	
			
			$scope.purchaseSelectionChartData = data.results;
			
			$scope.drawPurchaseSelectionChart();
			
			$(window).resize (App.debounce ($scope.drawPurchaseSelectionChart, 250));
			
    	});
    	
    }
    
    
    $scope.drawPurchaseSelectionChart = function(){
    	
    	$('#purchaseselection-area-chart').empty ();

    	var yKeys = [];
    	var labels = [];
    	var pointSize = 0;
    	var lineColors = [];
    	
    	if ($scope.purchaseSelectionChartType == 0){
    		yKeys = ['purchase-1', 'purchase-2', 'purchase-3', 'purchase-4'];
    		labels = ['1 Months', '3 Months', '6 Months', '12 Months'];
    		pointSize = 4;
    		lineColors = [App.chartColors[0], App.chartColors[1], App.chartColors[3], App.chartColors[4]];
    	}else if ($scope.purchaseSelectionChartType == 1){
    		yKeys = ['purchase-1', 'purchase-2', 'purchase-3'];
    		labels = ['2 Days', '4 Days', '1 Week'];
    		pointSize = 3;
    		lineColors = [App.chartColors[0], App.chartColors[1], App.chartColors[3]];
    		
    	}else if ($scope.purchaseSelectionChartType == 2){
    		yKeys = ['purchase-1', 'purchase-2'];
    		labels = ['Image gift', 'Premium Gift'];
    		pointSize = 2;
    		lineColors = [App.chartColors[0], App.chartColors[1]];
    	}
    	
		Morris.Area ({
			element: 'purchaseselection-area-chart',
			data:$scope.purchaseSelectionChartData,
			xkey: 'period',
			ykeys: yKeys,
			labels: labels, 
			pointSize: pointSize, 
			hideHover: 'auto',
			lineColors: lineColors
		});
    }

    /* Purchase Selection Chart data -- End */
    
    
    
    
    
    /* Gross Revenue chart data -- Begin */
    
    $scope.grossRevenueChartStep = 0;
    $scope.grossRevenueChartData = [];
    
    $scope.updateGrossRevenueChartData = function(){
    	
    	$http(
    			{ method: 'POST', 
    			  url: gSiteInfo.siteURL + "/admin/getGrossRevenueChartData", 
    			  params: {stepIndex : $scope.grossRevenueChartStep} 
    			}
    	).success(function (data, status, headers, config){
			
			if (data.code == undefined) {
				console.log('Ajax Error.');
				return;
			}
			if (data.code !== 0){
				alert(data.msg);
				return;
			}	
			
			$scope.grossRevenueChartData = data.results;
			
			$scope.drawGrossRevenueChart();
			
			$(window).resize (App.debounce ($scope.drawGrossRevenueChart, 250));
			
    	});
    }
    
    
    $scope.drawGrossRevenueChart = function(){
    	
    	$('#grossrevenue-area-chart').empty ();

		Morris.Area ({
			element: 'grossrevenue-area-chart',
			data:$scope.grossRevenueChartData,
			xkey: 'period',
			ykeys: ['premium_count', 'sos_count', 'gifts_count'],
			preUnits: '$',
			labels: ['Premium', 'Standout Strip', 'Gifts'],
			pointSize: 3,
			hideHover: 'auto',
			lineColors: [App.chartColors[0], App.chartColors[1], App.chartColors[3]]
		});
    }
    
    $scope.$watch('grossRevenueChartStep', function(){
    	
    	$scope.updateGrossRevenueChartData();
    });
    
    
    /* Gross Revenue chart data -- End */
    
    
}]);