import State from "../../../Wolfie2D/DataTypes/State/State";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import MathUtils from "../../../Wolfie2D/Utils/MathUtils";
import HW3AnimatedSprite from "../../Nodes/HW3AnimatedSprite";
import GooseController from "../GooseController";
import PlayerController from "../../Player/PlayerController";
/**
 * An abstract state for the PlayerController 
 */
export default abstract class GooseState extends State {

    protected parent: GooseController;
	protected owner: HW3AnimatedSprite;
    protected player: HW3AnimatedSprite;
	protected gravity: number;

	public constructor(parent: GooseController, owner: HW3AnimatedSprite){
		super(parent);
		this.owner = owner;
        this.gravity = 500;
	}

    public abstract onEnter(options: Record<string, any>): void;

    /**
     * Handle game events from the parent.
     * @param event the game event
     */
	public handleInput(event: GameEvent): void {
        switch(event.type) {
            // Default - throw an error
            default: {
                throw new Error(`Unhandled event in GooseState of type ${event.type}`);
            }
        }
	}

	public update(deltaT: number): void {

    }

    public abstract onExit(): Record<string, any>;
}