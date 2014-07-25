function FloorCastHit(dist, pos, tile, offsetX, offsetY) {
	this.dist = dist;
	this.pos = pos;
	this.tile = tile;
	this.offsetX = offsetX;
	this.offsetY = offsetY;
}
FloorCastHit.prototype = {
	realDist: function(offset) {
		return this.dist / Math.cos(offset);
	}
}