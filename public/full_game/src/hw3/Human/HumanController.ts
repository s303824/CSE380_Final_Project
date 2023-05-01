import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Idle from "./HumanStates/Idle";
import Walk from "./HumanStates/Walk";

import PlayerController from "../Player/PlayerController";
import Input from "../../Wolfie2D/Input/Input";

import { HW3Controls } from "../HW3Controls";
import HW3AnimatedSprite from "../Nodes/HW3AnimatedSprite";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import { HW3Events } from "../HW3Events";

import Timer from "../../Wolfie2D/Timing/Timer";

/**
 * Animation keys for the player spritesheet
 */
export const HumanAnimations = {
    IDLE: "IDLE",
    WALK: "WALK"   
} as const

/**
 * Tween animations the player can player.
 */

/**
 * Keys for the states the PlayerController can be in.
 */
export const HumanStates = {
    IDLE: "IDLE",
    WALK: "WALK"
 

} as const

/**
 * The controller that controls the player.
 */
export default class HumanController extends StateMachineAI {
    public readonly MAX_SPEED: number = 100;
    public readonly MIN_SPEED: number = 75;

    /** Health and max health for the player */
    /*
    protected _health: number;
    protected _maxHealth: number;
*/
    /** The players game node */
    protected owner: HW3AnimatedSprite;

    protected _velocity: Vec2;
	protected _speed: number;

    protected tilemap: OrthogonalTilemap;

    protected player: HW3AnimatedSprite;
    public playerVec: Vec2;
    // protected cannon: Sprite;
    protected walkFlag: boolean;

    
    public initializeAI(owner: HW3AnimatedSprite, options: Record<string, any>){
        this.owner = owner;



        this.tilemap = this.owner.getScene().getTilemap(options.tilemap) as OrthogonalTilemap;
        this.speed = this.MIN_SPEED;
        this.velocity = Vec2.ZERO;
        this.player = options.player;
        this.playerVec = this.player.position;
        this.walkFlag = false;

        // Add the different states the player can be in to the PlayerController 
		this.addState(HumanStates.IDLE, new Idle(this, this.owner));
        this.addState(HumanStates.WALK, new Walk(this, this.owner));

        this.initialize(HumanStates.IDLE);
    }

    /** 
	 * Get the inputs from the keyboard, or Vec2.Zero if nothing is being pressed
	 */
    public get inputDir(): Vec2 {
        let direction = Vec2.ZERO;
		return direction;
    }
    /** 
     * Gets the direction of the mouse from the player's position as a Vec2
     */
    //public get faceDir(): Vec2 { return this.owner.position.dirTo(Input.getGlobalMousePosition()); }

    public update(deltaT: number): void {
		super.update(deltaT);
       
        if((Math.abs(this.owner.position.x - this.playerVec.x) < 100) &&(Math.abs(this.owner.position.y - this.playerVec.y) < 100)){
            
            this.handleGooseWalk();
        }else{
            this.changeState(HumanStates.IDLE);
            this.walkFlag = false;
        }
        
        if(this.owner.collisionShape.overlaps(this.player.collisionShape)){
            this.handlePlayerGooseCollision();   
        }
        
	}
    protected handleGooseWalk(): void {
        if(this.walkFlag == false){
        this.changeState(HumanStates.WALK);
        this.walkFlag = true;
        }
    }
   
    protected handlePlayerGooseCollision(): void {
        this.emitter.fireEvent(HW3Events.PLAYER_GOOSE_HIT);
       
    }
    public get velocity(): Vec2 { return this._velocity; }
    public set velocity(velocity: Vec2) { this._velocity = velocity; }

    public get speed(): number { return this._speed; }
    public set speed(speed: number) { this._speed = speed; }
  
}