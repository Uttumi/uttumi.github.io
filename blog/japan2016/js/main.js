var nav_lists = {};

var $window = $(window);
var $document = $(document);

$(document).ready(function()
{
	CreateNavigationFromIndexJson();

	SetBGIntoMotion ();

	console.debug('Reading JSON');
});

function FinalizePage()
{
    $window.bind( 'hashchange', function(event)
    {
	    CheckHash ();
    });
    
    // Since the event is only triggered when the hash changes, we need to trigger
    // the event now, to handle the hash the page may have loaded with.
    $window.trigger( 'hashchange' );

	console.debug('Ready')
}

function CheckHash ()
{
	//Remove the # from the hash, as different browsers may or may not include it
	var hash = location.hash.replace('#','');

	console.debug('Initial hash: '+ hash +' - '+ location.hash);
	$.each( 
		nav_lists, 
		function( key, value )
		{
			console.log( key + ": " + value );
			value.element.text += ' ('+ value.own_articles +'-'+ value.child_articles +')';
		}
	);

	//console.debug('content/'+ nav_lists[location.hash].article_list);

	templates.load('content/'+ nav_lists[location.hash].article_list, "#content-area", "files-loaded");

	$('html,body').scrollTop(0);

	//Animation for scrolling
/*	$("html, body").animate({ scrollTop: 0 }, 2000);*/

/*	$document.scrollTop();*/
}

function SetBGIntoMotion ()
{
	$('div[data-type="background"]').each(function()
	{
		var $bgElement = $(this); // Assigning background object
		var scrollLength = $document.height() - $window.height();
		var startPos = - scrollLength * $bgElement.data('speed');

		console.log('Document height '+ $document.height() +' Window height '+ $window.height())

		var bottomPos = startPos + 'px';

		// Move the element
		$bgElement.css({ bottom: bottomPos });

		$window.scroll(function()
		{
			UpdateBGElement ($bgElement);
		});

		$window.resize(function()
		{
			UpdateBGElement ($bgElement);
		});
	});
}

function UpdateBGElement (bgElement)
{
	var $window = $(window);
	var $document = $(document);

	var scrollLength = $document.height() - $window.height();
	var scrollPosition = $window.scrollTop();
	var scrollPercent = 100 * scrollPosition / ($document.height() - $window.height());

	var currentPos = - (scrollLength - scrollPosition) * bgElement.data('speed');
	// Put together our final bottom position
	var bottomPos = currentPos + 'px';
	// Move the element
	bgElement.css({ bottom: bottomPos });
}

function BuildContentFromArray (contentArray)
{
	var content = $('#content-area');

	$.each(contentArray, function( index, value )
	{
		if (index > 0)
			$('#content-area').append('<hr class=\"article-gap clearfix\">');

		$.get(value, function(data)
		{
			console.log('Got data '+ index +': \n'+ data +'\n\n');
  			$('#content-area').append(data);
		});
	});
}

function LoadBlogPosts()
{
	var templateArray = ["file1.html", "file2.html"]
	templates.load(templateArray, "#content-area", "files-loaded");
}

var tempElements = [];

var templates = (function ($, host) {
    // begin to load external templates from a given path and inject them into the DOM
    return {
        // use jQuery $.get to load the templates asynchronously
        load: function (templateArray, target, event)
        {
            var defferArray = [];
            tempElements = [];

            var i = 0;

            $(target).empty();

            $.each(templateArray, function (index, urlValue)
            {
            	console.debug($.type(urlValue));
            	console.debug('Opening page from url: '+ urlValue);

            	defferArray.push(new $.Deferred());

            	console.debug('DEFFER PUSH SUCCESS');

            	var tempElement = $('<div />');

                tempElements.push( tempElement );
            	
            	tempElement.load(
            		'content/'+ urlValue, 
                	function() 
	                {

	                	console.debug('DEFFER RESOLVED');
/*	                	console.debug('TEMP ELEMENT: '+ tempElement.html());
	                	console.debug('TEMP ELEMENT: '+ $('#content-area').html());*/
					    defferArray[i].resolve();
					    i++;
					}
				);

				console.debug('TEMP ELEMENTS: '+ tempElements.length);
				console.debug('HTMLs: '+ templateArray.length);
            })

            $.when.apply(null, defferArray).done(
            	function ()
	            {
	            	console.debug(tempElements.length);

	            	$.each (
	            		tempElements,
	            		function( index, tempElement )
	            		{
	            			if (index > 0)
							{
								$(target).append("<span class=\"clearfix\">");
								$(target).append("<hr class=\"article-gap\">");
							}

/*							console.debug('TEMP ELEMENT: '+ tempElement.html());
*/
	            			$(target).append(tempElement.html());
	            		}
	            	);

	                $(host).trigger(event);
	            }
            );
        },
        loadJSON: function (jsonPath, event)
        {
            var loader = $.getJSON(jsonPath)
                .success(function (jsonData) 
                {
					ProcessNavigationElement(
						$('nav'),
						{key: 'root', value: jsonData.en},
						1,
						'#'
					);

					console.log(nav_lists);
            	});

            $.when(loader).done(function ()
            {
                $(host).trigger(event);
            });
        }
    };
})(jQuery, document);

$(document).on(
	"json-loaded", 
	function ()
	{
		FinalizePage();
	    console.debug('JSON loaded');
	}
)

$(document).on(
	"files-loaded", 
	function ()
	{
	    console.debug('File loaded');
	}
)


function CreateNavigationFromIndexJson()
{
	var json = null;

	templates.loadJSON('content/index.json', "json-loaded");
}

function ProcessNavigationElement(parent_element, json_element, list_level, anchor)
{
	console.debug('LEVEL:'+ list_level);
	console.debug('ANCHOR:'+ anchor);
	console.debug('#########################');

	var sub_json_element_list = GetComplexElementList(json_element.value);

	switch(list_level)
	{
		case 1: 
			var topics_div = $('<div />', {id: 'nav-bar'}).appendTo(parent_element);
			var topics_ul = $('<ul />').appendTo(topics_div);

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

function CreateNavElement(parent_element, json_element, list_level, parent_anchor, append_list_item)
{
	var list_item = CreateListItem(
		parent_element, 
		json_element,
		list_level,
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

function CreateNavElementsFromArticles(parent_element, json_element, list_level, parent_anchor)
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
				parent_anchor + article_tuple.key,
				true
			);
		}
	)
}

function CreateListItem(parent_element, json_tuple, list_level, anchor, is_article)
{
	anchor = anchor.replace(' ', '-').toLowerCase();

	var list_item = $('<li />').appendTo(parent_element);
	var link = $('<a />', {href: anchor}).appendTo(list_item);

	link.text(json_tuple.key);

	switch(list_level)
	{
		case 1: 
				break;
		case 2: 
				list_item.addClass('dropdown-item level1');

				if(is_article)
					AddToNavList(anchor, json_tuple, link);

				break;
		case 3: 
				list_item.addClass('dropdown-item level2');

				if(is_article)
					AddToNavList(anchor, json_tuple, link);

				break;
		default: 
				list_item.addClass('dropdown-item level3');

				if(is_article)
					AddToNavList(anchor, json_tuple, link);

				break;		
	}

	return list_item;
}

function AddToNavList(orig_anchor, json_tuple, link_element)
{
	console.log('Adding to nav list');

	var folders = orig_anchor.split('/');
	var anchor = '';
	var article_id = folders[folders.length-1];
	var article_selector = json_tuple.value +' #'+ article_id;

	var last_folder = false;

	$.each(
		folders,
		function( index, folder )
		{
			if(index == 0)
			{
				anchor = folder;
			}
			else
			{
				anchor += '/'+ folder;
			}

			if(index = folders.length-1)
				last_folder = true;

			if(nav_lists.hasOwnProperty(anchor))
			{
				console.debug('Pushing to '+ anchor +': '+ article_selector);
				nav_object = nav_lists[anchor];

				console.log(nav_object);

				nav_object.article_list.push(article_selector);

				console.log(nav_object);

				if(last_folder)
					nav_object.own_articles += 1;
				else
					nav_object.child_articles += 1;

				console.log(nav_object);
				console.log(nav_lists[anchor]);
			}
			else
			{
				console.debug('Initializing '+ anchor +': '+ article_selector);

				var nav_object = {article_list: [article_selector], own_articles: 0, child_articles: 0, element: link_element};

				if(last_folder)
					nav_object.own_articles = 1;
				else
					nav_object.child_articles = 1;

				console.log(nav_object);

				nav_lists[anchor] = nav_object;

				console.log(nav_lists[anchor]);
			}

			console.log(nav_lists[orig_anchor]);

			for( variable in nav_lists )
			{
				console.log(variable.key +' - '+ variable.value);
			}
		}
	);
}

function GetArrayByKey(element, list_key)
{
	if(element.hasOwnProperty(list_key))
	{
		var array = element[list_key];
		
		if($.isArray(array))
			return array
	}

	return null; 					
}

function GetComplexElementList(element)
{
	var complex_elements = [];

	$.each(
		element, 
		function(key, value) 
		{
			if(!$.isArray(value))
			{
				complex_elements.push({'key': key, 'value': value});
			}
		}
	)
	
	return complex_elements;
}

function HasNestedElements(element)
{
	var has_nested_elements = false;

	$.each(
		element, 
		function(key, value) 
		{
			if(!$.isArray(value))
			{
				has_nested_elements = true;
				return false;
			}
		}
	)
	
	return has_nested_elements;
}

/** Function count the occurrences of substring in a string;
 * @param {String} string   Required. The string;
 * @param {String} subString    Required. The string to search for;
 * @param {Boolean} allowOverlapping    Optional. Default: false;
 * @author Vitim.us http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string/7924240#7924240
 */
function occurrences(string, subString, allowOverlapping)
{
    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    while (true)
    {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}