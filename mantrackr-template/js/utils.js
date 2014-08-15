jQuery.fn.sortElements = (function(){
 
    var sort = [].sort;
 
    return function(comparator, getSortable) {
 
        getSortable = getSortable || function(){return this;};
 
        var placements = this.map(function(){
 
            var sortElement = getSortable.call(this),
                parentNode = sortElement.parentNode,
 
                // Since the element itself will change position, we have
                // to have some way of storing its original position in
                // the DOM. The easiest way is to have a 'flag' node:
                nextSibling = parentNode.insertBefore(
                    document.createTextNode(''),
                    sortElement.nextSibling
                );
 
            return function() {
 
                if (parentNode === this) {
                    throw new Error(
                        "You can't sort elements if any one is a descendant of another."
                    );
                }
 
                // Insert before flag:
                parentNode.insertBefore(this, nextSibling);
                // Remove flag:
                parentNode.removeChild(nextSibling);
 
            };
 
        });
 
        return sort.call(this, comparator).each(function(i){
            placements[i].call(getSortable.call(this));
        });
 
    };
 
})();


function getMenuOrderListFromString(menuOrderString){
	
	var results = [];
	
	var index = 0;
	
	var parts = menuOrderString.split(",");
	
	for (var i in parts){
		
		var val = parts[i].trim();
		
		results[val] = index;
		
		index++;
	}
	
	return results;
	
}

function getMenuOrderStringFromElements(selector){
	
	var items = $(selector);
	
	var result = '';
	
	for (var i = 0; i < items.length; i++){
		
		if (!items.hasOwnProperty(i)) continue;
		
		var item = items[i];
		
		var menu_id = $(item).attr('data-mnu-id');
		
		if (result != '') result = result + ",";
		
		result = result + menu_id;
	}
	
	return result;
}