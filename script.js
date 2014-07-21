//http://www.permadi.com/tutorial/raycast/rayc9.html
//http://dev.opera.com/articles/3d-games-with-canvas-and-raycasting-part-1/
//http://www.benjoffe.com/script/canvascape/main.
//http://lodev.org/cgtutor/
//https://www.youtube.com/watch?v=-5nhdEDGaws

function Vec2(x, y) {
	this.x = x;
	this.y = y;
}

function Player(x, y) {
	Vec2.call(this, x, y);
	this.view = Math.PI / 180 * 90;
	this.speed = 1;
}
$.extend(Player.prototype, Vec2.prototype, {
	update: function(delta, time) {
		if(input.mouseDelta) {
			this.view += input.mouseDelta * 0.01;
			input.mouseDelta = 0;
		}

		if(input.rotate) {
			this.view += input.rotate * Math.PI / 180 * 5;
		}

		if(input.move || input.move === 0) {
			this.move((this.view + input.move) % (Math.PI * 2));
		}
		if(input.strafe || input.strafe === 0) {
			this.move((this.view + input.strafe) % (Math.PI * 2));
		}
	},
	move: function(angle) {
		var prevX = this.x;
		var prevY = this.y;
		var hit = rayCast(this, angle, map),
			speed = hit ? Math.min(this.speed, hit.dist() - Math2.epsilon) : this.speed;
		
		this.x += Math.cos(angle) * speed;
		this.y += Math.sin(angle) * speed;
	}
});

function Map(tiles, tileWidth, tileHeight) {
	this.tiles = tiles;
	this.tileWidth = tileWidth;
	this.tileHeight = tileHeight;
	this.width = tiles.length * tileWidth;
	this.height = tiles[0].length * tileHeight;
}
Map.prototype = {
	//eX and eY = point in entity coordinate-system 
	tileAt: function(eX, eY) {
		return (this.tiles[Math.floor(eY / this.tileHeight)] || {})[Math.floor(eX / this.tileWidth)];
	},
	//tX and tY = point in tile coordinate-system 
	getTile: function(tX, tY) {
		return this.tiles[tY][tX];
	},
	tilePos: function(tX, tY) {
		return new Vec2(tX * this.tileWidth, tY * this.tileHeight);
	},
	inBoundsX: function(eX) {
		return eX > 0 && eX < this.width;
	},
	inBoundsY: function(eY) {
		return eY > 0 && eY < this.height;
	},
	inBounds: function(eX, eY) {
		return this.inBoundsX(eX) && this.inBoundsY(eY);
	}
}
$.extend(Map, {
	convert: function(x, y, map1, map2) {
		var scale = map1 / map2;
		return new Vec2(scale * x, scale * y);
	}
});

function RayCastHit(origin, pos, v, tile, offset) {
	this.origin = origin;
	this.pos = pos;
	this.v = v;
	this.tile = tile;
	this.offset = offset;
}
RayCastHit.prototype = {
	render: function(ctx) {
		ctx.strokeStyle = 'rgba(0,0,0,0.1)';
		ctx.beginPath();
		ctx.moveTo(this.origin.x, this.origin.y);
		ctx.lineTo(this.pos.x, this.pos.y);
		ctx.stroke();
	},
	dist: function() {
		return (this._dist = this._dist ||
			Math.sqrt(
				Math.pow(this.origin.x - this.pos.x, 2) +
				Math.pow(this.origin.y - this.pos.y, 2)
			)
			// Math.abs((this.origin.x - this.pos.x) / Math.cos(this.v))
		);
	},
	realDist: function(offset) {
		return this.dist() * Math.cos(offset);
	}
}

var Math2 = {
	clamp: function(a, min, max) {
		return Math.min(Math.max(a, min), max)
	},
	//May be cause of errors in movement
	epsilon: 0.1
}

function Canvas(selector) {
	var $canvas = $(selector),
		canvas = $canvas[0],
		ctx = canvas.getContext('2d');

	this.$canvas = $canvas;
	this.canvas = canvas;
	this.ctx = ctx;
	this.render = function(fn) {
		fn(ctx, canvas, $canvas);
	}
}

var map = new Map([
	[1,1,1,1,1,1,1,1,1,1,1,1],
	[1,1,1,0,0,0,1,1,1,1,1,1],
	[1,1,0,0,0,0,1,0,0,1,1,1],
	[1,1,0,1,1,0,0,0,0,1,1,1],
	[1,1,0,0,0,0,0,0,1,1,1,1],
	[1,1,1,0,1,0,0,0,0,1,1,1],
	[1,1,0,0,0,0,0,0,0,1,1,1],
	[1,1,0,0,1,0,0,1,0,1,1,1],
	[1,1,1,1,1,1,0,1,0,0,1,1],
	[1,1,1,1,1,1,0,1,1,1,1,1],
	[1,1,1,1,1,0,0,1,1,1,1,1],
	[1,1,1,1,1,1,1,1,1,1,1,1],
],
16, 16);

var minimap = new Map(map.tiles, 10, 10);
// var minimap = new Map(map.tiles, 40, 40);

minimap.scale = {
	x: minimap.width / map.width,
	y: minimap.height / map.height
};

var player = new Player(
	map.tileWidth * map.tiles.length / 2,
	map.tileHeight * map.tiles[0].length / 2
);


var canvases = {
	game: new Canvas('#game'),
	minimap: new Canvas('#minimap')
}

var texture = $('.texture')[0];
var textureScale = texture.height / map.tileHeight;

var screen = {
	width: 800,
	height: 600,
	// width: 1280,
	// height: 800,
	fov: Math.PI / 180 * 60
}
screen.halfWidth =  screen.width / 2;
screen.halfHeight =  screen.height / 2;
screen.halfFov =  screen.fov / 2;
screen.dist = screen.halfWidth / Math.tan(screen.halfFov);
screen.viewStep = screen.fov / screen.width;

var inputManager = new InputManager({
	mousemove: {
		event: 'look'
	},
	keydown: {
		38: {
			event: 'move',
			data: 0
		},
		87: {
			event: 'move',
			data: 0
		},
		40: {
			event: 'move',
			data: Math.PI
		},
		83: {
			event: 'move',
			data: Math.PI
		},
		65: {
			event: 'strafe',
			data: Math.PI * 1.5
		},
		68: {
			event: 'strafe',
			data: Math.PI * 0.5
		},
		70: {
			event: 'fullscreen'
		},
		37: {
			event: 'rotate',
			data: -1
		},
		39: {
			event: 'rotate',
			data: 1
		}
	},
	keyup: {
		38: {
			event: 'stopMove',
		},
		87: {
			event: 'stopMove',
		},
		40: {
			event: 'stopMove',
		},
		83: {
			event: 'stopMove',
		},
		37: {
			event: 'stopMove',
		},
		65: {
			event: 'stopStrafe',
		},
		39: {
			event: 'stopMove',
		},
		68: {
			event: 'stopStrafe',
		},
		37: {
			event: 'stopRotate'
		},
		39: {
			event: 'stopRotate'
		}
	}
});

var input = {};
inputManager.on('rotate', function(data) {
	input.rotate = data;
});
inputManager.on('stopRotate', function(data) {
	input.rotate = null;
});
inputManager.on('move', function(data) {
	input.move = data;
});
inputManager.on('stopMove', function(data) {
	input.move = null;
});
inputManager.on('strafe', function(data) {
	input.strafe = data;
});
inputManager.on('stopStrafe', function(data) {
	input.strafe = null;
});
inputManager.on('stopMoveRightLeft', function(data) {
	input.moveRightLeft = null;
});
inputManager.on('fullscreen', function(data) {
	canvases.game.canvas.webkitRequestPointerLock();
	// canvases.game.canvas.webkitRequestFullscreen();
});
inputManager.on('look', function(data) {
	input.mouseDelta = data.originalEvent.webkitMovementX;
});

var lastTime;
function frame(time) {
	var delta = lastTime ? time - lastTime : 0;

	update(delta, time);

	lastTime = time;
	requestAnimationFrame(frame);
}

requestAnimationFrame(frame);

function update(delta, time) {
	player.update(delta, time);
	render();
}



function render() {
	canvases.game.render(function(ctx, canvas) {
		ctx.fillStyle = '#fff';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	});

	canvases.minimap.render(function(ctx, canvas) {
		ctx.fillStyle = '#fff';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.fillStyle = '#ccc';
		var x = 0, y, tile, pos;
		for(; x < map.tiles.length; x++) {
			for(y = 0; y < map.tiles[0].length; y++) {
				tile = map.tiles[y][x];
				if(tile) {
					pos = minimap.tilePos(x, y);	
					ctx.fillRect(pos.x, pos.y, minimap.tileWidth, minimap.tileHeight);
				}
			}
		}

		ctx.fillStyle = "#f00";
		ctx.fillRect(minimap.scale.x * player.x - 2, minimap.scale.y * player.y - 2, 4, 4);
	});

	var x = 0, offset, v;
	for(; x < screen.width; x++) {
		offset = -screen.halfFov + screen.viewStep * x;
		// offset = 0;
		v = (player.view + offset) % (Math.PI * 2);
		// canvases.minimap.render(function(ctx) {
		// 	ctx.strokeStyle = 'rgba(255,0,0,1)';
		// 	// ctx.strokeStyle = 'rgba(255,0,0,0.1)';
		// 	ctx.beginPath();
		// 	ctx.moveTo(player.x * minimap.scale.xc, player.y * minimap.scale.y);
		// 	ctx.lineTo(player.x * minimap.scale.x + Math.cos(v) * 50, player.y * minimap.scale.y + Math.sin(v) * 50);
		// 	ctx.stroke();
		// });
		if((hit = rayCast(player, v, map))) {
			canvases.minimap.render(function(ctx) {
				// ctx.strokeStyle = 'rgba(0,0,0,1)';
				ctx.strokeStyle = 'rgba(0,0,0,0.1)';
				ctx.beginPath();
				ctx.moveTo(hit.origin.x * minimap.scale.x, hit.origin.y * minimap.scale.y);
				ctx.lineTo(hit.pos.x * minimap.scale.x, hit.pos.y * minimap.scale.y);
				ctx.stroke();
			});
			canvases.game.render(function(ctx) {
				var dist = hit.realDist(offset),
					height = map.tileHeight / dist * screen.dist,
					position = screen.halfHeight - height / 2;

				ctx.fillStyle = '#3f51b5';
				// ctx.fillStyle = '#fff';
				// ctx.fillRect(x, position, 1, height);
				ctx.drawImage(texture, Math.floor(hit.offset * textureScale), 0, 1, texture.height, x, position, 1, height);
				// console.log(hit.offset);
				ctx.fillStyle = 'rgba(0,0,0,' + dist / 150 + ')';
				// ctx.fillRect(x, position, 1, height);
			});
		}
	}
}
function rayCast(origin, angle, map) {
	var tanV = Math.tan(angle),
		absV = Math.abs(angle),
		hitX = rayCastX(origin, angle, tanV, absV, map.tileHeight, map),
		hitY = rayCastY(origin, angle, tanV, absV, map.tileWidth, map);

	if(hitX || hitY) {
		return hitX && hitY
			? hitX.dist() < hitY.dist() ? hitX : hitY
			: hitX ? hitX : hitY;
	}
}
// function rayCast(origin, angle, map) {
// 	var tanV = Math.tan(angle),
// 		hitX = rayCastX(origin, angle, tanV, map.tileHeight, map);
// 		// hitY = rayCastY(origin, angle, tanV, map.tileWidth, map);

// 	// if(hitX || hitY) {
// 		// return hitX && hitY
// 			// ? hitX.dist() < hitY.dist() ? hitX : hitY
// 			// : hitX ? hitX : hitY;
// 	// }
// 	return hitX;
// }
// function rayCast(origin, angle, map) {
// 	var tanV = Math.tan(angle),
// 		// hitX = rayCastX(origin, angle, tanV, map.tileHeight, map);
// 		hitY = rayCastY(origin, angle, tanV, map.tileWidth, map);

// 	// if(hitX || hitY) {
// 		// return hitX && hitY
// 			// ? hitX.dist() < hitY.dist() ? hitX : hitY
// 			// : hitX ? hitX : hitY;
// 	// }
// 	return hitY;
// }

function rayCastX(o, v, tanV, absV, Ty, map) {
	var up = v < 0 && v > -Math.PI || v > Math.PI, tile, x, y, tileOffs = up ? 1 : 0;

	//Look for adjacent tile
	y = (up ? Math.floor : Math.ceil)(o.y / Ty) * Ty;

	x = o.x - (o.y - y) / tanV;

	//If it's out of bounds, return nothing
	// if(!map.inBounds(x, y)) return;

	tile = map.tileAt(x, y - tileOffs);
	debugHit(tile, x, y);

	//Return the hit if there's a wall there
	if(tile) return new RayCastHit(o, new Vec2(x, y), v, tile, x % Ty);

	//Calculate step in x- and y-axis
	var ya = up ? -Ty : Ty, xa = ya / tanV;

	//Check for hits within map
	while(map.inBounds((x += xa), (y += ya))) {
		tile = map.tileAt(x, y - tileOffs);
		debugHit(tile, x, y);
		//If a wall is found, return the hit
		if(tile) return new RayCastHit(o, new Vec2(x, y), v, tile, x % Ty);
	}
}

function rayCastY(o, v, tanV, absV, Tx, map) {
	var left = absV > Math.PI * 0.5 && absV < Math.PI * 1.5, tile, x, y, tileOffs = left ? 1 : 0;

	//Look for adjacent tile
	x = (left ? Math.floor : Math.ceil)(o.x / Tx) * Tx;

	y = o.y - (o.x - x) * tanV;

	//If it's out of bounds, return nothing
	// if(!map.inBounds(x, y)) return;

	tile = map.tileAt(x - tileOffs, y);
	debugHit(tile, x, y);

	//Return the hit if there's a wall there
	if(tile) return new RayCastHit(o, new Vec2(x, y), v, tile, y % Tx);

	//Calculate step in x- and y-axis
	var xa = left ? -Tx : Tx, ya = xa * tanV;

	//Check for hits within map
	while(map.inBounds((x += xa), (y += ya))) {
		tile = map.tileAt(x - tileOffs, y);
		debugHit(tile, x, y);
		
		//If a wall is found, return the hit
		if(tile) return new RayCastHit(o, new Vec2(x, y), v, tile, y % Tx);
	}
}

function debugHit(tile, x, y) {
	// canvases.minimap.render(function(ctx) {
	// 	ctx.fillStyle = tile ? '#0f0' : '#f00';
	// 	ctx.fillRect(x * minimap.scale.x - 2, y * minimap.scale.y - 2, 4, 4);
	// });
}
function debug(text) {
	$('#debug').text(text);
}