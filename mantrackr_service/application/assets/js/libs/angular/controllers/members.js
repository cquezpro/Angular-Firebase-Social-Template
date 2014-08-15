'use strict';

angular.module('mantrackrAdminApp')
    .controller('MembersCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
      
    
    
}]);






var memberTableRowCallback = function( nRow, aData, iDisplayIndex ){
	
	/*$('td:eq(0)', nRow).addClass('checkbox-column');
	$('td:eq(0)', nRow).html('<input type="checkbox" class="icheck-input">');*/
		
	$('td:eq(0)', nRow).html('<div class="thumbnail"><div class="thumbnail-view"><a class="thumbnail-view-hover ui-lightbox" href="' + aData[0] + '"></a><img src="' + aData[0] + '" width="125" alt="Profile Image"></div></div>');
	
	$('td:eq(1)', nRow).html('<a href="' + gSiteInfo.siteURL + '/admin/member?memberId=' + aData[1][2] + '">' + aData[1][0] + ', ' + aData[1][1] + '</a>');
	
	$('td:eq(0)', nRow).addClass('hidden-xs');
	$('td:eq(0)', nRow).addClass('hidden-sm');
	
	$('td:eq(3)', nRow).addClass('hidden-xs');
	$('td:eq(3)', nRow).addClass('hidden-sm');
	
	$('td:eq(5)', nRow).addClass('hidden-xs');
	$('td:eq(5)', nRow).addClass('hidden-sm');
	
	$('td:eq(4)', nRow).html(aData[4] == 0 ? '<span class="label label-default">Freemium</span>' : '<span class="label label-primary">Premium</span>');
	$('td:eq(5)', nRow).html(aData[5] == 0 ? '<span class="label label-secondary">Pending</span>' : '<span class="label label-primary">Approved</span>');
	$('td:eq(6)', nRow).html(aData[6] == 0 ? '<span class="label label-primary">Active</span>' : '<span class="label label-default">Suspended</span>');
	
	return nRow;
	
}


var memberTableDrawCallback = function(oSettings ){
	
	$('.ui-lightbox').magnificPopup({
		type: 'image',
		closeOnContentClick: false,
		closeBtnInside: true,
		fixedContentPos: true,
		mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
		image: {
			verticalFit: true,
			tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
		}
	});
}