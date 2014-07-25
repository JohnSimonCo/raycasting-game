function floorCast(angle, angleOffset, offset) {
	var dist = player.height * screen.dist / offset / Math.cos(angleOffset),
		x = player.x + Math.cos(angle) * dist,
		y = player.y + Math.sin(angle) * dist,
		tile = floor.tileAt(x, y);

	if(tile) {
		return new FloorCastHit(dist, new Vec2(x, y), tile, x % floor.tileWidth, y % floor.tileHeight);
	}
}
function floorCast(offset, quota, cosV, sinV) {
	var dist = quota / offset,
		x = player.x + cosV * dist,
		y = player.y + sinV * dist,
		tile = floor.tileAt(x, y);

	if(tile) {
		return new FloorCastHit(dist, new Vec2(x, y), tile, x % floor.tileWidth, y % floor.tileHeight);
	}
}