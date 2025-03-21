"use strict";

(function($)
{
	$.contentUrl = 'content/';
	$.indexUrl = $.contentUrl +'index.json';

	$.articleMap = {};

	$.init = function()
	{
		$.setupNavigation($.indexUrl);

		// Called when DOM is ready
		// Images and external content might still be under the process of loading
		$.utility.addEvent(
			document,
			'DOMContentLoaded',
			function()
			{
				console.log('DOM DOCUMENT LOADED');

				$.background = new $.ParalaxBackground();
			}
		);

		// Called when the entire page has loaded (including DOM, scripts and images etc.)
		$.utility.addEvent(
			window,
			'load',
			function()
			{
				console.log('WHOLE PAGE LOADED');
				// $('html,body').scrollTop(0);
				document.body.scrollTop = 0;

				$.background.init();
			}
		);

		$.utility.addEvent(
			window,
			'hashchange',
			function()
			{
				$.checkHash();
			}
		);
	};
	
	$.addToNavList = function(originalAnchor, articleSelector, lastModified, element)
	{
		console.log('##################');
		console.log('ADDING TO NAV LIST');
		console.log('##################');

		if(articleMap.hasOwnProperty(originalAnchor))
			console.debug('DUPLICATE ARTICLE ANCHOR!');

		articleMap[originalAnchor] =
		{
			path: articleSelector,
			lastModified: lastModified
		};

		let folders = originalAnchor.split('/');
		let anchor = '';
		let articleId = folders[folders.length-1];

		//Go through each parent folder of the document and add it to the article list of the folder

		for(let index = 0; index < folders.length; index++)
		{
			let folder = folders[index];

			let first 	= index == 0;
			let last 	= index == folders.length-1;

			anchor = first ? folder : anchor +'/'+ folder;

			if(navigationMap.hasOwnProperty(anchor))
			{
				let navigationPoint = navigationMap[anchor];

				navigationPoint.articleList.push(originalAnchor);

				if(last)
					navigationPoint.ownArticles += 1;
				else
					navigationPoint.childArticles += 1;
			}
			else
			{
				let navigationPoint =
				{
					articleList: [originalAnchor],
					ownArticles: 0,
					childArticles: 0,
					element: element
				};

				if(last)
					navigationPoint.ownArticles = 1;
				else
					navigationPoint.childArticles = 1;

				navigationMap[anchor] = navigationPoint;
			}
		}
	};

} (project));

project.init();
