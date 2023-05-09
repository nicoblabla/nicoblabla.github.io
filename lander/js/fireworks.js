// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/CKeyIbT3vXI

function Firework() {
	this.hu = Math.round(random(-100, 360));
	this.firework = new Particle(player.bod.position.x + random(-400, 400), 600, this.hu, true);
	this.exploded = false;
	this.particles = [];
	this.gravity = createVector(0,0.1);

	this.done = function() {
		if (this.exploded && this.particles.length === 0) {
			return true;
		} else {
			return false;
		}
	}

	this.update = function() {
		if (!this.exploded) {
			this.firework.applyForce(this.gravity);
			this.firework.update();
			if (this.firework.vel.y >= 0) {
				this.exploded = true;
				this.explode();
			}
		}
		
		for (var i = this.particles.length - 1; i >= 0; i--) {
			this.particles[i].applyForce(this.gravity);
			this.particles[i].update();
			
			if (this.particles[i].done()) {
				this.particles.splice(i, 1);
			}
		}
	}

	this.explode = function() {
		for (var i = 0; i < 100; i++) {
			var p = new Particle(this.firework.pos.x, this.firework.pos.y, this.hu, false);
			this.particles.push(p);
		}
	}

	this.show = function(context, cam) {
		if (!this.exploded) {
			this.firework.show(context, cam);
		}
		
		for (var i = 0; i < this.particles.length; i++) {
			this.particles[i].show(context, cam);
		}
	}
}

// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/CKeyIbT3vXI

function Particle(x, y, hu, firework) {
	this.pos = createVector(x, y);
	
	this.firework = firework;
	this.lifespan = 255;
	this.hu = hu;
	if (this.hu <= 0) {
		this.hu = Math.round(random(0, 360));
	}
	this.acc = createVector(0, 0);
	
	if (this.firework) {
		this.vel = createVector(0, random(-11, -7));
	} else {
		this.vel = createVector(0, 0);
		var rnd = random(0, 2 * Math.PI)
		this.vel.x = Math.cos(rnd);
		this.vel.y = Math.sin(rnd);
		rnd = random(2, 7);
		this.vel.x *= rnd;
		this.vel.y *= rnd;
		//this.vel.mult(random(2, 10));
	}
 
	this.applyForce = function(force) {
		this.acc.x += force.x;
		this.acc.y += force.y;
	}

	this.update = function() {
		if (!this.firework) {
			//this.vel.mult(0.9);
			this.vel.x *= 0.95;
			this.vel.y *= 0.95;
			this.lifespan -= 4;
		}
		
		this.vel.x += this.acc.x;
		this.vel.y += this.acc.y;
		this.pos.x += this.vel.x;
		this.pos.y += this.vel.y;
		this.acc.x = 0;
		this.acc.y = 0;
	}

	this.done = function() {
		if (this.lifespan < 0) {
			return true;
		} else {
			return false;
		}
	}

	this.show = function(context, cam) {
		//colorMode(HSB);
		
		if (!this.firework) {
			//strokeWeight(2);
			//stroke(hu, 255, 255, this.lifespan);
			//context.fillStyle = 'rgba(255, 165, 0, ' + this.lifespan / 255 + ')';
			context.fillStyle = 'hsl(' + this.hu + ', 100%, 50%, ' + Math.round(this.lifespan / 2.55)/100 + ')'
			context.beginPath();
			context.arc(this.pos.x - cam.x, this.pos.y - cam.y, 2, 0, 2 * Math.PI);
			context.fill();
		} else {
			//strokeWeight(4);
			//stroke(hu, 255, 255);
			context.fillStyle = 'hsl(' + this.hu + ', 100%, 50%, 1)'
			context.beginPath();
			context.arc(this.pos.x - cam.x, this.pos.y - cam.y, 4, 0, 2 * Math.PI);
			context.fill();
		}
	}
}

function createVector(px, py) {
	return {'x': px, 'y': py}
}