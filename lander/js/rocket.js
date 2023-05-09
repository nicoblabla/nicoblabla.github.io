function Car() {

	function createCar2() {
		var mainPart = Bodies.rectangle(0, 0, 30, 200, {
			frictionAir: 0.05,
		});
		var wingL = Bodies.rectangle(-30, 100, 20, 80, {
			frictionAir: 0.05,
			angle: 80 * Math.PI / 180
		});
		var wingR = Bodies.rectangle(30, 100, 20, 80, {
			frictionAir: 0.05,
			angle: -80 * Math.PI / 180
		});

		var wingBL = Bodies.rectangle(-70, 130, 20, 60, {
			frictionAir: 0.05,
			angle: 10 * Math.PI / 180
		});
		var wingBR = Bodies.rectangle(70, 130, 20, 60, {
			frictionAir: 0.05,
			angle: -10 * Math.PI / 180
		});
		var BodyCar = Body.create({
			parts: [mainPart, wingL, wingR, wingBL, wingBR],
			frictionAir: 0.05
		});
		return BodyCar;
	}
	function createCar() {
		var mainPart = Bodies.rectangle(0, 0, 15, 100, {
			render: {
				fillStyle: '#FFFFFF'
			},
			label: "Main part"
		});
		var wingL = Bodies.rectangle(-12, 50, 10, 40, {
			render: {
				fillStyle: '#E31337'
			},
			label: "Left wing",
		});
		var wingR = Bodies.rectangle(12, 50, 10, 40, {
			render: {
				fillStyle: '#E31337'
			},
			label: "Right wing",
		});
		var BodyCar = Body.create({
			parts: [mainPart, wingL, wingR],
			frictionAir: 0.005,
			friction: 0.01,
			collisionFilter: {
	            mask: 0x03
	        },
			label: "Main body"
		});
		return BodyCar;
	}

	this.fireL = Bodies.circle(0, 0, 10, {
		isSensor: true,
		isStatic: true,
		render: {
			sprite: {
				texture: 'fire.png',
				xScale: 0.1,
				yScale: 0.1
			},
			visible: false
		}
	});
	this.fireR = Bodies.circle(0, 0, 10, {
		isSensor: true,
		isStatic: true,
		render: {
			sprite: {
				texture: 'fire.png',
				xScale: 0.1,
				yScale: 0.1
			},
			visible: false
		}
	});

	this.body = function() {
		return [this.bod, this.fireL, this.fireR];
	}


	this.bod = createCar();
	console.log(this.bod);
	this.advancing = false;
	this.boostingL = 0;
	this.boostingR = 0;

	this.stability = 0;
	this.isDead = false;

	var acc = 0.004;
	var maxSpeed = 10;


	this.update = function() {


		var puissance = 0.0006;
		if (this.boostingL == 1 && this.boostingR == 1) {
			puissance /= 1.5;
		}

		var vel = {x: 0, y: 0};
		vel.x = Math.sin(this.bod.angle) * puissance;
		vel.y = -Math.cos(this.bod.angle) * puissance;


		var pos1 = {x: 0, y: 0};
		pos1.x = -Math.sin(this.bod.angle) * (60);
		pos1.y = Math.cos(this.bod.angle) * (60);

		var pos2 = {x: 0, y: 0};
		pos2.x = Math.cos(this.bod.angle) * (12);
		pos2.y = Math.sin(this.bod.angle) * (12);

		Matter.Body.setPosition(this.fireL, {x: this.bod.position.x + pos1.x - pos2.x, y: this.bod.position.y + pos1.y - pos2.y});
		Matter.Body.setPosition(this.fireR, {x: this.bod.position.x + pos1.x + pos2.x, y: this.bod.position.y + pos1.y + pos2.y});
		Matter.Body.setAngle(this.fireL, this.bod.angle);
		Matter.Body.setAngle(this.fireR, this.bod.angle);

		if (this.boostingL == 1) {
			Body.applyForce( this.bod, {x: this.bod.position.x + pos1.x - pos2.x, y: this.bod.position.y + pos1.y - pos2.y}, {x: vel.x, y: vel.y});
		}

		if (this.boostingR == 1) {
			Body.applyForce( this.bod, {x: this.bod.position.x + pos1.x + pos2.x, y: this.bod.position.y + pos1.y + pos2.y}, {x: vel.x, y: vel.y});
		}


		if (this.stability > 0 && this.stability < 100) {
			this.stability -= 2;
		}
	}

	this.reset = function(x, y, angle = 0) {
		Matter.Body.setPosition(this.bod, {x: x, y: y});
		Matter.Body.setVelocity(this.bod, {x: 0, y: 0});
		Matter.Body.setAngularVelocity(this.bod, 0);
		Matter.Body.setAngle(this.bod, angle);
	}
	this.gameOver = function(x, y, angle = 0) {
		//level.currentLevel--;

		this.isDead = true;

		var mainPart = Bodies.rectangle(0, 0, 15, 100, {
			render: {
				fillStyle: '#FFFFFF'
			},
			label: "Main part ded"
		});
		var wingL = Bodies.rectangle(-12, 50, 10, 40, {
			render: {
				fillStyle: '#E31337'
			},
			label: "Left wing ded",
		});
		var wingR = Bodies.rectangle(12, 50, 10, 40, {
			render: {
				fillStyle: '#E31337'
			},
			label: "Right wing ded",
		});



		World.add(engine.world, [mainPart, wingL, wingR]);

		Matter.Body.setPosition(mainPart, {x: this.bod.position.x, y: this.bod.position.y});
		Matter.Body.setPosition(wingL, {x: this.bod.position.x, y: this.bod.position.y});
		Matter.Body.setPosition(wingR, {x: this.bod.position.x, y: this.bod.position.y});
		Matter.Body.applyForce(mainPart, {x: mainPart.position.x + random(-20, 20), y: mainPart.position.y + random(-20, 20)}, {x: random(20,-20)/200, y: random(20,-20)/200});
		Matter.Body.applyForce(wingL, {x: wingL.position.x + random(-20, 20), y: wingL.position.y + random(-20, 20)}, {x: random(20,-20)/400, y: random(20,-20)/400});
		Matter.Body.applyForce(wingR, {x: wingR.position.x + random(-20, 20), y: wingR.position.y + random(-20, 20)}, {x: random(20,-20)/400, y: random(20,-20)/400});
		World.remove(engine.world, player.bod);
		World.remove(engine.world, player.fireL);
		World.remove(engine.world, player.fireR);

		//level.nextLevel();
	}
}
