"use strict";

(function($)
{
	$.getFacebookButton = function(url)
	{
		let fbButton = document.createElement('DIV');

		fbButton.setAttribute('class', 'fb-like');
		fbButton.setAttribute('width', 200);
		fbButton.setAttribute('height', 50);

		fbButton.dataset.width = 200;
		fbButton.dataset.layout = 'button_count';
		fbButton.dataset.showFaces = 'false';
		fbButton.dataset.share = 'false';
		fbButton.dataset.href = url;

		return fbButton;

		// $facebook_like_button_div =
		// 	$('<div />',
		// 		{
		// 			'class': 'fb-like',
		// //			data-href: 'http://uttumi.github.io/blog/japan2016/',
		// 			'data-width': 200,
		// 			'data-layout': 'button_count',
		// 			'data-show-faces': 'false',
		// 			'data-share': 'false',
		// 			'width': 200,
		// 			'height': 50
		// 		}
		// 	);
		//
		// $facebook_like_button_div.prop('data-href', url);
		//
		// return $facebook_like_button_div;
	};
} (project.utility));
