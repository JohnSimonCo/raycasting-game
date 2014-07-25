var Math2 = {
	clamp: function(a, min, max) {
		return Math.min(Math.max(a, min), max)
	},
	//May be cause of errors in movement
	epsilon: 1
}