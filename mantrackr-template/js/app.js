'use strict';

angular.module('mantrackrApp', ['ngRoute', 'firebase', 'ngAnimate', 'angularFileUpload'])
	.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

    $routeProvider
        .when('/nearby', {
            templateUrl: '/mantrackr-template/views/nearby.html',
            controller: 'MembersGridCtrl'
        })
        .when('/profile', {
        	templateUrl: '/mantrackr-template/views/profile.html',
        	controller: 'ProfileCtrl'
        })
        .when('/memberProfile/:memberId', {
        	templateUrl: '/mantrackr-template/views/member_profile.html',
        	controller: 'MemberProfileCtrl'
        })
        .when('/hotNot', {
        	templateUrl: '/mantrackr-template/views/hot_not.html',
        	controller: 'HotOrNotCtrl'
        })
        .when('/settings', {
        	templateUrl: '/mantrackr-template/views/settings.html',
        	controller: 'SettingsCtrl'
        })
        .when('/online', {
        	templateUrl: '/mantrackr-template/views/online_members.html',
        	controller: 'MembersGridCtrl'
        })
        .when('/global', {
        	templateUrl: '/mantrackr-template/views/global_members.html',
        	controller: 'MembersGridCtrl'
        })
        .when('/looking', {
        	templateUrl: '/mantrackr-template/views/looking_members.html',
        	controller: 'MembersGridCtrl'
        })
        .when('/favorites', {
        	templateUrl: '/mantrackr-template/views/favorites_members.html',
        	controller: 'MembersGridCtrl'
        })
        .when('/chats', {
        	templateUrl: '/mantrackr-template/views/chats_members.html',
        	controller: 'MembersGridCtrl'
        })
        .when('/woofs', {
        	templateUrl: '/mantrackr-template/views/woof_members.html',
        	controller: 'MembersGridCtrl'
        })
        .when('/test', {
        	templateUrl: '/mantrackr-template/views/test.html',
        	controller: 'IndexCtrl'
        })
        .when('/tracks', {
        	templateUrl: '/mantrackr-template/views/track_members.html',
        	controller: 'MembersGridCtrl'
        });
        
    
    $locationProvider.html5Mode(true);

}]);


/*jQuery(function($){
	
	var _oldShow = $.fn.show;
	
	$.fn.show = function(speed, oldCallback){
		
		return $(this).each(function(){
			
			var obj = $(this),
				newCallback = function(){
					if ($.isFunction(oldCallback)){
						oldCallback.apply(obj);
					}
					obj.trigger('afterShow');
				};
			obj.trigger('beforeShow');
			
			_oldShow.apply(obj, [speed, newCallback]);
			
		});
		
	}
});


jQuery(function($){
	$('#profilePhotoContainer').bind('afterShow', function(){alert('aftershow');});
})

*/

function htmlEncode(value){
	return $('<div/>').text(value).html();
}

function htmlDecode(value){
	return $('<div/>').html(value).text();
}

function parseFloatNumber(value){
	if (value == undefined || value == '' || value == null) return 0;
	
	var parseValue = parseFloat(value);
	if (parseValue == NaN || isNaN(parseValue)) return 0;
	
	return parseValue;
}

function parseIntegerNumber(value){
	
	if (value == undefined || value == '' || value == null) return 0;
	
	var parseValue = parseInt(value);
	if (parseValue == NaN || isNaN(parseValue)) return 0;
	
	return parseValue;
}


function stripHTMLTags(html){
	var div = document.createElement("div");
	div.innerHTML = html;
	var text = div.textContent || div.innerText || "";
	return text;
}

function bringBackModal(modalID){
	
	if ($('.modal-backdrop')) $('.modal-backdrop').zIndex(900);
	if ($(modalID)) $(modalID).zIndex(1000);
}

function bringFrontModal(modalID){
	
	if ($('.modal-backdrop')) $('.modal-backdrop').zIndex(1030);
	if ($(modalID)) $(modalID).zIndex(1040);
}


var gShowLoadingDialog = function(){
	
	var $loadingContainer = $('#loading-wrapper');
	var $loadingDialog = $('#loadingDialog');
	
	if (!$loadingContainer || !$loadingDialog) return;
	
	$loadingContainer.zIndex(1040);
	
	$loadingDialog.modal();
	
	$loadingDialog.on('hidden.bs.modal', function(e){
		$loadingContainer.zIndex(-100);
	});
	
}


var gHideLoadingDialog = function(){
	
	var $loadingDialog = $('#loadingDialog');
	if ($loadingDialog) $loadingDialog.modal('hide');
	
}


var getScreenTotalWidth = function(){
	
	var wrapper = $('#loading-wrapper');
	
	if (!wrapper) return 0;
	
	return wrapper.width();
}


function getObjectMembersCount(obj){
	
	if (obj == undefined) return 0;
	
	var count = 0;
	
	for (var key in obj){
		if (obj.hasOwnProperty(key)) count++;
	}
	
	return count;
}

function getFirstMemberOfObject(obj){
	
	if (obj == undefined) return undefined;
	
	for (var key in obj){
		
		if (obj.hasOwnProperty(key)) return obj[key];
		
	}
	
	return undefined;
}

function getPhotoUrlOfSwiperSlide(slide){
	
	if (!slide.childNodes) return '';
	
	for(var childNode in slide.childNodes){
		var node = slide.childNodes[childNode];
		if (node.localName == 'img'){
			return node.getAttribute('src');
		}
	}
	
	return '';
}

function getPhotoTypeOfSwiperSlide(slide){
	
	if (!slide.childNodes) return '';
	
	for(var childNode in slide.childNodes){
		var node = slide.childNodes[childNode];
		if (node.localName == 'img'){
			return node.getAttribute('data-photo-type');
		}
	}
	
	return '';
}

function getPhotoIdOfSwiperSlide(slide){
	
	if (!slide.childNodes) return '';
	
	for(var childNode in slide.childNodes){
		var node = slide.childNodes[childNode];
		if (node.localName == 'img'){
			return node.getAttribute('data-photo-id');
		}
	}
	
	return '';
}

function getPhotoIndexOfSwiperSlide(slide){
	
	if (!slide.childNodes) return '';
	
	for(var childNode in slide.childNodes){
		var node = slide.childNodes[childNode];
		if (node.localName == 'img'){
			return node.getAttribute('data-photo-index');
		}
	}
	
	return '';
}

var Rm = 3961;
var Rk = 6373;


function deg2rad(deg) {
	return deg * Math.PI/180;
}

function round(x) {
	return Math.round( x * 1000) / 1000;
}

function calculateDistance(lat1, lon1, lat2, lon2, unit){
	
	lat1 = deg2rad(lat1);
	lon1 = deg2rad(lon1);
	lat2 = deg2rad(lat2);
	lon2 = deg2rad(lon2);
	
	var dlon = lon2 - lon1; 
	var dlat = lat2 - lat1 ;
	
	var a  = Math.pow(Math.sin(dlat/2),2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon/2),2);
	var c  = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a)); // great circle distance in radians
	var dm = c * Rm; // great circle distance in miles
	var dk = c * Rk; // great circle distance in km
		
	var mi = round(dm);
	var km = round(dk);
	
	if (unit == 'mile') return mi;
	
	return km;
}

function getElapsedTime(now, from){
	
	var gap = now - from;
	
	if (gap <= 0) return "Just now";
	
	var days=Math.floor(gap / 86400);
    // After deducting the days calculate the number of hours left
    var hours = Math.floor((gap - (days * 86400 ))/3600)
    // After days and hours , how many minutes are left
    var minutes = Math.floor((gap - (days * 86400 ) - (hours *3600 ))/60)
    // Finally how many seconds left after removing days, hours and minutes.
    var secs = Math.floor((gap - (days * 86400 ) - (hours *3600 ) - (minutes*60)))

    var result = ' ';
    
    if (days > 0) {
    	//if (days == 1)
    	result = result + days + "d ";
    	/*else 
    		result = result + days + " days ";*/
    }
    
    if (hours > 0) {
    	//if (hours == 1)
    		result = result + hours + "hr ";
    	/*else 
    		result = result + hours + " hours ";*/
    }
    
    if (minutes > 0) {
    	if (minutes == 1)
    		result = result + minutes + "min ";
    	else 
    		result = result + minutes + "mins ";
    }
    
    if (secs > 0) {
    	if (days == 1)
    		result = result + secs + "sec ";
    	else 
    		result = result + secs + "secs ";
    }
   
    if (result != ' ') result = result + 'ago';
    
    return result;
}