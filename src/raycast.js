function raycast(camera, entity, map) {
	var hits = [],
		offset = -camera.halfFov,
		v, hit, dist, height;

	for(var x = 0; x < camera.width; x++) {
		v = (entity.dir + offset) % (Math.PI * 2);

		if((hit = map.raycast(entity.pos, v, map))) {
			dist = hit.realDist(offset);
			height = Math.floor(map.tileHeight / dist * camera.dist);

			hits[x] = {
				hit: hit,
				dist: dist,
				height: height,
				halfHeight: height / 2
			};
		}

		offset += camera.dirStep;
	}

	return hits;
}