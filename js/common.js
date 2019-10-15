(function(self) {
	'use strict';
	var gtag, scr;

	scr = document.createElement('script');
	scr.src = 'https://www.googletagmanager.com/gtag/js?id=UA-150098986-1';

	document.head.appendChild(scr);

	self.dataLayer = self.dataLayer || [];
	gtag = function() { dataLayer.push(arguments); };
	gtag('js', new Date());

	gtag('config', 'UA-150098986-1');
})(this);