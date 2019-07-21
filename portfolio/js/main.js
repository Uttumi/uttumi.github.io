"use strict";

(function($)
{	
	$.contentUrl = 'content/';
	$.indexUrl = $.contentUrl +'index.json';

	$.init = function() 
	{
		$.fillModificationDate();

		$.createNavigationFromIndexJson($.indexUrl);

		// window.onload
		// Called when the entire page has loaded (including DOM(?), scripts and images etc.)

		// document.onload
		// Called when DOM is ready
		// Images and external content might still be under the process of loading

		// document.onload = function()
		// {
		// 	console.debug('Loading');
		// 	$('html,body').scrollTop(0);
		// };

		// An alternative to document.onload
		$.utility.addEvent(
			document,
			'load',  
			function()
			{
				console.debug('Loading');
				$('html,body').scrollTop(0);
			});

		// An alternative to jquery $(document).ready
		$.utility.addEvent(
			document,
			'DOMContentLoaded',
			function()
			{
				$.setBGIntoMotion();
			});

		// Implemented in navigation.js as fetchJson
		// document.addEventListener(
		// 	'json-loaded', 
		// 	function(event)
		// 	{
		// 		let data = event.target.jsonData;
		// 		//console.debug(JSON.stringify(data));
		// 		createNavigationElement(null, {key: 'root', value: data}, 1);
		// 	}
		// );

		// Implemented in content.js as fetchDocuments
		// $(document).on(
		// 	"documents-loaded", 
		// 	function (event, document_divs, target)
		// 	{
		// 		$.each(document_divs, 
		// 			function(index, document_div)
		// 			{
		// 				document_div.addClass('one-per-row');
		// 				document_div.addClass('first');
		// 				target.append(document_div);	
		// 			}
		// 		);
		// 	}
		// )
	};

	$.fillModificationDate = function()
	{
		let modificationDate = new Date(document.lastModified);
		let timeElement = document.querySelector('#date > time');

		let date = modificationDate.getDate();
		let month = modificationDate.getMonth() + 1;
		let year = modificationDate.getFullYear();

		let timeString = 'Last modified '+ date +'.'+ month +'.'+ year;

		timeElement.innerHTML = timeString;
	};

} (project));

project.init();