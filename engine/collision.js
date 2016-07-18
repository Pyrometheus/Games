//   Intervals

function interval(left, right){
	return {left: left, right: right};
}

function sortInterval(a, b){
	return interval(Math.min(a, b), Math.max(a, b));
}

function doesIntervalOverlap(a, b){
	return within(a.left, a.right, b.left) || within(a.left, a.right, b.right) 
	|| within(b.left, b.right, a.left) || within(b.left, b.right, a.right); 
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

				var impact = impactData(bodyI, bodyJ, sub(bodyI.velocity, bodyJ.velocity));
				if(impact.time >= 0 && impact.time <= remainingTime && (collision === null || impact.time <= collision.time)){
					if(impact.time == 0){
						moveBodies(-10, [bodyI, bodyJ]);
						break;
					}
					impact.body = bodyI;
					impact.other = bodyJ;
					collision = impact;
				}
			}
		}

		if(collision === null)
			break;

		moveBodies(collision.time, bodies);
		onCollide(collision.body, collision.other, collision.side);

		remainingTime -= collision.time;
	}
	moveBodies(remainingTime, bodies);
}

function moveBodies(timeStep, bodies){
	for(var body of bodies){
		body.position.x += timeStep * body.velocity.x;
		body.position.y += timeStep * body.velocity.y;
	}
}

oppositeSide = {left: 'right', right: 'left', up: 'down', down: 'up'};