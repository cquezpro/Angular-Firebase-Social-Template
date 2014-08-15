'use strict';


angular.module('mantrackrApp')
.filter('nearbyFilter', [function(){
	
	return function (members){
		
		var args = Array.prototype.slice.call(arguments, 1);
		
		if (args.length){
			for(var i = 0; i < args.length; i++)
				if (typeof args[i] == 'string') args[i] = parseIntegerNumber(args[i]);
		}
		
		if (!angular.isUndefined(members)){
			
			var tempClients = [];
			
			angular.forEach(members, function(member){
				
				if (typeof member == 'object'){
					if (args.indexOf(member.id) == -1) tempClients.push(member);
				}
				
			});
			
			return tempClients;
			
		}
		else
			return members;
		
	};
	
}]);


angular.module('mantrackrApp')
.filter('globalFilter', [function(){
	
	return function (members){
		
		var args = Array.prototype.slice.call(arguments, 1);
		
		if (args.length){
			for(var i = 0; i < args.length; i++)
				if (typeof args[i] == 'string') args[i] = parseIntegerNumber(args[i]);
		}
		
		if (!angular.isUndefined(members)){
			
			var tempClients = [];
			
			angular.forEach(members, function(member){
				
				if (typeof member == 'object'){
					if (args.indexOf(member.id) == -1) tempClients.push(member);
				}
				
			});
			
			return tempClients;
			
		}
		else
			return members;
		
	};
	
}]);


angular.module('mantrackrApp')
	.filter('onlineFilter', [function(){
		
		return function (members){
			
			var args = Array.prototype.slice.call(arguments, 1);
			
			if (args.length){
				for(var i = 0; i < args.length; i++)
					if (typeof args[i] == 'string') args[i] = parseIntegerNumber(args[i]);
			}
			
			if (!angular.isUndefined(members)){
				
				var tempClients = [];
				
				angular.forEach(members, function(member){
					
					if (typeof member == 'object'){
						if (args.indexOf(member.id) == -1 && member.online == true) tempClients.push(member);
					}
					
				});
				
				return tempClients;
				
			}
			else
				return members;
			
		};
		
	}]);

angular.module('mantrackrApp')
.filter('lookingFilter', [function(){
	
	return function (members){
		
		var args = Array.prototype.slice.call(arguments, 1);
		
		if (args.length){
			for(var i = 0; i < args.length; i++)
				if (typeof args[i] == 'string') args[i] = parseIntegerNumber(args[i]);
		}
		
		if (!angular.isUndefined(members)){
			
			var tempClients = [];
			
			angular.forEach(members, function(member){
				
				if (typeof member == 'object'){
					//if (args.indexOf(member.id) == -1) tempClients.push(member);
				}
				
			});
			
			return tempClients;
			
		}
		else
			return members;
		
	};
	
}]);


angular.module('mantrackrApp')
.filter('favoritesFilter', [function(){
	
	return function (members){
		
		var args = Array.prototype.slice.call(arguments, 1);
		
		if (args.length){
			for(var i = 0; i < args.length; i++)
				if (typeof args[i] == 'string') args[i] = parseIntegerNumber(args[i]);
		}
		
		if (!angular.isUndefined(members)){
			
			var tempClients = [];
			
			angular.forEach(members, function(member){
				
				if (typeof member == 'object'){
					//if (args.indexOf(member.id) == -1) tempClients.push(member);
				}
				
			});
			
			return tempClients;
			
		}
		else
			return members;
		
	};
	
}]);


angular.module('mantrackrApp')
.filter('chatsFilter', [function(){
	
	return function (members){
		
		var args = Array.prototype.slice.call(arguments, 1);
		
		if (args.length){
			for(var i = 0; i < args.length; i++)
				if (typeof args[i] == 'string') args[i] = parseIntegerNumber(args[i]);
		}
		
		if (!angular.isUndefined(members)){
			
			var tempClients = [];
			
			angular.forEach(members, function(member){
				
				if (typeof member == 'object'){
					//console.log(args[1][member.id]);
					//if (args[0] != member.id && args[1][member.id].info.unread > 0) tempClients.push(member);
				}
				
			});
			
			return tempClients;
			
		}
		else
			return members;
		
	};
	
}]);

angular.module('mantrackrApp')
.filter('woofsFilter', [function(){
	
	return function (members){
		
		var args = Array.prototype.slice.call(arguments, 1);
		
		if (args.length){
			for(var i = 0; i < args.length; i++)
				if (typeof args[i] == 'string') args[i] = parseIntegerNumber(args[i]);
		}
		
		if (!angular.isUndefined(members)){
			
			var tempClients = [];
			
			angular.forEach(members, function(member){
				
				if (typeof member == 'object'){
					//console.log(args[1][member.id]);
					//if (args[0] != member.id && args[1][member.id].info.unread > 0) tempClients.push(member);
				}
				
			});
			
			return tempClients;
			
		}
		else
			return members;
		
	};
	
}]);

angular.module('mantrackrApp')
.filter('tracksFilter', [function(){
	
	return function (members){
		
		var args = Array.prototype.slice.call(arguments, 1);
		
		if (args.length){
			for(var i = 0; i < args.length; i++)
				if (typeof args[i] == 'string') args[i] = parseIntegerNumber(args[i]);
		}
		
		if (!angular.isUndefined(members)){
			
			var tempClients = [];
			
			angular.forEach(members, function(member){
				
				if (typeof member == 'object'){
					//console.log(args[1][member.id]);
					//if (args[0] != member.id && args[1][member.id].info.unread > 0) tempClients.push(member);
				}
				
			});
			
			return tempClients;
			
		}
		else
			return members;
		
	};
	
}]);

angular.module('mantrackrApp')
.filter('filterMemberName', [function(){
	
	return function (memberName){
		
		if (memberName == undefined || memberName == '') return 'No Name';
		
		return memberName;
	};
	
}]);


angular.module('mantrackrApp')
.filter('orderByDistance', [function(){
	
	return function (items, startLat, startLng, reverse){
		
		var filtered = [];
		
		angular.forEach(items, function(item){
			if (typeof item == 'object')
				filtered.push(item);
		});
		
		filtered.sort(function (a, b){
			
			var distanceA = calculateDistance(parseFloatNumber(startLat), parseFloatNumber(startLng), parseFloatNumber(a.lat), parseFloatNumber(a.lng));
			var distanceB = calculateDistance(parseFloatNumber(startLat), parseFloatNumber(startLng), parseFloatNumber(b.lat), parseFloatNumber(b.lng));
			
			return (distanceA > distanceB);
			
		});
		
		if (reverse) filtered.reverse();
		return filtered;
	};
	
}]);





