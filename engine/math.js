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

//   Vectors

function vec(x, y){return {x: x, y: y};}

function add(a, b){return {x: a.x + b.x, y: a.y + b.y};}
function sub(a, b){return {x: a.x - b.x, y: a.y - b.y};}

function mul(a, b){return {x: a.x * b, y: a.y * b};}
function div(a, b){return {x: a.x / b, y: a.y / b};}

function dot(a, b){return a.x * b.x + a.y * b.x;}
function cross(a, b){return a.x * b.y - a.y * b.x;}

function lenSquared(a){return a.x * a.x + a.y * a.y}
function length(a){return Math.sqrt(a.x * a.x + a.y * a.y);}
function normal(a){return div(a, length(a));}

function comp(a, b){return dot(a, b) / length(a);}
function proj(a, b){return mul(a, dot(a, b) / lenSquared(a));}