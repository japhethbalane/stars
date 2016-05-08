
////////////////////////////////////////////////////////////////

var canvas = document.getElementById("stars");
var context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

////////////////////////////////////////////////////////////////

var stars = [];
var steadystars = [];
var horizon = new Horizon();
var buildings = new Buildings();
var starCount = 400;
var universeSpeed = 5;

generateStars(starCount);
setInterval(universe, 20);

////////////////////////////////////////////////////////////////

function generateStars(count) {
	for (var i = 0; i < count; i++) {
		stars.push(new Star());
	}
	for (var i = 0; i < count*2; i++) {
		steadystars.push(new steadyStar());
	}
}

////////////////////////////////////////////////////////////////

function universe() {
	clearCanvas();
	for (var i = 0; i < steadystars.length; i++) {
		steadystars[i].draw();
	}
	for (var i = 0; i < stars.length; i++) {
		stars[i].update().draw();
	}
	// buildings.update().draw();
	horizon.draw();
}

////////////////////////////////////////////////////////////////

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function clearCanvas() {
	context.fillStyle = "#000";
	context.fillRect(0,0,canvas.width,canvas.height);
}

////////////////////////////////////////////////////////////////

function Star() {
	this.x = randomBetween(0, canvas.width);
	this.y = randomBetween(0, horizon.y)

	this.radius = randomBetween(1, 3);

	this.test = this.radius;
	this.bool = false;
	this.speed = (randomBetween(1, 20) + universeSpeed) * 0.01;

	this.r = randomBetween(50,255);
	this.g = randomBetween(50,255);
	this.b = randomBetween(255,255);

	this.radMlt = 50;
	this.auraRadius = this.radMlt * this.radius;
	this.originalAuraRadius = this.auraRadius;

	this.control = function() {
		if (this.x < 0) {
			this.x = canvas.width;
			this.auraRadius = this.radMlt * this.radius;
		};
		if (this.x > canvas.width) {
			this.x = 0;
			this.auraRadius = this.radMlt * this.radius;
		}
		if (this.y < 0) {
			this.y = canvas.height - (canvas.height - horizon.y);
			this.auraRadius = this.radMlt * this.radius;
		}
		if (this.y > canvas.height - (canvas.height - horizon.y)) {
			this.y = 0;
			this.auraRadius = this.radMlt * this.radius;
		}
	}

	this.checkAuraPosition = function() {
		if (this.auraRadius < this.originalAuraRadius) {
			this.auraRadius = this.originalAuraRadius;
		}

		if (this.y + this.auraRadius > horizon.y) {
			this.auraRadius = horizon.y - this.y;
		}
		if (this.y - this.auraRadius < 0) {
			this.auraRadius = this.y;
		}
		if (this.x + this.auraRadius > canvas.width) {
			this.auraRadius = canvas.width - this.x;
		}
		if (this.x - this.auraRadius < 0) {
			this.auraRadius = this.x;
		}		
	}

	this.update = function() {
		this.x -= this.speed;
		this.y += this.speed / 5;

		this.control();

		if (!this.bool && randomBetween(1,3) == 1) {
			this.radius -= 0.05;
		} else if (this.bool && randomBetween(1,3) == 1) {
			this.radius += 0.05;
		};
		if (this.radius <= 0.4) {
			this.bool = true;
		};
		if (this.radius >= this.test) {
			this.bool = false;
		};
		if (this.radius < 0) {
			this.radius = 0;
		};

		return this;
	}

	this.drawAura = function() {
		this.checkAuraPosition();
		context.beginPath();
		context.arc(this.x, this.y, this.auraRadius, Math.PI * 2, false);
		context.fillStyle = "rgba("+this.r+","+this.g+","+this.b+",0.01)";
		context.fill();
	}

	this.drawCounterpart = function() {
		var test = (horizon.y) - this.y + horizon.y;
		if (test < canvas.height) {
			context.beginPath();
			context.arc(this.x, test, this.radius, Math.PI * 2, false);
			context.fillStyle = "rgba("+this.r+","+this.g+","+this.b+",0.3)";
			context.fill();

			context.beginPath();
			context.arc(this.x,test, this.auraRadius, Math.PI * 2, false);
			context.fillStyle = "rgba("+this.r+","+this.g+","+this.b+",0.004)";
			context.fill();
		}
	}

	this.draw = function() {
		this.drawAura();
		this.drawCounterpart();

		context.beginPath();
		context.arc(this.x, this.y, this.radius, Math.PI * 2, false);
		context.fillStyle = "rgba("+this.r+","+this.g+","+this.b+",1)";
		context.fill();

		return this;
	}
}

function steadyStar() {
	this.x = randomBetween(0, canvas.width);
	this.y = randomBetween(0, horizon.y);
	this.radius = 0.8;
	this.r = randomBetween(50,255);
	this.g = randomBetween(50,255);
	this.b = randomBetween(255,255);
	this.blink = false;

	this.generateY = function() {
		for (var i = 0; i < horizon.y; i++) {
			if (1 == randomBetween(1, 150)) {
				this.y = i;
				break;
			}
		}
	}
	// this.generateY();

	this.drawCounterpart = function() {
		var test = (horizon.y) - this.y + horizon.y;
		if (test < canvas.height) {
			context.beginPath();
			context.arc(this.x, test, this.radius, Math.PI * 2, false);
			context.fillStyle = "rgba("+this.r+","+this.g+","+this.b+",0.3)";
			context.fill();
		}
	}

	this.draw = function() {
		this.drawCounterpart();
		context.beginPath();
		context.arc(this.x, this.y, this.radius, Math.PI * 2, false);
		context.fillStyle = "rgba("+this.r+","+this.g+","+this.b+",0.5)";
		context.fill();
	}
}

function Horizon() {
	this.div = 1.5;
	this.y = canvas.height / this.div;

	this.draw = function() {
		context.beginPath();
		context.moveTo(0,this.y);
		context.lineTo(canvas.width,this.y);
		context.strokeStyle = "rgba(255,255,255,0.08)";
		context.stroke();
	}
}

function House(a, test) {
	this.x = a;
	this.width = randomBetween(1,20);
	this.height = randomBetween(10,150);
	this.test = test;

	this.update = function() {
		// this.height += randomBetween(-1,2);
	}

	this.drawWindows = function() {

	}

	this.drawCounterpart = function() {
		context.beginPath();
		context.moveTo(this.x, horizon.y+this.test)
		context.lineTo(this.x, horizon.y+this.height);
		context.lineTo(this.x+this.width, horizon.y+this.height);
		context.strokeStyle = "rgba(255,255,255,0.1)";
		context.stroke();
	}

	this.draw = function() {
		context.beginPath();
		context.moveTo(this.x, horizon.y-this.test)
		context.lineTo(this.x, horizon.y-this.height);
		context.lineTo(this.x+this.width, horizon.y-this.height);
		context.strokeStyle = "rgba(255,255,255,0.1)";
		context.stroke();
	}
}

function Buildings() {
	this.houses = [];
	var test = 0;

	this.generateHouses = function() {
		for (var i = 0; i < canvas.width; ) {
			if (this.houses[this.houses.length-1] != undefined)
				test = this.houses[this.houses.length-1].height;
			this.houses.push(new House(i,test));
			i += this.houses[this.houses.length-1].width;
		}
	}
	this.generateHouses();

	this.update = function() {

		return this;
	}

	this.draw = function() {
		for (var i = 0; i < this.houses.length; i++) {
			// this.houses[i].update();
			this.houses[i].drawCounterpart()
			this.houses[i].draw();
		}
	}
}