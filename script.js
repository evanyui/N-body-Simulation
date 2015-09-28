
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
var PI = Math.PI;
var VLC_SCALE = 10;

//Event handlers NOT USED YET
//document.addEventListener("click", onClick);

//convert degree to radian *THIS IS NOT USED
function getRad(deg) {
  	return deg * PI/180;
}

//Convert radian to degree
function getDeg(rad) {
	return rad * 180/PI;
}

//Get sign according to angular graph, produce opposite Y sign because of PC screen Y axis is opposite
function getSign(value) {
	var signX = 0;
	var signY = 0;
	var signXY = [];

	//Cases for 4 different zone of angular graph to decide the sign of x and y components
	//NOTE: because computer screen starts with left top (0,0), 
 		//instead of table A,S,T,C , computer has -A,-S,S,A (0,-90,180,90)
 	//first zone
	if(value<=0 && value>=-90) {
		signX = 1;
		signY = -1;
		signXY.push({x:signX,y:signY});
	}
	//second zone
	else if(value<=-90 && value>=-180) {
		signX = -1;
		signY = -1;
		signXY.push({x:signX, y:signY});
	}
	//third zone
	else if(value>=90 && value<=180) {
		signX = -1;
		signY = 1;
		signXY.push({x:signX,y:signY});
	}
	//fourth zone
	else if(value>=0 && value<=90) {
		signX = 1;
		signY = 1;
		signXY.push({x:signX,y:signY});
	}

	return signXY[0];
}

//convert input into logical value
//NOT USED
function checkDegreeSign(degree) {
	if(degree >= 0) {
		return degree;
	}
	else {	//negative degree input
		return checkDegreeSign(360+degree);	//recursively subtract 360 until degree is within 360
	}
}

function createParticle(a0,b0,af,bf) {
	// var x0 = e.pageX;
 	// var y0 = e.pageY;

 	//Get origin coorinate x and y
 	var x0 = a0;
 	var y0 = b0;

 	//calculate difference from origin to destination
 	var da = (af - a0);			//x-axis
 	var db = (bf - b0);			//y-axis
 	//calculate degree and decide sign for direction
 	var degree = getDeg(Math.atan2(db,da));
 	var sign = getSign(degree);

 	var sFactor = Math.sqrt(Math.pow(w,2)+Math.pow(h,2));
 	//calculate velocity component x and y 
 	//note: the dragging length divided by the screen size decideds the speed
 	var va = ((Math.abs(af - a0)/sFactor)*VLC_SCALE) * sign.x;
 	var vb = ((Math.abs(bf - b0)/sFactor)*VLC_SCALE) * sign.y;

    //get size in radius, SIZE DECIDES COLOR
    var size = Number(document.getElementById("radius").value);

    //get ForceField radius, default = 0, max = infinity
    var radius = Number(document.getElementById("maxRadius").value);

    //get speed and radian, find velocity in x and y
    // var speed = Number(document.getElementById("speed").value);
    // var degree = checkDegreeSign(Number((document.getElementById("angle").value)))%360;
    // var sign = getSign(degree);
    //Converting speed and degree into x and y components, also check p or n sign of direction
    // da = Math.sqrt((Math.pow(speed,2))/(1+Math.pow(Math.tan(getRad(degree)),2)));
    // db = Math.sqrt(Math.pow(speed,2)-Math.pow(da,2));
    // da = da * sign.x;	//change of x 	default = original speed and direction(no acceleration)
    // db = db * sign.y;	//change of y

    //Save new particle data
    //Each particle has value of: x, y, dx, dy, size, forcefieldR, acceleration, gravity
    particles.push({x:x0, y:y0, dx:va, dy:vb, sz:size, r:radius});
}

//Create particles color depends on size
function colorParticle(sz) {
	if(sz<1) {
		return "#00ffff";
	}
	else if(sz<5) {
		return "#fff";
	}
	else if(sz<10) {
		return "#ffff00";
	}
	else if(sz<15) {
		return "#ffb400";
	}
	else if(sz<20) {
		return "#ffa000";
	}
	else { //sz>20
		return "#ff6400";
	}
}

//Draw on canvas
function drawParticles() {
	for(var i = 0; i < particles.length; i++) {
		//drawing the particles
		ctx.beginPath();
		ctx.arc(particles[i].x,particles[i].y,particles[i].sz,0,PI*2,false);
		ctx.closePath();
		ctx.fillStyle=colorParticle(particles[i].sz);
    	ctx.fill();

    	//drawing the force field of particle 
    	ctx.beginPath();
    	ctx.arc(particles[i].x,particles[i].y,particles[i].r,0,PI*2,false);
    	ctx.closePath();
    	ctx.strokeStyle="rgba(0,255,255,0.5)";
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
	//draw line when holding
	if(hold) {
		drawVector();
	}
}

//Event Listener coded on CSS to detect mouse moves
function trackMouse(e) {
	mouseX = e.pageX - canvas.offsetLeft;
    mouseY = e.pageY - canvas.offsetTop;
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

//variable to manipulate origin point to destination, and holding state of mouse
var a0, b0, a, b, hold = false;

//Upon holding down mouse click
function dragging(e) {
	a0 = e.pageX;
	b0 = e.pageY;
	hold = true;
}

//When release mouse click
function dropping(e) {
	a = e.pageX;
	b = e.pageY;
	hold = false;

	//Create particle
	createParticle(a0,b0,a,b);
}

function drawVector() {
	//drawing line to where the cursor is from dragging source point
	ctx.beginPath();
	ctx.moveTo(a0,b0);
	ctx.lineTo(mouseX,mouseY);
	ctx.strokeStyle="rgba(0,255,0,1)";
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



