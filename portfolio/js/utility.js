"use strict";

(function($)
{
	/*
    function: addEvent
	Taken from https://stackoverflow.com/questions/641857/javascript-window-resize-event
    @param: obj         (Object)(Required)
        -   The object which you wish
            to attach your event to.
    @param: type        (String)(Required)
        -   The type of event you
            wish to establish.
    @param: callback    (Function)(Required)
        -   The method you wish
            to be called by your
            event listener.
    @param: capturing (Boolean)(Optional)
        -   Whether you want the
            event to propagate as bubbling
            or capturing.
	*/

	$.addEvent = function(element, type, callback, capturing = false)
	{
	    if(element == null || typeof element === 'undefined') 
	    	return;

	    if(element.addEventListener)
	    {
	        element.addEventListener(type, callback, capturing ? true : false);
	    }
	    else if(element.attachEvent)
	    {
	        element.attachEvent('on' + type, callback);
	    }
	    else
	    {
	        element['on'+ type] = callback;
	    }
	};

	// $.hasNestedElements = function(element)
	// {
	// 	var hasNestedElements = false;

	// 	element.forEach(
	// 		function(key, value) 
	// 		{
	// 			if(!Array.isArray(value))
	// 			{
	// 				hasNestedElements = true;
	// 				return false;
	// 			}
	// 		}
	// 	)
		
	// 	return hasNestedElements;
	// };

	$.getNestedObjects = function(element, includeArrays = false)
	{
		let objects = [];

		for(let key of Object.keys(element))
		{
			let value = element[key];

			// Check if the given value is an object
			if(typeof value === 'object' && value !== null)
			{
				// Arrays are also objects, so rule them out depending on the parameters
				if(includeArrays || !Array.isArray(value))
				{
					objects.push( {'key': key, 'value': value} );
				}
			}
		}

		// element.forEach(

		// 	//TODO Check if the value is a complex type (contains both key and value)
		// 	function(value, key) 
		// 	{
		// 		// Check if the given value is an object
		// 		if(typeof value === 'object' && value !== null)
		// 		{
		// 			// Arrays are also objects, so rule them out depending on the parameters
		// 			if(includeArrays || !Array.isArray(value))
		// 			{
		// 				objects.push( {'key': key, 'value': value} );
		// 			}
		// 		}
		// 	}
		// );

		return objects;
	};

	$.getArrayByKey = function(element, arrayKey)
	{
		if(element.hasOwnProperty(arrayKey))
		{
			let array = element[arrayKey];
			
			if(Array.isArray(array))
			{
				return array;
			}
		}

		return null; 					
	};

} (project.utility));