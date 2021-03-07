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
		for(let background of this.backgrounds)
		{
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
			background.dataset.baseline = background.dataset.position;
		}
		
		this.reset();
	};
	
	$.ParalaxBackground.prototype.reset = function()
	{
		window.scrollTo(0,0); 
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

		const position 	= parseFloat(background.dataset.position);
		const baseline 	= parseFloat(background.dataset.baseline);
		const speed 	= parseFloat(background.dataset.speed);

		const nextPosition = baseline - scrollPosition * speed;

		background.dataset.position = nextPosition;
		background.style.backgroundPosition = '0px '+ nextPosition +'px';
	};

	$.ParalaxBackground.prototype._getScrollPosition = function()
	{
		//How many pixels are hidden above the top edge, i.e. how much has been scrolled from the top
		return window.scrollY || document.body.scrollTop;
	};

} (project));
