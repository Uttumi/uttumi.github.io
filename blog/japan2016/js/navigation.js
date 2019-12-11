"use strict";

(function($)
{
	$.currentAnchor = "";

	$.Navigation = function(content)
	{
		this.content = content;

		this.articleMap = {};
		this.navigationMap = {};
	};

	$.Navigation.prototype.init = function(jsonData)
	{
		this.jsonData = jsonData;

		this.navigationMenuElement = document.querySelector('#navigation-menu');
		// $.createNavigationLevel(navigationMenuElement, 'root', jsonData, 1);

		//Language selection should be done here for now
		this.loadWithLanguage('en');

		console.log('NAVIGATION CREATED');
	};

	$.Navigation.prototype.update = function(anchor)
	{
		let me = this;

		this.content.reset();

		for(let navigationPoint in $.navigationMap)
		{
			navigationPoint.element.text += ' ('+ navigationPoint.ownArticles +'-'+ navigationPoint.childArticles +')';
		}

		let articlePaths = [];

		if(this.navigationMap.hasOwnProperty(anchor))
		{
			let navigationPoint = this.navigationMap[anchor];
			let articles = navigationPoint.articleList;

			for(let articleAnchor of articles)
			{
				let article = this.articleMap[articleAnchor];
				articlePaths.push(article.path);
			}

			$.utility.fetchTextDocuments(articlePaths).then(articleHTMLs => me.content.addArticles(articleHTMLs));
		}
		else
		{
			console.error('Strange anchor: '+ anchor);
		}
	};

    $.Navigation.prototype.loadWithLanguage = function(language)
    {
		let languageData = this.jsonData[language];

		this.createNavigationLevel(
            this.navigationMenuElement,
			languageData,
            1,
            ''
        );

        console.debug('Page loaded with language: '+ language);
    };

	$.Navigation.prototype.createNavigationLevel = function(parent, data, level, anchor)
	{
		let articles = [];
		let subElements = $.utility.getNestedObjects(data);

		console.debug('#########################');
		console.debug('PROCESSING NAV ELEMENT');
		console.debug('LEVEL:'+ level);
		console.debug('ANCHOR:'+ anchor);
		// console.debug(subElements);
		console.debug('#######');

		if(data.hasOwnProperty('articles'))
		{
			articles = data.articles;
			console.debug('HAS '+ articles.length +' ARTICLES');
		}

		let topicsDiv = document.createElement('DIV');
		topicsDiv.classList.add('nav-wrap');
		parent.appendChild(topicsDiv);

		let topicsList = document.createElement('UL');
		topicsDiv.appendChild(topicsList);

		switch(level)
		{
			case 1:
				topicsDiv.id = 'nav-bar';

				for(let subElement of subElements)
				{
					this.createNavElement(topicsList, subElement.key, subElement.value, level, anchor, false);
				}

				break;

			default:
				this.createNavElementsForArticles(topicsList, articles, level, anchor +'/');

				for(let subElement of subElements)
				{
					this.createNavElement(topicsList, subElement.key, subElement.value, level, anchor +'/', false);
				}

				break;
		}
	};

	$.Navigation.prototype.createNavElementsForArticles = function(parent, articles, level, parentAnchor)
	{
		console.debug('CREATING NAV ELEMENTS FOR '+ articles.length +' ARTICLES');

		for(let article of articles)
		{
			let id 				= article.id;
			let title 			= article.title;
			// let path 			= article.path;
			// let lastModified 	= article.last_modified;
			let anchor 			= parentAnchor +'/'+ id;

			// console.debug('ARTICLE NUMBER '+ index);
			// console.debug('LAST MODIFIED '+ lastModified);

			let listElement = this.createListItem(
				// path,
				level,
				title,
				anchor,
				// lastModified,
				article
			);

			parent.append(listElement);
		}

		// $.each
		// (
		// 	article_array,
		// 	function( index, article_map )
		// 	{
		// 		var id = article_map.id;
		// 		var title = article_map.title;
		// 		var path = article_map.path;
		// 		var anchor = parent_anchor +'/'+ id;
		// 		var last_modified = article_map.last_modified;
		//
		// 		console.debug('ARTICLE NUMBER '+ index);
		// 		console.debug('LAST MODIFIED '+ last_modified);
		//
		// 		var list_item_element = this.createListItem(
		// 			path,
		// 			level,
		// 			title,
		// 			anchor,
		// 			last_modified,
		// 			true
		// 		);
		//
		// 		list_element.append(list_item_element);
		// 	}
		// )
	};

	$.Navigation.prototype.createNavElement = function(listElement, key, data, level, parentAnchor, append)
	{
		let anchor = parentAnchor + key;

		console.debug('PARENT ANCHOR: '+ parentAnchor);

		let title = key;

		if(data.hasOwnProperty('title'))
		{
			console.debug('TITLE FOUND: '+ data.title);
			title = data.title;
		}

		if(data.hasOwnProperty('anchor'))
		{
			console.debug('ANCHOR CHANGED: '+ key +' -> '+ data.anchor);
			anchor = parentAnchor + data.anchor;
		}

		let listItemElement = this.createListItem(
			// path,
			level,
			title,
			anchor,
			// lastModified,
			// false
			);

		// if(append)
		// {
		// 	listElement.appendChild(listItemElement);
		//
		// 	this.createNavigationLevel(
		// 		listItemElement,
		// 		data,
		// 		level + 1,
		// 		anchor
		// 	);
		// }
		// else
		// {
			listElement.appendChild(listItemElement);

			this.createNavigationLevel(
				listItemElement,
				data,
				level + 1,
				anchor
			);
		// }
	};

	$.Navigation.prototype.createListItem = function(level, title, anchor, article = null)
	{
		let me = this;

		anchor = anchor.replace(' ', '_').toLowerCase();

		let inputId = anchor +'_input';
		let inputName = 'vertical_menu_'+ level;

		let listItem 	= document.createElement('LI');
		let label 		= document.createElement('LABEL');
		let input 		= document.createElement('INPUT');
		let labelText 	= document.createTextNode(title);

		label.setAttribute('for', inputId);
		label.appendChild(labelText);

		input.setAttribute('type', 'checkbox');
		input.setAttribute('name', inputName);
		input.setAttribute('id', inputId);

		listItem.appendChild(label);
		listItem.appendChild(input);

		if(level > 1)
		{
			listItem.classList.add('nav-dropdown-element', 'nav-dropdown-level'+ (level - 1));

			if(article)
			{
				let link 		= document.createElement('A');
				let linkText 	= document.createTextNode(title);

				link.setAttribute('href', anchor);
				link.appendChild(linkText);

				this.addToNavList(anchor, article.path, article.lastModified, link);
			}
		}
		else
		{
			//Close the dropdown menu when mouse hovers of its bounds
			$.utility.addEvent(
				listItem,
				'mouseleave',
				function()
				{
					me.uncheckHorizontalInput(inputName);
					me.uncheckVerticalInput(inputName);
				}
			);

			//Close the dropdown menu when mouse hovers of its bounds
			// $list_item.mouseleave(
			// 	function()
			// 	{
			// 		//Uncheck input horizontally
			// 		$('input[name="'+ $input_element.prop('name') +'"]').prop('checked', false);
			// 		//Uncheck input vertically
			// 		$list_item.find('input').prop('checked', false);
			//
			// 		//Remove selection class horizontally
			// 		$list_item.siblings().andSelf().removeClass( 'menu-selection' );
			// 		//Remove selection class vertically
			// 		$list_item.find('li').removeClass( 'menu-selection' );
			// 	}
			// );
		}

		// label.appendChild(linkText);

		// var $list_item = $('<li />');
		// var $link_element = $('<a />', {href: anchor});
		// $link_element.text(title);

		// var $label_element =
		// 	$(
		// 		'<label />',
		// 		{
		// 			for: anchor +'_input'
		// 		}
		// 	);
		// $label_element.html(title);



		// var $input_element =
		// 	$(
		// 		'<input />',
		// 		{
		// 		//type: 'radio',
		// 		type: 'checkbox',
		// 		name: 'vertical_menu_'+ list_level,
		// 		id: anchor +'_input',
		// 		}
		// 	);

		//list_item.append(link_element);
		// $list_item.append($label_element);
		// $list_item.append($input_element);

		$.utility.addEvent(
			input,
			'change',
			function()
			{
				if(input.checked)
				{
					me.changeSelection(listItem, true);

					let siblings = $.utility.getSiblings(listItem);

					for(let sibling of siblings)
					{
						sibling.classList.remove('menu-selection');
					}

					me.uncheckHorizontalInput(inputName, input);

					// $list_item.addClass( 'menu-selection' );
					// $list_item.siblings().removeClass( 'menu-selection' );

					// $('input[name="'+ $(this).prop('name') +'"]').not(this).prop('checked', false);

					location.href = '#!'+ anchor;
				}
				else
				{
					me.changeSelection(listItem, false);

					me.uncheckVerticalInput(inputName);

					// $list_item.find('input').prop('checked', false);
				}
			}
		);

		// $input_element.on(
		// 	'change',
		// 	function()
		// 	{
		// 		if( $(this).prop('checked') )
		// 		{
		// 			$list_item.addClass( 'menu-selection' );
		// 			$list_item.siblings().removeClass( 'menu-selection' );
		//
		// 			$('input[name="'+ $(this).prop('name') +'"]').not(this).prop('checked', false);
		//
		// 			window.location.href = anchor;
		// 		}
		// 		else
		// 		{
		// 			$list_item.removeClass( 'menu-selection' );
		//
		// 			$list_item.find('input').prop('checked', false);
		// 		}
		// 	}
		// );

		return listItem;
	};

	$.Navigation.prototype.addToNavList = function(originalAnchor, articleSelector, lastModified, element)
	{
		console.log('##################');
		console.log('ADDING TO NAV LIST');
		console.log('##################');

		if(this.articleMap.hasOwnProperty(originalAnchor))
		{
			console.debug('DUPLICATE ARTICLE ANCHOR!');
		}

		this.articleMap[originalAnchor] =
		{
			path: articleSelector,
			lastModified: lastModified
		};

		let folders = originalAnchor.split('/');
		let currentAnchor = '';
		let articleId = folders[folders.length-1];

		//Go through each parent folder of the document and add it to the article list of the folder

		for(let index = 0; index < folders.length; index++)
		{
			let folder = folders[index];

			let isFirst = index == 0;
			let isLast = index == folders.length-1;

			currentAnchor = isFirst ? folder : currentAnchor +'/'+ folder;

			if(this.navigationMap.hasOwnProperty(currentAnchor))
			{
				let navigationPoint = this.navigationMap[currentAnchor];

				navigationPoint.articleList.push(originalAnchor);

				if(isLast)
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

				if(isLast)
					navigationPoint.ownArticles = 1;
				else
					navigationPoint.childArticles = 1;

				this.navigationMap[currentAnchor] = navigationPoint;
			}
		}
	};

	$.Navigation.prototype.changeSelection = function(listItem, value)
	{
		if(value)
		{
			listItem.classList.add('menu-selection');
		}
		else
		{
			listItem.classList.remove('menu-selection');
		}
	};

	$.Navigation.prototype.uncheckHorizontalInput = function(inputName, exceptionInput = null)
	{
		let inputs = document.querySelectorAll('input[name="'+ inputName +'"]')

		for(let input of inputs)
		{
			if(input !== exceptionInput) input.checked = false;
		}
	};

	$.Navigation.prototype.uncheckVerticalInput = function(inputName, exceptionInput = null)
	{
		let inputs = document.querySelectorAll('input')

		for(let input of inputs)
		{
			if(input !== exceptionInput) input.checked = false;
		}
	};

	$.Navigation.prototype.navigationClick = function(anchor)
	{
		console.log('OPENING '+ anchor);

		// let navigationItem = $.navigationMap[anchor];
		// let title = navigationItem.title;
		// let content = navigationItem.content;
        //
		// window.dispatchEvent(new Event('navigation-event'));
        //
		// if(anchor === $.currentAnchor)
		// 	return;
        //
		// $.currentAnchor = anchor;
        //
		// let totalElementCount =
		// 	content.description.length +
		// 	content.images.length +
		// 	content.videos.length +
		// 	content.pages.length +
		// 	content.subpages.length;
        //
		// if(totalElementCount > 0)
		// {
		// 	let contentArea = document.getElementById('content-area');
        //
		// 	// Might consider removing child nodes element by element
		// 	// https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
		// 	contentArea.innerHTML = '';
		// 	// contentArea.empty();
        //
		// 	// $('<h1>'+ key.replace(/_/g,' ') +'</h1>').appendTo(contentArea);
		// 	let headerElement = document.createElement('H1');
		// 	let textNode = document.createTextNode(anchor.replace(/_/g,' '));
		// 	headerElement.appendChild(textNode);
        //
		// 	contentArea.appendChild(headerElement);
        //
		// 	// $('<div class=\'title-underline\'/>').appendTo(contentArea);
		// 	let divElement = document.createElement('DIV');
		// 	divElement.class = 'title-underline';
        //
		// 	contentArea.appendChild(divElement);
        //
		// 	$.processContent($.currentAnchor, contentArea, content.description, content.images, content.videos, content.pages, content.subpages);
		// }
	};

} (project));
