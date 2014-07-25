function rayCast(origin, angle, map) {
	var tanV = Math.tan(angle),
		absV = Math.abs(angle),
		hitX = rayCastX(origin, angle, tanV, absV, map),
		hitY = rayCastY(origin, angle, tanV, absV, map);

	if(hitX || hitY) {
		return hitX && hitY
			? hitX.dist() < hitY.dist() ? hitX : hitY
			: hitX ? hitX : hitY;
	}
}
// function rayCast(origin, angle, map) {
// 	var tanV = Math.tan(angle),
// 		hitX = rayCastX(origin, angle, tanV, map.tileHeight, map);
// 		// hitY = rayCastY(origin, angle, tanV, map.tileWidth, map);

// 	// if(hitX || hitY) {
// 		// return hitX && hitY
// 			// ? hitX.dist() < hitY.dist() ? hitX : hitY
// 			// : hitX ? hitX : hitY;
// 	// }
// 	return hitX;
// }
// function rayCast(origin, angle, map) {
// 	var tanV = Math.tan(angle),
// 		// hitX = rayCastX(origin, angle, tanV, map.tileHeight, map);
// 		hitY = rayCastY(origin, angle, tanV, map.tileWidth, map);

// 	// if(hitX || hitY) {
// 		// return hitX && hitY
// 			// ? hitX.dist() < hitY.dist() ? hitX : hitY
// 			// : hitX ? hitX : hitY;
// 	// }
// 	return hitY;
// }

function rayCastX(o, v, tanV, absV, map) {
	var up = v < 0 && v > -Math.PI || v > Math.PI, tile, x, y, tileOffs = up ? 1 : 0;

	//Look for adjacent tile
	y = (up ? Math.floor : Math.ceil)(o.y / map.tileHeight) * map.tileHeight;

	x = o.x - (o.y - y) / tanV;

	//If it's out of bounds, return nothing
	// if(!map.inBounds(x, y)) return;

	tile = map.tileAt(x, y - tileOffs);
	debugHit(tile, x, y);

	//Return the hit if there's a wall there
	if(tile) return new RayCastHit(o, new Vec2(x, y), v, tile, x % map.tileHeight);

	//Calculate step in x- and y-axis
	var ya = up ? -map.tileHeight : map.tileHeight, xa = ya / tanV;

	//Check for hits within map
	while(map.inBounds((x += xa), (y += ya))) {
		tile = map.tileAt(x, y - tileOffs);
		debugHit(tile, x, y);
		//If a wall is found, return the hit
		if(tile) return new RayCastHit(o, new Vec2(x, y), v, tile, x % map.tileWidth);
	}
}

function rayCastY(o, v, tanV, absV, map) {
	var left = absV > Math.PI * 0.5 && absV < Math.PI * 1.5, tile, x, y, tileOffs = left ? 1 : 0;

	//Look for adjacent tile
	x = (left ? Math.floor : Math.ceil)(o.x / map.tileWidth) * map.tileWidth;

	y = o.y - (o.x - x) * tanV;

	//If it's out of bounds, return nothing
	// if(!map.inBounds(x, y)) return;

	tile = map.tileAt(x - tileOffs, y);
	debugHit(tile, x, y);

	//Return the hit if there's a wall there
	if(tile) return new RayCastHit(o, new Vec2(x, y), v, tile, y % map.tileWidth);

	//Calculate step in x- and y-axis
	var xa = left ? -map.tileWidth : map.tileWidth, ya = xa * tanV;

	//Check for hits within map
	while(map.inBounds((x += xa), (y += ya))) {
		tile = map.tileAt(x - tileOffs, y);
		debugHit(tile, x, y);
		
		//If a wall is found, return the hit
		if(tile) return new RayCastHit(o, new Vec2(x, y), v, tile, y % map.tileHeight);
	}
}
function debugHit(tile, x, y) {
	// canvases.minimap.render(function(ctx) {
	// 	ctx.fillStyle = tile ? '#0f0' : '#f00';
	// 	ctx.fillRect(x * minimap.scale.x - 2, y * minimap.scale.y - 2, 4, 4);
	// });
}