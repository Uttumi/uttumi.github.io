/*var planArray = [
	'content/plan/2016-02-13-Himeji.html',
	'content/plan/2016-02-13-Himeji.html'
];

var experienceArray = [
	'content/experience/2016-02-13-Himeji.html',
	'content/experience/2016-02-13-Himeji.html'
];*/

var nav_lists = {};

var $window = $(window);
var $document = $(document);

$(document).ready(function()
{
	CreateNavigationFromIndexJson();

/*	CheckHash ();*/

	// BuildContentFromArray (contentArray);

	SetBGIntoMotion ();

	console.debug('Reading JSON');
});

function InitializePage()
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


/*$(document).hashchange( function() //.bind("hashchange", function()
{
    // Anchor has changed.
    alert('Anchor changed!');
    CheckHash ();
});*/

function CheckHash ()
{
	//Remove the # from the hash, as different browsers may or may not include it
	var hash = location.hash.replace('#','');

	console.debug('Initial hash: '+ hash);
	console.debug('content/'+ nav_lists[location.hash]);

	templates.load(nav_lists[location.hash], "#content-area", "files-loaded");

/*	switch (hash)
	{
		case 'plan':
			console.log("PLAN!");
			templates.load(planArray, "#content-area", "files-loaded");
			break;
		case 'experience':
			console.log("EXPERIENCE!");
			templates.load(experienceArray, "#content-area", "files-loaded");
			break;
	}*/

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
			$('#content-area').append("<hr>");

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

		/*		tempElement.appendTo('#content-area');*/

				console.debug('TEMP ELEMENTS: '+ tempElements.length);
				console.debug('HTMLs: '+ templateArray.length);

                    	// on success, add the template to the targeted DOM element
/*						if (index > 0)
						{
							$(target).append("<hr>");
						}*/

/*						var numberOfArticles = occurrences(data, '<article');*/

/*						if (templateArray.length == 1 && numberOfArticles > 1)
						{
							var elements = $(theHtmlString);
							var found = elements.('article id=\"'+ kyoto1 +'\"', elements);
						}*/
/*
						$(target).append(data);*/

/*                var loader = $.get('content/'+ urlValue)
                    .success(function (data) 
                    {
                    	// on success, add the template to the targeted DOM element
						if (index > 0)
						{
							$(target).append("<hr>");
						}

						var numberOfArticles = occurrences(data, '<article');

						$(target).append(data);
                	});
                defferArray.push(loader);*/
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
								$(target).append("<hr>");
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
		InitializePage();
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

/*	$.getJSON
	(
		'content/index.json',
		function(json)
		{
			console.log('Opened index.json');

			console.debug(JSON.stringify(json.en.experience));

			CreateNavigationElement(
				$('nav'), 
				{key: 'root', value: json.en}, 
				1, 
				'#'
				);

			console.debug(nav_lists);
		}
	)
	.error ( function() { console.debug('Could not open index.json'); } )
	
	return json;*/
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
						anchor + complex_element_tuple.key
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
									anchor +'/'+ article_tuple.key
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
							anchor +'/'+ complex_element_tuple.key
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
									anchor +'/'+ article_tuple.key
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
							anchor +'/'+ complex_element_tuple.key
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

function CreateListItem(parent_element, json_tuple, list_level, anchor)
{
	anchor = anchor.toLowerCase();

	var list_item = $('<li />').appendTo(parent_element);
	var link = $('<a />', {href: anchor}).appendTo(list_item);

	link.text(json_tuple.key);

	switch(list_level)
	{
		case 1: 
				break;
		case 2: 
				list_item.addClass('dropdown-item level1');

				AddToNavList(anchor, json_tuple);

				break;
		case 3: 
				list_item.addClass('dropdown-item level2');

				AddToNavList(anchor, json_tuple);

				break;
		default: 
				list_item.addClass('dropdown-item level3');

				AddToNavList(anchor, json_tuple);

				break;		
	}

	return list_item;
}

function AddToNavList(orig_anchor, json_tuple)
{
	var folders = orig_anchor.split('/');
	var anchor = '';
	var article_id = folders[folders.length-1];
	var article_selector = json_tuple.value +' #'+ article_id;

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

			if(nav_lists.hasOwnProperty(anchor))
			{
				console.debug('Pushing to '+ anchor +': '+ article_selector);
				nav_lists[anchor].push(article_selector);
			}
			else
			{
				console.debug('Initializing '+ anchor +': '+ article_selector);
				nav_lists[anchor] = [article_selector];
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


