"use strict";

(function($)
{
	$.ParalaxBackground = function()
	{
		this.backgrounds = document.querySelectorAll('*[data-type="background"]');

		this.contentArea = document.querySelector('#content-area');
	};

	$.ParalaxBackground.prototype.init = function()
	{
		// const windowHeight = window.innerHeight;
		//
		// const	body = document.body,
		// 		html = document.documentElement;
		//
		// const documentHeight = Math.max(
		// 	body.scrollHeight, body.offsetHeight,
		// 	html.clientHeight, html.scrollHeight, html.offsetHeight );

		for(let background of this.backgrounds)
		{
			// const baseline 	= background.dataset.baseline;
			// const speed 	= background.dataset.speed;
			//
			// // Assigning background object
			// const scrollDistance = documentHeight - windowHeight;
			// const startPos = - scrollDistance * speed;
			//
			// const bottomPos = startPos + 'px';
			//
			// if(background.dataset.anchor === 'bottom')
			// {
			// 	// Move the element
			// 	background.style.bottom = bottomPos;
			// }
			// else
			// {
			// 	background.style.backgroundPosition = '0px 0px';
			// }

			background.dataset.baseline = 0;
			background.dataset.position = 0;
		}

		$.utility.addEvent(
			window, 'scroll',
			this.update.bind(this),
			true);

		$.utility.addEvent(
			window,
			'resize',
			this.update.bind(this),
			true);

		$.utility.addEvent(
			this.contentArea,
			'resize',
			this.update.bind(this),
			true);

		$.utility.addEvent(
			window,
			'navigation-event',
			this.save.bind(this),
			true);
	};

	$.ParalaxBackground.prototype.save = function()
	{
		for(let background of this.backgrounds)
		{
			// const scrollPosition = this._getScrollPosition();
			// background.dataset.baseline = scrollPosition;
			// background.dataset.position = scrollPosition;

			background.dataset.baseline = 0;
		}
	};

	$.ParalaxBackground.prototype.update = function()
	{
		for(let background of this.backgrounds)
		{
			this._updateElement(background);
		}
	};

	$.ParalaxBackground.prototype._updateElement = function(background)
	{
		const scrollPosition = this._getScrollPosition();
		// const scrollLeft = scrollDistance - scrollPosition;

		const position 	= parseFloat(background.dataset.position);
		const baseline 	= parseFloat(background.dataset.baseline);
		const speed 	= parseFloat(background.dataset.speed);

		const nextPosition = position - (scrollPosition - baseline) * speed;

		background.dataset.position = nextPosition;
		background.dataset.baseline = scrollPosition;

		background.style.backgroundPosition = '0px '+ nextPosition +'px';
		// background.style.bottom = nextPosition +'px';
	};

	$.ParalaxBackground.prototype._getScrollPosition = function()
	{
		const windowHeight = window.innerHeight;

		const	body = document.body,
		    	html = document.documentElement;

		const documentHeight = Math.max(
			body.scrollHeight, body.offsetHeight,
	        html.clientHeight, html.scrollHeight, html.offsetHeight );

		//How many pixels there are to scroll
		const scrollDistance = documentHeight - windowHeight;

		//How many pixels are hidden at top, i.e. how much is scrolled from top
		return html.scrollTop;
	};

} (project));
