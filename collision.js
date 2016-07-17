//   Utils

function clamp(low, high, x){
	if(x < low)
		return low;
	if(x > high)
		return high;
	return x;
}

function within(low, high, x){
	return x >= low && x <= high;
}

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

function box(x, y, width, height){
	return {x: x, y: y, width: width, height: height};
}

function xInterval(box){
	return sortInterval(box.x, box.x + box.width);
}

function yInterval(box){
	return sortInterval(box.y, box.y + box.height);
}

//   Collision Detection

function overlapPeriod(a, b, relativeSpeed){
	var start = (b.left - a.right) / relativeSpeed; //Don't worry about division by 0, Javascript handles this cleanly using the Infinity value. For example, 1/0 = Infinity and -1/0 = -Infinity.
	var stop = (b.right - a.left) / relativeSpeed;
	return sortInterval(start, stop);
}

function impactData(boxA, boxB, relativeXSpeed, relativeYSpeed){
	var xIntA = xInterval(boxA);
	var yIntA = yInterval(boxA);
	var xIntB = xInterval(boxB);
	var yIntB = yInterval(boxB);

	var xOverlapPeriod = overlapPeriod(xIntA, xIntB, relativeXSpeed); //The period of time when the boxes overlap in the x-dimension.
	var yOverlapPeriod = overlapPeriod(yIntA, yIntB, relativeYSpeed);

	if(!doesIntervalOverlap(xOverlapPeriod, yOverlapPeriod))
		return {time: Infinity, side: 'left'};

	var boxOverlapPeriod = intervalOverlap(xOverlapPeriod, yOverlapPeriod);

	var side = impactSide(xOverlapPeriod, yOverlapPeriod, boxA.x - boxB.x, boxA.y - boxB.y);

	return {time: boxOverlapPeriod.left, side: side};
}

function impactSide(xOverlapPeriod, yOverlapPeriod, relativeX, relativeY){
	//If the x's overlap after the y's then the hit was on the left or right side.
	var isLeftOrRight = xOverlapPeriod.left > yOverlapPeriod.left;
	if(isLeftOrRight)
		return relativeX < 0 ? 'right' : 'left';
	return relativeY < 0 ? 'down' : 'up';
}