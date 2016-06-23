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

		$('body').append($svgBackground);
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
	console.debug('ARTICLE LIST :'+ nav_lists[location.hash].article_list);

	templates.loadElements(nav_lists[location.hash].article_list, "#content-area", "elements-loaded");

	$('html,body').scrollTop(0);

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
            function( index, tempElement )
            {
                if (index > 0)
                {
                    $target_element.append("<span class=\"clearfix\">");
                    $target_element.append("<hr class=\"article-gap\">");
                }

                $target_element.append(tempElement.html());
            }
        );
	}
)

function ProcessNavigationElement(parent_element, json_element, list_level, anchor)
{
	console.debug('LEVEL:'+ list_level);
	console.debug('ANCHOR:'+ anchor);
	console.debug('#########################');

	var sub_json_element_list = GetComplexElementList(json_element.value);

	if(json_element.value.hasOwnProperty('anchor'))
	{
		console.debug(json_element.key +': '+ json_element.value.anchor);

		anchor = '#'+ json_element.value.anchor;
	}

	switch(list_level)
	{
		case 1: 
			var topics_div = $('<div />', {id: 'nav-bar'}).appendTo(parent_element);
			var topics_ul = $('<ul />').appendTo(topics_div);

			var articles = json_element.value.articles;

			$.each
			(
				sub_json_element_list,
				function( index, sub_json_element )
				{
					if(sub_json_element.key == 'articles')
					{

					}
					else
					{
						CreateNavElement(topics_ul, sub_json_element, list_level, anchor, true);
					}
				}
			)

			break;
		case 2:
			var topic_dropdown_div = $('<div />', {class: 'dropdown-menu'}).appendTo(parent_element);
			var topic_dropdown_ul = $('<ul />').appendTo(topic_dropdown_div);

			$.each
			(
				sub_json_element_list,
				function( index, sub_json_element )
				{
					if(sub_json_element.key == 'articles')
					{
						CreateNavElementsFromArticles(topic_dropdown_ul, sub_json_element, list_level, anchor +'/');
					}
					else
					{
						CreateNavElement(topic_dropdown_ul, sub_json_element, list_level, anchor +'/', false);
					}
				}
			)

			break;
		default:
			$.each
			(
				sub_json_element_list,
				function( index, sub_json_element )
				{
					if(sub_json_element.key == 'articles')
					{
						CreateNavElementsFromArticles(parent_element, sub_json_element, list_level, anchor +'/');
					}
					else
					{
						CreateNavElement(parent_element, sub_json_element, list_level, anchor +'/', false);
					}
				}
			)

			break;
	}
}

function CreateNavElement(parent_element, json_element, list_level, title, parent_anchor, append_list_item)
{
	var title = json_element.key;

	if(json_element.value.hasOwnProperty('title'))
	{
		console.debug(json_element.key +': '+ json_element.value.title);
		title = json_element.value.title;
	}

	var list_item = CreateListItem(
		parent_element, 
		json_element,
		list_level,
		title,
		parent_anchor + json_element.key,
		false
		);

	if(append_list_item)
	{
		list_item.appendTo(parent_element);

		ProcessNavigationElement(
			list_item, 
			json_element, 
			list_level+1,
			parent_anchor + json_element.key
			);
	}
	else
	{
		ProcessNavigationElement(
			parent_element, 
			json_element, 
			list_level+1,
			parent_anchor + json_element.key
			);
	}
}

function CreateNavElementsFromArticles(parent_element, json_element, list_level, title, parent_anchor)
{
	var article_list = GetComplexElementList(json_element.value);

	$.each
	(
		article_list,
		function( index, article_tuple )
		{
			CreateListItem(
				parent_element, 
				article_tuple,
				list_level,
				title,
				parent_anchor + article_tuple.key,
				true
			);
		}
	)
}

function CreateListItem(parent_element, json_tuple, list_level, title, anchor, is_article)
{
	anchor = anchor.replace(' ', '-').toLowerCase();

	var list_item = $('<li />').appendTo(parent_element);
	var link = $('<a />', {href: anchor}).appendTo(list_item);

	//link.text(json_tuple.key);
	link.text(title);

	switch(list_level)
	{
		case 1: 
				break;
		case 2: 
				list_item.addClass('nav-dropdown-element nav-dropdown-level1');

				if(is_article)
					AddToNavList(anchor, json_tuple, link);

				break;
		case 3: 
				list_item.addClass('nav-dropdown-element nav-dropdown-level2');

				if(is_article)
					AddToNavList(anchor, json_tuple, link);

				break;
		default: 
				list_item.addClass('nav-dropdown-element nav-dropdown-level3');

				if(is_article)
					AddToNavList(anchor, json_tuple, link);

				break;		
	}

	return list_item;
}

function AddToNavList(orig_anchor, json_element, link_element)
{
	//json_element expectations
	//key = 
	//value = path

	console.log('Adding to nav list');

	var folders = orig_anchor.split('/');
	var anchor = '';
	var article_id = folders[folders.length-1];
	var article_selector = json_element.value; // +' #'+ article_id;  //Why was there ID?

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

			console.log(nav_lists[orig_anchor]);

			$.each(
				nav_lists,
				function( key, value )
				{
					console.log(key +' - '+ value);
				}
			)
		}
	);
}
