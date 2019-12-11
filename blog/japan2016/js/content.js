"use strict";

(function($)
{
	$.Content = function(contentElement)
	{
		this.contentElement = contentElement;
	};
	$.Content.prototype.reset = function()
	{
		$.utility.clearElement(this.contentElement);
	};

	$.Content.prototype.addArticles = function(articleHTMLs)
	{
		for(let articleHTML of articleHTMLs)
		{
			this.addArticleStart(this.contentElement);

			this.contentElement.insertAdjacentHTML('beforeend', articleHTML);

			// var $article_content = $.contentElement.children().last().find('.article-content');
			//var scrollHeight = $article_content.get(0).scrollHeight;

			let articleContents = this.contentElement.lastElementChild.querySelector('.article-content');

			this.addSocialMedia(this.contentElement);

			// articleContents.style.height = 'auto';
			// let autoHeight = articleContents.innerHeight();

			// var autoHeight = $article_content.css('height', 'auto').height();
			// $article_content.height('100px');



			if(articleContents)
			{
				articleContents.style.height = $.articleClosedHeight + 'px';
				this.addArticleToggle(this.contentElement, articleContents)
			}

			// this.articleClick();

			this.addArticleEnd(this.contentElement);
		}
	};

	$.Content.prototype.addArticleStart = function(element)
	{
		const span = document.createElement('SPAN');
		span.classList.add('clearfix');
		element.appendChild(span);

		const hr = document.createElement('HR');
		hr.classList.add('article-start');
		element.appendChild(hr);
	};

	$.Content.prototype.addSocialMedia = function(element)
	{
		element.appendChild($.utility.getFacebookButton('uttumi.github.io/blog/japan2016'));
	};

	$.Content.prototype.addArticleToggle = function(element, articleContents)
	{
		const label = document.createElement('LABEL');
		const labelText = document.createTextNode('');
		const title = document.createElement('H3');
		const input = document.createElement('INPUT');
		input.setAttribute('type', 'checkbox');

		label.appendChild(labelText);
		label.appendChild(title);
		label.appendChild(input);
		element.appendChild(label);

		$.utility.addEvent(
			input,
			'change',
			this.checkArticleToggle.bind(this, input, labelText, articleContents)
		);

		this.checkArticleToggle(input, labelText, articleContents);
	};

	$.Content.prototype.addArticleEnd = function(element)
	{
		let span = document.createElement('SPAN');
		span.classList.add('clearfix');
		element.appendChild(span);

		let hr = document.createElement('HR');
		hr.classList.add('article-end');
		element.appendChild(hr);
	};

	// $.articleSlideToggle = function(targets, closedHeight = 0)
	// {
	// 	for(let target of targets)
	// 	{
	// 		if(!element.style.height)
	// 		{
	// 			element.style.height = closedHeight;
	// 		}
	//
	// 		const clientHeight = element.clientHeight;
	// 		const scrollHeight = element.scrollHeight;
	// 		const isCollapsed = clientHeight - closedHeight < 1e-2;
	//
	// 		element.style.height = (isCollapsed ? scrollHeight : closedHeight) + 'px';
	//
	// 		// if(noHeightSet)
	// 		// {
	// 		// 	return slidetoggle.call(this);
	// 		// }
	// 	}
	// };

	$.Content.prototype.articleSlideToggle = function(article, closedHeight = 0)
	{
		if(!article.style.height)
		{
			article.style.height = closedHeight;
		}

		const clientHeight = article.clientHeight;
		const scrollHeight = article.scrollHeight;
		const isCollapsed = clientHeight - closedHeight < 1e-2;

		article.style.height = (isCollapsed ? scrollHeight : closedHeight) + 'px';

		// if(noHeightSet)
		// {
		// 	return slidetoggle.call(this);
		// }
	};

	document.querySelectorAll("[data-slidetoggle]").forEach(el => el.addEventListener('click', slidetoggle))

	$.Content.prototype.checkArticleToggle = function(input, labelText, articleContents)
	{
		// if( $(this).prop('checked') )
		if(input.checked)
		{
			// let targets = document.querySelectorAll(input.dataset.targetSelector));
			this.articleSlideToggle(articleContents, $.articleClosedHeight);

			// $article_content.animate(
			// 	{
			// 		height: autoHeight
			// 	},
			// 	{
			// 		duration: $.articleAnimationDurationMs,
			// 		complete: function()
			// 		{
			// 			$article_content.height('auto');
			// 		},
			// 		step: function()
			// 		{
			// 			$(window).trigger('resize');
			// 		}
			// 	}
			// );

			let images = articleContents.querySelectorAll('img');

			for(let image of images)
			{
				// var $image = $(image);

				const currentHeight = image.innerHeight; //$image.height();
				const currentWidth = image.innerWidth; //$image.width();

				// console.debug('Image old width value: '+ $image.attr('width') );

				image.style.width = image.getAttribute('width');
				image.style.height = 'auto';

				// var outcomeImage = $image.css(
				// 	{
				// 		'width': $image.attr('width'),
				// 		'height': 'auto'
				// 	}
				// );

				const newHeight = image.innerHeight; //$image.height();
				const newWidth = image.innerWidth; //$image.width();


				// var outcomeHeight = outcomeImage.height();
				// var outcomeWidth = outcomeImage.width();


				// console.debug('Image width: '+ curWidth +' -> '+ outcomeWidth);
				// console.debug('Image height: '+ curHeight +' -> '+ outcomeHeight);


				// $image.height(curHeight).width(curWidth).animate(
				// 	{
				// 		height: outcomeHeight,
				// 		width: outcomeWidth
				// 	},
				// 	$.articleAnimationDurationMs
				// );
			}

			// $article_content.find('img').each(
			// 	function( index, image )
			// 	{
			//
			// 	}
			// );

			articleContents.classList.remove('closed');
			articleContents.classList.add('opened');

			labelText.nodeValue = 'Close article';
		}
		else
		{
			$article_content.animate(
				{
					height: $.closedArticleContentHeight+'px'
				},
				{
					duration: $.articleAnimationDurationMs,
					complete: function()
					{
						$article_content.height($.closedArticleContentHeight +'px');
					},
					step: function()
					{
						$(window).trigger('resize');
					}
				}
			);
	/*
			$article_content.find('img').each(
				function( index, image )
				{
					var $image = $(image);
					var newSizeTuple = CalculateAspectRatioFit($image.width(), $image.height(), 10000, 100);

					console.debug(newSizeTuple);

					$image.animate(
						{
							height: newSizeTuple.height +'px',
							width: newSizeTuple.width +'px'
						},
						1000
					);

					var curHeight = $image.height();
					var autoHeight = $image.css('height', 'auto').height();
					el.height(curHeight).animate({height: autoHeight}, 1000);
				}
			);
	*/

			$article_content.find('img').each(
				function( index, image )
				{
					var $image = $(image);

					var curHeight = $image.height();
					var curWidth = $image.width();

					var outcomeImage = $image.css(
						{
							'width': 'auto',
							'height': $.closedArticleContentHeight +'px'
						}
					);

					var outcomeHeight = outcomeImage.height();
					var outcomeWidth = outcomeImage.width();


					if(outcomeWidth != 0 && outcomeHeight != 0)
					{
						$image.height(curHeight).width(curWidth).animate(
							{
								height: outcomeHeight,
								width: outcomeWidth
							},
							$.articleAnimationDurationMs
						);
					}

					console.debug('Image width: '+ curWidth +' -> '+ outcomeWidth);
					console.debug('Image height: '+ curHeight +' -> '+ outcomeHeight);


				}
			);

			articleContents.classList.remove('opened');
			articleContents.classList.add('closed');

			labelText.nodeValue = 'Open full...';
		}
	};

} (project));
