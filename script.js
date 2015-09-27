
//Initializing canvas
var canvas = document.getElementById("canvas"),
		ctx = canvas.getContext("2d"),
		w = window.innerWidth,
		h = window.innerHeight;

canvas.height = h;
canvas.width = w;

//Variables
var particles = [];

//constants

document.addEventListener("click", onClick);

function getRad(deg) {
  	return deg * Math.PI/180;
}

//Get sign according to angular graph, produce opposite Y sign because of PC screen Y axis is opposite
function getSign(value) {
	var signX = 0;
	var signY = 0;
	var signXY = [];

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

function checkDegreeSign(degree) {
	if(degree >= 0) {
		return degree;
	}
	else {	//negative degree input
		return checkDegreeSign(360+degree);	//recursively subtract 360 until degree is within 360
	}
}

function onClick(e) {
	a = e.pageX;
    b = e.pageY;

    var speed = Number(document.getElementById("speed").value);
    var degree = checkDegreeSign(Number((document.getElementById("angle").value)))%360;
    var sign = getSign(degree);

    da = Math.sqrt((Math.pow(speed,2))/(1+Math.pow(Math.tan(getRad(degree)),2)));
    db = Math.sqrt(Math.pow(speed,2)-Math.pow(da,2));
    da = da * sign.x;
    db = db * sign.y;
    console.log(sign.x);
    // da = -10;
    // db = -10;
    particles.push({x:a, y:b, dx:da, dy:db});
}

function drawParticles() {
	for(var i = 0; i < particles.length; i++) {
		ctx.beginPath();
		ctx.arc(particles[i].x,particles[i].y,10,0,Math.PI*2,false);
		ctx.closePath();
		ctx.fillStyle="#fff";
    	ctx.fill();
	} 
}

function update() {
	ctx.clearRect(0,0,w,h);
	drawParticles();
	for(var i = 0; i < particles.length; i++) {
		particles[i].x+=particles[i].dx;
		particles[i].y+=particles[i].dy;
	}
}

function init() {
	setInterval(update, 1000/60);
}

//Initialize after content is loaded
document.addEventListener("DOMContentLoaded", function(event) { 
	init();
});



