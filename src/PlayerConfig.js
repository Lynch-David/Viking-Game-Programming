
// PlayerConfig object to hold our adjustable values
export const PlayerConfig = {
    maxSpeed: 100,
    acceleration: 10,
    deceleration: 10, // Updated to stop immediately
	iceAcceleration: 5,     
    iceDeceleration: 0.3,
	jumpPower: -500,
	gravity: 3000,
	maxFallSpeed: 400,
	maxJumpTime: 0.4,
	maxCoyoteTime: 0.1,
	maxJumpBuffer: 0.1,
	doubleJumpEnabled: false,
	skidThreshold: 100,
	slideFriction: 0.95,
	bounceVelocity: -200, // Upward velocity when bouncing off an enemy
	maxChargeJumpHeight: -600, 
    chargeTime: 1.0, 
};
