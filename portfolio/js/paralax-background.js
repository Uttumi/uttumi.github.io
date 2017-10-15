var $window = $(window);
var $document = $(document);

$(document).ready(function()
{
	SetBGIntoMotion ();
});

function SetBGIntoMotion ()
{
	$('*[data-type="background"]').each(
		function()
		{
			var $bgElement = $(this); // Assigning background object
			//var scrollDistance = $document.height() - $window.height();
			//var startPos = - scrollDistance * $bgElement.data('speed');

			//console.log('Document height '+ $document.height() +' Window height '+ $window.height())

			//var bottomPos = startPos + 'px';

			// Move the element
			//$bgElement.css({ bottom: bottomPos });

			if($bgElement.data('anchor') == 'bottom')
			{
				$bgElement.css({ bottom: bottomPos });
			}
			else
			{
				$bgElement.css('background-position', '0px 0px');
			}

			$bgElement.data('baseline', 0);

			$window.scroll(function()
			{
				console.debug('Scroll triggered '+ $window.scrollTop());
				console.debug($bgElement.data('position'));
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

			$window.on( "navigation-event", function( ) 
			{
  				console.debug('Navigation event');
  				$bgElement.data('baseline', $bgElement.data('position'));
  				$window.scrollTop(0); 
			});

		}
	);
}

function UpdateBGElement ($bgElement)
{
	//How many pixels there are to scroll
	var scrollDistance = $document.height() - $window.height();

	//How many pixels are hidden at top
	var scrollPosition = $window.scrollTop();

	var scrollLeft = scrollDistance - scrollPosition;

	//var previousPos = $bgElement.data('position');
	var currentPosition = $bgElement.data('baseline') + scrollPosition * $bgElement.data('speed');

	var topPosition = -currentPosition +'px';

	$bgElement.data('position', currentPosition);
	//$bgElement.css({ top: topPosition });

	if($bgElement.data('anchor') == 'bottom')
	{
		bgElement.css('bottom', topPosition);
	}
	else
	{
		$bgElement.css('background-position', '0px ' + topPosition);
	}

	//var currentPos = - scrollLeft * bgElement.data('speed') - bgBaseline;

	//$bgElement.data('position', currentPosition)

	// Put together our final bottom position
	//var bottomPos = currentPos + 'px';

	// Move the element
	//bgElement.css({ bottom: bottomPos });
}