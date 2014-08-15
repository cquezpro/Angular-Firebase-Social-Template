'use strict';

angular.module('mantrackrAdminApp')
    .controller('PendingPhotoMembersCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
      
    
    
}]);


function approvePendingPhoto(memberId){
	if (confirm('Are you sure to approve this photo?')){
		document.location.href = gSiteInfo.siteURL + "/admin/approveMemberPhoto?member_id=" + memberId;
	}	
}

function declinePendingPhoto(memberId){
	if (confirm('Are you sure to decline this photo?')){
		document.location.href = gSiteInfo.siteURL + "/admin/declineMemberPhoto?member_id=" + memberId;
	}	
		
}

function deleteMemberFromPendingPhoto(memberId){
	if (confirm('Are you sure to delete this member?')){
		document.location.href = gSiteInfo.siteURL + "/admin/deleteMember?member_id=" + memberId + '&back_page=' + encodeURIComponent('/admin/pendingPhotos');
	}	
}

function downloadPhoto(photoId){
	document.location.href = gSiteInfo.siteURL + "/admin/downloadPhoto?photo_id=" + photoId;
	//window.open(gSiteInfo.siteURL + "/admin/downloadPhoto?photo_id=" + photoId, "_blank"); 
}



function openReplaceDialog(path, photo_id, member_id){
	
	$('#currentPhotoThumb').prop("src", path);
	$('#replacePhotoId').val(photo_id);
	$('#replaceMemberId').val(member_id);
	
	$('#replacePhotoModal').modal('show');
}