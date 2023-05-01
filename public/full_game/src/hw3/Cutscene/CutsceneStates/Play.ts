import { CutesceneStates, Animations } from "../CutsceneController";
import PlayerState from "./CutsceneState";
import Input from "../../../Wolfie2D/Input/Input";
import { HW3Controls } from "../../HW3Controls";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { HW3Events } from "../../HW3Events";

export default class Play extends PlayerState {


	public onEnter(options: Record<string, any>): void {
        this.owner.animation.playIfNotAlready(Animations.PLAY, false, HW3Events.LEVEL_END);        
	}

	public update(deltaT: number): void {
		super.update(deltaT);
	}

	public onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}