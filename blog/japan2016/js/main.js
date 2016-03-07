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
	$.each( nav_lists, function( key, value ) {
		console.log( key + ": " + value );
		value.element.text += ' ('+ value.own_articles +'-'+ value.child_articles +')';
	});

	console.debug('content/'+ nav_lists[location.hash].article_list);

	templates.load(nav_lists[location.hash].article_list, "#content-area", "files-loaded");

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
                .success(function (data) 
                {
					CreateNavigationElement(
						$('nav'), 
						{key: 'root', value: data.en}, 
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

function CreateNavigationElement(parent_element, json_tuple, list_level, anchor)
{
	var nav_element;

	console.debug('ANCHOR LEVEL:'+ anchor);
	console.debug('#########################');

	switch(list_level)
	{
		case 1: 
			nav_element = $('<div />', {id: 'nav-bar'}).appendTo(parent_element);
			var ul_element = $('<ul />').appendTo(nav_element);

			var complex_element_list = GetComplexElementList(json_tuple.value);

			$.each
			(
				complex_element_list,
				function( index, complex_element_tuple )
				{
					var list_item = CreateListItem(
						ul_element, 
						complex_element_tuple,
						list_level,
						anchor + complex_element_tuple.key,
						false
						);

					list_item.appendTo(ul_element);

					var new_nav_element = CreateNavigationElement(
						list_item, 
						complex_element_tuple, 
						list_level+1,
						anchor + complex_element_tuple.key
						);

/*					new_nav_element.appendTo(list_item);*/
				}
			)
			break;
		case 2:
			nav_element = $('<div />', {class: 'dropdown-menu'}).appendTo(parent_element);
			var ul_element = $('<ul />').appendTo(nav_element);

			var complex_element_list = GetComplexElementList(json_tuple.value);

			$.each
			(
				complex_element_list,
				function( index, complex_element_tuple )
				{
					if(complex_element_tuple.key == 'articles')
					{
						console.debug('Articles 2');
						console.debug(complex_element_tuple);

						var article_list = GetComplexElementList(complex_element_tuple.value);

						console.debug(article_list);

						$.each
						(
							article_list,
							function( index, article_tuple )
							{
								console.debug('Article: 2');
								console.debug(article_tuple);

								var list_item = CreateListItem(
									ul_element, 
									article_tuple,
									list_level,
									anchor +'/'+ article_tuple.key,
									true
								);
							}
						)
					}
					else
					{
						console.debug('Complex element 2');
						console.debug(complex_element_tuple);

						var list_item = CreateListItem(
							ul_element, 
							complex_element_tuple,
							list_level,
							anchor +'/'+ complex_element_tuple.key,
							false
							);

						CreateNavigationElement(
							ul_element, 
							complex_element_tuple, 
							list_level+1,
							anchor +'/'+ complex_element_tuple.key
							);

/*						new_nav_element.appendTo(list_item);
*/					}
				}
			)

			break;
		default:
			var complex_element_list = GetComplexElementList(json_tuple.value);

			$.each
			(
				complex_element_list,
				function( index, complex_element_tuple )
				{
					console.debug('Tuple 3:');
					console.debug(complex_element_tuple);

					if(complex_element_tuple.key == 'articles')
					{
						console.debug('Is articles 3');

						var article_list = GetComplexElementList(complex_element_tuple.value);

						console.debug(article_list);

						$.each
						(
							article_list,
							function( index, article_tuple )
							{
								console.debug(article_tuple);

								var list_item = CreateListItem(
									parent_element, 
									article_tuple,
									list_level,
									anchor +'/'+ article_tuple.key,
									true

								);
							}
						)
					}
					else
					{
						var list_item = CreateListItem(
							parent_element, 
							complex_element_tuple,
							list_level,
							anchor +'/'+ complex_element_tuple.key,
							false
							);

						var new_nav_element = CreateNavigationElement(
							parent_element, 
							complex_element_tuple, 
							list_level+1,
							anchor +'/'+ complex_element_tuple.key
							);
					}
				}
			)
			
			break;
	}
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