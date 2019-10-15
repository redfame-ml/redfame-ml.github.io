(function(self) {
	var Util, _;
	var canvas, context, draw, crGame;
	var games, items, index, temp, __;

	Util = {
		'distSq': function(p1, p2) {
			return (p2[0] - p1[0]) * (p2[0] - p1[0]) + (p2[1] - p1[1]) * (p2[1] - p1[1]);
		},
		'dist': function(p1, p2) {
			return Math.sqrt(this.distSq(p1, p2));
		}
	};

	games = {
		'breakout': {
			'state': null,
			'_state': { },
			'draw': function() {
				var x, y;

				context.fillStyle = '#008';
				context.fillRect(0, 0, canvas.width, canvas.height)
			},
			'tick': function() { },
			'init': function() { this.state = Object.assign({ }, this._state); }
		},
		'snake': {
			'state': null,
			'_state': {
				'map': Array(16 * 12),
				'food': null,
				'w': 21, 'h': 15,
				'snakepos': [ 10, 7 ],
				'snakepath': [ ],
				'snakevel': 0,
				'fid': 0,
				'points': 0
			},
			'draw': function() {
				var x, y, tW, tH, pos;

				tW = canvas.width / this.state.w;
				tH = canvas.height / this.state.h;

				context.fillStyle = '#000';
				context.fillRect(0, 0, canvas.width, canvas.height);

				context.fillStyle = '#bbb';
				for(x = 0; x < this.state.snakepath.length; ++x) 
					context.fillRect(this.state.snakepath[x][0] * tW, this.state.snakepath[x][1] * tH, tW, tH);

				context.fillStyle = '#eee';
				context.fillRect(this.state.snakepos[0] * tW, this.state.snakepos[1] * tH, tW, tH);

				if(this.state.food)
					context.fillStyle = '#200',
					context.fillRect((this.state.food[0] - 0.5) * tW, (this.state.food[1] - 0.5) * tH, tW * 2, tH * 2),
					context.fillStyle = '#900',
					context.fillRect((this.state.food[0]) * tW, (this.state.food[1]) * tH, tW, tH);

				context.fillStyle = '#999';
				context.font = (tH) + 'px Open Sans';
				context.fillText(this.state.points, tW, 2 * tH);
			},
			'tick': function() {
				if(this.state.fid === 'GAME_END') return;

				++this.state.fid;

				if(this.state.food === null) {
					this.state.food = [
						Math.floor(Math.random() * this.state.w),
						Math.floor(Math.random() * this.state.h)
					];
				}

				if(this.state.fid % 3 !== 0) return;

				if(__ !== null) {
					this.state.snakevel += 2 * ((__[0] > Number.parseInt(getComputedStyle(canvas).width) / 2) - 0.5);
					__ = null;
				}

				if(_ !== null) {
					if(_ === 37 || _ === 65)
						--this.state.snakevel;
					if(_ === 39 || _ === 68)
						++this.state.snakevel;
					_ = null;
				}

				if(this.state.snakepos[0] > this.state.w - 1) this.state.snakepos[0] = 0;
				if(this.state.snakepos[1] > this.state.h - 1) this.state.snakepos[1] = 0;
				if(this.state.snakepos[0] < 0) this.state.snakepos[0] = this.state.w - 1;
				if(this.state.snakepos[1] < 0) this.state.snakepos[1] = this.state.h - 1;

				this.state.snakepath.push(Object.assign([ ], this.state.snakepos));

				this.state.snakepos[0] += Math.round(Math.cos(this.state.snakevel * Math.PI / 2));
				this.state.snakepos[1] += Math.round(Math.sin(this.state.snakevel * Math.PI / 2));

				if(Util.distSq(this.state.snakepos, this.state.food) <= 1)
					++this.state.points, this.state.food = null;

				if(this.state.snakepath.length > this.state.points) {
					this.state.snakepath.splice(0, 1);
				}

				for(index = 0; index < this.state.snakepath.length; ++index) {
					if(Util.distSq(this.state.snakepath[index], this.state.snakepos) < 1) {
						this.state.fid = 'GAME_END';
						this.state.points += ' > GAME OVER';
					}
				}
			},
			'init': function() {
				this.state = JSON.parse(JSON.stringify(this._state));

				for(index = 0; index < this._state.map.length; ++index) {
					this.state.map[index] = 0;
				}
			}
		},
		'pong': {
			'state': null,
			'_state': { },
			'draw': function() {
				var x, y;

				context.fillStyle = '#800';
				context.fillRect(0, 0, canvas.width, canvas.height)
			},
			'tick': function() { },
			'init': function() { this.state = Object.assign({ }, this._state); }
		}
	};

	draw = function() {
		_draw: {
			if(typeof crGame === 'undefined')
				break _draw;

			games[crGame].tick();
			games[crGame].draw();
		}

		requestAnimationFrame(draw);
	};

	self.addEventListener('DOMContentLoaded', function() {
		items = document.querySelectorAll('li');

		for(index = 0; index < items.length; ++index) {
			temp = [ ];
			temp.push(items[index].id);
			temp.push(document.createElement('a'));

			temp[1].href = 'javascript:void "' + temp[0] + '";';
			temp[1].innerText = temp[0].charAt(0).toUpperCase() + temp[0].slice(1, temp[0].length);
			temp[1].onclick = function() {
				crGame = this.parentElement.id;
				games[crGame].init();
			};

			items[index].innerHTML = '';

			items[index].appendChild(temp[1]);
		}

		canvas = document.querySelector('canvas');
		context = canvas.getContext('2d');

		__ = null, _ = null;

		canvas.addEventListener('mousedown', function(e) {
			e.preventDefault();
			__=[e.pageX - canvas.getBoundingClientRect().left,
				e.pageY - canvas.getBoundingClientRect().top];
		}, false);
		canvas.addEventListener('touchstart', function(e) {
			e.preventDefault();
			__=[e.changedTouches[0].pageX - canvas.getBoundingClientRect().left,
				e.changedTouches[0].pageY - canvas.getBoundingClientRect().top];
		}, false);

		canvas.width = 640;
		canvas.height = 480;

		draw();
	});

	window.addEventListener('keydown', function(e) {
		//    w   s   a   d   w   s   a   d
		if([ 38, 40, 37, 39, 87, 83, 65, 68 ].includes(e.keyCode))
			e.preventDefault();
		_ = e.keyCode;
	});

	self.addEventListener('error', function(err) {
		alert(err.message + '\n\t' + err.lineno + '.' + err.colno);
	});
})(this);