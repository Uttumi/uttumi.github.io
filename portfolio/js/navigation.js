"use strict";

(function($)
{	
	$.currentKey = "";

	$.createNavigationFromIndexJson = function(indexUrl)
	{
		//templates.loadJSON(content_path + 'index.json', "json-loaded");

		$.utility.fetchJson(indexUrl).then(data =>
			{ 
				$.createNavigationElement(null, {key: 'root', value: data}, 1);
			}
		);
	};

	$.createNavigationElement = function(ownListItem, jsonTuple, listLevel, is_home_page=false)
	{
		let description = $.utility.getArrayByKey(jsonTuple.value, 'description');
		let pages 		= $.utility.getArrayByKey(jsonTuple.value, 'pages');
		let images 		= $.utility.getArrayByKey(jsonTuple.value, 'images');
		let videos 		= $.utility.getArrayByKey(jsonTuple.value, 'videos');
		let subpages 	= $.utility.getArrayByKey(jsonTuple.value, 'subpages');
		
		if(description == null) description = [];
		if(pages == null) pages = [];
		if(images == null) images = [];
		if(videos == null) videos = [];
		if(subpages == null) subpages = [];
		
		let subelements = $.utility.getNestedObjects(jsonTuple.value);
		
		if(ownListItem != null)
		{
			let title = jsonTuple.key;

			if(title == 'welcome')
			{
				$.navigationClick(title, description, images, videos, pages, subpages);

				let homeInput = document.querySelector('#home_input');
				homeInput.checked = true;
				//$('#home_input').prop('checked', true);
			}

			let inputElement = ownListItem.querySelector('input');

			$.utility.addEvent(
				inputElement, 'click',  
				function()
				{
					console.debug('Clicked: '+ title);
					$.navigationClick(title, description, images, videos, pages, subpages);
				}, 
				true);
		}

		if(subelements.length > 0)
		{
			let navSublist = null; 
			
			if(ownListItem == null)
			{
				navSublist = document.querySelector('#level_1');
			}
			else
			{
				navSublist = document.createElement('UL');
				navSublist.setAttribute('id', 'level_'+ listLevel);

				let div = document.createElement('DIV');
				div.setAttribute('class', 'nav-wrap');

				div.appendChild(navSublist);
				ownListItem.appendChild(div);
			}
		
			for(let index = 0; index < subelements.length; index++)
			{
				let tuple = subelements[index];

				let childListItem = document.createElement('LI'); 
				navSublist.appendChild(childListItem);

				let label = document.createElement('LABEL');
				label.setAttribute('for', tuple.key +'_input');
				label.innerHTML = tuple.key.replace(/_/g, ' ');
				childListItem.appendChild(label);

				if(listLevel === 1)
				{
					if(index === 0)
					{
						childListItem.setAttribute('id', 'first_nav_element');
					}

					if(index + 1 === subelements.length)
					{
						let lastListItem  = document.createElement('LI'); 
						navSublist.appendChild(lastListItem );
						lastListItem.setAttribute('id', 'last_nav_element');
					}
				}

				let input = document.createElement('INPUT');
				input.setAttribute('id', tuple.key +'_input');
				input.setAttribute('type', 'checkbox');
				input.setAttribute('name', 'vertical_menu_'+ listLevel);
				childListItem.appendChild(input);

				$.createNavigationElement(childListItem, tuple, listLevel + 1);
			}

			// subelements.foreach(
			// 	function (tuple, index)
			// 	{
			// 		let childListItem = document.createElement('LI'); 
			// 		navSublist.appendChild(childListItem);

			// 		let label = document.createElement('LABEL');
			// 		label.setAttribute('for', tuple.key +'_input');
			// 		labelE.innerHTML = tuple.key.replace(/_/g, ' ');
			// 		childListItem.appendChild(label);

			// 		if(listLevel === 1)
			// 		{
			// 			if(index === 0)
			// 			{
			// 				childListItem.setAttribute('id', 'first_nav_element');
			// 			}

			// 			if(index + 1 === subelements.length)
			// 			{
			// 				let lastListItem  = document.createElement('LI'); 
			// 				navigationSublist.appendChild(lastListItem );
			// 				lastListItem.setAttribute('id', 'last_nav_element');
			// 			}
			// 		}

			// 		let input = document.createElement('INPUT');
			// 		input.setAttribute('id', tuple.key +'_input');
			// 		input.setAttribute('type', 'checkbox');
			// 		input.setAttribute('name', 'vertical_menu_'+ list_level);
			// 		childListItem.appendChild(input);

			// 		CreateNavigationElement(childListItem, tuple, listLevel + 1);
			// 	}
			// )
		}
	};

	$.navigationClick = function(key, description, images, videos, pages, subpages)
	{
		//console.debug('Clicked '+ key);
		
		// $window.trigger("navigation-event");

		window.dispatchEvent(new Event('navigation-event'));

		if(key === $.currentKey)
			return;

		$.currentKey = key;

		let totalElementCount = description.length + images.length + videos.length + pages.length + subpages.length;

		if(totalElementCount > 0)
		{
			//console.debug(description);
			//console.debug(images);
			//console.debug(videos);
			//console.debug(pages);
			//console.debug(subpages);

			// let contentArea = $('#content-area');
			let contentArea = document.getElementById('content-area');

			// Might consider removing child nodes element by element 
			// https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
			contentArea.innerHTML = '';
			// contentArea.empty();

			// $('<h1>'+ key.replace(/_/g,' ') +'</h1>').appendTo(contentArea);
			let headerElement = document.createElement('H1');
			let textNode = document.createTextNode(key.replace(/_/g,' '));
			headerElement.appendChild(textNode);

			contentArea.appendChild(headerElement);

			// $('<div class=\'title-underline\'/>').appendTo(contentArea);
			let divElement = document.createElement('DIV');
			divElement.class = 'title-underline';

			contentArea.appendChild(divElement);

			// $('<hr />').appendTo(contentArea);
			// let hrElement = document.createElement('HR');
			// contentArea.appendChild(hrElement);

			$.processContent($.currentKey, contentArea, description, images, videos, pages, subpages);
		}
	};

} (project));