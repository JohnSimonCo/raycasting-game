function MinimapCamera($canvas, minimap, map) {
	this.$canvas = $canvas;
	this.canvas = $canvas[0];
	this.ctx = this.canvas.getContext('2d');

	this.width = this.canvas.width;
	this.height = this.canvas.height;

	this.minimap = minimap;

	this.scaleX = this.width / map.width;
	this.scaleY = this.height / map.height;
}
MinimapCamera.prototype = {
	render: function() {
		var ctx = this.ctx, minimap = this.minimap;

		ctx.fillStyle = '#fff';
		this.clear();

		// canvases.minimap.render(function(ctx) {
		// 	ctx.strokeStyle = 'rgba(255,0,0,1)';
		// 	// ctx.strokeStyle = 'rgba(255,0,0,0.1)';
		// 	ctx.beginPath();
		// 	ctx.moveTo(player.x * minimap.scale.x, player.y * minimap.scale.y);
		// 	ctx.lineTo(player.x * minimap.scale.x + Math.cos(v) * 50, player.y * minimap.scale.y + Math.sin(v) * 50);
		// 	ctx.stroke();
		// });

		// canvases.minimap.render(function(ctx) {
		// 	// ctx.strokeStyle = 'rgba(0,0,0,1)';
		// 	ctx.strokeStyle = 'rgba(0,0,0,0.1)';
		// 	ctx.beginPath();
		// 	ctx.moveTo(hit.origin.x * minimap.scale.x, hit.origin.y * minimap.scale.y);
		// 	ctx.lineTo(hit.pos.x * minimap.scale.x, hit.pos.y * minimap.scale.y);
		// 	ctx.stroke();
		// });

		var x = 0, y, tile, pos;
		for(; x < minimap.tiles.length; x++) {
			for(y = 0; y < minimap.tiles[0].length; y++) {
				tile = minimap.tiles[y][x];
				if(tile) {
					pos = minimap.tilePos(x, y);	
					ctx.fillStyle = tile.color;
					ctx.fillRect(pos.x, pos.y, minimap.tileWidth, minimap.tileHeight);
				}
			}
		}

		ctx.fillStyle = "#f00";
		ctx.fillRect(player.x * this.scaleX - 2, player.y * this.scaleY - 2, 4, 4);
	},
	clear: function() {
		this.ctx.clearRect(0, 0, this.width, this.height);
	}
};