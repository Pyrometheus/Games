//   Intervals

function interval(left, right){
	return {left: left, right: right};
}

function sortInterval(a, b){
	return interval(Math.min(a, b), Math.max(a, b));
}

function doesIntervalOverlap(a, b){
	return within(a.left, a.right, b.left) || within(b.left, b.right, a.left);
}

function intervalOverlap(a, b){
	var left = clamp(a.left, a.right, b.left);
	var right = clamp(a.left, a.right, b.right);
	return interval(left, right);
}

//   Body

function body(position, velocity, width, height){
	return {position: position, velocity: velocity, height: height, width: width};
}

function xInterval(body){
	return sortInterval(body.position.x, body.position.x + body.width);
}

function yInterval(body){
	return sortInterval(body.position.y, body.position.y + body.height);
}

function intersects(body, other){
	return doesIntervalOverlap(xInterval(body), xInterval(other)) && doesIntervalOverlap(yInterval(body), yInterval(other));
}

// function center(body){
// 	return vec(body.position.x + body.width / 2, body.position.y + body.height / 2);
// }

//   Collision Detection

function overlapPeriod(a, b, relativeVelocity){
	var start = (b.left - a.right) / relativeVelocity; //Don't worry about division by 0, Javascript handles this using the Infinity value. For example, 1/0 = Infinity and -1/0 = -Infinity.
	var stop = (b.right - a.left) / relativeVelocity;
	return sortInterval(start, stop);
}

function impactData(bodyA, bodyB, relativeVelocity){
	var xIntA = xInterval(bodyA);
	var yIntA = yInterval(bodyA);
	var xIntB = xInterval(bodyB);
	var yIntB = yInterval(bodyB);

	var xOverlapPeriod = overlapPeriod(xIntA, xIntB, relativeVelocity.x); //The period of time when the boxes overlap in the x-dimension.
	var yOverlapPeriod = overlapPeriod(yIntA, yIntB, relativeVelocity.y);

	if(!doesIntervalOverlap(xOverlapPeriod, yOverlapPeriod))
		return {time: -Infinity, side: 'left'};

	var boxOverlapPeriod = intervalOverlap(xOverlapPeriod, yOverlapPeriod);

	var side = impactSide(xOverlapPeriod, yOverlapPeriod, bodyA.position, bodyB.position);

	return {time: boxOverlapPeriod.left, side: side};
}

function impactSide(xOverlapPeriod, yOverlapPeriod, positionA, positionB){
	var relativePosition = sub(positionA, positionB);
	//If the x's overlap after the y's then the hit was on the left or right side.
	var isLeftOrRight = xOverlapPeriod.left > yOverlapPeriod.left;
	if(isLeftOrRight)
		return relativePosition.x < 0 ? 'right' : 'left';
	return relativePosition.y < 0 ? 'down' : 'up';
}

function runFor(timeStep, bodies, onCollide){ //This is still runs in O(n^2) per collision.
	var remainingTime = timeStep;
	while(true){

		var collision = null;
		for(var i = 0; i < bodies.length; i++){
			var bodyI = bodies[i];

			for(var j = 0;  j < i; j++){
				var bodyJ = bodies[j];
				var thisCollision = impactData(bodyI, bodyJ, sub(bodyI.velocity, bodyJ.velocity));

				if(thisCollision.time > -1 && thisCollision.time <= remainingTime && (collision === null || thisCollision.time <= collision.time)){
					thisCollision.body = bodyI;
					thisCollision.other = bodyJ;
					collision = thisCollision;
				}
			}
		}
		if(collision === null)
			break;

		moveBodies(collision.time, bodies);
		positionalCorrection(collision.body, collision.other, collision.side);
		onCollide(collision.body, collision.other, collision.side);

		remainingTime -= collision.time;
	}
	moveBodies(remainingTime, bodies);
}

var restVelocity = 0.01;
function moveBodies(timeStep, bodies){
	for(var body of bodies){
		if(Math.abs(body.velocity.y) < restVelocity)
			body.velocity.y = 0;
		body.position.x += timeStep * body.velocity.x;
		body.position.y += timeStep * body.velocity.y;
	}
}

//Positional correction. Corrects floating point errors, objects can often pass through eachother otherwise.

var skin = 0.0001;
function positionalCorrection(body, other, side){
	if(side == 'left' || side == 'right')
		return;
	correctVertical(body, other);
}

function correctVertical(body, other){
	var upper, lower;
	if(body.position.y < other.position.y){
		upper = body;
		lower = other;
	} else {
		upper = other;
		lower = body;
	}

	if(upper.mass > lower.mass)
		snapUp(upper, lower);
	else
		snapDown(upper, lower);
}

function snapDown(upper, lower){
	upper.position.y = lower.position.y - upper.height - skin;
}

function snapUp(upper, lower){
	lower.position.y = upper.position.y + upper.height + skin;
}

var oppositeSide = {left: 'right', right: 'left', up: 'down', down: 'up'};