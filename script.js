
//Initializing canvas
var canvas = document.getElementById("canvas"),
		ctx = canvas.getContext("2d"),
		w = window.innerWidth,
		h = window.innerHeight;
canvas.height = h;
canvas.width = w;

//Variables
var particles = [];
var mouseX, mouseY;

//constants
var pi = Math.PI;

//Event handlers
document.addEventListener("click", onClick);

//convert degree to radian
function getRad(deg) {
  	return deg * Math.PI/180;
}

//Get sign according to angular graph, produce opposite Y sign because of PC screen Y axis is opposite
function getSign(value) {
	var signX = 0;
	var signY = 0;
	var signXY = [];

	//Cases for 4 different zone of angular graph to decide the sign of x and y components
	if(value<=90) {
		signX = 1;
		signY = -1;
		signXY.push({x:signX,y:signY});
	}
	else if(value<=180 && value>90) {
		signX = -1;
		signY = -1;
		signXY.push({x:signX, y:signY});
	}
	else if(value<=270 && value>180) {
		signX = -1;
		signY = 1;
		signXY.push({x:signX,y:signY});
	}
	else if(value<=360 && value > 270) {
		signX = 1;
		signY = 1;
		signXY.push({x:signX,y:signY});
	}

	return signXY[0];
}

//convert input into logical value
function checkDegreeSign(degree) {
	if(degree >= 0) {
		return degree;
	}
	else {	//negative degree input
		return checkDegreeSign(360+degree);	//recursively subtract 360 until degree is within 360
	}
}

//NEED TO MEASURE SPEED INTO PIXEL PER SECOND 
function onClick(e) {
	a = e.pageX;
    b = e.pageY;

    //get size in radius
    var size = Number(document.getElementById("radius").value);

    //get ForceField radius
    var radius = Number(document.getElementById("maxRadius").value);

    //get speed and radian, find velocity in x and y
    var speed = Number(document.getElementById("speed").value);
    var degree = checkDegreeSign(Number((document.getElementById("angle").value)))%360;
    var sign = getSign(degree);
    //Converting speed and degree into x and y components, also check p or n sign of direction
    da = Math.sqrt((Math.pow(speed,2))/(1+Math.pow(Math.tan(getRad(degree)),2)));
    db = Math.sqrt(Math.pow(speed,2)-Math.pow(da,2));
    da = da * sign.x;	//change of x 	default = original speed and direction(no acceleration)
    db = db * sign.y;	//change of y

    //Save new particle data
    //Each particle has value of: x, y, dx, dy, size, forcefieldR, acceleration, gravity
    particles.push({x:a, y:b, dx:da, dy:db, sz:size, r:radius});
}

//Draw on canvas
function drawParticles() {
	for(var i = 0; i < particles.length; i++) {
		//drawing the particles
		ctx.beginPath();
		ctx.arc(particles[i].x,particles[i].y,particles[i].sz,0,pi*2,false);
		ctx.closePath();
		ctx.fillStyle="#fff";
    	ctx.fill();

    	//drawing the force field of particle 
    	ctx.beginPath();
    	ctx.arc(particles[i].x,particles[i].y,particles[i].r,0,pi*2,false);
    	ctx.closePath();
    	ctx.strokeStyle="rgba(255,255,255,0.5)";
    	ctx.stroke();
	} 
}

//Render
function update() {
	//clear previous drawings
	ctx.clearRect(0,0,w,h);

	//make new drawings with new coordinates
	drawParticles();
	for(var i = 0; i < particles.length; i++) {
		particles[i].x+=particles[i].dx;
		particles[i].y+=particles[i].dy;
	}
	drawCross();
}

//Event Listener coded on CSS to detect mouse moves
function trackMouse(e) {
	mouseX=e.pageX - canvas.offsetLeft;
    mouseY=e.pageY - canvas.offsetTop;
}

//Drawing X Y ruler on cursor
function drawCross() {
    //draw vertical line
    ctx.beginPath();
    ctx.moveTo(mouseX, 0);
    ctx.lineTo(mouseX, canvas.height);
    ctx.strokeStyle="rgba(0,255,0,0.1)";
    ctx.stroke();
    //draw horizontol line
    ctx.moveTo(0, mouseY);
    ctx.lineTo(canvas.width, mouseY);
    ctx.strokeStyle="rgba(0,255,0,0.5)";
    ctx.stroke();
    ctx.closePath();
}

function clearCanvas() {
	//clear canvas
	ctx.clearRect(0,0,w,h);

	//clear particles data in array
	while(particles.length>0) {
		particles.pop();
	}
}

//Animation loop starts during initiliaze
function init() {
	//100 frames per sec
	setInterval(update, 1000/100);
}

//Initialize after content is loaded
document.addEventListener("DOMContentLoaded", function(event) { 
	init();
});



