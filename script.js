
////////////////////////////////////////////////////////////////

var canvas = document.getElementById("stars");
var context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

////////////////////////////////////////////////////////////////

var stars = [];
var steadystars = [];
var horizon = new Horizon();
var starCount = 400;
var universeSpeed = 5;
var mouseX = canvas.width/2, mouseY = canvas.height/2;
var meteor = null;

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

var trackMouse = function(event) {
    mouseX = event.pageX;
    mouseY = event.pageY;
}; canvas.addEventListener("mousemove", trackMouse);

function rotate() {
	var x = -(mouseX-canvas.width/2)/1000;
	var y = -(mouseY-canvas.height/2)/1000;
	for (var i = 0; i < stars.length; i++) {
		stars[i].x += x;
	}
	for (var i = 0; i < steadystars.length; i++) {
		steadystars[i].x += x/2;
	}
}

function initMeteor() {
	if (randomBetween(0,100) == 1 && meteor == null) {
		meteor = new Meteor();
	}
	if (meteor != null) {
		meteor.update().draw();
		if (meteor.ended) {
			meteor = null;
		}
	}
}

////////////////////////////////////////////////////////////////

function universe() {
	clearCanvas();
	// rotate();
	initMeteor();
	for (var i = 0; i < steadystars.length; i++) {
		steadystars[i].control();
		steadystars[i].draw();
	}
	for (var i = 0; i < stars.length; i++) {
		stars[i].update().draw();
	}
	horizon.draw();
	// console.log(meteor);
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

	this.radius = randomBetween(1,3);

	this.test = this.radius;
	this.bool = false;
	this.speed = (randomBetween(1, 10) * universeSpeed) * 0.001;

	this.r = randomBetween(50,255);
	this.g = randomBetween(50,255);
	this.b = randomBetween(255,255);

	this.radMlt = 50;
	this.auraRadius = 90;
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
		context.fillStyle = "rgba("+this.r+","+this.g+","+this.b+",0.0078)";
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
			if (1 == randomBetween(1, 200)) {
				this.y = i;
				break;
			}
		}
	}
	this.generateY();

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
	this.div = 1.4;
	this.y = canvas.height / this.div;

	this.draw = function() {
		context.beginPath();
		context.moveTo(0,this.y);
		context.lineTo(canvas.width,this.y);
		context.strokeStyle = "rgba(255,255,255,0.08)";
		context.stroke();
	}
}

function Meteor() {
	this.headx = randomBetween(0,canvas.width);
	this.heady = 0;
	this.tailx = this.headx;
	this.taily = 0;
	this.ended = false;

	this.update = function() {
		if (this.heady < horizon.y - 50 && !this.ended) {
			this.headx -= universeSpeed * 15;
			this.heady += universeSpeed * 15;
		}
		if (this.heady >= horizon.y - 50 && !this.ended) {
			this.tailx -= universeSpeed * 15;
			this.taily += universeSpeed * 15;
		}
		if (this.taily >= horizon.y - 50) {
			this.ended = true;
		}
		return this;
	}

	this.draw = function() {
		// context.shadowBlur = 10;
		// context.shadowColor = "red";
		context.beginPath();
		context.strokeStyle = "rgba(255,255,255,0.5)";
		context.moveTo(this.headx,this.heady);
		context.lineTo(this.tailx,this.taily);
		context.stroke();
		context.beginPath();
		context.strokeStyle = "rgba(255,255,255,0.2)";
		context.moveTo(this.headx,horizon.y+(horizon.y-this.heady));
		context.lineTo(this.tailx,horizon.y+(horizon.y-this.taily));
		context.stroke();
		context.beginPath();
		context.fillStyle = "rgba(255,255,255,1)";
		context.arc(this.headx,this.heady,1,Math.PI*2,false);
		context.fill();
	}
}