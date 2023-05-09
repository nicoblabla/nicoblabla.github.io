var worldColor = {
	"planet": "#2E2B44",
	"lava": "#AB1E0C",
	"planet2": "#AAA",
};

function createWorld(minLen, maxLen, maxAngle) {

	var path = '';

	var lastCoord = {x: 0, y: 1000};

	path = lastCoord.x + ',' + (lastCoord.y+1000) + ', ' + lastCoord.x + ',' + lastCoord.y;
	for (var i = 0; i < 100; i++) {
		var len = random(minLen, maxLen);
		var ang = random(-maxAngle, maxAngle);
		var newCoord = {
			x: lastCoord.x + len * Math.cos(ang),
			y: lastCoord.y + len * Math.sin(ang)
		};
		path += ', ' + newCoord.x + ',' + newCoord.y;
		lastCoord.x = newCoord.x;
		lastCoord.y = newCoord.y;
	}

	path += ', ' + (lastCoord.x+maxLen) + ',' + (1000);
	path += ', ' + (lastCoord.x+maxLen) + ',' + (2000);
	let vertices = Matter.Vertices.fromPath(path);

	planet1 = Bodies.fromVertices(0, 400, vertices, {isStatic: true, label: "planet"});
	planet2 = Bodies.fromVertices((planet1.bounds.max.x - planet1.bounds.min.x), 400, vertices, {isStatic: true, label: "planet"});
	planetWidth = planet1.bounds.max.x - planet1.bounds.min.x;
	return [planet1, planet2];
}

function createMontainWorld(minSlope, maxSlope, minHeight, maxHeight, minWidth, maxWidth) {
	var path = '';
	var lastCoord = {x: 0, y: 1000}
	path = lastCoord.x + ',' + (lastCoord.y+1000) + ', ' + lastCoord.x + ',' + lastCoord.y;
	for (var i = 0; i < 10; i++) {
		var len = random(minSlope, maxSlope);
		var height = random(minHeight, maxHeight);
		var platWidth = random(minWidth, maxWidth);
		path += ', ' + (lastCoord.x+len) + ',' + (lastCoord.y-height);
		if (platWidth > 0)
			path += ', ' + (lastCoord.x+len+platWidth) + ',' + (lastCoord.y-height);
		path += ', ' + (lastCoord.x+len+platWidth+len) + ',' + lastCoord.y;
		lastCoord.x = lastCoord.x+len+platWidth+len;
	}

	let vertices = Matter.Vertices.fromPath(path);

	planet1 = Bodies.fromVertices(0, 400, vertices, {isStatic: true, label: "planet"});
	planet2 = Bodies.fromVertices((planet1.bounds.max.x - planet1.bounds.min.x), 400, vertices, {isStatic: true, label: "planet"});
	planetWidth = planet1.bounds.max.x - planet1.bounds.min.x;
	return [planet1, planet2];
}

function createSlopeWorld(angle) {
	var path = '';

	var lastCoord = {x: 0, y: 1000};

	path = lastCoord.x + ',' + (lastCoord.y+1000) + ', ' + lastCoord.x + ',' + lastCoord.y;
	for (var i = 0; i < 10	; i++) {
		var tempX = lastCoord.x + 1000 * Math.cos(angle);
		var tempY = lastCoord.y - 1000 * Math.sin(angle);
		path += ', ' + tempX + ',' + tempY;
		path += ', ' + (tempX-100) + ',' + lastCoord.y;
		lastCoord.x = tempX;
	}

	path += ', ' + (lastCoord.x) + ',' + (2000);

	let vertices = Matter.Vertices.fromPath(path);



	planet1 = Bodies.fromVertices(0, 400, vertices, {isStatic: true, label: "planet"});
	planet2 = Bodies.fromVertices((planet1.bounds.max.x - planet1.bounds.min.x), 400, vertices, {isStatic: true, label: "planet"});
	planetWidth = planet1.bounds.max.x - planet1.bounds.min.x;
	return [planet1, planet2];
}

function createShapeWorld(coords) {
	var parts = [];
	var parts2 = [];
	for (var i = 0; i < coords.length; i++) {
		parts.push(Bodies.fromVertices(0, 0, coords[i].path, {label: coords[i].type, isStatic: true, render: {fillStyle: worldColor[coords[i].type]}}));
		
		Matter.Body.setPosition(parts[i], {x: coords[i].path[0].x - parts[i].bounds.min.x + parts[0].bounds.min.x, y: coords[i].path[0].y - parts[i].bounds.min.y});

		parts2.push(Bodies.fromVertices(0, 0, coords[i].path, {label: coords[i].type, isStatic: true, render: {fillStyle: worldColor[coords[i].type]}}));
		Matter.Body.setPosition(parts2[i], {x: coords[i].path[0].x - parts2[i].bounds.min.x + parts2[0].bounds.min.x, y: coords[i].path[0].y - parts2[i].bounds.min.y});
	}

	planet1 = Body.create({
		parts: parts,
		isStatic: true
	});

	planet2 = Body.create({
		parts: parts2,
		isStatic: true
	});
	planetWidth = (planet1.bounds.max.x - planet1.bounds.min.x);
	manageWorld0();
	return [planet1, planet2];
}


function createWorld0() {
	var bottomWall = Bodies.rectangle(0, 100, 100, 20, { isStatic: true });
	var supportR = Bodies.rectangle(115, 390, 20, 600, { isStatic: true, angle: -Math.PI / 12 });
	var supportL = Bodies.rectangle(-115, 390, 20, 600, { isStatic: true, angle: Math.PI / 12 });
	var planet = createWorld(10, 100, 50 * Math.PI / 180);
	return planet.concat([bottomWall, supportR, supportL]);
}

function createWorld1() {
	return createWorld(10, 100, 50 * Math.PI / 180);
}

function createWorld2() {
	return createWorld(10, 40, 60 * Math.PI / 180);
}

function createWorld3() {
	return createMontainWorld(50, 200, 300, 800, 20, 90);
}

function createWorld4() {
	return createMontainWorld(100, 200, 300, 800, 0, 0);
}

function createWorld5() {
	return createSlopeWorld(15 * Math.PI / 180);
}

function createWorld6() {
	var coords = [{"type":"lava","path":[{"x":0,"y":0},{"x":240,"y":0},{"x":240,"y":40},{"x":0,"y":40}]},{"type":"lava","path":[{"x":0,"y":40},{"x":40,"y":40},{"x":40,"y":600},{"x":0,"y":600}]},{"type":"lava","path":[{"x":40,"y":560},{"x":600,"y":560},{"x":600,"y":600},{"x":40,"y":600}]},{"type":"lava","path":[{"x":400,"y":0},{"x":400,"y":40},{"x":800,"y":40},{"x":800,"y":0}]},{"type":"lava","path":[{"x":740,"y":40},{"x":800,"y":40},{"x":800,"y":600},{"x":740,"y":600}]},{"type":"lava","path":[{"x":140,"y":260},{"x":740,"y":260},{"x":740,"y":280},{"x":140,"y":280}]},{"type":"planet","path":[{"x":580,"y":600},{"x":600,"y":580},{"x":700,"y":580},{"x":720,"y":600}]}];
	return createShapeWorld(coords);
}
function createWorld7() {
	var coords = [{"type":"planet2","path":[{"x":0,"y":180},{"x":280,"y":180},{"x":730,"y":600},{"x":0,"y":600}]},{"type":"planet2","path":[{"x":490,"y":180},{"x":910,"y":180},{"x":910,"y":600}]},{"type":"planet","path":[{"x":0,"y":1480},{"x":910,"y":1480},{"x":910,"y":1900},{"x":0,"y":1900}]}];
	return createShapeWorld(coords);

	//[{"type":"planet","path":[{"x":280,"y":160},{"x":300,"y":160},{"x":300,"y":200},{"x":280,"y":200}]},{"type":"planet","path":[{"x":260,"y":200},{"x":320,"y":200},{"x":320,"y":240},{"x":260,"y":240}]}];
}

function createWorld8() {
	var coords = [{"type":"lava","path":[{"x":0,"y":580},{"x":1000,"y":580},{"x":1000,"y":1600},{"x":0,"y":1600}]},{"type":"planet","path":[{"x":270,"y":200},{"x":310,"y":200},{"x":310,"y":580},{"x":270,"y":580}]},{"type":"planet2","path":[{"x":284,"y":183},{"x":296,"y":183},{"x":296,"y":200},{"x":284,"y":200}]}];
	return createShapeWorld(coords);
}

function createWorld9(isALazyCheater = false) {
	if (isALazyCheater == true) {
		var p1 = createWorld(50, 60, 0);
	} else {
		var p1 = createWorld(3, 20, 60 * Math.PI / 180);
	}
		

	planet1.nextAsteorid = 10;

	planet1.updatePlanet = function() {
		if (level.missionAcomplished) {
			planet1.nextAsteorid--;
			if (planet1.nextAsteorid <= 0) {
				createAsteorid();
				planet1.nextAsteorid = random(0, 30);
			}
		}


		function createAsteorid() {
			var m = 0;
			var vertices = [];
			var rayon = random(20, 40);
			var posX = gaussianRandom(render.bounds.min.x-100, render.bounds.max.x+100) + player.bod.velocity.x * 50;
			while(m < Math.PI * 2 - 0.3) {
				var noise = random(0.8, 1.2);
				vertices.push({x: Math.cos(m) * rayon * noise, y: Math.sin(m) * rayon * noise})
				m += random(0.5, 1);
			}

			var asteorid = Bodies.fromVertices(posX, render.bounds.min.y-80, vertices, {label: "asteorid", render: {fillStyle: '#ACACAC'}, friction: 0});
			Matter.Body.setMass(asteorid, 0.9);
			World.add(engine.world, asteorid);
		}
	}
	return p1;
}

function createWorld10() {
	var tourelle = [{"type":"planet","path":[{"x":0,"y":0},{"x":20,"y":0},{"x":40,"y":20},{"x":40,"y":40},{"x":20,"y":60},{"x":0,"y":60}]},{"type":"planet","path":[{"x":40,"y":25},{"x":65,"y":25},{"x":65,"y":35},{"x":40,"y":35}]}];
	var coords = [{"type":"planet","path":[{"x":0,"y":480},{"x":760,"y":480},{"x":780,"y":2000},{"x":0,"y":2000}]},{"type":"planet","path":[{"x":1140,"y":460},{"x":2000,"y":440},{"x":1980,"y":1980},{"x":1160,"y":2000}]},{"type":"planet","path":[{"x":460,"y":480},{"x":760,"y":480},{"x":760,"y":400}]},{"type":"planet","path":[{"x":1140,"y":400},{"x":1440,"y":460},{"x":1140,"y":460}]}];
	return null;
}

function createWorldEnd() {
	var coords = [{"type":"planet","path":[{"x":0,"y":520},{"x":1000,"y":520},{"x":1000,"y":1600},{"x":0,"y":1600}]},{"type":"planet","path":[{"x":460,"y":520},{"x":460,"y":440},{"x":560,"y":440},{"x":560,"y":520}]},{"type":"planet","path":[{"x":560,"y":380},{"x":660,"y":380},{"x":660,"y":520},{"x":560,"y":520}]},{"type":"planet","path":[{"x":660,"y":460},{"x":760,"y":460},{"x":760,"y":520},{"x":660,"y":520}]}];
	var p1 = createShapeWorld(coords);
	planet1.nextFireWork = 10;
	planet1.updatePlanet = function() {
		planet1.nextFireWork--;
		if (planet1.nextFireWork <= 0) {
			bg.createFireWorks(random(1, 4));
			planet1.nextFireWork = random(30, 50);
		}
	}
	return p1;
}

function random(min, max) {
	return Math.random() * (max-min) + min;
}
function gaussianRandom(min, max) {
  var rand = 0;

  for (var i = 0; i < 3; i += 1) {
    rand += Math.random();
  }

  return (rand / 3) * (max-min) + min;
}


function manageWorld() {
	var chunk = Math.round(player.bod.position.x / planetWidth);
	if (chunk % 2 == 0) {
		if (player.bod.position.x > chunk * planetWidth) {
			Matter.Body.setPosition(planet2, {x: (chunk + 1) * planetWidth, y: planet2.position.y});
		} else {
			Matter.Body.setPosition(planet2, {x: (chunk - 1) * planetWidth, y: planet2.position.y});
		}
	} else {
		if (player.bod.position.x > chunk * planetWidth) {
			Matter.Body.setPosition(planet1, {x: (chunk + 1) * planetWidth, y: planet1.position.y});
		} else {
			Matter.Body.setPosition(planet1, {x: (chunk - 1) * planetWidth, y: planet1.position.y});
		}
	}
}
function manageWorld0() {
	Matter.Body.setPosition(planet1, {x: 0 * planetWidth, y: planet1.position.y});
}
