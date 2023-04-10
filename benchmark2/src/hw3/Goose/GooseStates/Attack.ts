import { GooseStates, GooseAnimations } from "../GooseController";
import Input from "../../../Wolfie2D/Input/Input";
import { HW3Controls } from "../../HW3Controls";
import PlayerState from "./GooseState";

export default class Walk extends PlayerState {

	onEnter(options: Record<string, any>): void {
		this.parent.speed = this.parent.MIN_SPEED;
        this.owner.animation.playIfNotAlready(GooseAnimations.ATTACK);
	}

	update(deltaT: number): void {
        // Call the update method in the parent class - updates the direction the player is facing
        super.update(deltaT);

        // Get the input direction from the player controller
		let dir = this.parent.inputDir;

        // If the player is not moving - transition to the Idle state
		
  

	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}