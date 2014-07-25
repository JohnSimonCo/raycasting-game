function Texture(image, scaleWidth, scaleHeight) {
	this.image = image;
	this.width = image.width;
	this.height = image.height;

	this.scaleX = this.width / scaleWidth;
	this.scaleY = this.height / scaleHeight;
	
	this.canvas = document.createElement('canvas');
	this.canvas.width = this.width;
	this.canvas.height = this.height;
	this.ctx = this.canvas.getContext('2d');
	this.ctx.drawImage(image, 0, 0);
	this.imageData = this.ctx.getImageData(0, 0, this.width, this.height);
}
Texture.prototype = {
	getX: function(offset) {
		return Math.floor(offset * this.scaleX);
	},
	getY: function(offset) {
		return Math.floor(offset * this.scaleY);
	}
}

Texture.getPixelIndex = function(x, y, width) {
	return (y * width + x) * 4;
}