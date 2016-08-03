var content_path = 'content/';

var $window = $(window);
var $document = $(document);

var modification_date = new Date(document.lastModified);

var nav_map = {};
var articles_map = {};

$(document).ready(function()
{
	$('#date > time').html('Last modified '+ modification_date.getDate() +'.'+ (modification_date.getMonth()+1) +'.'+ modification_date.getFullYear());

	CreateNavigationFromIndexJson();

	//templates.getFileContents('img/Background_plain.svg', "svg-fetched");
	//templates.getFileContents('img/Background SAVED 2.svg', 'svg-fetched');
	templates.getFileContents('img/background_illustrator.svg', 'svg-fetched');
});

$(document).on(
	'svg-fetched', 
	function (event, svgData)
	{
		//console.debug('SVG succesfully fetched');

		var $svgBackground = $($.parseHTML(svgData));

		$svgBackground.attr( 'height', '100%' );
		$svgBackground.attr( 'width', 'auto' );
		//$svgBackground.attr( 'preserveAspectRatio', 'xMinYMid meet'); //'xMidYMid meet' );

		//$svgBackground.find('g').attr('data-type', 'background');
		//$svgBackground.find('g[id*="background"]').attr('data-type', 'background');

		$svgBackground.find('g[id*="ground"]').each(
			function( index )
			{
				$gElement = $(this);
				$gElement.attr('data-type', 'background');
				var id = $gElement.attr('id');

				//The number in id should be after 10th index (foreground2, background6 etc.)
				var number = id.substring(10);

				$gElement.attr('data-speed', number);
			}
		);

		$('body').append($svgBackground);

		SetBGIntoMotion();
	}
)

function CreateNavigationFromIndexJson()
{
	var json = null;

	templates.getJSON(content_path +'index.json', "json-fetched");

	console.debug('Reading JSON');
}

$(document).on(
	"json-fetched", 
	function (event, jsonData)
	{
		//console.debug(JSON.stringify(data));
		console.debug('JSON succesfully fetched');

		//Language selection should be done here for now
		FinalizePage(jsonData.en);
	}
)

function FinalizePage(jsonData)
{
    ProcessNavigationElement(
        $('nav'),
        {key: 'root', value: jsonData},
        1,
        '#'
    );

    $window.bind( 'hashchange', function(event)
    {
	    CheckHash ();
    });
    
    // Since the event is only triggered when the hash changes, we need to trigger
    // the event now, to handle the hash with which the page may have loaded.
    $window.trigger( 'hashchange' );

	console.debug('Page finalized');
}

function CheckHash ()
{
	//Remove the # from the hash, as different browsers may or may not include it
	var hash = location.hash.replace('#','');

	console.debug('INITIAL HASH: '+ hash +' - '+ location.hash);

	$.each( 
		nav_map, 
		function( key, value )
		{
			console.log( key + ": " + value );
			value.element.text += ' ('+ value.own_articles +'-'+ value.child_articles +')';
		}
	);

	//console.debug('ACCESSING ARTICLE LIST');
	//console.debug('LOCATION HASH :'+ location.hash);
	//console.debug('NAV OBJECT :');
	//console.debug(nav_map);
	//console.debug('ARTICLE LIST :'+ nav_map[location.hash].article_list);

	var article_paths = [];

	$.each(
		nav_map[location.hash].article_list,
		function(index, article_anchor)
		{
			var article_tuple = articles_map[article_anchor];
			article_paths.push(article_tuple.path);
		}
	);

	templates.loadElements(article_paths, nav_map[location.hash].article_list, "#content-area", "elements-loaded");

	//$('html,body').scrollTop(0);

	//Animation for scrolling
/*	$("html, body").animate({ scrollTop: 0 }, 2000);*/

/*	$document.scrollTop();*/
}

var closed_article_content_height = 200;
var article_animation_duration_ms = 1000;

$(document).on(
	"elements-loaded", 
	function (event, article_divs, article_ids, target_element_id)
	{
	    console.debug('Files loaded');

	    $target_element = $(target_element_id);

	    $target_element.empty();

        $.each (
            article_divs,
            function( index, article_div )
            {
            	$target_element.append("<span class=\"clearfix\" />");
            	$target_element.append("<hr class=\"article-start\" >");

            	$last_modified_element = $('<time class="article_last_modified" />');
            	$last_modified_element.text(articles_map[article_ids[index]].last_modified);

            	$target_element.append($last_modified_element);
                $target_element.append(article_div.html());
                var $article_content = $target_element.children().last().find('.article-content');
                //var scrollHeight = $article_content.get(0).scrollHeight;

                $target_element.append( GetFacebookButton('uttumi.github.io/blog/japan2016') );

                var autoHeight = $article_content.css('height', 'auto').height();
                $article_content.height('100px');

                var $label_element = $('<label />');
                var $label_text_element = $('<h3 />');
				var $input_element =
					$(
						'<input />', 
						{ 
							type: 'checkbox'
						}
					);

            	$target_element.append($label_element);
            	$label_element.append($label_text_element);
            	$label_element.append($input_element);

		        $input_element.on(
					'change', 
					function()
					{
						if( $(this).prop('checked') )
						{
					        $article_content.animate(
					        	{
									height: autoHeight
								},
								{ 
									duration: article_animation_duration_ms,
									complete: function()
									{
								    	$article_content.height('auto');
									},
									step: function()
									{       
										$(window).trigger('resize');
									}
								}
							);

							$article_content.find('img').each( 
								function( index, image ) 
								{
									var $image = $(image);

									var curHeight = $image.height();
									var curWidth = $image.width();

									console.debug('Image old width value: '+ $image.attr('width') );

									var outcomeImage = $image.css(
										{
											'width': $image.attr('width'),
											'height': 'auto'
										}
									);

									var outcomeHeight = outcomeImage.height();
									var outcomeWidth = outcomeImage.width();


									console.debug('Image width: '+ curWidth +' -> '+ outcomeWidth);
									console.debug('Image height: '+ curHeight +' -> '+ outcomeHeight);

									$image.height(curHeight).width(curWidth).animate(
										{
											height: outcomeHeight,
											width: outcomeWidth
										}, 
										article_animation_duration_ms
									);
								}
							);

							$article_content.removeClass('closed');
							$article_content.addClass('opened');

							$label_text_element.text('Close article');
						}
						else
						{
							$article_content.animate(
					        	{
									height: closed_article_content_height +'px'
								}, 
								{ 
									duration: article_animation_duration_ms,
									complete: function()
									{
								    	$article_content.height(closed_article_content_height +'px');
									},
									step: function()
									{       
										$(window).trigger('resize');
									}
								}
							);
/*
							$article_content.find('img').each( 
								function( index, image ) 
								{
									var $image = $(image);
									var newSizeTuple = CalculateAspectRatioFit($image.width(), $image.height(), 10000, 100);

									console.debug(newSizeTuple);

									$image.animate(
							        	{
											height: newSizeTuple.height +'px',
											width: newSizeTuple.width +'px'
										},
										1000
									);

									var curHeight = $image.height();
									var autoHeight = $image.css('height', 'auto').height();
									el.height(curHeight).animate({height: autoHeight}, 1000);
								}
							);
*/

							$article_content.find('img').each( 
								function( index, image ) 
								{
									var $image = $(image);

									var curHeight = $image.height();
									var curWidth = $image.width();

									var outcomeImage = $image.css(
										{
											'width': 'auto',
											'height': closed_article_content_height +'px'
										}
									);

									var outcomeHeight = outcomeImage.height();
									var outcomeWidth = outcomeImage.width();


									if(outcomeWidth != 0 && outcomeHeight != 0)
									{
										$image.height(curHeight).width(curWidth).animate(
											{
												height: outcomeHeight,
												width: outcomeWidth
											}, 
											article_animation_duration_ms
										);
									}

									console.debug('Image width: '+ curWidth +' -> '+ outcomeWidth);
									console.debug('Image height: '+ curHeight +' -> '+ outcomeHeight);
									

								}
							);

							$article_content.removeClass('opened');
							$article_content.addClass('closed');

							$label_text_element.text('Open full...');
						}
					}
				);

				$input_element.trigger( 'change' );

				$target_element.append("<span class=\"clearfix\" />");
            	$target_element.append("<hr class=\"article-end\" >"); 
            }
        );

        //var $input_elements = $target_element.find('input');
/*
        $input_elements.on(
			'change', 
			function()
			{
				var $article_content = $(this).parent().find('.article-content'); //$(this).next().next().next();

				if( $(this).prop('checked') )
				{
					$article_content.css(
						{
							'height': $article_content.get(0).scrollHeight +'px',
							'transition': 'height 1000ms ease-in'
						}
					);
				}
				else
				{
					$article_content.css(
						{
							'height': '100px',
							'transition': 'height 1000ms ease'
						}
					);
				}
			}
		);
*/
		//$input_elements.trigger( 'change' );
		//$input_elements.prop('checked', false);    
	}
)

function ProcessNavigationElement(parent_element, json_element, list_level, anchor)
{
	var article_array = [];
	var sub_json_element_list = GetComplexElementList(json_element.value);

	console.debug('#########################');
	console.debug('PROCESSING NAV ELEMENT');
	console.debug('LEVEL:'+ list_level);
	console.debug('ANCHOR:'+ anchor);
	console.debug(sub_json_element_list);
	console.debug('#######');
/*
	if(json_element.value.hasOwnProperty('anchor'))
	{
		console.debug('ANCHOR CHANGED: '+ json_element.key +' -> '+ json_element.value.anchor);
		anchor = '#'+ json_element.value.anchor;
	}
*/
	if(json_element.value.hasOwnProperty('articles'))
	{
		article_array = json_element.value.articles;
		console.debug('HAS '+ article_array.length +' ARTICLES');
		
	}

	switch(list_level)
	{
		case 1: 
			var topics_div = $('<div />', {id: 'nav-bar', class: 'nav-wrap'}).appendTo(parent_element);
			var topics_ul = $('<ul />').appendTo(topics_div);

			$.each
			(
				sub_json_element_list,
				function( index, sub_json_element )
				{
					CreateNavElement(topics_ul, sub_json_element, list_level, anchor, false);
				}
			)

			break;
		default:
			var topic_dropdown_div = $('<div />', {class: 'nav-wrap'}).appendTo(parent_element);
			var topic_dropdown_ul = $('<ul />').appendTo(topic_dropdown_div);

			CreateNavElementsFromArticles(topic_dropdown_ul, article_array, list_level, anchor +'/');

			$.each
			(
				sub_json_element_list,
				function( index, sub_json_element )
				{
					CreateNavElement(topic_dropdown_ul, sub_json_element, list_level, anchor +'/', false);
				}
			)

			break;
/*		default:

			CreateNavElementsFromArticles(parent_element, article_array, list_level, anchor +'/');

			$.each
			(
				sub_json_element_list,
				function( index, sub_json_element )
				{
					CreateNavElement(parent_element, sub_json_element, list_level, title, anchor +'/', false);
				}
			)

			break;*/
	}
}

function CreateNavElement(list_element, json_element, list_level, parent_anchor, append_list_item)
{
	var anchor = parent_anchor + json_element.key;

	console.debug('PARENT ANCHOR: '+ parent_anchor);

/*	if(json_element.value.hasOwnProperty('title'))
	{
		console.debug('TITLE CHANGED: '+ json_element.key +' -> '+ json_element.value.title);
		title = json_element.value.title;
	}

	if(json_element.value.hasOwnProperty('anchor'))
	{
		console.debug('ANCHOR CHANGED: '+ parent_anchor +' -> '+ json_element.value.anchor);
		anchor = json_element.value.anchor;
	}*/

	var title = json_element.key;

	if(json_element.value.hasOwnProperty('title'))
	{
		console.debug('TITLE FOUND: '+ json_element.value.title);
		title = json_element.value.title;
	}

	if(json_element.value.hasOwnProperty('anchor'))
	{
		console.debug('ANCHOR CHANGED: '+ json_element.key +' -> '+ json_element.value.anchor);
		anchor = parent_anchor + json_element.value.anchor;
	}

	var list_item_element = CreateListItem( 
		json_element,
		list_level,
		title,
		anchor,
		false
		);

	list_element.append(list_item_element);

	if(append_list_item)
	{
		list_element.append(list_item_element);

		ProcessNavigationElement(
			list_item_element, 
			json_element, 
			list_level+1,
			anchor
			);
	}
	else
	{
		ProcessNavigationElement(
			list_item_element,
			json_element, 
			list_level+1,
			anchor
			);
	}
}

function CreateNavElementsFromArticles(list_element, article_array, list_level, parent_anchor)
{
/*	if(title == undefined)
		title = json_element.key;*/

/*	var anchor = parent_anchor + json_element.key;*/

	

/*	if(json_element.value.hasOwnProperty('title'))
	{
		console.debug('TITLE CHANGED: '+ json_element.key +' -> '+ json_element.value.title);
		title = json_element.value.title;
	}

	if(parent_element.value.hasOwnProperty('anchor'))
	{
		console.debug('ANCHOR CHANGED: '+ parent_anchor +' -> '+ json_element.value.anchor);
		anchor = json_element.value.anchor;
	}*/

	//var article_list = GetComplexElementList(json_element.value);

	//console.debug('CREATING NAV ELEMENT FOR '+ Object.keys(article_map).length +' ARTICLES');
/*	var index = 0;

	$.each
	(
		article_map,
		function( key, value )
		{
			var tuple = {};
			tuple[key] = article_map[key];

			console.debug('ARTICLE '+ ++index);
			console.debug(tuple);

			CreateListItem(
				parent_element, 
				value,
				list_level,
				title,
				parent_anchor + key,
				true
			);
		}
	)*/

	console.debug('CREATING NAV ELEMENTS FOR '+ article_array.length +' ARTICLES');

	var index = 0;

	$.each
	(
		article_array,
		function( index, article_map )
		{
			var id = article_map.id;
			var title = article_map.title;
			var path = article_map.path;
			var last_modified = article_map.last_modified;
			var anchor = parent_anchor +'/'+ id;

			console.debug('ARTICLE NUMBER '+ index);
			console.debug('LAST MODIFIED '+ last_modified);

			var list_item_element = CreateListItem(
				path,
				list_level,
				title,
				anchor,
				last_modified,
				true
			);

			list_element.append(list_item_element);
		}
	)
}

function CreateListItem(path, list_level, title, anchor, last_modified, is_article)
{
	anchor = anchor.replace(' ', '_').toLowerCase();

	var $list_item = $('<li />');

	var $link_element = $('<a />', {href: anchor});
	$link_element.text(title);

	var $label_element = 
		$(
			'<label />', 
			{ 
				for: anchor +'_input' 
			}
		);
	$label_element.html(title);

	var $input_element =
		$(
			'<input />', 
			{ 
			//type: 'radio', 
			type: 'checkbox', 
			name: 'vertical_menu_'+ list_level, 
			id: anchor +'_input',
			}
		);

	//list_item.append(link_element);
	$list_item.append($label_element);
	$list_item.append($input_element);
	
	$input_element.on(
		'change', 
		function()
		{
			if( $(this).prop('checked') )
			{
				$list_item.addClass( 'menu-selection' );
				$list_item.siblings().removeClass( 'menu-selection' );

				$('input[name="'+ $(this).prop('name') +'"]').not(this).prop('checked', false);

				window.location.href = anchor;
			}
			else
			{
				$list_item.removeClass( 'menu-selection' );

				$list_item.find('input').prop('checked', false);
			}
		}
	);

	if(list_level > 1)
	{
		$list_item.addClass('nav-dropdown-element nav-dropdown-level'+ (list_level-1));

		if(is_article)
			AddToNavList(anchor, path, last_modified, $link_element);	
	}
	else
	{
		//Close the dropdown menu when mouse hovers of its bounds
		$list_item.mouseleave(
			function() 
			{
				//Uncheck input horizontally
				$('input[name="'+ $input_element.prop('name') +'"]').prop('checked', false);
				//Uncheck input vertically
				$list_item.find('input').prop('checked', false);

				//Remove selection class horizontally
				$list_item.siblings().andSelf().removeClass( 'menu-selection' );
				//Remove selection class vertically
				$list_item.find('li').removeClass( 'menu-selection' );
			}
		);
	}

	return $list_item;
}

function AddToNavList(orig_anchor, article_selector, last_modified, link_element)
{
	//json_element expectations
	//key = 
	//value = path

/*	console.debug(json_element);*/

	console.log('##################');
	console.log('ADDING TO NAV LIST');
	console.log('##################');

	if(articles_map.hasOwnProperty(orig_anchor))
		console.debug('DUPLICATE ARTICLE ANCHOR!');

	articles_map[orig_anchor] = {path: article_selector, last_modified: last_modified};

	console.debug(articles_map[orig_anchor]);

	var folders = orig_anchor.split('/');
	var anchor = '';
	var article_id = folders[folders.length-1];
/*	var article_selector = json_element[1];*/ // +' #'+ article_id;  //Why was there ID?

	//Go through each parent folder of the document and add it to the article list of the folder

	$.each(
		folders,
		function( index, folder )
		{
			var first_folder = (index == 0 ? true : false);
			var last_folder = (index == folders.length-1 ? true : false);

			if(first_folder)
			{
				anchor = folder;
			}
			else
			{
				anchor += '/'+ folder;
			}

			if(nav_map.hasOwnProperty(anchor))
			{
				//console.debug('PUSHING TO NAV ELEMENT: \nANCHOR: '+ anchor +'\nSELECTOR: '+ article_selector);

				nav_object = nav_map[anchor];

				nav_object.article_list.push(orig_anchor);

				if(last_folder)
					nav_object.own_articles += 1;
				else
					nav_object.child_articles += 1;

				//console.log(nav_map[anchor]);
			}
			else
			{
				//console.debug('INITIALISING NAV ELEMENT: \nANCHOR: '+ anchor +'\nSELECTOR: '+ article_selector);

				var nav_object = {article_list: [orig_anchor], own_articles: 0, child_articles: 0, element: link_element};

				if(last_folder)
					nav_object.own_articles = 1;
				else
					nav_object.child_articles = 1;

				//console.debug('NAV OBJECT:');
				//console.debug(nav_object);
				//console.debug('NAV OBJECT ARTICLES: '+ nav_object.article_list);
				//console.debug('NAV OBJECT ARTICLES IS ARRAY: '+ $.isArray(nav_object.article_list));

				nav_map[anchor] = nav_object;

				//console.debug('NAV OBJECT FROM LIST: '+ nav_map[anchor]);
			}
/*
			$.each(
				nav_map,
				function( key, value )
				{
					console.log(key +' - '+ value);
				}
			)
*/
		}
	);

//	console.log(nav_map[orig_anchor]);
}
