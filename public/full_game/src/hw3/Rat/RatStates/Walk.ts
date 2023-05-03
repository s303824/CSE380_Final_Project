import { RatAnimations } from "../RatController";
import RatState from "./RatState";

export default class Walk extends RatState {

	onEnter(options: Record<string, any>): void {
		
		this.parent.speed = this.parent.MIN_SPEED;
        this.owner.animation.playIfNotAlready(RatAnimations.WALK, true);
	}

	update(deltaT: number): void {
        // Call the update method in the parent class - updates the direction the player is facing
        super.update(deltaT);

        // Get the input direction from the player controller

		let playerVec = this.parent.playerVec;
		this.parent.velocity.y += this.gravity*deltaT; 
		
		
			if(playerVec.x > this.owner.position.x){
				this.parent.velocity.x = (this.parent.speed);
		
			}else{
				this.parent.velocity.x = -(this.parent.speed);
		
			}
		
		// If we're walking left, flip the sprite
		this.owner.invertX = this.parent.velocity.x < 0;

		this.owner.move(this.parent.velocity.scaled(deltaT));
		
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}