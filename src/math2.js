var Math2 = {
	clamp: function(a, min, max) {
		return Math.min(Math.max(a, min), max)
	},
	//May be cause of errors in movement
	epsilon: 1,
	lerp: function(current, target, step) {
		return current < target
			? Math.min(current + step, target)
			: Math.max(current - step, target);
	}
}