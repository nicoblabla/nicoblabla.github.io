function drawUI() {
	var canvas = document.getElementById("uiCanvas");
	var ctx = canvas.getContext("2d");


	var previousLevel = -1;
	this.draw = function() {
		if (level.currentLevel != previousLevel) {
			ctx.clearRect(0, 0, 800, 600);
			ctx.fillStyle = "white";
			ctx.font = "30px Comic Sans MS";
			ctx.fillText("Level: " + level.currentLevel, 10, 50);
			previousLevel = level.currentLevel;
		}

		var posY = map(player.bod.position.y, level.missionAcomplished ? -level.skyLimit : -level.depart, 0, 0, 400-48, true);


		var stabY = map(player.stability, 0, 100, 0, 400, true);


		ctx.clearRect(750, 80, 30, 440)

		ctx.fillStyle = "#81D4FA";
		ctx.fillStyle = "#263238";
		ctx.fillRect(750, 100, 30, 400-stabY);

		ctx.fillStyle = "#A0FDB9";
		ctx.fillStyle = "#2E7D32";
		ctx.fillRect(750, 500-stabY, 30, stabY);



		ctx.fillStyle = "#FFF";
		ctx.fillRect(762, 100 + posY, 6, 40);
		ctx.fillStyle = "#E31337";
		ctx.fillRect(758, 100 + posY + 32, 4, 16);
		ctx.fillRect(768, 100 + posY + 32, 4, 16);
	}
}





function map(n, start1, stop1, start2, stop2, withinBounds) {
	var newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
	if (!withinBounds) {
		return newval;
	}
	if (start2 < stop2) {
		return constrain(newval, start2, stop2);
	} else {
		return constrain(newval, stop2, start2);
	}
}

function constrain(n, low, high) {
	return Math.max(Math.min(n, high), low);
}