function Level() {

this.skyLimit = 1000;
this.depart = 3000;
this.currentLevel = -1;
this.missionAcomplished = true;


this.loadLvl0 = function() {
	this.currentLevel = 0;

	this.loadLvl(createWorld0());
	this.loadNextLevel = this.loadLvl1;
	player.reset(0, 0);
	this.missionAcomplished = true;
}

this.loadLvl1 = function() {
	this.currentLevel = 1;

	this.loadLvl(createWorld1());
	this.loadNextLevel = this.loadLvl2;
}

this.loadLvl2 = function() {

	this.currentLevel = 2;

	this.loadLvl(createWorld2());
	this.loadNextLevel = this.loadLvl3;
}

this.loadLvl3 = function() {

	this.currentLevel = 3;

	this.loadLvl(createWorld3());
	this.loadNextLevel = this.loadLvl4;
}

this.loadLvl4 = function() {

	this.currentLevel = 4;

	this.loadLvl(createWorld4());
	this.loadNextLevel = this.loadLvl5;
}

this.loadLvl5 = function() {

	this.currentLevel = 5;

	this.loadLvl(createWorld5());
	this.loadNextLevel = this.loadLvl6;
}

this.loadLvl6 = function() {

	this.currentLevel = 6;

	this.loadLvl(createWorld6());
	this.loadNextLevel = this.loadLvl7;
}

this.loadLvl7 = function() {

	this.currentLevel = 7;

	this.loadLvl(createWorld7());
	this.loadNextLevel = this.loadLvl8;
}

this.loadLvl8 = function() {

	this.currentLevel = 8;
	
	this.loadLvl(createWorld8());
	this.loadNextLevel = this.loadLvl9;
}

this.loadLvl9 = function() {

	this.currentLevel = 9;
	
	this.loadLvl(createWorld9());
	this.loadNextLevel = this.loadLvlEnd;
	//player.reset(0, -200);
	this.skyLimit = 3000;
}
this.loadLvl9_5 = function() {

	this.currentLevel = 9.5;
	
	this.loadLvl(createWorld9(true));
	this.loadNextLevel = this.loadLvlEnd;
	player.reset(0, -200);
	this.skyLimit = 3000;
}

this.loadLvl10 = function() {

	this.currentLevel = 10;
	
	this.loadLvl(createWorld10());
	this.loadNextLevel = this.loadLvlm1;
}

this.loadLvl = function(planet) {

	player.stability = 0;
	player.isDead = false;
	this.missionAcomplished = false;
	this.skyLimit = 1000;


	World.clear(engine.world);

	World.add(engine.world, player.body());
	World.add(engine.world, planet);

	player.reset(0, -this.depart - 400, Math.PI);
}

this.loadLvlEnd = function() {
	console.info("gg t'as fini le jeu");
	this.currentLevel = 10;
	
	this.loadLvl(createWorldEnd());
	//this.loadNextLevel = this.loadLvlm1;
}

this.loadNextLevel = this.loadLvl0;
this.loadCurrentLevel = this.loadLvl0;

this.nextLevel = function() {
	this.loadCurrentLevel = this.loadNextLevel;
	this.loadNextLevel();
}

this.resetLevel = function() {
	this.loadCurrentLevel();
}

/*this.nextLevel = function() {
	this.currentLevel++;
	player.stability = 0;
	this.missionAcomplished = false;
	if (this.currentLevel == 0)
		this.loadLvl0();
	else if (this.currentLevel == 1)
		this.loadLvl1();
	else if (this.currentLevel == 2)
		this.loadLvl2();
	else if (this.currentLevel == 3)
		this.loadLvl3();
	else if (this.currentLevel == 4)
		this.loadLvl4();
	else if (this.currentLevel == 5)
		this.loadLvl5();
	else if (this.currentLevel == 6)
		this.loadLvl6();
	else if (this.currentLevel == 7)
		this.loadLvl7();
	else if (this.currentLevel == 8)
		this.loadLvl8();
	else {
		console.error("Level indéfini");
		this.currentLevel--;
	}
	console.log("Mission: " + this.missionAcomplished);
}*/


}
