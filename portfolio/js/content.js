"use strict";

(function($)
{
	$.contentViewContainer = document.createElement('DIV');
	document.body.appendChild($.contentViewContainer);

	$.loadNewContent = function(anchor, title, content)
	{
		const contentArea = document.getElementById('content-area');

		$.utility.clearElement(contentArea);

		const titleElement = document.createElement('H1');
		const titleText = document.createTextNode(title);
		titleElement.appendChild(titleText);

		contentArea.appendChild(titleElement);

		const lineElement = document.createElement('DIV');
		lineElement.classList.add('title-line');

		contentArea.appendChild(lineElement);

		$.processContent(anchor, contentArea, content.description, content.images, content.videos, content.pages, content.subpages);
	};

	$.processContent = function(key, contentArea, description, images, videos, pages, subpages)
	{
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

			let articleElement = document.createElement("ARTICLE");
			articleElement.classList.add('content');

			let headline = [
				'<div class="article-gap-line"></div>',
				'<h2>',
				pageName.replace(/_/g,' '),
				'</h2>',
				'<div class="article-gap-line"></div>'
				].join('');

			articleElement.innerHTML = headline;
			contentArea.appendChild(articleElement);

			let description = $.utility.getArrayByKey(pageContent, 'description');
			let pages 		= $.utility.getArrayByKey(pageContent, 'pages');
			let images 		= $.utility.getArrayByKey(pageContent, 'images');
			let videos 		= $.utility.getArrayByKey(pageContent, 'videos');

			if(description === null) description = [];
			if(pages === null) pages = [];
			if(images === null) images = [];
			if(videos === null) videos = [];

			$.processContent(pageName, articleElement, description, images, videos, pages, []);
		}
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

			let input = document.createElement('INPUT');
			input.setAttribute('id', buttonID);
			input.setAttribute('type', 'radio');
			input.setAttribute('name', 'play_inputs');

			input.addEventListener('click', function()
			{
				$.playGame(iframe);
			});

			let label = document.createElement('LABEL');
			label.setAttribute('class', 'play-button');
			label.setAttribute('for', buttonID);
			label.innerHTML = 'Play';

			let div = document.createElement('DIV');
			div.setAttribute('class', 'content iframe-container');

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

		project.utility.fetchTextDocuments(articleUrls).then(articles =>
			{
				for(let article of articles)
				{
	                let articleElement = document.createElement('ARTICLE');
	                articleElement.innerHTML = article;
					articleElement.classList.add('content');
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

		let contentClass;
		let contentStyle = 'margin: 5px; height: 190px; object-fit: contain; object-position: 50% 50%; border-radius: 10px;';

		let imageContainer = document.createElement('DIV');
		imageContainer.setAttribute('style', 'width: 100%; display: flex; flex-wrap: wrap; justify-content: center; padding-top: 10px; padding-bottom: 10px')

		for(let url of imageUrls)
		{
			let imageElement = document.createElement('IMG');
			imageElement.src = $.contentUrl + url;

			imageElement.setAttribute('style', contentStyle);

			imageContainer.appendChild(imageElement);

			imageElement.addEventListener('click', function()
			{
				$.openContentView(imageElement);
			});
		}

		contentArea.appendChild(imageContainer);
	};

	$.addVideos = function(contentArea, videoUrls)
	{
		if(videoUrls.length == 0)
		{
			return;
		}

		const subelementWidth = contentArea.clientWidth;
		const contentClass = 'content';

		for(let url of videoUrls)
		{
			console.debug('Creating video: '+ $.contentUrl + url +' with width '+ subelementWidth);

			const video = document.createElement('VIDEO');
			const backupText = document.createTextNode('Your browser does not support the video tag.');
			const source = document.createElement('SOURCE');

			video.classList.add('content');
			video.controls = true;

			source.src = $.contentUrl + url;
			source.type = 'video/mp4';

			video.appendChild(source);
			video.appendChild(backupText);

			contentArea.appendChild(video);
		}
	};

	$.openContentView = function(content)
	{
		let contentClone = content.cloneNode(true);

		let background = document.createElement('DIV');
		let view = document.createElement('DIV');

		background.setAttribute('style', 'z-index: 1000; position: fixed; top: 0; right: 0; bottom: 0; left: 0; background-color: rgba(0, 20, 40, 0.9);');
		view.setAttribute('style', 'pointer-events: none; z-index: 1100; position: fixed; top: 50px; right: 0; bottom: 50px; left: 0;');

		contentClone.setAttribute('style', 'z-index: 1100; position: relative; height: 100%; width: 100%; object-fit: contain; object-position: 50% 50%; border-radius: 10px;');

		background.addEventListener('click', $.closeContentView);

		view.appendChild(contentClone);

		$.contentViewContainer.appendChild(background);
		$.contentViewContainer.appendChild(view);

		window.onwheel = function(){ return false; };
	};

	$.closeContentView = function()
	{
		$.contentViewContainer.innerHTML = '';

		window.onwheel = function(){};
	};

} (project));
