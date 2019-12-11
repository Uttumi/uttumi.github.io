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
			location.href = '#welcome';

			let homeInput = document.querySelector('#home_input');
			homeInput.checked = true;
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

			    // The hashchange event is only triggered when the hash changes
				//  we need to trigger
			    // the event now, to handle the hash with which the page may have loaded.
				$.checkHash();
				// let event = new Event('hashchange');
				// window.dispatchEvent(event);
			}
		);
	};

	$.createNavigationLevel = function(parent, parentTitle, value, level)
	{
		let sublevels = $.utility.getNestedObjects(value);

		switch(level)
		{
			case 1:
				// Start level. Container

				if(sublevels.length > 0)
				{
					const navList = document.createElement('UL');
					navList.setAttribute('id', 'level_'+ level);
					parent.appendChild(navList);

					let first = true;

					for(let sublevel of sublevels)
					{
						const title = sublevel.key;
						const data = sublevel.value;

						const navCategory = $.createNavigationElement(navList, parentTitle, title, level);

						if(first)
						{
							navCategory.setAttribute('id', 'first_nav_element');
							first = false;
						}

						$.createNavigationLevel(navCategory, sublevel.key, sublevel.value, level + 1);
					}

					let lastNavElement = document.createElement('LI');
					lastNavElement.setAttribute('id', 'last_nav_element');

					navList.appendChild(lastNavElement);
				}

				break;

			case 2:
				// Category level

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
						const title = sublevel.key;
						const data = sublevel.value;

						const navListItem = $.createNavigationElement(navList, parentTitle, title, level, false);

						$.createNavigationLevel(navListItem, title, data, level + 1);
					}
				}

				break;

			case 3:
				// Button level
				$.createNavigationButton(parent, parentTitle, value);
				break;
		}
	};

	$.createNavigationElement = function(parentList, groupId, title, level, hidable = true)
	{
		const listItem = document.createElement('LI');

		const navigationButton = new $.NavigationButton(listItem, groupId, title, level, hidable);

		parentList.appendChild(listItem);

		return listItem;
	};

	$.createNavigationButton = function(parent, title, value)
	{
		let content =
		{
			description : $.utility.getArrayByKey(value, 'description'),
			pages 		: $.utility.getArrayByKey(value, 'pages'),
			images 		: $.utility.getArrayByKey(value, 'images'),
			videos 		: $.utility.getArrayByKey(value, 'videos'),
			subpages 	: $.utility.getArrayByKey(value, 'subpages')
		};

		if(!content.description) content.description = [];
		if(!content.pages) content.pages = [];
		if(!content.images) content.images = [];
		if(!content.videos) content.videos = [];
		if(!content.subpages) content.subpages = [];

		let anchor = title.toLowerCase();

		if($.navigationMap.hasOwnProperty(anchor))
			console.error('Navigation menu has multiple items with identical anchor: '+ anchor);
		else
			$.navigationMap[anchor] = {title: title, content: content};

		let input = parent.querySelector('input');

		$.utility.addEvent(
			input,
			'click',
			function()
			{
				console.debug('Clicked: '+ title);
				location.href = '#!'+ anchor;
			},
			true);
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
