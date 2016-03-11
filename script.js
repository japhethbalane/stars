var canvas = document.getElementById("stars");
var context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var stars = [];
var starCount = 500;

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
}

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function clearCanvas() {
	context.fillStyle = "#000";
	context.fillRect(0,0,canvas.width,canvas.height);
}

function Star() {
	this.x = randomBetween(0, canvas.width);
	this.y = randomBetween(0, canvas.height);
	this.radius = randomBetween(1, 3);

	this.test = this.radius;
	this.bool = false;
	this.speed = randomBetween(5, 10) * 0.1;

	this.r = randomBetween(50,255);
	this.g = randomBetween(50,255);
	this.b = randomBetween(255,255);

	this.update = function() {
		this.x -= this.speed;

		if (this.x < 0) {
			this.x = canvas.width;
		};

		if (!this.bool) {
			this.radius -= 0.05;
		};
		if (this.bool) {
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
		context.beginPath();
		context.arc(this.x, this.y, this.radius, Math.PI * 2, false);
		context.fillStyle = "rgba("+this.r+","+this.g+","+this.b+",1)";
		context.fill();

		return this;
	}
}