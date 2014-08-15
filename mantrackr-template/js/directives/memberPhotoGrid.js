'use strict';

angular.module('mantrackrApp')
    .directive('memberPhotoGrid', function() {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                members: '=members',
            },
            template: '<div class="swiper-slide member-grid-cell" data-ng-repeat="member in members">' +
				   '<img src="img/test/01.png" class="img-responsive grid-cell-image" />' + 
			     '<div class="member-name"><span class="member-looking-now-icon iconmoon-binoculars"></span>&nbsp;Tall Guy</div>' +
				   '</div>'
            ,
            link: function(scope, element, attrs) {

            	var updateMembersInfo = function(){
            	
            		
            		for(var member in scope.members){
            			if (scope.members.hasOwnProperty(member))
            				console.log(scope.members[member]);
            		}
            		
            	};
            	
            	
            	scope.$watch("members", function(newVal, oldVal){
            		if (newVal){
            			scope.members = newVal;
            			updateMembersInfo();
            			
            		}
            	})

            }
        }
    });