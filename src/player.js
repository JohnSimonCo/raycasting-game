function Player(x, y) {
	this.pos = new Vec2(x, y);
	this.dir = Math.PI / 180 * 90;
	this.speed = 10;
	this.strafeSpeed = 5;
	this.lerpSpeed = 1;
	this.height = 32;
	this.velocity = Vec2.ZERO;
}
$.extend(Player.prototype, Vec2.prototype, {
	update: function(delta, time) {
		if(input.mouseDeltaX) {
			this.dir += input.mouseDeltaX * 0.04;
			input.mouseDeltaX = 0;
		}
		if(input.mouseDeltaY) {
			camera.setOffset(camera.offset - input.mouseDeltaY * 12);
			// this.height = Math2.clamp(this.height - input.mouseDeltaY, 0, 64);
			// this.look = this.height - 32;
			debug('height: ' + this.height + '\nlook: ' + this.look);
			input.mouseDeltaY = 0;
		}

		if(input.rotate) {
			this.dir += input.rotate * Math.PI / 180 * 5;
		}

		var moved = false;
		if(input.move || input.move === 0) {
			moved = true;
			this.targetVelocity = Vec2.fromAngle(this.dir + input.move).scale(this.speed);
		}
		if(input.strafe || input.strafe === 0) {
			moved = true;
			this.targetVelocity = Vec2.fromAngle(this.dir + input.strafe).scale(this.strafeSpeed);
		}
		if(!moved) {
			this.targetVelocity = Vec2.ZERO;
		}

		// this.velocity = this.velocity.lerp(this.targetVelocity, delta * this.lerpSpeed);
		this.velocity = this.targetVelocity;

		debug('velocity x:' + Math.round(this.velocity.x) + ' y: ' + Math.round(this.velocity.y) + '\n'
				+ 'targetVelocity x:' + Math.round(this.targetVelocity.x) + ' y: ' + Math.round(this.targetVelocity.y))

		this.pos = this.pos.add(this.velocity);
	},
	move: function(angle) {
		this.targetVelocity = Vec2.fromAngle(angle).scale(this.speed);
	}
});