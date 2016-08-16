var surfaceFriction = 0.9

function bounce(body, other, side, restitution){
	var harmonicMean = 1 / (1/ body.mass + 1 / other.mass);
	if(side == 'left' || side == 'right')
	{
		var impulse = bounceImpulse(body.velocity.x, other.velocity.x, body.mass, other.mass, restitution, harmonicMean);
		body.velocity.x += impulse / body.mass;
		other.velocity.x += -impulse / other.mass;

		// impulse = frictionImpulse(body.velocity.y, other.velocity.y, body.mass, other.mass);
		// body.velocity.y += impulse / body.mass;
		// other.velocity.y -= impulse / other.mass;
		body.velocity.y += (surfaceFriction - 1) * body.velocity.y * harmonicMean / body.mass;
		other.velocity.y += (surfaceFriction - 1) * other.velocity.y * harmonicMean / other.mass;
	} else {
		var impulse = bounceImpulse(body.velocity.y, other.velocity.y, body.mass, other.mass, restitution, harmonicMean);
		body.velocity.y += impulse / body.mass;
		other.velocity.y += -impulse / other.mass;

		// impulse = frictionImpulse(body.velocity.x, other.velocity.x, body.mass, other.mass);
		// body.velocity.x += impulse / body.mass;
		// other.velocity.x -= impulse / other.mass;
		body.velocity.x += (surfaceFriction - 1) * body.velocity.x * harmonicMean / body.mass;
		other.velocity.x += (surfaceFriction - 1) * other.velocity.x * harmonicMean / other.mass;
	}
}

function bounceImpulse(velocity, otherVelocity, mass, otherMass, restitution, harmonicMean){
	return -(1 + restitution) * (velocity - otherVelocity) * harmonicMean;
}

function frictionImpulse(velocity, otherVelocity, mass, otherMass, harmonicMean){
	return (surfaceFriction - 1) * (velocity - otherVelocity) * harmonicMean;
}