var canvas = document.getElementById("stars");
var context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var stars = [];
var horizon = new Horizon();
var starCount = 300;

setInterval(universe, 20);

generateStars(starCount);

function generateStars(count) {
	for (var i = 0; i < count; i++) {
		stars.push(new Star());
	}
}

function universe() {
	clearCanvas();
	for (var i = 0; i < stars.length; i++) {
		stars[i].update().draw();
	}
	horizon.draw();
	// drawArea();
}

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function clearCanvas() {
	context.fillStyle = "#000";
	context.fillRect(0,0,canvas.width,canvas.height);
}

function drawArea(){
	context.fillStyle = "rgba(100,255,200,0.03)";
	context.fillRect(0,horizon.y,canvas.width,canvas.height-horizon.y);
}

function Star() {
	this.x = randomBetween(0, canvas.width);
	this.y = randomBetween(0, canvas.height / horizon.div)
	// this.y = canvas.height / horizon.div;
	// var check = false;
	// for (var i = canvas.height / horizon.div; i > 0 && !check; i--) {
	// 	if (randomBetween(1,300) == 1) {
	// 		this.y = i;
	// 		check = !check;
	// 	}
	// }
	// if (this.y == canvas.height / horizon.div) {
	// 	this.y = randomBetween(0, canvas.height / horizon.div)
	// }

	this.radius = randomBetween(1, 3);

	this.test = this.radius;
	this.bool = false;
	this.speed = randomBetween(5, 10) * 0.05;

	this.r = randomBetween(50,255);
	this.g = randomBetween(50,255);
	this.b = randomBetween(255,255);

	this.auraRadius = 25 * this.radius;


	this.control = function() {
		if (this.x < 0) {
			this.x = canvas.width;
		};
		if (this.x > canvas.width) {
			this.x = 0;
		}
		if (this.y < 0) {
			this.y = canvas.height;
		}
		if (this.y > canvas.height - (canvas.height - horizon.y)) {
			this.y = 0;
		}
	}

	this.drawAura = function() {
		if (this.auraRadius + this.y > horizon.y) {
			this.auraRadius = horizon.y - this.y;
		}
		context.beginPath();
		context.arc(this.x, this.y, this.auraRadius, Math.PI * 2, false);
		context.fillStyle = "rgba("+this.r+","+this.g+","+this.b+",0.015)";
		context.fill();
	}

	this.drawCounterpart = function() {
		var test = (canvas.height/horizon.div) - this.y + horizon.y;
		if (test < canvas.height) {
			context.beginPath();
			context.arc(this.x, test, this.radius, Math.PI * 2, false);
			context.fillStyle = "rgba("+this.r+","+this.g+","+this.b+",0.3)";
			context.fill();

			context.beginPath();
			context.arc(this.x,test, this.auraRadius, Math.PI * 2, false);
			context.fillStyle = "rgba("+this.r+","+this.g+","+this.b+",0.01)";
			context.fill();
		}
	}

	this.update = function() {
		this.x -= this.speed;
		this.y += this.speed / 4;

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

function Horizon() {
	this.div = 1.5;
	this.y = canvas.height / this.div;

	this.draw = function() {
		context.beginPath();
		context.moveTo(0,this.y);
		context.lineTo(canvas.width,this.y);
		context.strokeStyle = "rgba(255,255,255,0.07)";
		context.stroke();
	}
}