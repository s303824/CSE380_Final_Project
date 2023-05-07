import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Rect from "../../../Wolfie2D/Nodes/Graphics/Rect";
import HW3AnimatedSprite from "../../Nodes/HW3AnimatedSprite";
import HumanController, { HumanAnimations, HumanStates } from "../HumanController";
import HumanState from "./HumanState";

export default class Patrol extends HumanState {
	protected levelEndArea: Rect;
	protected player: HW3AnimatedSprite;

	protected patrollingLeft: boolean;
	protected range: number;
	protected origin: number;

	public constructor(parent: HumanController, owner: HW3AnimatedSprite, player:HW3AnimatedSprite, levelEndArea: Rect, range: number){
		super(parent, owner)
		this.levelEndArea = levelEndArea;

		this.player = player;
		this.range = range;
		this.origin = owner.position.x;
		this.patrollingLeft = true;
	}


	onEnter(options: Record<string, any>): void {
		this.origin = this.parent.velocity.x;
		this.parent.speed = this.parent.MIN_SPEED;
        this.owner.animation.play(HumanAnimations.WALK, true);

	}

	update(deltaT: number): void {
        // Call the update method in the parent class - updates the direction the player is facing
        super.update(deltaT);

		//console.log(this.owner.position.x)
		let playerVec = this.parent.playerVec;

		if(!this.parent.getAwareness()&&(Math.abs(this.owner.position.x - playerVec.x) < 200) &&(Math.abs(this.owner.position.y - playerVec.y) < 200)){
            console.log("FISH SPOTTED");
            this.finished(HumanStates.CHASE);
        }

        // Get the input direction from the player controller

		this.parent.velocity.y += this.gravity*deltaT; 

		if (this.patrollingLeft)
		{
		  if (this.owner.position.x <= this.origin - this.range)
		  {
			this.patrollingLeft = false;
			this.parent.velocity.x = -this.parent.velocity.x;
		  }
		}
		else
		{
		  if (this.owner.position.x >= this.origin + this.range)
		  {
			this.patrollingLeft = true;
			this.parent.velocity.x = -this.parent.velocity.x;
		  }
		}		
		
		// If we're walking left, flip the sprite
		this.owner.invertX = this.parent.velocity.x < 0;
        if(!this.player.collisionShape.overlaps(this.levelEndArea.collisionShape))
			this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	onExit(): Record<string, any> {
		//this.owner.animation.stop();
		return {};
	}
}