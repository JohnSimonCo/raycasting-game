//http://www.permadi.com/tutorial/raycast/rayc9.html
//http://dev.opera.com/articles/3d-games-with-canvas-and-raycasting-part-1/
//http://www.benjoffe.com/script/canvascape/main.
//http://lodev.org/cgtutor/
//https://www.youtube.com/watch?v=-5nhdEDGaws
//http://www.playmycode.com/play/game/joe/raycaster
var wallImages = $('.wall-texture');

var wallTextures = [
	null,
	new Tile(new Texture(wallImages[0], 64, 64), '#000'),
	new Tile(new Texture(wallImages[1], 64, 64), '#555')
];

var wallTiles = [
	[1,1,1,1,1,1,1,1,1,1,1,1],
	[1,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,2,0,0,0,0,0,2,2,1],
	[1,0,0,2,0,2,2,2,0,0,0,1],
	[1,0,0,2,0,0,0,0,0,0,2,1],
	[1,0,0,0,0,0,0,0,0,0,2,1],
	[1,0,0,0,0,0,0,2,0,0,0,1],
	[1,0,0,0,2,0,0,0,0,0,0,1],
	[1,0,2,2,2,2,0,0,0,0,0,1],
	[1,0,0,2,0,0,2,0,0,2,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,1],
	[1,1,1,1,1,1,1,1,1,1,1,1]
]
.map(function(row) {
	return row.map(function(index) {
		return wallTextures[index];
	});
});

var map = new Grid(wallTiles, 64, 64);

var minimap = new Grid(map.tiles, 10, 10);
// var minimap = new Grid(map.tiles, 40, 40);

var floorImages = $('.floor-texture');

var floorTextures = [
	null,
	new Tile(new Texture(floorImages[0], 64, 64)),
	new Tile(new Texture(floorImages[1], 64, 64))
];

var floorTiles = [
	[0,0,0,0,0,0,0,0,0,0,0,0],
	[0,1,1,1,1,1,1,1,1,1,1,0],
	[0,1,1,0,1,1,1,1,1,0,0,0],
	[0,1,1,0,1,0,0,0,1,1,1,0],
	[0,1,1,0,1,1,1,1,1,1,0,0],
	[0,1,1,1,1,1,1,1,1,1,0,0],
	[0,2,2,2,2,2,2,0,2,2,2,0],
	[0,2,2,2,0,2,2,2,2,2,2,0],
	[0,2,0,0,0,0,2,2,2,2,2,0],
	[0,2,2,0,2,2,0,2,2,0,2,0],
	[0,2,2,2,2,2,2,2,2,2,2,0],
	[0,0,0,0,0,0,0,0,0,0,0,0]
]
.map(function(row) {
	return row.map(function(index) {
		return floorTextures[index];
	});
});

var floor = new Grid(floorTiles, 64, 64);

var player = new Player(
	map.tileWidth * map.tiles.length / 2,
	map.tileHeight * map.tiles[0].length / 2
);

var sprites = [
	new Vec2(player.pos.x - 10, player.pos.y - 10)
]

// var lights = [
// 	new Light(player.x, player.y, 0.5)
// ]

var camera = new Camera($('canvas#game'), map);

var minimapCamera = new MinimapCamera($('canvas#minimap'), minimap, map);

var lastTime;
function frame(time) {
	var delta = lastTime ? time - lastTime : 0;

	update(Math.min(delta / 100, 0.6), time);

	lastTime = time;
	requestAnimationFrame(frame);
}

setTimeout(function() {requestAnimationFrame(frame);}, 100);

function update(delta, time) {
	player.update(delta, time);
	render();
}

function render() {
	var raycastResults = raycast(camera, player, map);

	camera.render(raycastResults);
	minimapCamera.render(raycastResults);
}


function debug(text) {
	$('#debug').text(text);
}