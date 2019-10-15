(function(self) {
	'use strict';
	var header, scrolled, prescroll;

	self.addEventListener('scroll', function() {
		document.documentElement.classList[(self.scrollY > self.innerHeight * 0.03)
			?
				'add' : 'remove'
		]('scrolled');
	}, false);

	self.addEventListener('DOMContentLoaded', function() {
		var genHeader;

		genHeader = function(id) {
			var ret, src;

			ret = document.createElement('embed');

			ret.id = id;
			ret.src = 'html/' + id + '.html';

			document.body.appendChild(ret);

			return ret;
		};

		header = genHeader('header');
	}, false);
})(this);