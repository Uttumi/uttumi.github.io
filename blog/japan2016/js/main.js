var content_path = 'content/';

var $window = $(window);
var $document = $(document);

var modification_date = new Date(document.lastModified);

var nav_lists = {};

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
		console.debug('SVG succesfully fetched');

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
		nav_lists, 
		function( key, value )
		{
			console.log( key + ": " + value );
			value.element.text += ' ('+ value.own_articles +'-'+ value.child_articles +')';
		}
	);

	console.debug('ACCESSING ARTICLE LIST');
	console.debug('LOCATION HASH :'+ location.hash);
	console.debug('NAV OBJECT :');
	console.debug(nav_lists);
	console.debug('ARTICLE LIST :'+ nav_lists[location.hash].article_list);

	templates.loadElements(nav_lists[location.hash].article_list, "#content-area", "elements-loaded");

	//$('html,body').scrollTop(0);

	//Animation for scrolling
/*	$("html, body").animate({ scrollTop: 0 }, 2000);*/

/*	$document.scrollTop();*/
}

$(document).on(
	"elements-loaded", 
	function (event, document_divs, target_id)
	{
	    console.debug('Files loaded');

	    $target_element = $(target_id);

	    $target_element.empty();

        $.each (
            document_divs,
            function( index, article_element )
            {
            	$target_element.append("<span class=\"clearfix\" />");
            	$target_element.append("<hr class=\"article-start\" >");

                $target_element.append(article_element.html());

                var $article_content = $target_element.children().last().find('.article-content');
                //var scrollHeight = $article_content.get(0).scrollHeight;

                var autoHeight = $article_content.css('height', 'auto').height(); 

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
							$article_content.css(
								{
									'height': autoHeight +'px',
									'transition': 'height 1000ms ease-in'
								}
							);
/*
							$article_content.removeClass('closed');
							$article_content.addClass('opened');
*/
							$label_text_element.text('Close article');
						}
						else
						{
							$article_content.css(
								{
									'height': '100px',
									'transition': 'height 1000ms ease'
								}
							);
/*
							$article_content.removeClass('opened');
							$article_content.addClass('closed');
*/
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
			var anchor = parent_anchor +'/'+ id;

			console.debug('ARTICLE NUMBER '+ index);

			var list_item_element = CreateListItem(
				path,
				list_level,
				title,
				anchor,
				true
			);

			list_element.append(list_item_element);
		}
	)
}

function CreateListItem(path, list_level, title, anchor, is_article)
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
			AddToNavList(anchor, path, $link_element);	
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

function AddToNavList(orig_anchor, article_selector, link_element)
{
	//json_element expectations
	//key = 
	//value = path

/*	console.debug(json_element);*/

	console.log('##################');
	console.log('ADDING TO NAV LIST');
	console.log('##################');

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

			if(nav_lists.hasOwnProperty(anchor))
			{
				console.debug('PUSHING TO NAV ELEMENT: \nANCHOR: '+ anchor +'\nSELECTOR: '+ article_selector);

				nav_object = nav_lists[anchor];

				nav_object.article_list.push(article_selector);

				if(last_folder)
					nav_object.own_articles += 1;
				else
					nav_object.child_articles += 1;

				console.log(nav_lists[anchor]);
			}
			else
			{
				console.debug('INITIALISING NAV ELEMENT: \nANCHOR: '+ anchor +'\nSELECTOR: '+ article_selector);

				var nav_object = {article_list: [article_selector], own_articles: 0, child_articles: 0, element: link_element};

				if(last_folder)
					nav_object.own_articles = 1;
				else
					nav_object.child_articles = 1;

				console.debug('NAV OBJECT:');
				console.debug(nav_object);
				console.debug('NAV OBJECT ARTICLES: '+ nav_object.article_list);
				console.debug('NAV OBJECT ARTICLES IS ARRAY: '+ $.isArray(nav_object.article_list));

				nav_lists[anchor] = nav_object;

				console.debug('NAV OBJECT FROM LIST: '+ nav_lists[anchor]);
			}

			$.each(
				nav_lists,
				function( key, value )
				{
					console.log(key +' - '+ value);
				}
			)
		}
	);

	console.log(nav_lists[orig_anchor]);
}
