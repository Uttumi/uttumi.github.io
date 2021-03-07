"use strict";

(function($)
{
	$.currentAnchor = "";

	$.navigationMap = {};

	$.menuIconButton = document.querySelector('#menu-icon-button');

	$.checkHash = function()
	{
		//Remove the #! and # from the hash, as different browsers may or may not include them
		let anchor = location.hash.replace('#!','').replace('#','');

		if(anchor === '')
		{
			location.href = '#!welcome';
		}

		$.navigationClick(anchor);
	};

	$.setupNavigation = function(indexUrl)
	{
		$.utility.fetchJson(indexUrl).then(data =>
			{
				console.log('DATA JSON RECEIVED');

				const navigationMenuElement = document.querySelector('#navigation-menu');
				$.createNavigationLevel(navigationMenuElement, 'root', data, 1);

				console.log('NAVIGATION CREATED');

				// Check the initial hash
				$.checkHash();
			}
		);
	};

	$.createNavigationLevel = function(parent, parentId, value, level)
	{
		let sublevels = $.utility.getNestedObjects(value);

		switch(level)
		{
			case 1:
				if(sublevels.length > 0)
				{
					const navList = document.createElement('UL');
					navList.setAttribute('id', 'level_'+ level);
					parent.appendChild(navList);

					let first = true;

					for(let sublevel of sublevels)
					{
						const id = sublevel.key;
						const data = sublevel.value;
						const title = data.title;

						//const navCategory = $.createNavigationElement(navList, parentId, id, title, level);

						const listItem = document.createElement('LI');
						const navigationButton = new $.NavigationButton(listItem, parentId, id, title, level, {navigable: false, hidable: true});
						navList.appendChild(listItem);

						if(first)
						{
							listItem.setAttribute('id', 'first_nav_element');
							first = false;
						}

						$.createNavigationLevel(listItem, sublevel.key, sublevel.value, level + 1);
					}

					let lastNavElement = document.createElement('LI');
					lastNavElement.setAttribute('id', 'last_nav_element');

					navList.appendChild(lastNavElement);
				}

				break;

			case 2:
				if(sublevels.length > 0)
				{
					const div = document.createElement('DIV');
					div.classList.add('nav-wrap');

					parent.appendChild(div);
					parent = div;

					const navList = document.createElement('UL');
					navList.setAttribute('id', 'level_'+ level);
					parent.appendChild(navList);

					for(let sublevel of sublevels)
					{
						const id = sublevel.key;
						const data = sublevel.value;
						const title = data.title;

						const listItem = document.createElement('LI');
						const navigationButton = new $.NavigationButton(listItem, parentId, id, title, level, {navigable: true, hidable: false});
						navList.appendChild(listItem);

						$.createNavigationItem(navigationButton.anchor, title, data);
					}
				}

				break;
		}
	};

	$.createNavigationItem = function(anchor, title, data)
	{
		let content =
		{
			description : $.utility.getArrayByKey(data, 'description'),
			pages 		: $.utility.getArrayByKey(data, 'pages'),
			images 		: $.utility.getArrayByKey(data, 'images'),
			videos 		: $.utility.getArrayByKey(data, 'videos'),
			subpages 	: $.utility.getArrayByKey(data, 'subpages')
		};

		if(!content.description) content.description = [];
		if(!content.pages) content.pages = [];
		if(!content.images) content.images = [];
		if(!content.videos) content.videos = [];
		if(!content.subpages) content.subpages = [];

		if($.navigationMap.hasOwnProperty(anchor))
			console.error('Navigation menu has multiple items with identical anchors: '+ anchor);
		else
			$.navigationMap[anchor] = {title: title, content: content};
	};

	$.navigationClick = function(anchor)
	{
		console.log('OPENING '+ anchor);

		const navigationItem = $.navigationMap[anchor];
		const content = navigationItem.content;
		let title = navigationItem.title ? navigationItem.title : anchor;

		title = title.replace(/_/g,' ');

		window.dispatchEvent(new Event('navigation-event'));

		if(anchor === $.currentAnchor)
			return;

		$.currentAnchor = anchor;

		const totalElementCount =
			content.description.length +
			content.images.length +
			content.videos.length +
			content.pages.length +
			content.subpages.length;

		if(totalElementCount > 0)
		{
			$.menuIconButton.checked = false;

			$.loadNewContent($.currentAnchor, title, content);
		}
	};

} (project));
