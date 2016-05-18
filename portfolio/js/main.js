var content_path = 'content/';

var modification_date = new Date(document.lastModified);

function resizeIframe(obj)
{
    var newheight;
    var newwidth;

    newheight = obj.contentWindow.document .body.scrollHeight;
    newwidth = obj.contentWindow.document .body.scrollWidth;

    obj.height = (newheight) + "px";
    obj.width = (newwidth) + "px";
}

$(document).ready(function()
{
	CreateNavigationFromIndexJson();
});

$(document).load(function()
{
	$('html,body').scrollTop(0);
});

function CreateNavigationFromIndexJson()
{
	$('#date > time').html('Last modified '+ modification_date.getDate() +'.'+ (modification_date.getMonth()+1) +'.'+ modification_date.getFullYear());

	templates.loadJSON(content_path + 'index.json', "json-loaded");
}

$(document).on(
	"json-loaded", 
	function (event, data)
	{
		//console.debug(JSON.stringify(data));
		CreateNavigationElement(null, {key: 'root', value: data}, 1);
	}
)


function CreateNavigationElement(own_list_item, json_tuple, list_level, is_home_page=false)
{
	var description = GetArrayByKey(json_tuple.value, 'description');
	var pages = GetArrayByKey(json_tuple.value, 'pages');
	var images = GetArrayByKey(json_tuple.value, 'images');
	var videos = GetArrayByKey(json_tuple.value, 'videos');
	var subpages = GetArrayByKey(json_tuple.value, 'subpages');
	
	if(description == null) description = [];
	if(pages == null) pages = [];
	if(images == null) images = [];
	if(videos == null) videos = [];
	if(subpages == null) subpages = [];

	var subelements = GetComplexElementList(json_tuple.value);
	
	if(own_list_item != null)
	{
		var title = json_tuple.key;

		if(title == 'welcome')
		{
			NavigationClick(title, description, images, videos, pages, subpages);

			$('#Home_input').prop('checked', true);
		}

		own_list_item.find('input').click(
			function ()
			{ 
				NavigationClick(title, description, images, videos, pages, subpages) 
			}
		);
	}

	if(subelements.length > 0)
	{
		var navigation_sublist = null; 
		
		if(own_list_item == null)
		{
			navigation_sublist = $('#level_1');
		}
		else
		{
			navigation_sublist = $('<ul />', {id: 'level_'+ list_level});
			$('<div class=\'nav-wrap\' />').html(navigation_sublist).appendTo(own_list_item);
		}
	
		$.each
		(
			subelements,
			function( index, tuple )
			{
				var child_list_item = $('<li />').appendTo(navigation_sublist);
				var label_element = $('<label />', 
					{ 
						for: tuple.key +'_input' 
					}
				).html(tuple.key.replace(/_/g, ' ')).appendTo(child_list_item);
				
				if(list_level == 1)
				{
					if(index == 0)
					{
						child_list_item.attr('id', 'first_nav_element');
					}
					if(index+1 == subelements.length)
					{
						//label_element.attr('id', 'last_nav_element');
						var last_list_item = $('<li />').appendTo(navigation_sublist);
						last_list_item.attr('id', 'last_nav_element');
					}
				}

				$('<input />', 
					{ 
					//type: 'radio', 
					type: 'checkbox', 
					name: 'vertical_menu_'+ list_level, 
					id: tuple.key +'_input',
					}
				).appendTo(child_list_item);

				CreateNavigationElement(child_list_item, tuple, list_level+1);
			}
		)
	}
}

current_key = "";

function NavigationClick(key, description, images, videos, pages, subpages)
{
	console.debug('Clicked '+ key);
	
	if(key == current_key)
		return;

	current_key = key;

	var total_elements = description.length + images.length + videos.length + pages.length + subpages.length;

	if(total_elements > 0)
	{
		var content_area = $('#content-area');
		content_area.empty();

		$('<h1>'+ key.replace(/_/g,' ') +'</h1>').appendTo(content_area);
		$('<div class=\'title-underline\'/>').appendTo(content_area);
		//$('<hr />').appendTo(content_area);

		ProcessContent(content_area, description, images, videos, pages, subpages);
	}
}

function ProcessContent(content_area, description, images, videos, pages, subpages)
{
	AddArticles(content_area, description);
	AddExternalPages(content_area, pages);
	AddImages(content_area, images);
	AddVideos(content_area, videos);
	AddSubpages(content_area, subpages);
}

function AddSubpages(content_area, subpages)
{
	if(subpages.length == 0)
		return;

	$.each(subpages, 
		function(index, subpage)
		{
			console.debug('Index: '+ index);

			$.each(subpage, 
				function(key, value)
				{
					console.debug('Key: '+ key);
					console.debug(JSON.stringify(value));

					var container = $('<article />').appendTo(content_area);
					$('<div class=\'article-gap-line\' />').appendTo(container);
					var title = $('<h2>'+ key.replace(/_/g,' ') +'</h2>').appendTo(container);
					$('<div class=\'article-gap-line\' />').appendTo(container);

					var description = GetArrayByKey(value, 'description');
					var pages = GetArrayByKey(value, 'pages');
					var images = GetArrayByKey(value, 'images');
					var videos = GetArrayByKey(value, 'videos');

					if(description == null) description = [];
					if(pages == null) pages = [];
					if(images == null) images = [];
					if(videos == null) videos = [];

					ProcessContent(container, description, images, videos, pages, [])
				}
			)
		}
	)
}

function AddExternalPages(content_area, external_pages)
{
	if(external_pages.length == 0)
		return;

	$.each(external_pages,
		function(index, page_url)
		{
			var iframe = $('<iframe src=\"'+ content_path + page_url +'?autoplay=false\" name="Game name" scrolling="no" onload="resizeIframe(this)"></iframe>');
			
			var div = $('<div class=\"one-per-row iframe-container\"/>').append(iframe);
			content_area.append(div);
		}
	);
}	

function AddArticles(content_area, articles)
{
	if(articles.length == 0)
		return;

	templates.loadDocuments(articles, content_area, "documents-loaded");
}

$(document).on(
	"documents-loaded", 
	function (event, document_divs, target)
	{
		$.each(document_divs, 
			function(index, document_div)
			{
				document_div.addClass('one-per-row');
				document_div.addClass('first');
				target.append(document_div);	
			}
		);
	}
)

var img_margin = 5;

function AddImages(content_area, images)
{
	if(images.length == 0)
		return;
		
	var image_count = images.length;
	
	var content_class = 'one-per-row';

	if(image_count > 4)
	{
		content_class = 'two-per-row';
	}
	if(image_count > 8)
	{
		content_class = 'three-per-row';
	}
	if(image_count > 16)
	{
		content_class = 'four-per-row';
	}
	
	$.each(images, 
		function(index, value)
		{
			var image = $('<img />', 
				{
					src: content_path + value,
					class: content_class
				}
			).appendTo(content_area);
		}
	)
}

function AddVideos(content_area, videos)
{
	if(videos.length == 0)
		return;

	var subelement_width = content_area.width();
	var content_class = 'one-per-row';

	$.each(videos, 
		function(index, value)
		{
			console.debug('Creating video: '+ content_path + value +' with width '+ subelement_width);

			content_area.append(
			//	'<video width=\''+ subelement_width +'\' controls>'+
				'<video controls class=\"'+ content_class +'\"">'+
				'	<source src=\''+ content_path + value +'\' type="video/mp4">'+
				'	Your browser does not support the video tag.'+
				'</video>'
				)
			/*
			var video = $('<video />', {width: subelement_width}).appendTo(content_area);
			
			video.html('Your browser does not support the video tag.');
			
			$('<source />', 
				{
					src: 'portfolio/'+ value,
					type: 'video/mp4'
				}
			).appendTo(video);
			*/
		}
	)
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
