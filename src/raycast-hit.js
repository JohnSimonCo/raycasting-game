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