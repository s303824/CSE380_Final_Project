import { HumanStates, HumanAnimations } from "../HumanController";
import GooseState from "./HumanState";
import Input from "../../../Wolfie2D/Input/Input";
import { HW3Controls } from "../../HW3Controls";

export default class Idle extends GooseState {

	public onEnter(options: Record<string, any>): void {
        this.owner.animation.play(HumanAnimations.IDLE, true);
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
			this.finished(HumanStates.WALK);
		} 

		
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}