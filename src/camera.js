function Camera($canvas, map, fov) {
	this.$canvas = $canvas;
	this.canvas = $canvas[0];
	this.ctx = this.canvas.getContext('2d');

	this.map = map;

	this.width = this.canvas.width;
	this.height = this.canvas.height;
	// this.fov = fov;
	this.fov = Math.PI / 180 * 60;
	this.halfFov = this.fov / 2;

	this.offset = 0;
	this.halfWidth = this.centerX = this.width / 2;
	this.halfHeight = this.centerY = this.height / 2;
	this.dist = this.halfWidth / Math.tan(this.halfFov);
	this.dirStep = this.fov / this.width;

}
Camera.prototype = {
	moveTo: function(x, y) {
		this.x = x;
		this.y = y;
	},
	setOffset: function(offset) {
		this.offset = offset;
		this.centerY = this.halfHeight + offset;
	},
	render: function(raycastResult) {
		this.clear();

		// var ctx = this.ctx,
		// 	// imageData = ctx.getImageData(0, 0, this.width, this.height),
		// 	floorHit, quota, cosV, sinV, floorTile,
		// 	textureIndex, screenIndex;


		var ctx = this.ctx, x = 0, y, rcr, hit, tile;

		for(; x < raycastResult.length; x++) {
			rcr = raycastResult[x];
			if(rcr.hit) {
				y = this.centerY - rcr.halfHeight;
				hit = rcr.hit;
				tile = hit.tile;

				// ctx.fillStyle = '#3f51b5';
				// ctx.fillStyle = 'rgba(0,0,0,0.1)';
				// ctx.fillRect(x, y, 1, height);
				ctx.drawImage(tile.texture.image, tile.texture.getX(hit.offset), 0, 1, tile.texture.height, x, y, 1, rcr.height);
				// ctx.fillStyle = 'rgba(0,0,0,' + dist / 150 + ')';
				// ctx.fillRect(x, y, 1, height);
			}
		}

		// $('#floor').height(this.halfHeight - this.offset);




		// for(var x = 0; x < this.width; x++) {
		// 	v = (entity.dir + offset) % (Math.PI * 2);

		// 	if((hit = raycast(entity, v, map))) {
		// 		tile = hit.tile;
		// 		dist = hit.realDist(offset);
		// 		height = Math.floor(map.tileHeight / dist * this.dist);
		// 		halfHeight = Math.floor(height / 2);
		// 		y = this.centerY - halfHeight;

		// 		// ctx.fillStyle = '#3f51b5';
		// 		// ctx.fillStyle = 'rgba(0,0,0,0.1)';
		// 		// ctx.fillRect(x, y, 1, height);
		// 		ctx.drawImage(tile.texture.image, tile.texture.getX(hit.offset), 0, 1, tile.texture.height, x, y, 1, height);
		// 		// ctx.fillStyle = 'rgba(0,0,0,' + dist / 150 + ')';
		// 		// ctx.fillRect(x, y, 1, height);


		// 		// if(offset === 0) {
		// 			// y = this.centerY + halfHeight;
		// 			// quota = player.height * this.dist / Math.cos(offset);
		// 			// cosV = Math.cos(v);
		// 			// sinV = Math.sin(v);
					
		// 			// for(; y < this.height; y++) {
		// 			// 	if((floorHit = floorCast(y - (this.centerY), quota, cosV, sinV))) {
		// 			// 		floorTile = floorHit.tile;

		// 			// 		screenIndex = Texture.getPixelIndex(x, y, this.width);
		// 			// 		textureIndex = Texture.getPixelIndex(floorTile.texture.getX(floorHit.offsetX), floorTile.texture.getY(floorHit.offsetY), floorTile.texture.width);

		// 			// 		for(var i = 0; i < 4; i++) {
		// 			// 			imageData.data[screenIndex + i] = floorTile.texture.imageData.data[textureIndex + i];
		// 			// 		}

		
		// 			// 		// ctx.drawImage(floorTile.texture.image, floorTile.texture.getX(floorHit.offsetX), floorTile.texture.getY(floorHit.offsetY), 1, 1, x, y, 1, 1);
		// 			// 	}
		// 			// 	// canvases.minimap.render(function(ctx) {
		// 			// 	// 	ctx.strokeStyle = 'rgba(255,0,0,1)';
		// 			// 	// 	ctx.strokeStyle = 'rgba(255,0,0,0.1)';
		// 			// 	// 	ctx.beginPath();
		// 			// 	// 	ctx.moveTo(player.x * minimap.scale.xc, player.y * minimap.scale.y);
		// 			// 	// 	ctx.lineTo(player.x * minimap.scale.x + Math.cos(v) * 50, player.y * minimap.scale.y + Math.sin(v) * 50);
		// 			// 	// 	ctx.stroke();
		// 			// 	// });
		// 			// 	// canvases.minimap.render(function(ctx) {
		// 			// 	// 	var lel = 255 - Math.floor(floorHit.dist);
		// 			// 	// 	ctx.fillStyle = 'rgb(' + lel+','+lel+','+lel+')';
		// 			// 	// 	ctx.fillRect(floorHit.pos.x * minimap.scale.x - 3, floorHit.pos.y * minimap.scale.y, 6, 1);
		// 			// 	// });
		// 			// }
		// 		// }
		// 	}

		// 	offset += this.dirStep;
		// }

		// ctx.putImageData(imageData, 0, 0);

	},
	clear: function() {
		this.ctx.clearRect(0, 0, this.width, this.height);
	}
}