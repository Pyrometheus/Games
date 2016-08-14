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

function vclone(v){return vec(v.x, v.y);}

//   Colors

function rgb(r,g,b){
	return 'rgb(' + r + ',' + g + ',' + b + ')';
}

function hsl(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return rgb(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
}