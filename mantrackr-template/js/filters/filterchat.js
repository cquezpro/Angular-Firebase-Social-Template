angular.module('mantrackrApp').
  filter('msgUserName', function() {
    return function(input) {
      
    	if (input.to == undefined || input.to == '')
    		return "User-" + input.from;
    	
    	return 'Me';
    }
});
