"use strict";

(function($)
{
	// Transfered to main.js
	// $.utility.addEvent(
	// 	document, 'ready',  
	// 	function()
	// 	{
	// 		SetBGIntoMotion ();
	// 	}, 
	// 	true);

	$.setBGIntoMotion = function()
	{
		let backgrounds = document.querySelectorAll('*[data-type="background"]');

		for(let bgElement of backgrounds)
		{
			//var $bgElement = $(this); 

			// Assigning background object
			//var scrollDistance = $document.height() - $window.height();
			//var startPos = - scrollDistance * $bgElement.data('speed');

			//console.log('Document height '+ $document.height() +' Window height '+ $window.height())

			//var bottomPos = startPos + 'px';

			// Move the element
			//$bgElement.css({ bottom: bottomPos });

			if(bgElement.dataset.anchor === 'bottom')
			{
				// bgElement.css({ bottom: bottomPos });
				bgElement.style.bottom = bottomPos;
			}
			else
			{
				// bgElement.style.color;

				bgElement.style.backgroundPosition = '0px 0px';
				// $bgElement.css('background-position', '0px 0px');
			}

			bgElement.dataset.baseline = 0;
			// $bgElement.data('baseline', 0);

			$.utility.addEvent(
				window, 'scroll',  
				function()
				{
					//console.debug('Scroll triggered '+ window.scrollTop);
					//console.debug(bgElement.dataset.position);
					$.updateBGElement(bgElement);
				}, 
				true);

			$.utility.addEvent(
				window, 
				'resize',  
				function()
				{
					console.debug('Window resize triggered');
					$.updateBGElement(bgElement);
				}, 
				true);

			let contentArea = document.querySelector('#content-area');

			$.utility.addEvent(
				contentArea, 
				'resize',  
				function()
				{
					console.debug('Content resize triggered');
					$.updateBGElement(bgElement);
				}, 
				true);

			$.utility.addEvent(
				window, 
				'navigation-event',  
				function()
				{
	  				console.debug('Navigation event');
	  				bgElement.dataset.baseline = bgElement.dataset.position;
	  				window.scrollTop = 0; 
				},
				true);

			// $window.scroll(function()
			// {
			// 	console.debug('Scroll triggered '+ $window.scrollTop());
			// 	console.debug($bgElement.data('position'));
			// 	UpdateBGElement ($bgElement);
			// });

			// $window.resize(function()
			// {
			// 	console.debug('Window resize triggered');
			// 	UpdateBGElement ($bgElement);
			// });

			// $('#content-area').resize(function()
			// {
			// 	console.debug('Content resize triggered');
			// 	UpdateBGElement ($bgElement);
			// });

			// $window.on( "navigation-event", function( ) 
			// {
			// 	console.debug('Navigation event');
			// 	$bgElement.data('baseline', $bgElement.data('position'));
			// 	$window.scrollTop(0); 
			// });
		}
	};

	$.updateBGElement = function(bgElement)
	{
		let documentHeight = document.body.clientHeight;
		let windowHeight = window.innerHeight;

		//How many pixels there are to scroll
		let scrollDistance = documentHeight - windowHeight;
		// let scrollDistance = $document.height() - $window.height();

		//How many pixels are hidden at top, i.e. how much is scrolled from top
		// let scrollPosition = $window.scrollTop();
		let scrollPosition = window.scrollTop;

		let scrollLeft = scrollDistance - scrollPosition;

		let baseline = bgElement.dataset.baseline;
		let speed = bgElement.dataset.speed;

		let currentPosition = baseline + scrollPosition * speed;

		let topPosition = -currentPosition +'px';

		bgElement.dataset.position = currentPosition;
		//$bgElement.css({ top: topPosition });

		if(bgElement.dataset.anchor === 'bottom')
		{
			bgElement.style.bottom = topPosition;
		}
		else
		{
			bgElement.style.backgroundPosition = '0px ' + topPosition;
		}

		//var currentPos = - scrollLeft * bgElement.data('speed') - bgBaseline;

		//$bgElement.data('position', currentPosition)

		// Put together our final bottom position
		//var bottomPos = currentPos + 'px';

		// Move the element
		//bgElement.css({ bottom: bottomPos });
	};

} (project));