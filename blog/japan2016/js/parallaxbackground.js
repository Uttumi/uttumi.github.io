var $window = $(window);
var $document = $(document);

$(document).ready(function()
{
	SetBGIntoMotion ();
});

function SetBGIntoMotion ()
{
	$('*[data-type="background"]').each(function()
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
			console.debug('Scroll triggered');
			UpdateBGElement ($bgElement);
		});

		$window.resize(function()
		{
			console.debug('Window resize triggered');
			UpdateBGElement ($bgElement);
		});

		$('#content-area').resize(function()
		{
			console.debug('Content resize triggered');
			UpdateBGElement ($bgElement);
		});
	});
}

function UpdateBGElement (bgElement)
{
	var scrollLength = $document.height() - $window.height();
	var scrollPosition = $window.scrollTop();
	var scrollPercent = 100 * scrollPosition / ($document.height() - $window.height());

	var currentPos = - (scrollLength - scrollPosition) * bgElement.data('speed');

	// Put together our final bottom position
	var bottomPos = currentPos + 'px';

	// Move the element
	bgElement.css({ bottom: bottomPos });
}
