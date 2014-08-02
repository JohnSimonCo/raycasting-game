function Grid(tiles, tileWidth, tileHeight) {
	this.tiles = tiles;
	this.tileWidth = tileWidth;
	this.tileHeight = tileHeight;
	this.width = tiles.length * tileWidth;
	this.height = tiles[0].length * tileHeight;
}
Grid.prototype = {
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
	},
	raycast: function(origin, angle) {
		var tanV = Math.tan(angle),
			absV = Math.abs(angle),
			hitX = this._raycastX(origin, angle, tanV, absV),
			hitY = this._raycastY(origin, angle, tanV, absV);

		if(hitX || hitY) {
			return hitX && hitY
				? hitX.dist() < hitY.dist() ? hitX : hitY
				: hitX ? hitX : hitY;
		}
	},
	_raycastX: function(o, v, tanV, absV) {
		var up = v < 0 && v > -Math.PI || v > Math.PI, tile, x, y, tileOffs = up ? 1 : 0;

		//Look for adjacent tile
		y = (up ? Math.floor : Math.ceil)(o.y / this.tileHeight) * this.tileHeight;

		x = o.x - (o.y - y) / tanV;

		//If it's out of bounds, return nothing
		// if(!this.inBounds(x, y)) return;

		tile = this.tileAt(x, y - tileOffs);
		debugHit(tile, x, y);

		//Return the hit if there's a wall there
		if(tile) return new RaycastHit(o, new Vec2(x, y), v, tile, x % this.tileHeight);

		//Calculate step in x- and y-axis
		var ya = up ? -this.tileHeight : this.tileHeight, xa = ya / tanV;

		//Check for hits within map
		while(this.inBounds((x += xa), (y += ya))) {
			tile = this.tileAt(x, y - tileOffs);
			debugHit(tile, x, y);
			//If a wall is found, return the hit
			if(tile) return new RaycastHit(o, new Vec2(x, y), v, tile, x % this.tileWidth);
		}
	},
	_raycastY: function(o, v, tanV, absV) {
		var left = absV > Math.PI * 0.5 && absV < Math.PI * 1.5, tile, x, y, tileOffs = left ? 1 : 0;

		//Look for adjacent tile
		x = (left ? Math.floor : Math.ceil)(o.x / this.tileWidth) * this.tileWidth;

		y = o.y - (o.x - x) * tanV;

		//If it's out of bounds, return nothing
		// if(!this.inBounds(x, y)) return;

		tile = this.tileAt(x - tileOffs, y);
		debugHit(tile, x, y);

		//Return the hit if there's a wall there
		if(tile) return new RaycastHit(o, new Vec2(x, y), v, tile, y % this.tileWidth);

		//Calculate step in x- and y-axis
		var xa = left ? -this.tileWidth : this.tileWidth, ya = xa * tanV;

		//Check for hits within map
		while(this.inBounds((x += xa), (y += ya))) {
			tile = this.tileAt(x - tileOffs, y);
			debugHit(tile, x, y);
			
			//If a wall is found, return the hit
			if(tile) return new RaycastHit(o, new Vec2(x, y), v, tile, y % this.tileHeight);
		}
	}
}
function debugHit(tile, x, y) {
	// canvases.minimap.render(function(ctx) {
	// 	ctx.fillStyle = tile ? '#0f0' : '#f00';
	// 	ctx.fillRect(x * minimap.scale.x - 2, y * minimap.scale.y - 2, 4, 4);
	// });
}