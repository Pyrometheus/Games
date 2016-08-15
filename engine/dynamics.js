var surfaceFriction = 0.92;

function bounce(body, other, side, restitution){
	if(side == 'left' || side == 'right')
	{
		var impulse = bounceImpulse(body.velocity.x, other.velocity.x, body.mass, other.mass, restitution);
		body.velocity.x += impulse / body.mass;
		other.velocity.x += -impulse / other.mass;

		impulse = frictionImpulse(body.velocity.y, other.velocity.y, body.mass, other.mass);
		body.velocity.y += impulse / body.mass;
		other.velocity.y -= impulse / other.mass;
	} else {
		var impulse = bounceImpulse(body.velocity.y, other.velocity.y, body.mass, other.mass, restitution);
		body.velocity.y += impulse / body.mass;
		other.velocity.y += -impulse / other.mass;

		impulse = frictionImpulse(body.velocity.x, other.velocity.x, body.mass, other.mass);
		body.velocity.x += impulse / body.mass;
		other.velocity.x -= impulse / other.mass;
	}
}

function bounceImpulse(velocity, otherVelocity, mass, otherMass, restitution){
	return -(1 + restitution) * (velocity - otherVelocity) / (1/mass + 1/otherMass);
}

function frictionImpulse(velocity, otherVelocity, mass, otherMass){
	return (surfaceFriction - 1) * (velocity - otherVelocity) / (1/mass + 1/otherMass);
}