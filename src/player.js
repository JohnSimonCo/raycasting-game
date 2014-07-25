function Player(x, y) {
	Vec2.call(this, x, y);
	this.dir = Math.PI / 180 * 90;
	this.speed = 10;
	this.height = 32;
}
$.extend(Player.prototype, Vec2.prototype, {
	update: function(delta, time) {
		if(input.mouseDeltaX) {
			this.dir += input.mouseDeltaX * 0.03;
			input.mouseDeltaX = 0;
		}
		if(input.mouseDeltaY) {
			playerCamera.setOffset(playerCamera.offset - input.mouseDeltaY * 5);
			// this.height = Math2.clamp(this.height - input.mouseDeltaY, 0, 64);
			// this.look = this.height - 32;
			debug('height: ' + this.height + '\nlook: ' + this.look);
			input.mouseDeltaY = 0;
		}

		if(input.rotate) {
			this.dir += input.rotate * Math.PI / 180 * 5;
		}

		if(input.move || input.move === 0) {
			this.move((this.dir + input.move) % (Math.PI * 2), delta);
		}
		if(input.strafe || input.strafe === 0) {
			this.move((this.dir + input.strafe) % (Math.PI * 2), delta);
		}
	},
	move: function(angle, delta) {
		var hit = rayCast(this, angle, map),
			speed = hit ? Math.min(this.speed * delta, hit.dist() - Math2.epsilon) : this.speed * delta;
		
		this.x += Math.cos(angle) * speed;
		this.y += Math.sin(angle) * speed;
	}
});