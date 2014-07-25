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
	// canvases.game.canvas.webkitRequestFullscreen();
	$('canvas#game')[0].webkitRequestPointerLock();
});
inputManager.on('look', function(data) {
	input.mouseDeltaX = data.originalEvent.webkitMovementX || data.originalEvent.mozMovementX;
	input.mouseDeltaY = data.originalEvent.webkitMovementY || data.originalEvent.mozMovementY;
});