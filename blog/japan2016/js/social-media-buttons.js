

function GetFacebookButton (url)
{
	$facebook_like_button_div = 
		$('<div />',
			{
				'class': 'fb-like',
	//			data-href: 'http://uttumi.github.io/blog/japan2016/',
				'data-width': '200',
				'data-layout': 'button_count',
				'data-show-faces': 'false',
				'data-share': 'false'
			}
		);

	$facebook_like_button_div.prop('data-href', url);

	return $facebook_like_button_div;
}