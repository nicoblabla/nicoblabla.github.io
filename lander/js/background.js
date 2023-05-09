function drawBackground() {
	var canvas = document.getElementById("bgCanvas");
	var ctx = canvas.getContext("2d");
	
	this.cam = {x: 0, y: 0};

	var stars = [];
	var fireworks = [];

	for (var i = 0; i < 100; i++) {
		stars.push(new Star(random(0, 1000), random(0, 1000)));
	}

	
	this.draw = function() {
		ctx.clearRect(0, 0, 800, 600);
		this.cam.x = render.bounds.min.x;
		this.cam.y = render.bounds.min.y;
		for (var i = 0; i < stars.length; i++) {
			ctx.fillStyle = "#FFF";
			ctx.beginPath();
			ctx.arc(mod(stars[i].posX - this.cam.x/1.5, 1000)-100, mod(stars[i].posY - this.cam.y/1.5, 1000)-100, 1, 0, 2 * Math.PI);
			ctx.fill();
		}


		for (var i = fireworks.length - 1; i >= 0; i--) {
			fireworks[i].update();
			fireworks[i].show(ctx, this.cam);

			if (fireworks[i].done()) {
				fireworks.splice(i, 1);
			}
		}
	}



	this.createFireWorks = function(nb = 1) {
		for (var i = 0; i < nb; i++) {
			fireworks.push(new Firework());
		}
	}
	

	
}

function Star(px, py) {
	this.posX = px;
	this.posY = py;
}
function mod(n, m) {
  return ((n % m) + m) % m;
}