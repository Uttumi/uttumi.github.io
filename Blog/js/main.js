$(document).ready(function()
{
	var $window = $(window);
	var $document = $(document);

	var contentArray = [
			'content/experience/2016-02-13-Himeji.html',
			'content/experience/2016-02-13-Himeji.html'
		];

	BuildContentFromArray (contentArray);

	console.log('Ready')

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

/*			var scrollPosition = $window.scrollTop();
			var scrollPercent = 100 * scrollPosition / ($document.height() - $window.height());

			console.log('Scrolling '+ scrollPosition)

			var currentPos = - (scrollLength - scrollPosition) * $background.data('speed');
			// Put together our final bottom position
			var bottomPos = currentPos + 'px';
			// Move the element
			$background.css({ bottom: bottomPos });*/
		});

		$window.resize(function()
		{
			UpdateBGElement ($bgElement);
		});

	});
});

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
