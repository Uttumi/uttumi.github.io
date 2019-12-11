"use strict";

(function($)
{

	/*
	$(document).ready(function()
	{
		SetBGIntoMotion ();
	});
	*/

// $.setBGIntoMotion = function(svgBackground)
	$.ParallaxBackgroundSVG = function()
	{
		this.xPosScaleFix = 0;
		this.yPosScaleFix = 0;
		this.scaleFix = 1;
	};

	$.ParallaxBackgroundSVG.prototype.init = function(svgText)
	{
		// this.svgBackgroundElement = document.createElement('SVG');

		let parser = new DOMParser();

		// this.svgBackgroundElement = parser.parseFromString(svgText, 'text/xml');  	//XMLDocument
		this.svg = this.svgBackgroundElement = parser.parseFromString(svgText, 'image/svg+xml').documentElement;	//SVGDocument
		// this.svgBackgroundElement = parser.parseFromString(svgText, 'text/html');	//HTMLDocument

		// console.log(xmlDoc.querySelector("description"));

		// var $svgBackground = $($.parseHTML(svgData));

		// $svgBackground.attr( 'height', '100%' );
		// $svgBackground.attr( 'width', 'auto' );

		// this.svgBackgroundElement.setAttribute('height', '100%');
		// this.svgBackgroundElement.setAttribute('width', 'auto');

		// this.svgBackgroundElement.setAttribute('height', '100%');
		// this.svgBackgroundElement.setAttribute('width', 'auto');

		// this.svg.setAttributeNS(null, 'height', '100%');
		// this.svg.setAttributeNS(null, 'width', 'auto');

		this.svg.style.height = '100%';
		this.svg.style.width = 'auto';


		//$svgBackground.attr( 'preserveAspectRatio', 'xMinYMid meet'); //'xMidYMid meet' );

		//$svgBackground.find('g').attr('data-type', 'background');
		//$svgBackground.find('g[id*="background"]').attr('data-type', 'background');

		let groundElements = this.svg.querySelectorAll('g[id*="ground"]');

		for(let groundElement of groundElements)
		{
			// $gElement = $(this);
			// $gElement.attr('data-type', 'background');
			// var id = $gElement.attr('id');

			groundElement.dataset.type = 'background';
			let id = groundElement.id;

			//The number in id should be after 10th index (foreground2, background6 etc.)
			let number = id.substring(10);

			// $gElement.attr('data-speed', number);

			groundElement.dataset.speed = number;
		}

		// let viewBoxElement = this.svgBackgroundElement.childNodes[0];
		let viewBoxSizeArray = this.svg.getAttributeNS(null, 'viewBox').split(' ');

		this.viewBox =
		{
			minX 	: parseInt(viewBoxSizeArray[0]),
			minY	: parseInt(viewBoxSizeArray[1]),
			width 	: parseInt(viewBoxSizeArray[2]),
			height	: parseInt(viewBoxSizeArray[3]),
		};

		this.bgElementArray = this.svg.querySelectorAll('*[data-type="background"]');

		// this.svgBackgroundElement.appendChild(this.svg);
		document.body.appendChild(this.svgBackgroundElement);

		this.resize();
		this.update();
	};

	$.ParallaxBackgroundSVG.prototype.reset = function()
	{
		document.body.scrollTop = 0;
		this.update();
	};

	$.ParallaxBackgroundSVG.prototype.resize = function()
	{
		//console.debug('SCALING SVG BACKGROUND');

		let svgWidthScale = this.viewBox.width / this.svgBackgroundElement.clientWidth;
		let svgHeightScale = this.viewBox.height / this.svgBackgroundElement.clientHeight;

		this.scaleFix = svgHeightScale / svgWidthScale;

		this.xPosScaleFix = (this.scaleFix - 1) * (this.viewBox.width) / 2;
		this.yPosScaleFix = (this.scaleFix - 1) * (this.viewBox.height + this.viewBox.minY) / 2;
	/*
		console.debug('Scale: '+ svgScale);
		console.debug('viewBox.Width: '+ viewBox.Width);
		console.debug('viewBox.Width: '+ viewBox.Width);
	*/
	/*	var newWidth = originalWidth * svgScale;
		var newMinX = 0; // (newWidth - originalWidth) / 2;
		var newViewBox = newMinX +' '+ viewBoxMinY +' '+ newWidth +' '+ viewBoxHeight;
	*/
	/*	this.svgBackgroundElement[0].setAttribute('viewBox', newViewBox);*/
		//this.svgBackgroundElement[0].setAttribute('width', originalWidth / svgScale);

		let elements = this.svgBackgroundElement.querySelectorAll('#svg2');

		for(let element of elements)
		{
			element.setAttribute('transform', 		'scale('+ this.scaleFix +')');
			element.setAttribute('xPosScaleFix', 	this.xPosScaleFix);
			element.setAttribute('yPosScaleFix', 	this.yPosScaleFix);
			element.setAttribute('viewBoxMinY', 	this.viewBox.minY);
			element.setAttribute('viewBoxHeight', 	this.viewBox.height);
		}
	};

	$.ParallaxBackgroundSVG.prototype.update = function()
	{
		for(let bgElement of this.bgElementArray)
		{
			let elementFullHeight = document.body.scrollHeight; // $document.height() - $window.innerHeight(); //$window.height();
			let viewHeight = document.body.clientHeight; // window.innerHeight;
			let scrollAmount = elementFullHeight - viewHeight;

			let distanceToTop = document.body.scrollTop;
			let distanceToEnd = scrollAmount - distanceToTop;
			let scrollProgress = scrollAmount > 0 ? distanceToEnd / scrollAmount : 1; // elementFullHeight;

			//let svgScale = this.viewBox.height / this.scaleFix / this.svgBackgroundElement.height; //$window.innerHeight(); //scrollLength; /// $window.height();

			let elementPosition = (scrollProgress * this.viewBox.height * Math.pow(this.scaleFix, 2) - this.yPosScaleFix) * Math.sqrt( (1 - bgElement.dataset.speed / 10));
			// let currentPositionPercent = currentPosition / elementFullHeight;

			bgElement.setAttribute('transform', 'translate( '+ (-this.xPosScaleFix / this.scaleFix) +' '+ ((elementPosition - this.yPosScaleFix) / this.scaleFix) +' )');
			bgElement.setAttribute('yFix', this.yPosScaleFix);
			bgElement.setAttribute('xFix', this.xPosScaleFix);
		}

		// this.bgElementArray.each
		// (
		// 	function()
		// 	{
		// 		var $bgElement = $(this);
		//
		// 		var scrollLength = $body[0].scrollHeight; // $document.height() - $window.innerHeight(); //$window.height();
		// 		var scrollPos = $window.scrollTop();
		// 		var scrollEndDistance = scrollLength - scrollPos - $window.innerHeight();
		// 		var scrollPosPercent = scrollEndDistance / scrollLength;
		// 		var svgScale = viewBox.Height / scaleFix / this.svgBackgroundElement.height(); //$window.innerHeight(); //scrollLength; /// $window.height();
		//
		// 		//var currentPos = scrollPos + scrollEndDistance * (1 - $bgElement.data('speed') / 10);
		// 		//var currentPos = (scrollEndDistance - this.yPosScaleFix*2) * (1 - $bgElement.data('speed') / 10);
		// 		var currentPos = (scrollPosPercent * viewBox.Height * Math.pow(scaleFix, 2) - this.yPosScaleFix) * Math.sqrt( (1 - $bgElement.data('speed') / 10));
		// 		//var currentPos = (scrollPosPercent * viewBox.Height) * scaleFix * (1 - $bgElement.data('speed') / 10);
		// 		var currentPosPercent = currentPos / scrollLength;
		//
		// 	/*
		//
		// 		if($bgElement.data('speed') == 0)
		// 		{
		// 			console.debug('svgHeight: '+ viewBox.Height);
		// 			console.debug('$window.height(): '+ $window.innerHeight());
		// 			console.debug('ScrollHeight: '+ $body[0].scrollHeight);
		// 			console.debug('scrollPos: '+ scrollPos);
		// 			console.debug('scrollEndDistance: '+ scrollEndDistance);
		// 			console.debug('Scale: '+ svgScale);
		// 			console.debug('currentPos: '+ currentPos);
		// 			console.debug('currentPos scaled: '+ (currentPos * svgScale));
		// 		}
		// 	*/
		//
		//
		// 		// Put together our final bottom position
		// 		//var bottomPos = currentPos + 'px';
		//
		// 		//this.svgBackgroundElement.attr('transform', 'translate( 0 '+ (-scrollPos * svgScale) +' )');
		// 		$bgElement.attr('transform', 'translate( '+ (-this.xPosScaleFix / scaleFix) +' '+ ((currentPos - this.yPosScaleFix) / scaleFix) +' )');
		//
		// 		$bgElement.attr('yFix', this.yPosScaleFix);
		// 		$bgElement.attr('xFix', this.xPosScaleFix);
		// 		// Move the element
		// 		//bgElement.css({ bottom: bottomPos });
		// 	}
		// );
	};
} (project));
