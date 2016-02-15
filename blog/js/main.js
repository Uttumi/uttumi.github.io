var planArray = [
	'content/plan/2016-02-13-Himeji.html',
	'content/plan/2016-02-13-Himeji.html'
];

var experienceArray = [
	'content/experience/2016-02-13-Himeji.html',
	'content/experience/2016-02-13-Himeji.html'
];

var $window = $(window);
var $document = $(document);

$(document).ready(function()
{
	CheckHash ();

	// BuildContentFromArray (contentArray);

	SetBGIntoMotion ();

    $window.bind( 'hashchange', function(event){
/*	    alert('Anchor changed!');*/
	    CheckHash ();
    });
    
    // Since the event is only triggered when the hash changes, we need to trigger
    // the event now, to handle the hash the page may have loaded with.
    $window.trigger( 'hashchange' );

	console.log('Ready')
});

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

	console.log('Initial hash: '+ hash);

	switch (hash)
	{
		case 'plan':
			console.log("PLAN!");
			templates.load(planArray, "#content-area", "files-loaded");
			break;
		case 'experience':
			console.log("EXPERIENCE!");
			templates.load(experienceArray, "#content-area", "files-loaded");
			break;
	}

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

	$.each(contentArray, function( index, value ) {
		if (index > 0)
			$('#content-area').append("<hr>");
		$.get(value, function(data){
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

var templates = (function ($, host) {
    // begin to load external templates from a given path and inject them into the DOM
    return {
        // use jQuery $.get to load the templates asynchronously
        load: function (templateArray, target, event)
        {
            var defferArray = [];

            $(target).empty();

            $.each(templateArray, function (index, urlValue)
            {
                var loader = $.get(urlValue)
                    .success(function (data) 
                    {
                    // on success, add the template to the targeted DOM element
						if (index > 0)
								$(target).append("<hr>");
						$(target).append(data);
                	});
                defferArray.push(loader);
            })

            $.when.apply(null, defferArray).done(function ()
            {
                $(host).trigger(event);
            });
        }
    };
})(jQuery, document);

$(document).on("files-loaded", function () {
    $("#content").append("<p>All done!</p>");
})
