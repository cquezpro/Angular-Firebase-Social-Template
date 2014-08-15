'use strict';

angular.module('mantrackrAdminApp')
    .controller('AdManagerCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
      
    $('.date-picker').datepicker();
       
    $('input:checkbox').iCheck({
		checkboxClass: 'icheckbox_minimal-blue',
		inheritClass: true
	});
    
        
    
    $('.date-picker[data-dpicker-type="startdate"]').datepicker().on('changeDate', function(e){
    	
    	var enddate_picker_id = getCorrespondingId($(this).prop('id'), 'ad_startdate', 'ad_enddate');
    	
    	if ($('#'+enddate_picker_id)){
    		$('#'+enddate_picker_id).datepicker('setStartDate', e.date);
    	}
    	
    });
    
    $('div[data-portlet-collapse="true"]').on('hidden.bs.collapse', function(e){
    	
    	var toggle_link_id = getCorrespondingId($(this).prop('id'), 'ad_content_panel', 'ad_content_toggle_link'); 
    	
    	if ($('#'+toggle_link_id)){
    		$('#'+toggle_link_id).addClass("fa-plus-square");
    		$('#'+toggle_link_id).removeClass("fa-minus-square");
    	}
    });
    
    $('div[data-portlet-collapse="true"]').on('shown.bs.collapse', function(e){
    	
    	var toggle_link_id = getCorrespondingId($(this).prop('id'), 'ad_content_panel', 'ad_content_toggle_link'); 
    	
    	if ($('#'+toggle_link_id)){
    		$('#'+toggle_link_id).removeClass("fa-plus-square");
    		$('#'+toggle_link_id).addClass("fa-minus-square");
    	}
    	
    });
    
        
    $('input:checkbox[data-chk-type="noenddate"]').on('ifChecked', function(event){
    	
    	var enddate_picker_id = getCorrespondingId($(this).prop('id'), 'noenddate_chk', 'ad_enddate');
    	
    	if ($('#'+enddate_picker_id)){
    		$('#'+enddate_picker_id).val('');
    	}
    });
    
    
    if (current_ad_id != 0){
    	
    	if ($('#ad_content_panel_'+current_ad_id)){
    		$('#ad_content_panel_'+current_ad_id).collapse('show');
    		$('#ad_content_panel_'+current_ad_id).goTo();
    		
    	}
    	
    }
    
}]);


function deActivateAd(id){
	if (confirm('Are you sure to de-activate this ad/alert?')){
		document.location.href = gSiteInfo.siteURL + "/admin/deactivateAd?ad_id=" + id;
	}
}

function deleteAd(id){
	if (confirm('Are you sure to remove this ad/alert?')){
		document.location.href = gSiteInfo.siteURL + "/admin/deleteAd?ad_id=" + id;
	}
}

function activateAd(id){
	if (confirm('Are you sure to activate this ad/alert?')){
		document.location.href = gSiteInfo.siteURL + "/admin/activateAd?ad_id=" + id;
	}
}


