"use strict";

(function($)
{	
	$.resizeIframe = function(iframe)
	{
	    // let newheight = iframe[0].contentWindow.document.body.scrollHeight;
	    // let newwidth = iframe[0].contentWindow.document.body.scrollWidth;

	    let newheight = iframe.contentWindow.document.body.scrollHeight;
	    let newwidth = iframe.contentWindow.document.body.scrollWidth;

	    console.debug('New iframe height: '+ newheight);
	    console.debug('New iframe width: '+ newwidth);
	    //obj.height = (newheight) + "px";
	    //obj.width = (newwidth) + "px";

	    iframe.style.height = newheight +'px';
	    iframe.style.width = newwidth +'px';
	};

	$.playGame = function(iframe)
	{
		//console.debug("CLICK!")

		// iframe.attr('src', iframe.attr('data-src'));
		iframe.setAttribute('src', iframe.dataset.src);
	};

} (project));