"use strict";

(function($)
{	
	$.contentViewContainer = document.createElement('DIV');
	document.body.appendChild($.contentViewContainer);

	$.processContent = function(key, contentArea, description, images, videos, pages, subpages)
	{
		//console.debug('Processing key: '+ key);

		$.addArticles(contentArea, description);
		$.addExternalPages(key, contentArea, pages);
		$.addImages(contentArea, images);
		$.addVideos(contentArea, videos);
		$.addSubpages(contentArea, subpages);
	};

	$.addSubpages = function(contentArea, subpages)
	{
		if(subpages.length == 0)
		{
			return;
		}
			
		for(let subpage of subpages)
		{
			let pageName = Object.keys(subpage)[0];
			let pageContent = subpage[pageName];

			let article = document.createElement("ARTICLE");
			article.style.width = '100%';

			let headline = [
				'<div class="article-gap-line"></div>',
				'<h2>', 
				pageName.replace(/_/g,' '), 
				'</h2>',
				'<div class="article-gap-line"></div>'
				].join('');

			article.innerHTML = headline;
			contentArea.appendChild(article);

			// var container = $('<article />').appendTo(contentArea);
			// $('<div class=\'article-gap-line\' />').appendTo(container);
			// var title = $('<h2>'+ key.replace(/_/g,' ') +'</h2>').appendTo(container);
			// $('<div class=\'article-gap-line\' />').appendTo(container);

			// let description = $.utility.getArrayByKey(section, 'description');
			// let pages 		= $.utility.getArrayByKey(section, 'pages');
			// let images 		= $.utility.getArrayByKey(section, 'images');
			// let videos 		= $.utility.getArrayByKey(section, 'videos');

			let description = $.utility.getArrayByKey(pageContent, 'description');
			let pages 		= $.utility.getArrayByKey(pageContent, 'pages');
			let images 		= $.utility.getArrayByKey(pageContent, 'images');
			let videos 		= $.utility.getArrayByKey(pageContent, 'videos');

			if(description === null) description = [];
			if(pages === null) pages = [];
			if(images === null) images = [];
			if(videos === null) videos = [];

			$.processContent(pageName, article, description, images, videos, pages, []);
		}

		// subpages.forEach( 
		// 	function(subpage, index)
		// 	{
		// 		$.each(subpage, 
		// 		function(key, value)
		// 		{

		// 		}
		// 	)
		// 	}
		// );
	};

	$.addExternalPages = function(key, contentArea, externalPageUrls)
	{
		if(externalPageUrls.length === 0)
		{
			return;
		}
		
		for(let pageUrl of externalPageUrls)
		{
			let buttonID = 'play-button-'+ key;
			let labelID = 'play-label-'+ key;

			let iframe = document.createElement('IFRAME');
			iframe.dataset.src = $.contentUrl + pageUrl;
			iframe.setAttribute('class', 'play-content');
			iframe.setAttribute('name', 'Game name');
			iframe.setAttribute('scrolling', 'no');
			iframe.name = 'Game name';

			iframe.onload = function() 
			{
		    	$.resizeIframe(this);
			}

			// let iframe = $('<iframe />',
			// 	{ 
			// 		class: 'play-content',
			// 		'data-src': content_path + page_url,
			// 		name: "Game name",
			// 		scrolling: "no",
			// 	}
			// ).on("load", 
			// 	function() 
			// 	{
			//     	resizeIframe($(this));
			// 	}
			// );

/*			.load(
				function ()
				{ 
					resizeIframe($(this));
				}
			);
*/

			let input = document.createElement('INPUT');
			input.setAttribute('id', buttonID);
			input.setAttribute('type', 'radio');
			input.setAttribute('name', 'play_inputs');

			input.addEventListener('click', function() 
			{ 
				$.playGame(iframe);
			});

			// let input = $('<input />', 
			// 	{ 
			// 		type: 'radio', 
			// 		//type: 'checkbox', 
			// 		name: 'play_inputs', 
			// 		id: buttonID
			// 	}
			// ).click(
			// 	function ()
			// 	{ 
			// 		PlayClicked(iframe);
			// 	}
			// );

			let label = document.createElement('LABEL');
			label.setAttribute('class', 'play-button');
			label.setAttribute('for', buttonID);
			label.innerHTML = 'Play';

			// let label = $('<label />',
			// 	{
			// 		//id: labelID,
			// 		class: "play-button",
			// 		for: buttonID
			// 	}
			// ).html('Play');


			let div = document.createElement('DIV');
			div.setAttribute('class', 'one-per-row iframe-container');
			 // $('<div class=\"one-per-row iframe-container\"/>')

			div.appendChild(input);
			div.appendChild(label);
			div.appendChild(iframe);

			contentArea.appendChild(div);
		}
	};

	$.addArticles = function(contentArea, articleUrls)
	{
		if(articleUrls.length == 0)
		{
			return;
		}

		//templates.loadDocuments(articles, contentArea, "documents-loaded");

		project.utility.fetchTextDocuments(articleUrls).then(articles =>
			{
				for(let article of articles)
				{
	                let articleElement = document.createElement('ARTICLE');
	                articleElement.innerHTML = article;
					articleElement.classList.add('one-per-row');
					articleElement.classList.add('first');
					contentArea.appendChild(articleElement);	
				}
			}
		);
	};

	$.addImages = function(contentArea, imageUrls)
	{
		if(imageUrls.length == 0)
		{
			return;
		}

		let imageCount = imageUrls.length;

		// let contentClass = 'four-per-row';

		// let contentClass = 'one-per-row';

		// if(imageCount > 4)
		// {
		// 	contentClass = 'two-per-row';
		// }
		// if(imageCount > 8)
		// {
		// 	contentClass = 'three-per-row';
		// }
		// if(imageCount > 16)
		// {
		// 	contentClass = 'four-per-row';
		// }

		let contentClass;
		let contentStyle = 'margin: 5px; height: 190px; object-fit: contain; object-position: 50% 50%; border-radius: 10px;';

		switch(imageCount)
		{
		  	case 1:
		    	contentClass = 'four-per-row';
		    	break;
		  	case 2:
		    	contentClass = 'two-per-row';
		    	break;
		  	case 3:
		    	contentClass = 'three-per-row';
		    	break;
		  	default:
		    	contentClass = 'four-per-row';
		}

		let imageContainer = document.createElement('DIV');
		imageContainer.setAttribute('style', 'width: 100%; display: flex; flex-wrap: wrap; justify-content: center;')

		for(let url of imageUrls)
		{
			let imageElement = document.createElement('IMG');
			imageElement.src = $.contentUrl + url;
			// imageElement.className = contentClass;
			// imageElement.classList.add(contentClass);
			imageElement.setAttribute('style', contentStyle);

			imageContainer.appendChild(imageElement);

			imageElement.addEventListener('click', function()
			{
				$.openContentView(imageElement);
			});

			// var image = $('<img />', 
			// 		{
			// 			src: contentPath + value,
			// 			class: contentClass
			// 		}
			// 	).appendTo(contentArea);
		}

		contentArea.appendChild(imageContainer);
	};

	$.addVideos = function(contentArea, videoUrls)
	{
		if(videoUrls.length == 0)
		{
			return;
		}

		let subelementWidth = contentArea.clientWidth;
		let contentClass = 'one-per-row';

		for(let url of videoUrls)
		{
			console.debug('Creating video: '+ $.contentUrl + url +' with width '+ subelementWidth);

			let videoHtml = 
				'<video controls class=\"'+ contentClass +'\"">'+
				'	<source src=\''+ $.contentUrl + url +'\' type="video/mp4">'+
				'	Your browser does not support the video tag.'+
				'</video>';

			contentArea.insertAdjacentHTML('beforeend', videoHtml);

			/*
			contentArea.append(
			//	'<video width=\''+ subelement_width +'\' controls>'+
				'<video controls class=\"'+ contentClass +'\"">'+
				'	<source src=\''+ $.contentUrl + url +'\' type="video/mp4">'+
				'	Your browser does not support the video tag.'+
				'</video>'
				)
			*/

			/*
			var video = $('<video />', {width: subelement_width}).appendTo(content_area);
			
			video.html('Your browser does not support the video tag.');
			
			$('<source />', 
				{
					src: 'portfolio/'+ value,
					type: 'video/mp4'
				}
			).appendTo(video);
			*/
		}

		/*
		videos.forEach(
			function(video, index)
			{

			}
		);
		*/
	};

	$.openContentView = function(content)
	{
		let contentClone = content.cloneNode(true);

		let background = document.createElement('DIV');
		let view = document.createElement('DIV');
		// let backButton = document.createElement('DIV');

		background.setAttribute('style', 'z-index: 1000; position: fixed; top: 0; right: 0; bottom: 0; left: 0; background-color: rgba(0, 20, 40, 0.9);');
		view.setAttribute('style', 'pointer-events: none; z-index: 1100; position: fixed; top: 50px; right: 0; bottom: 50px; left: 0;');

		// contentClone.setAttribute('style', 'z-index: 1100; position: fixed; height: 100%; width: 100%; object-fit: cover;');
		contentClone.setAttribute('style', 'z-index: 1100; position: relative; height: 100%; width: 100%; object-fit: contain; object-position: 50% 50%; border-radius: 10px;');
		// backButton.setAttribute('style', 'z-index: 1200; top: 0; right: 0; bottom: 0; left: 0; background-color: rgb(255, 0, 0);');
		// backButton.setAttribute('style', 'z-index: 1200; position: fixed; top: 80px; right: 80px; width: 80px; height: 80px; background-color: rgb(255, 0, 0);');
		// backButton.setAttribute('style', 'z-index: 1200; position: absolute; top: 80px; right: 80px; width: 80px; height: 80px; background-color: rgb(255, 0, 0);');

		background.addEventListener('click', $.closeContentView);

		// contentClone.appendChild(backButton);

		view.appendChild(contentClone);

		$.contentViewContainer.appendChild(background);
		// $.contentViewContainer.appendChild(contentClone);
		$.contentViewContainer.appendChild(view);
		
		// background.appendChild(backButton);
		// view.appendChild(backButton);

		window.onwheel = function(){ return false; };
	};

	$.closeContentView = function()
	{
		$.contentViewContainer.innerHTML = '';

		window.onwheel = function(){};
	};

} (project));