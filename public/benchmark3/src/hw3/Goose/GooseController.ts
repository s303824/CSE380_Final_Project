import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Idle from "./GooseStates/Idle";
import Attack from "./GooseStates/Attack";
import Walk from "./GooseStates/Walk";

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
export const GooseAnimations = {
    IDLE: "IDLE",
    WALK: "WALK",
    ATTACK: "ATTACK"
   
} as const

/**
 * Tween animations the player can player.
 */

/**
 * Keys for the states the PlayerController can be in.
 */
export const GooseStates = {
    IDLE: "IDLE",
    ATTACK: "ATTACK",
    WALK: "WALK",
 

} as const

/**
 * The controller that controls the player.
 */
export default class GooseController extends StateMachineAI {
    public readonly MAX_SPEED: number = 75;
    public readonly MIN_SPEED: number = 50;

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
		this.addState(GooseStates.IDLE, new Idle(this, this.owner));
		this.addState(GooseStates.ATTACK, new Attack(this, this.owner));
        this.addState(GooseStates.WALK, new Walk(this, this.owner));

        this.initialize(GooseStates.IDLE);
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
            this.changeState(GooseStates.IDLE);
            this.walkFlag = false;
        }
        
        if(this.owner.collisionShape.overlaps(this.player.collisionShape)){
            this.handlePlayerGooseCollision();   
        }
        
	}
    protected handleGooseWalk(): void {
        if(this.walkFlag == false){
        this.changeState(GooseStates.WALK);
        this.walkFlag = true;
        }
    }
   
    protected handlePlayerGooseCollision(): void {
        this.changeState(GooseStates.ATTACK);
        this.emitter.fireEvent(HW3Events.PLAYER_GOOSE_HIT);
       
    }
    public get velocity(): Vec2 { return this._velocity; }
    public set velocity(velocity: Vec2) { this._velocity = velocity; }

    public get speed(): number { return this._speed; }
    public set speed(speed: number) { this._speed = speed; }
/*
    public get maxHealth(): number { return this._maxHealth; }
    public set maxHealth(maxHealth: number) { this._maxHealth = maxHealth; }

    public get health(): number { return this._health; }
    public set health(health: number) { 
        this._health = MathUtils.clamp(health, 0, this.maxHealth);
        // When the health changes, fire an event up to the scene.
        this.emitter.fireEvent(HW3Events.HEALTH_CHANGE, {curhp: this.health, maxhp: this.maxHealth});
        // If the health hit 0, change the state of the player
        if (this.health === 0) { this.changeState(GooseStates.DEAD); }
    }
    */
  
}