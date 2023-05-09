import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import { PlayerTweens, PlayerStates, PlayerAnimations } from "../PlayerController";
import PlayerState from "./PlayerState";
import { GameEventType } from "../../../Wolfie2D/Events/GameEventType";
import { HW3Events } from "../../HW3Events";

/**
 * The Dying state for the player's FSM AI. 
 */
export default class Dying extends PlayerState {

    // Trigger the player's death animation when we enter the dead state
    public onEnter(options: Record<string, any>): void {
        this.owner.animation.playIfNotAlready(PlayerAnimations.DYING, false);
    }

    // Ignore all events from the rest of the game
    public handleInput(event: GameEvent): void { }

    // Empty update method - if the player is dead, don't update anything
    public update(deltaT: number): void {
        if(!this.owner.animation.isPlaying(PlayerAnimations.DYING))
            this.finished(PlayerStates.DEAD);
    }

    public onExit(): Record<string, any> { return {}; }
    
}