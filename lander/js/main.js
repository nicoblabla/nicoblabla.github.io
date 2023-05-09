
// module aliases
var Engine = Matter.Engine,
	Render = Matter.Render,
	World = Matter.World,
	Body = Matter.Body,
	Events = Matter.Events,
	Bodies = Matter.Bodies,
	Runner = Matter.Runner,
	Composites = Matter.Composites,
	Common = Matter.Common,
	MouseConstraint = Matter.MouseConstraint,
	Mouse = Matter.Mouse;




// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
	element: document.getElementById("container"),
	engine: engine,
	options: {
		/*background: '#0f0f13',*/
		background: 'transparent',
		showAngleIndicator: false,
		wireframes: false,
	}
});


render.options.hasBounds = true


// create two boxes and a ground
var player = new Car();
var bg = new drawBackground();
var ui = new drawUI();
var level = new Level();
var planet1;
var planet2;
var planetWidth = 0;



// add all of the bodies to the world
engine.world.gravity.scale = 1;
engine.world.gravity.y = 0.0002;

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

Events.on(engine, "beforeTick", update);


Events.on(engine, 'collisionStart', function(event) {
	//console.log(Object.assign({}, event.pairs));
	for(key in event.pairs) {
		var pair = event.pairs[key];
		//console.log(pair);
		if (pair.bodyA.label == "Main part" || pair.bodyB.label == "Main part") {
			if (pair.bodyA.label == "planet" || pair.bodyB.label == "planet" || pair.bodyA.label == "lava" || pair.bodyB.label == "lava" || pair.bodyA.label == "planet2" || pair.bodyB.label == "planet2") {
				player.gameOver();
			}
		}
		if (pair.bodyA.label == "Left wing" || pair.bodyB.label == "Left wing" || pair.bodyA.label == "Right wing" || pair.bodyB.label == "Right wing") {
			if (pair.bodyA.label == "planet" || pair.bodyB.label == "planet" || pair.bodyA.label == "planet2" || pair.bodyB.label == "planet2") {
				//console.log(player.bod.velocity.y);
				if (player.bod.velocity.y > 4) {
					player.gameOver();
				}
			}
			if (pair.bodyA.label == "lava" || pair.bodyB.label == "lava") {
				player.gameOver();
			}
		}
	}
});

Events.on(engine, 'collisionActive', function(event) {
	var stableL = false;
	var stableR = false;
	for(key in event.pairs) {
		var pair = event.pairs[key];
		if (pair.bodyA.label == "planet" || pair.bodyB.label == "planet") {
			if (pair.bodyA.label == "Left wing" || pair.bodyB.label == "Left wing") {
				stableL = true;
			}
			if (pair.bodyA.label == "Right wing" || pair.bodyB.label == "Right wing") {
				stableR = true;
			}
		}
	}
	if (stableL && stableR) {
		if (player.stability < 100) {
			player.stability += 3;
		} else {
			player.stability = 100;
		}

		if (player.stability >= 100 && !level.missionAcomplished) {
			level.missionAcomplished = true;
			flagDrop();
		}
	}
});

function flagDrop() {
	var flag = Bodies.rectangle(player.bod.position.x + 30, player.bod.position.y + 15, 50, 50, {
		render: {
			sprite: {
				texture: 'flag.png',
				xScale: 0.2,
				yScale: 0.2,
				yOffset: 0.15
			},
		},
		collisionFilter: {
			category: 0x4
		},
		//isSensor: true,
		label: "flag"
	});
	World.add(engine.world, flag);
}


var initialEngineBoundsMaxX = render.bounds.max.x;
var initialEngineBoundsMaxY = render.bounds.max.y;



function update() {
	player.update();


	render.bounds.min.x = -400 + player.bod.bounds.min.x

	render.bounds.max.x = -400 + player.bod.bounds.min.x + initialEngineBoundsMaxX;

	if ((player.bod.bounds.min.y > -level.depart && !level.missionAcomplished) || player.bod.bounds.min.y > -level.skyLimit) {
		render.bounds.min.y = -300 + player.bod.bounds.min.y;
		render.bounds.max.y = -300 + player.bod.bounds.min.y + initialEngineBoundsMaxY;
	} else if (player.bod.bounds.max.y + 300 < -level.skyLimit && level.missionAcomplished) {
		level.nextLevel();
	} else {
		if (level.missionAcomplished) {
			render.bounds.min.y = -300 - level.skyLimit
			render.bounds.max.y = -300 - level.skyLimit + initialEngineBoundsMaxY
		} else {
			render.bounds.min.y = -300 - level.depart
			render.bounds.max.y = -300 - level.depart + initialEngineBoundsMaxY
		}
	}



	manageWorld();




	/*document.getElementById("info").innerHTML = "level: " + level.currentLevel +
												"<br> missionAcomplished: " + level.missionAcomplished +
												"<br> stability: " + player.stability+
												"<br> altitude: " + Math.round(player.bod.position.y);*/



	if (planet1.updatePlanet != undefined) {
		planet1.updatePlanet();
	}

	bg.draw();
	ui.draw();
}


if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	window.addEventListener('resize', resize, false);
	resize();

	document.body.addEventListener("touchstart", handleStart, { passive: false });
	document.body.addEventListener("touchend", handleEnd, { passive: false });
	window.scrollTo(0,1)
}

function handleStart(touchEvent) {
	if (player.isDead) {
		level.resetLevel();
	}
	for (var i = 0; i < touchEvent.touches.length; i++) {
		if (touchEvent.touches[i].clientY < 40) {
			level.loadCurrentLevel = level.loadLvl0;
			level.loadCurrentLevel();
		}
		if (touchEvent.touches[i].clientX > window.innerWidth / 2) {
			player.boostingR = 1;
			player.fireR.render.visible = true;
		} else {
			player.boostingL = 1;
			player.fireL.render.visible = true;
		}
	}
	touchEvent.preventDefault();
}
function handleEnd(touchEvent) {
	for (var i = 0; i < touchEvent.changedTouches.length; i++) {
		if (touchEvent.changedTouches[i].clientX > window.innerWidth / 2) {
			player.boostingR = 0;
			player.fireR.render.visible = false;
		} else {
			player.boostingL = 0;
			player.fireL.render.visible = false;
		}
	}
}

function resize() {

	var canvass = document.getElementsByTagName('canvas');
	for (var i = 0; i < canvass.length; i++) {
		var canvas = canvass[i];
		var canvasRatio = canvas.height / canvas.width;
		var windowRatio = window.innerHeight / window.innerWidth;
		var width;
		var height;

		if (windowRatio < canvasRatio) {
			height = window.innerHeight;
			width = height / canvasRatio;
		} else {
			width = window.innerWidth;
			height = width * canvasRatio;
		}

		canvas.style.width = width + 'px';
		canvas.style.height = height + 'px';
		canvas.style.margin = "auto";
		canvas.style.display = "block";
	}

};


document.body.onkeydown = function(event) {
	if (event.key == "w") {
		player.advancing = true;
	} else if (event.key == "d" || event.key == "ArrowRight") {
		player.boostingR = 1;
		player.fireR.render.visible = true;
	} else if (event.key == "a" || event.key == "ArrowLeft") {
		player.boostingL = 1;
		player.fireL.render.visible = true;
	} else if (event.key == "n") {
		level.nextLevel();
	} else if (event.key == "r") {
		level.resetLevel();
	} else if (event.key == " ") {
		level.resetLevel();
	} else if (event.key == "c") {
		if (level.currentLevel == 9) {
			level.loadCurrentLevel = level.loadLvl9_5;
			level.loadCurrentLevel();
		}
	}
}

document.body.ontouchstart = function(event) {
	//alert(JSON.parse(event));
}

document.body.onkeyup = function(event) {
	if (event.key == "w") {
		player.advancing = false;
	} else if (event.key == "d" || event.key == "ArrowRight") {
		player.boostingR = 0;
		player.fireR.render.visible = false;
	} else if (event.key == "a" || event.key == "ArrowLeft") {
		player.boostingL = 0;
		player.fireL.render.visible = false;
	}
}

level.nextLevel();
player.reset(0, 0);
//level.loadCurrentLevel = level.loadLvl1;
//level.loadCurrentLevel();


