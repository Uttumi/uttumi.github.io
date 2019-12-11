"use strict";

(function($)
{
	$.contentUrl = 'content/';
	$.indexUrl = $.contentUrl +'index.json';
	$.svgUrl = 'img/background_illustrator.svg';

	$.contentElement = document.querySelector('#content-area');

	$.articleClosedHeight = 100;
	// var modification_date = new Date(document.lastModified);

	// var nav_map = {};
	// var articles_map = {};

	$.init = function()
	{
		$.background = new $.ParallaxBackgroundSVG();
		$.content = new $.Content($.contentElement);
		$.navigation = new $.Navigation($.content);


		// CreateNavigationFromIndexJson();
		$.utility.fetchText($.svgUrl).then(svgText => $.background.init(svgText));
		$.utility.fetchJson($.indexUrl).then(jsonData =>
			{
				$.navigation.init(jsonData);

				// The hashchange event is only triggered when the hash changes
				// We need to trigger the event to handle the hash with which the page may have loaded.
				// $.checkHash();
			}
		);

		// Called when DOM is ready
		// Images and external content might still be under the process of loading
		$.utility.addEvent(
			document,
			'DOMContentLoaded',
			function()
			{
				console.log('DOM DOCUMENT LOADED');

				$.fillModificationDate();
			}
		);

		// Called when the entire page has loaded (including DOM, scripts and images etc.)
		$.utility.addEvent(
			document,
			'load',
			function()
			{
				console.log('WHOLE PAGE LOADED');
			}
		);

		$.utility.addEvent(
			window,
			'scroll',
			function()
			{
				$.background.update();
			}
		);

		$.utility.addEvent(
			window,
			'resize',
			function()
			{
				$.background.resize();
				$.background.update();
			}
		);

		$.utility.addEvent(
			window,
			'hashchange',
			function()
			{
				$.checkHash();
				$.background.reset();
			}
		);

		// $.utility.addEvent(
		// 	document.querySelector('#content-area'),
		// 	'resize',
		// 	function()
		// 	{
		// 		$.background.resize();
		// 		$.background.update();
		// 	}
		// );
	};

	$.fillModificationDate = function()
	{
		let modificationDate = new Date(document.lastModified);
		let timeElement = document.querySelector('#date > time');

		let date = modificationDate.getDate();
		let month = modificationDate.getMonth() + 1;
		let year = modificationDate.getFullYear();

		let timeString = 'Last modified '+ date +'.'+ month +'.'+ year;

		// timeElement.innerHTML = timeString;
		timeElement.textContent = timeString;
	};

	$.checkHash = function()
	{
		//Remove the #! and # from the hash, as different browsers may or may not include them
		let anchor = location.hash.replace('#!','').replace('#','');



		$.navigation.update(anchor);
	};

	// $(document).on(
	// 	'svg-fetched',
	// 	function (event, svgData)
	// 	{
	// 		//console.debug('SVG succesfully fetched');
	//
	// 		var $svgBackground = $($.parseHTML(svgData));
	//
	// 		$svgBackground.attr( 'height', '100%' );
	// 		$svgBackground.attr( 'width', 'auto' );
	// 		//$svgBackground.attr( 'preserveAspectRatio', 'xMinYMid meet'); //'xMidYMid meet' );
	//
	// 		//$svgBackground.find('g').attr('data-type', 'background');
	// 		//$svgBackground.find('g[id*="background"]').attr('data-type', 'background');
	//
	// 		$svgBackground.find('g[id*="ground"]').each(
	// 			function( index )
	// 			{
	// 				$gElement = $(this);
	// 				$gElement.attr('data-type', 'background');
	// 				var id = $gElement.attr('id');
	//
	// 				//The number in id should be after 10th index (foreground2, background6 etc.)
	// 				var number = id.substring(10);
	//
	// 				$gElement.attr('data-speed', number);
	// 			}
	// 		);
	//
	// 		$('body').append($svgBackground);
	//
	// 		SetBGIntoMotion();
	// 	}
	// )

	// $.setupNavigation = function()
	// {
	// 	let json = null;
	//
	// 	templates.getJSON(contentUrl +'index.json', "json-fetched");
	//
	// 	console.debug('Reading JSON');
	// }

	// $(document).on(
	// 	"json-fetched",
	// 	function (event, jsonData)
	// 	{
	// 		//console.debug(JSON.stringify(data));
	// 		console.debug('JSON succesfully fetched');
	//
	// 		//Language selection should be done here for now
	// 		FinalizePage(jsonData.en);
	// 	}
	// )
	//


	// $(document).on(
	// 	"elements-loaded",
	// 	function (event, article_divs, article_ids, target_element_id)
	// 	{
	// 	    console.debug('Files loaded');
	//
	// 	    $target_element = $(target_element_id);
	//
	// 	    $target_element.empty();
	//
	//         $.each (
	//             article_divs,
	// //             function( index, article_div )
	// //             {
	// //             	$target_element.append("<span class=\"clearfix\" />");
	// //             	$target_element.append("<hr class=\"article-start\" >");
	// //
	// //             	//$last_modified_element = $('<time class="article_last_modified" />');
	// //             	//$last_modified_element.text(articles_map[article_ids[index]].last_modified);
	// //
	// //             	//$target_element.append($last_modified_element);
	// //                 $target_element.append(article_div.html());
	// //                 var $article_content = $target_element.children().last().find('.article-content');
	// //                 //var scrollHeight = $article_content.get(0).scrollHeight;
	// //
	// //                 $target_element.append( getFacebookButton('uttumi.github.io/blog/japan2016') );
	// //
	// //                 var autoHeight = $article_content.css('height', 'auto').height();
	// //                 $article_content.height('100px');
	// //
	// //                 var $label_element = $('<label />');
	// //                 var $label_text_element = $('<h3 />');
	// // 				var $input_element =
	// // 					$(
	// // 						'<input />',
	// // 						{
	// // 							type: 'checkbox'
	// // 						}
	// // 					);
	// //
	// //             	$target_element.append($label_element);
	// //             	$label_element.append($label_text_element);
	// //             	$label_element.append($input_element);
	// //
	// // 		        $input_element.on(
	// // 					'change',
	// // 					function()
	// // 					{
	// // 						if( $(this).prop('checked') )
	// // 						{
	// // 					        $article_content.animate(
	// // 					        	{
	// // 									height: autoHeight
	// // 								},
	// // 								{
	// // 									duration: $.articleAnimationDurationMs,
	// // 									complete: function()
	// // 									{
	// // 								    	$article_content.height('auto');
	// // 									},
	// // 									step: function()
	// // 									{
	// // 										$(window).trigger('resize');
	// // 									}
	// // 								}
	// // 							);
	// //
	// // 							$article_content.find('img').each(
	// // 								function( index, image )
	// // 								{
	// // 									var $image = $(image);
	// //
	// // 									var curHeight = $image.height();
	// // 									var curWidth = $image.width();
	// //
	// // 									console.debug('Image old width value: '+ $image.attr('width') );
	// //
	// // 									var outcomeImage = $image.css(
	// // 										{
	// // 											'width': $image.attr('width'),
	// // 											'height': 'auto'
	// // 										}
	// // 									);
	// //
	// // 									var outcomeHeight = outcomeImage.height();
	// // 									var outcomeWidth = outcomeImage.width();
	// //
	// //
	// // 									console.debug('Image width: '+ curWidth +' -> '+ outcomeWidth);
	// // 									console.debug('Image height: '+ curHeight +' -> '+ outcomeHeight);
	// //
	// // 									$image.height(curHeight).width(curWidth).animate(
	// // 										{
	// // 											height: outcomeHeight,
	// // 											width: outcomeWidth
	// // 										},
	// // 										$.articleAnimationDurationMs
	// // 									);
	// // 								}
	// // 							);
	// //
	// // 							$article_content.removeClass('closed');
	// // 							$article_content.addClass('opened');
	// //
	// // 							$label_text_element.text('Close article');
	// // 						}
	// // 						else
	// // 						{
	// // 							$article_content.animate(
	// // 					        	{
	// // 									height: $.closedArticleContentHeight+'px'
	// // 								},
	// // 								{
	// // 									duration: $.articleAnimationDurationMs,
	// // 									complete: function()
	// // 									{
	// // 								    	$article_content.height($.closedArticleContentHeight +'px');
	// // 									},
	// // 									step: function()
	// // 									{
	// // 										$(window).trigger('resize');
	// // 									}
	// // 								}
	// // 							);
	// // /*
	// // 							$article_content.find('img').each(
	// // 								function( index, image )
	// // 								{
	// // 									var $image = $(image);
	// // 									var newSizeTuple = CalculateAspectRatioFit($image.width(), $image.height(), 10000, 100);
	// //
	// // 									console.debug(newSizeTuple);
	// //
	// // 									$image.animate(
	// // 							        	{
	// // 											height: newSizeTuple.height +'px',
	// // 											width: newSizeTuple.width +'px'
	// // 										},
	// // 										1000
	// // 									);
	// //
	// // 									var curHeight = $image.height();
	// // 									var autoHeight = $image.css('height', 'auto').height();
	// // 									el.height(curHeight).animate({height: autoHeight}, 1000);
	// // 								}
	// // 							);
	// // */
	// //
	// // 							$article_content.find('img').each(
	// // 								function( index, image )
	// // 								{
	// // 									var $image = $(image);
	// //
	// // 									var curHeight = $image.height();
	// // 									var curWidth = $image.width();
	// //
	// // 									var outcomeImage = $image.css(
	// // 										{
	// // 											'width': 'auto',
	// // 											'height': $.closedArticleContentHeight +'px'
	// // 										}
	// // 									);
	// //
	// // 									var outcomeHeight = outcomeImage.height();
	// // 									var outcomeWidth = outcomeImage.width();
	// //
	// //
	// // 									if(outcomeWidth != 0 && outcomeHeight != 0)
	// // 									{
	// // 										$image.height(curHeight).width(curWidth).animate(
	// // 											{
	// // 												height: outcomeHeight,
	// // 												width: outcomeWidth
	// // 											},
	// // 											$.articleAnimationDurationMs
	// // 										);
	// // 									}
	// //
	// // 									console.debug('Image width: '+ curWidth +' -> '+ outcomeWidth);
	// // 									console.debug('Image height: '+ curHeight +' -> '+ outcomeHeight);
	// //
	// //
	// // 								}
	// // 							);
	// //
	// // 							$article_content.removeClass('opened');
	// // 							$article_content.addClass('closed');
	// //
	// // 							$label_text_element.text('Open full...');
	// // 						}
	// // 					}
	// // 				);
	// //
	// // 				$input_element.trigger( 'change' );
	// //
	// // 				$target_element.append("<span class=\"clearfix\" />");
	// //             	$target_element.append("<hr class=\"article-end\" >");
	// //             }
	//         );
	//
	//         //var $input_elements = $target_element.find('input');
	// /*
	//         $input_elements.on(
	// 			'change',
	// 			function()
	// 			{
	// 				var $article_content = $(this).parent().find('.article-content'); //$(this).next().next().next();
	//
	// 				if( $(this).prop('checked') )
	// 				{
	// 					$article_content.css(
	// 						{
	// 							'height': $article_content.get(0).scrollHeight +'px',
	// 							'transition': 'height 1000ms ease-in'
	// 						}
	// 					);
	// 				}
	// 				else
	// 				{
	// 					$article_content.css(
	// 						{
	// 							'height': '100px',
	// 							'transition': 'height 1000ms ease'
	// 						}
	// 					);
	// 				}
	// 			}
	// 		);
	// */
	// 		//$input_elements.trigger( 'change' );
	// 		//$input_elements.prop('checked', false);
	// 	}
	// )

	// function ProcessNavigationElement(parent_element, json_element, list_level, anchor)
	// {
	// 	var article_array = [];
	// 	var sub_json_element_list = $.getNestedObjects(json_element.value);
	//
	// 	console.debug('#########################');
	// 	console.debug('PROCESSING NAV ELEMENT');
	// 	console.debug('LEVEL:'+ list_level);
	// 	console.debug('ANCHOR:'+ anchor);
	// 	console.debug(sub_json_element_list);
	// 	console.debug('#######');
	// /*
	// 	if(json_element.value.hasOwnProperty('anchor'))
	// 	{
	// 		console.debug('ANCHOR CHANGED: '+ json_element.key +' -> '+ json_element.value.anchor);
	// 		anchor = '#'+ json_element.value.anchor;
	// 	}
	// */
	// 	if(json_element.value.hasOwnProperty('articles'))
	// 	{
	// 		article_array = json_element.value.articles;
	// 		console.debug('HAS '+ article_array.length +' ARTICLES');
	//
	// 	}
	//
	// 	switch(list_level)
	// 	{
	// 		case 1:
	// 			var topics_div = $('<div />', {id: 'nav-bar', class: 'nav-wrap'}).appendTo(parent_element);
	// 			var topics_ul = $('<ul />').appendTo(topics_div);
	//
	// 			$.each
	// 			(
	// 				sub_json_element_list,
	// 				function( index, sub_json_element )
	// 				{
	// 					CreateNavElement(topics_ul, sub_json_element, list_level, anchor, false);
	// 				}
	// 			)
	//
	// 			break;
	// 		default:
	// 			var topic_dropdown_div = $('<div />', {class: 'nav-wrap'}).appendTo(parent_element);
	// 			var topic_dropdown_ul = $('<ul />').appendTo(topic_dropdown_div);
	//
	// 			CreateNavElementsFromArticles(topic_dropdown_ul, article_array, list_level, anchor +'/');
	//
	// 			$.each
	// 			(
	// 				sub_json_element_list,
	// 				function( index, sub_json_element )
	// 				{
	// 					CreateNavElement(topic_dropdown_ul, sub_json_element, list_level, anchor +'/', false);
	// 				}
	// 			)
	//
	// 			break;
	// /*		default:
	//
	// 			CreateNavElementsFromArticles(parent_element, article_array, list_level, anchor +'/');
	//
	// 			$.each
	// 			(
	// 				sub_json_element_list,
	// 				function( index, sub_json_element )
	// 				{
	// 					CreateNavElement(parent_element, sub_json_element, list_level, title, anchor +'/', false);
	// 				}
	// 			)
	//
	// 			break;*/
	// 	}
	// }

	// function CreateNavElement(list_element, json_element, list_level, parent_anchor, append_list_item)
	// {
	// 	var anchor = parent_anchor + json_element.key;
	//
	// 	console.debug('PARENT ANCHOR: '+ parent_anchor);
	//
	// /*	if(json_element.value.hasOwnProperty('title'))
	// 	{
	// 		console.debug('TITLE CHANGED: '+ json_element.key +' -> '+ json_element.value.title);
	// 		title = json_element.value.title;
	// 	}
	//
	// 	if(json_element.value.hasOwnProperty('anchor'))
	// 	{
	// 		console.debug('ANCHOR CHANGED: '+ parent_anchor +' -> '+ json_element.value.anchor);
	// 		anchor = json_element.value.anchor;
	// 	}*/
	//
	// 	var title = json_element.key;
	//
	// 	if(json_element.value.hasOwnProperty('title'))
	// 	{
	// 		console.debug('TITLE FOUND: '+ json_element.value.title);
	// 		title = json_element.value.title;
	// 	}
	//
	// 	if(json_element.value.hasOwnProperty('anchor'))
	// 	{
	// 		console.debug('ANCHOR CHANGED: '+ json_element.key +' -> '+ json_element.value.anchor);
	// 		anchor = parent_anchor + json_element.value.anchor;
	// 	}
	//
	// 	var list_item_element = CreateListItem(
	// 		json_element,
	// 		list_level,
	// 		title,
	// 		anchor,
	// 		false
	// 		);
	//
	// 	list_element.append(list_item_element);
	//
	// 	if(append_list_item)
	// 	{
	// 		list_element.append(list_item_element);
	//
	// 		ProcessNavigationElement(
	// 			list_item_element,
	// 			json_element,
	// 			list_level+1,
	// 			anchor
	// 			);
	// 	}
	// 	else
	// 	{
	// 		ProcessNavigationElement(
	// 			list_item_element,
	// 			json_element,
	// 			list_level+1,
	// 			anchor
	// 			);
	// 	}
	// }

	// function CreateNavElementsFromArticles(list_element, article_array, list_level, parent_anchor)
	// {
	// /*	if(title == undefined)
	// 		title = json_element.key;*/
	//
	// /*	var anchor = parent_anchor + json_element.key;*/
	//
	//
	//
	// /*	if(json_element.value.hasOwnProperty('title'))
	// 	{
	// 		console.debug('TITLE CHANGED: '+ json_element.key +' -> '+ json_element.value.title);
	// 		title = json_element.value.title;
	// 	}
	//
	// 	if(parent_element.value.hasOwnProperty('anchor'))
	// 	{
	// 		console.debug('ANCHOR CHANGED: '+ parent_anchor +' -> '+ json_element.value.anchor);
	// 		anchor = json_element.value.anchor;
	// 	}*/
	//
	// 	//var article_list = $.getNestedObjects(json_element.value);
	//
	// 	//console.debug('CREATING NAV ELEMENT FOR '+ Object.keys(article_map).length +' ARTICLES');
	// /*	var index = 0;
	//
	// 	$.each
	// 	(
	// 		article_map,
	// 		function( key, value )
	// 		{
	// 			var tuple = {};
	// 			tuple[key] = article_map[key];
	//
	// 			console.debug('ARTICLE '+ ++index);
	// 			console.debug(tuple);
	//
	// 			CreateListItem(
	// 				parent_element,
	// 				value,
	// 				list_level,
	// 				title,
	// 				parent_anchor + key,
	// 				true
	// 			);
	// 		}
	// 	)*/
	//
	// 	console.debug('CREATING NAV ELEMENTS FOR '+ article_array.length +' ARTICLES');
	//
	// 	var index = 0;
	//
	// 	$.each
	// 	(
	// 		article_array,
	// 		function( index, article_map )
	// 		{
	// 			var id = article_map.id;
	// 			var title = article_map.title;
	// 			var path = article_map.path;
	// 			var last_modified = article_map.last_modified;
	// 			var anchor = parent_anchor +'/'+ id;
	//
	// 			console.debug('ARTICLE NUMBER '+ index);
	// 			console.debug('LAST MODIFIED '+ last_modified);
	//
	// 			var list_item_element = CreateListItem(
	// 				path,
	// 				list_level,
	// 				title,
	// 				anchor,
	// 				last_modified,
	// 				true
	// 			);
	//
	// 			list_element.append(list_item_element);
	// 		}
	// 	)
	// }

	// function CreateListItem(path, list_level, title, anchor, last_modified, is_article)
	// {
	// 	anchor = anchor.replace(' ', '_').toLowerCase();
	//
	// 	var $list_item = $('<li />');
	//
	// 	var $link_element = $('<a />', {href: anchor});
	// 	$link_element.text(title);
	//
	// 	var $label_element =
	// 		$(
	// 			'<label />',
	// 			{
	// 				for: anchor +'_input'
	// 			}
	// 		);
	// 	$label_element.html(title);
	//
	// 	var $input_element =
	// 		$(
	// 			'<input />',
	// 			{
	// 			//type: 'radio',
	// 			type: 'checkbox',
	// 			name: 'vertical_menu_'+ list_level,
	// 			id: anchor +'_input',
	// 			}
	// 		);
	//
	// 	//list_item.append(link_element);
	// 	$list_item.append($label_element);
	// 	$list_item.append($input_element);
	//
	// 	$input_element.on(
	// 		'change',
	// 		function()
	// 		{
	// 			if( $(this).prop('checked') )
	// 			{
	// 				$list_item.addClass( 'menu-selection' );
	// 				$list_item.siblings().removeClass( 'menu-selection' );
	//
	// 				$('input[name="'+ $(this).prop('name') +'"]').not(this).prop('checked', false);
	//
	// 				window.location.href = anchor;
	// 			}
	// 			else
	// 			{
	// 				$list_item.removeClass( 'menu-selection' );
	//
	// 				$list_item.find('input').prop('checked', false);
	// 			}
	// 		}
	// 	);
	//
	// 	if(list_level > 1)
	// 	{
	// 		$list_item.addClass('nav-dropdown-element nav-dropdown-level'+ (list_level-1));
	//
	// 		if(is_article)
	// 			AddToNavList(anchor, path, last_modified, $link_element);
	// 	}
	// 	else
	// 	{
	// 		//Close the dropdown menu when mouse hovers of its bounds
	// 		$list_item.mouseleave(
	// 			function()
	// 			{
	// 				//Uncheck input horizontally
	// 				$('input[name="'+ $input_element.prop('name') +'"]').prop('checked', false);
	// 				//Uncheck input vertically
	// 				$list_item.find('input').prop('checked', false);
	//
	// 				//Remove selection class horizontally
	// 				$list_item.siblings().andSelf().removeClass( 'menu-selection' );
	// 				//Remove selection class vertically
	// 				$list_item.find('li').removeClass( 'menu-selection' );
	// 			}
	// 		);
	// 	}
	//
	// 	return $list_item;
	// }

	// function AddToNavList(originalAnchor, articleSelector, lastModified, element)
	// {
	// 	console.log('##################');
	// 	console.log('ADDING TO NAV LIST');
	// 	console.log('##################');
	//
	// 	if(articleMap.hasOwnProperty(originalAnchor))
	// 		console.debug('DUPLICATE ARTICLE ANCHOR!');
	//
	// 	articleMap[originalAnchor] =
	// 	{
	// 		path: articleSelector,
	// 		lastModified: lastModified
	// 	};
	//
	// 	let folders = originalAnchor.split('/');
	// 	let anchor = '';
	// 	let articleId = folders[folders.length-1];
	//
	// 	//Go through each parent folder of the document and add it to the article list of the folder
	//
	// 	for(let index = 0; index < folders.length; index++)
	// 	{
	// 		let folder = folders[index];
	//
	// 		let first 	= index == 0;
	// 		let last 	= index == folders.length-1;
	//
	// 		anchor = first ? folder : anchor +'/'+ folder;
	//
	// 		if(navigationMap.hasOwnProperty(anchor))
	// 		{
	// 			let navigationPoint = navigationMap[anchor];
	//
	// 			navigationPoint.articleList.push(originalAnchor);
	//
	// 			if(last)
	// 				navigationPoint.ownArticles += 1;
	// 			else
	// 				navigationPoint.childArticles += 1;
	// 		}
	// 		else
	// 		{
	// 			let navigationPoint =
	// 			{
	// 				articleList: [originalAnchor],
	// 				ownArticles: 0,
	// 				childArticles: 0,
	// 				element: element
	// 			};
	//
	// 			if(last)
	// 				navigationPoint.ownArticles = 1;
	// 			else
	// 				navigationPoint.childArticles = 1;
	//
	// 			navigationMap[anchor] = navigationPoint;
	// 		}
	// 	}
	// };



} (project));

project.init();
