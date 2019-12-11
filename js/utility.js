"use strict";

(function($)
{
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

	$.hasNestedElements = function(element)
	{
		for(let key of Object.keys(element))
		{
			let value = element[key];

			// Check if the given value is an object
			if(!Array.isArray(value))
			{
				return true;
			}
		}

	    return false;
	};

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

	/**
     * Conserve aspect ratio of the orignal region. Useful when shrinking/enlarging
     * images to fit into a certain area.
     *
     * @param {Number} srcWidth Source area width
     * @param {Number} srcHeight Source area height
     * @param {Number} maxWidth Fittable area maximum available width
     * @param {Number} maxHeight Fittable area maximum available height
     * @return {Object} { width, heigth }
     */
   $.calculateAspectRatioFit = function(srcWidth, srcHeight, maxWidth, maxHeight)
   {
       var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

       return { width: srcWidth*ratio, height: srcHeight*ratio };
    }

	/** Function count the occurrences of substring in a string;
	 * @param {String} string   Required. The string;
	 * @param {String} subString    Required. The string to search for;
	 * @param {Boolean} allowOverlapping    Optional. Default: false;
	 * @author Vitim.us http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string/7924240#7924240
	 */
	$.occurrences = function(string, subString, allowOverlapping)
	{
	    string += "";
	    subString += "";
	    if (subString.length <= 0) return (string.length + 1);

	    var n = 0,
	        pos = 0,
	        step = allowOverlapping ? 1 : subString.length;

	    while(true)
	    {
	        pos = string.indexOf(subString, pos);

	        if (pos >= 0)
			{
	            ++n;
	            pos += step;
	        }
			else break;
	    }

	    return n;
	};

	$.clearElement = function(element)
	{
		// https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript

		while(element.firstChild)
		{
	    	element.removeChild(element.firstChild);
		}
	};

	$.getSiblings = function(element, includeSelf)
	{
		let children = element.parentNode.children;

		if(includeSelf)
		{
			return children;
		}
		else
		{
			let siblings = [];
			// let sibling = element.parentNode.firstChild;

			for(let child of children)
			{
				if (child.nodeType !== 1 || child === element)
					continue;

				siblings.push(child);
			}

			// while(sibling)
			// {
			// 	if (sibling.nodeType !== 1 || (!includeSelf && sibling === element))
			// 		continue;
			//
			// 	siblings.push(sibling);
			// 	sibling = sibling.nextSibling;
			// }

			return siblings;
		}
	};

} (project.utility));
