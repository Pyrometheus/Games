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

//   Boxes

function box(position, width, height){
	return {position: position, width: width, height: height};
}

function xInterval(box){
	return sortInterval(box.position.x, box.position.x + box.width);
}

function yInterval(box){
	return sortInterval(box.position.y, box.position.y + box.height);
}

//   Body

function body(box, velocity){
	return {box: box, velocity: velocity};
}

//   Collision Detection

function overlapPeriod(a, b, relativeVelocity){
	var start = (b.left - a.right) / relativeVelocity; //Don't worry about division by 0, Javascript handles this using the Infinity value. For example, 1/0 = Infinity and -1/0 = -Infinity.
	var stop = (b.right - a.left) / relativeVelocity;
	return sortInterval(start, stop);
}

function impactData(boxA, boxB, relativeVelocity){
	var xIntA = xInterval(boxA);
	var yIntA = yInterval(boxA);
	var xIntB = xInterval(boxB);
	var yIntB = yInterval(boxB);

	var xOverlapPeriod = overlapPeriod(xIntA, xIntB, relativeVelocity.x); //The period of time when the boxes overlap in the x-dimension.
	var yOverlapPeriod = overlapPeriod(yIntA, yIntB, relativeVelocity.y);

	if(!doesIntervalOverlap(xOverlapPeriod, yOverlapPeriod))
		return {time: -Infinity, side: 'left'};

	var boxOverlapPeriod = intervalOverlap(xOverlapPeriod, yOverlapPeriod);

	var side = impactSide(xOverlapPeriod, yOverlapPeriod, boxA.position, boxB.position);

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
				var impact = impactData(bodyI.box, bodyJ.box, sub(bodyI.velocity, bodyJ.velocity));
				if(impact.time >= 0 && impact.time <= remainingTime &&
					(collision === null || impact.time <= collision.time)){
					impact.bodyI = bodyI;
					impact.bodyJ = bodyJ;
					collision = impact;
				}
			}
		}

		if(collision === null)
			break;

		moveBodies(collision.time, bodies);
		onCollide(collision.bodyI, collision.bodyJ, collision.side);
	}
	moveBodies(remainingTime, bodies);
}

function moveBodies(timeStep, bodies){
	for(var body of bodies){
		body.box.position.x += timeStep * body.velocity.x;
		body.box.position.y += timeStep * body.velocity.y;
	}
}

oppositeSide = {left: 'right', right: 'left', up: 'down', down: 'up'};