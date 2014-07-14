(function() {
	var $window = $(window);
	function scrollDirection(delta) {
		return delta < 0 ? 'down' : 'up';
	}
	
	InputEvent = function(event, data, prevent) {
		this.event = event;
		this.data = data;
		this.prevent = prevent;
	}
	InputManager = function(map) {
		this.map = map || {};
		this.listeners = {};

		var handler = this._handler.bind(this)
			weelHandler = this._weelHandler.bind(this),
			mouseMoveHandler = this._mouseMoveHandler.bind(this);
		
		$window.keydown(handler);
		$window.keyup(handler);
		$window.keypress(handler);
		$window.mousedown(handler);
		$window.mouseup(handler);
		// $window.scroll(scrollHandler);
		$window.mousemove(mouseMoveHandler);
		document.addEventListener('mousewheel', weelHandler);
	};
	InputManager.prototype = {
		_handler: function(e) {
			var map = this.map[e.type];
			if(map && map[e.which]) {
				var obj = map[e.which];
				this.emit(obj.event, obj.data);
				if(obj.prevent) e.preventDefault();
			}
		},
		_weelHandler: function(e) {
			var map = this.map.mousewheel,
				dir = scrollDirection(e.wheelDelta);
			if(map && map[dir]) {
				var obj = map[dir];
				this.emit(obj.event, obj.data);
				if(obj.prevent) e.preventDefault();
			}
		},
		_mouseMoveHandler: function(e) {
			var obj = this.map.mousemove;
			if(obj) {
				var data = {
					x: (e.layerX || e.layerX == 0) ? e.layerX : e.offsetX,
					y:  e.layerX ? e.layerY : e.offsetY,
					target: e.target
				};
				this.emit(obj.event, data);
			}
		},
		emit: function(event /*, data1, dataN*/) {
			var listeners = this.listeners, args = Array.prototype.slice.call(arguments, 1);
			if(listeners[event]) {
				listeners[event].forEach(function(callback) {
					callback.apply(callback, args);
				});
			}
		},
		on: function(event, callback) {
			var listeners = this.listeners;
			if(!listeners[event]) listeners[event] = [];
			listeners[event].push(callback);
		}
	};

	keyboardKeys = {
		left: 37,
		up: 38,
		right: 39,
		down: 40
	};

	mouseButtons = {
		left: 1,
		middle: 2,
		right: 3
	};
})()