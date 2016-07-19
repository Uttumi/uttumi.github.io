var $window = $(window);
var $document = $(document);
var $body = $('body');
var $bgElementArray;

var $svgBackground;
var viewBoxArra;
var viewBoxWidth;
var viewBoxHeight;
var originalAspect;
var originalWidth;

var xPosScaleFix = 0;
var yPosScaleFix = 0;
var scaleFix = 1;
/*
$(document).ready(function()
{
	SetBGIntoMotion ();
});
*/
function SetBGIntoMotion ()
{
	$svgBackground = $('svg');

	viewBoxArray = $svgBackground[0].getAttribute('viewBox').split(' ');

	viewBoxMinX = parseInt(viewBoxArray[0]);
	viewBoxMinY = parseInt(viewBoxArray[1]);
	viewBoxWidth = parseInt(viewBoxArray[2]);
	viewBoxHeight = parseInt(viewBoxArray[3]);

	originalAspect = viewBoxWidth / viewBoxHeight;
	originalWidth = viewBoxWidth;

	$window.scroll(function()
	{
		console.debug('Scroll triggered');
		UpdateBGElements ();
	});

	$window.resize(function()
	{
		console.debug('WINDOW RESIZE TRIGGERED');
		ScaleSVGBackground ();
		UpdateBGElements ();
	});

	$('#content-area').resize(function()
	{
		console.debug('CONTENT AREA RESIZE TRIGGERED');
		ScaleSVGBackground ();
		UpdateBGElements ();
	});

    $window.bind( 'hashchange', function(event)
    {
    	console.debug('HASH CHANGE TRIGGERED');
    	$body[0].scrollTop = 0;

		UpdateBGElements ();
    });

	$bgElementArray = $svgBackground.find('*[data-type="background"]');

	ScaleSVGBackground ();
	UpdateBGElements ();
/*
	$svgBackground.find('*[data-type="background"]').each(function()
	{
		var $bgElement = $(this); // Assigning background object
		
		var scrollLength = $document.height() - $window.height();
		var startPos = - scrollLength * $bgElement.data('speed');

		console.log('Document height '+ $document.height() +' Window height '+ $window.height())

		var bottomPos = startPos + 'px';

		// Move the element
		//$bgElement.css({ bottom: bottomPos });

		$window.scroll(function()
		{
			console.debug('Scroll triggered');
			UpdateBGElement ($bgElement);
		});

		$window.resize(function()
		{
			UpdateBGElement ($bgElement);
		});

		$('#content-area').resize(function()
		{
			UpdateBGElement ($bgElement);
		});

		$window.bind( 'hashchange', function(event)
	    {
	    	if

		    UpdateBGElement ($bgElement);
	    });

		UpdateBGElement ($bgElement);
	});*/
}

function ScaleSVGBackground ()
{
	console.debug('SCALING SVG BACKGROUND');

	var svgWidthScale = viewBoxWidth / $svgBackground.width();
	var svgHeightScale = viewBoxHeight / $svgBackground.height();

	scaleFix = svgHeightScale / svgWidthScale;

	xPosScaleFix = (scaleFix - 1) * (viewBoxWidth) / 2;
	yPosScaleFix = (scaleFix - 1) * (viewBoxHeight + viewBoxMinY) / 2; // / scaleFix;
/*
	console.debug('Scale: '+ svgScale);
	console.debug('viewBoxWidth: '+ viewBoxWidth);
	console.debug('viewBoxWidth: '+ viewBoxWidth);
*/
/*	var newWidth = originalWidth * svgScale;
	var newMinX = 0; // (newWidth - originalWidth) / 2;
	var newViewBox = newMinX +' '+ viewBoxMinY +' '+ newWidth +' '+ viewBoxHeight;
*/
/*	$svgBackground[0].setAttribute('viewBox', newViewBox);*/
	//$svgBackground[0].setAttribute('width', originalWidth / svgScale);

	$svgBackground.find('#svg2').attr('transform', 'scale( '+ scaleFix +'  )');
	$svgBackground.find('#svg2').attr('xPosScaleFix', xPosScaleFix );
	$svgBackground.find('#svg2').attr('yPosScaleFix', yPosScaleFix );
	$svgBackground.find('#svg2').attr('viewBoxMinY', viewBoxMinY );
	$svgBackground.find('#svg2').attr('viewBoxHeight', viewBoxHeight );
}

function UpdateBGElements ()
{
	$bgElementArray.each
	(
		function()
		{
			var $bgElement = $(this);

			var scrollLength = $body[0].scrollHeight; // $document.height() - $window.innerHeight(); //$window.height();
			var scrollPos = $window.scrollTop();
			var scrollEndDistance = scrollLength - scrollPos - $window.innerHeight();
			var scrollPosPercent = scrollEndDistance / scrollLength;
			var svgScale = viewBoxHeight / scaleFix / $svgBackground.height(); //$window.innerHeight(); //scrollLength; /// $window.height();

			//var currentPos = scrollPos + scrollEndDistance * (1 - $bgElement.data('speed') / 10);
			//var currentPos = (scrollEndDistance - yPosScaleFix*2) * (1 - $bgElement.data('speed') / 10);
			var currentPos = (scrollPosPercent * viewBoxHeight * Math.pow(scaleFix, 2) - yPosScaleFix) * Math.sqrt( (1 - $bgElement.data('speed') / 10));
			//var currentPos = (scrollPosPercent * viewBoxHeight) * scaleFix * (1 - $bgElement.data('speed') / 10);
			var currentPosPercent = currentPos / scrollLength;

		/*

			if($bgElement.data('speed') == 0)
			{
				console.debug('svgHeight: '+ viewBoxHeight);
				console.debug('$window.height(): '+ $window.innerHeight());
				console.debug('ScrollHeight: '+ $body[0].scrollHeight);
				console.debug('scrollPos: '+ scrollPos);
				console.debug('scrollEndDistance: '+ scrollEndDistance);
				console.debug('Scale: '+ svgScale);
				console.debug('currentPos: '+ currentPos);
				console.debug('currentPos scaled: '+ (currentPos * svgScale));
			}
		*/


			// Put together our final bottom position
			//var bottomPos = currentPos + 'px';

			//$svgBackground.attr('transform', 'translate( 0 '+ (-scrollPos * svgScale) +' )');
			$bgElement.attr('transform', 'translate( '+ (-xPosScaleFix / scaleFix) +' '+ ((currentPos - yPosScaleFix) / scaleFix) +' )');

			$bgElement.attr('yFix', yPosScaleFix);
			$bgElement.attr('xFix', xPosScaleFix);
			// Move the element
			//bgElement.css({ bottom: bottomPos });
		}
	);
}