
////////////////////////////////////////////////////////////////

var canvas = document.getElementById("stars");
var context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

////////////////////////////////////////////////////////////////

var nearstars = [];
var midstars = [];
var farstars = [];
var darkspots = [];
var horizon = new Horizon();
var starCount = 400;
var universeSpeed = 5;
var mouseX = canvas.width/2, mouseY = canvas.height/2;
var meteor = null;

generateHeavenlyBodies(starCount);
setInterval(universe, 20);

////////////////////////////////////////////////////////////////

function generateHeavenlyBodies(count) {
	for (var i = 0; i < count; i++) {
		nearstars.push(new nearStar());
	}
	for (var i = 0; i < count*2; i++) {
		midstars.push(new midStar());
	}
	for (var i = 0; i < count*3; i++) {
		farstars.push(new farStar());
	}
	for (var i = 0; i < 50; i++) {
		darkspots.push(new DarkSpot());
	}
}

var trackMouse = function(event) {
    mouseX = event.pageX;
    mouseY = event.pageY;
}; canvas.addEventListener("mousemove", trackMouse);

function rotateMouse() {
	var x = -(mouseX-canvas.width/2)/1500;
	var y = -(mouseY-canvas.height/2)/1500;
	for (var i = 0; i < nearstars.length; i++) {
		nearstars[i].x += x;
	}
	for (var i = 0; i < midstars.length; i++) {
		midstars[i].x += x/1.5;
	}
	for (var i = 0; i < farstars.length; i++) {
		farstars[i].x += x/2;
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

function darkSpots() {
	for (var i = 0; i < darkspots.length; i++) {
		darkspots[i].update().draw();
	}
}

////////////////////////////////////////////////////////////////

function universe() {
	clearCanvas();
	rotateMouse();
	initMeteor();
	for (var i = 0; i < farstars.length; i++) {
		farstars[i].update().draw();
	}
	for (var i = 0; i < midstars.length; i++) {
		midstars[i].update().draw();
	}
	darkSpots();
	for (var i = 0; i < nearstars.length; i++) {
		nearstars[i].update().draw();
	}
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

function nearStar() {
	this.x = randomBetween(0, canvas.width);
	this.y = randomBetween(0, horizon.y)

	this.radius = randomBetween(1,3);

	this.test = this.radius;
	this.bool = false;
	this.speed = (randomBetween(1, 100) * universeSpeed) * 0.0001;

	this.r = randomBetween(50,255);
	this.g = randomBetween(50,255);
	this.b = randomBetween(255,255);

	this.radMlt = 50;
	this.auraRadius = 75;
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
		var test = (canvas.width/2-this.x)*0.00001;
		this.x+=test;
		this.y += test*2;

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
		context.fillStyle = "rgba("+this.r+","+this.g+","+this.b+",0.004)";
		context.fill();
	}

	this.drawCounterpart = function() {
		var test = (horizon.y) - this.y + horizon.y;
		if (test < canvas.height) {
			context.beginPath();
			context.arc(this.x, test, this.radius, Math.PI * 2, false);
			context.fillStyle = "rgba("+this.r+","+this.g+","+this.b+",0.5)";
			context.fill(); // star

			context.beginPath();
			context.arc(this.x,test, this.auraRadius, Math.PI * 2, false);
			context.fillStyle = "rgba("+this.r+","+this.g+","+this.b+",0.005)";
			context.fill(); // aura
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

function midStar() {
	this.x = randomBetween(0, canvas.width);
	this.y = randomBetween(0, horizon.y);
	this.radius = 0.7;
	this.r = randomBetween(50,255);
	this.g = randomBetween(50,255);
	this.b = randomBetween(255,255);
	this.blink = false;

	this.generateY = function() {
		for (var i = 0; i < horizon.y; i++) {
			if (1 == randomBetween(1,300)) {
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
			context.fillStyle = "rgba("+this.r+","+this.g+","+this.b+",0.7)";
			context.fill();
		}
	}

	this.update = function() {
		this.control();

		return this;
	}

	this.draw = function() {
		this.drawCounterpart();
		context.beginPath();
		context.arc(this.x, this.y, this.radius, Math.PI * 2, false);
		context.fillStyle = "rgba("+this.r+","+this.g+","+this.b+",1)";
		context.fill();
	}
}

function farStar() {
	this.x = randomBetween(0, canvas.width);
	this.y = randomBetween(0, horizon.y);
	this.radius = 0.45;
	this.r = randomBetween(50,255);
	this.g = randomBetween(50,255);
	this.b = randomBetween(255,255);

	this.generateY = function() {
		for (var i = 0; i < horizon.y; i++) {
			if (1 == randomBetween(1,150)) {
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
			context.fillStyle = "rgba("+this.r+","+this.g+","+this.b+",0.7)";
			context.fill();
		}
	}

	this.update = function() {
		this.control();

		return this;
	}

	this.draw = function() {
		this.drawCounterpart();
		context.beginPath();
		context.arc(this.x, this.y, this.radius, Math.PI * 2, false);
		context.fillStyle = "rgba("+this.r+","+this.g+","+this.b+",1)";
		context.fill();
	}
}

function Horizon() {
	this.div = 1.6;
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
	this.color = "white";
	this.ended = false;
	this.speed = randomBetween(20,50);
	//test1
	this.headx = randomBetween(300,canvas.width);
	this.heady = 0;
	this.tailx = this.headx;
	this.taily = 0;
	//test2
	// this.radius = 5;
	// this.angle = 180;

	this.pathTest1 = function() {
		if (this.heady < horizon.y-this.speed && !this.ended) {
			this.headx -= this.speed;
			this.heady += this.speed;
		}
		if (this.heady >= horizon.y - 300 && !this.ended) {
			this.tailx -= this.speed;
			this.taily += this.speed;
		}
		if (this.taily >= horizon.y-this.speed) {
			this.ended = true;
		}
	}

	this.pathTest2 = function() {
		this.angle--;
		var dx = Math.cos(this.angle * Math.PI / 180) * this.speed;
        var dy = Math.sin(this.angle * Math.PI / 180) * this.speed;
        this.x += dx;
        this.y += dy;
        if (this.y >= horizon.y) {
        	this.ended = true;
        }
	}

	this.update = function() {
		this.pathTest1();
		// this.pathTest2();
		return this;
	}

	this.draw = function() {
		context.strokeStyle = this.color;
		context.fillStyle = this.color;

		// // TEST1
		context.beginPath();
		context.strokeStyle = "rgba(255,255,255,0.5)";
		context.moveTo(this.headx,this.heady);
		context.lineTo(this.tailx,this.taily);
		context.stroke();
		context.beginPath();
		context.strokeStyle = "rgba(255,255,255,0.1)";
		context.moveTo(this.headx,horizon.y+(horizon.y-this.heady));
		context.lineTo(this.tailx,horizon.y+(horizon.y-this.taily));
		context.stroke(); // reflection

		// TEST2
		// context.beginPath();
		// context.arc(this.x,this.y,this.radius,Math.PI*2,false);
		// context.fill();
	}
}

function DarkSpot() {
	this.x = randomBetween(0,canvas.width);
	this.y = randomBetween(0,horizon.y);
	this.radius = randomBetween(50,100);

	this.update = function() {
		return this;
	}

	this.draw = function() {
		context.beginPath();
		context.arc(this.x, this.y, this.radius, Math.PI * 2, false);
		context.fillStyle = "rgba(0,0,0,0.5)";
		context.fill();
		// context.stroke();
	}
}