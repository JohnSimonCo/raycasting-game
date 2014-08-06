function Vec2(x, y) {
	this.x = x;
	this.y = y;
}
Vec2.prototype = {
	subtract: function(other) {
		return new Vec2(this.x - other.x, this.y - other.y);
	},
	add: function(other) {
		return new Vec2(this.x + other.x, this.y + other.y);
	},
	scale: function(multiplyer) {
		return new Vec2(this.x * multiplyer, this.y * multiplyer);
	},
	length: function() {
		if(this._length) return this._length;
		return (this._length = Math.sqrt(this.lengthSqrt()));
	},
	lengthSqrt: function() {
		if(this._lengthSqrt) return this._lengthSqrt;
		return (this._lengthSqrt = this.x * this.x + this.y * this.y);
	},
	normalize: function() {
		var length = this.length();
		return new Vec2(this.x / length, this.y / length);
	},
	angle: function() {
		if(this._angle) return this._angle;
		return (this._angle = Math.atan(this.y / this.x));

	},
	dot: function(other) {
		return this.x * other.x + this.y * other.y;
	},
	lerp: function(target, step) {
		var xDist = Math.abs(this.x - target.x),
			yDist = Math.abs(this.y - target.y);

		if(xDist || yDist) {
			return new Vec2(
				xDist ? Math2.lerp(this.x, target.x, step / xDist) : this.x,
				yDist ? Math2.lerp(this.y, target.y, step / yDist) : this.y
			);
		} else {
			return this;
		}
	}
};

$.extend(Vec2, {
	fromAngle: function(angle) {
		return new Vec2(Math.cos(angle), Math.sin(angle));
	},
	ZERO: new Vec2(0, 0),
	UP: new Vec2(0, -1),
	DOWN: new Vec2(0, 1),
	RIGHT: new Vec2(1, 0),
	LEFT: new Vec2(-1, 0)
});