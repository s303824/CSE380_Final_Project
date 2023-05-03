import { RatStates, RatAnimations } from "../RatController";
import RatState from "./RatState";

export default class Idle extends RatState {

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(RatAnimations.IDLE, true);
		this.parent.speed = this.parent.MIN_SPEED;

        this.parent.velocity.x = 0;
        this.parent.velocity.y = 0;
	}

	public update(deltaT: number): void {
        // Adjust the direction the player is facing
		super.update(deltaT);
		this.parent.velocity.y += this.gravity*deltaT; 

        // Get the direction of the player's movement
		let dir = this.parent.inputDir;

        // If the player is moving along the x-axis, transition to the walking state
		if (Math.abs(dir.x)){
			this.finished(RatStates.WALK);
		} 

		
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}