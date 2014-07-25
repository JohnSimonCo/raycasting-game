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
	}
}