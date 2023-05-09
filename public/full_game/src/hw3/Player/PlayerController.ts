import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";

import Fall from "./PlayerStates/Fall";
import Idle from "./PlayerStates/Idle";
import Jump from "./PlayerStates/Jump";
import Run from "./PlayerStates/Run";

import Input from "../../Wolfie2D/Input/Input";


import { HW3Controls } from "../HW3Controls";
import HW3AnimatedSprite from "../Nodes/HW3AnimatedSprite";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import { HW3Events } from "../HW3Events";
import Dead from "./PlayerStates/Dead";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Timer from "../../Wolfie2D/Timing/Timer";
import Dying from "./PlayerStates/Dying";

/**
 * Animation keys for the player spritesheet
 */
export const PlayerAnimations = {
    IDLE: "IDLE",
    WALK: "WALK",
    JUMP: "JUMP",
    DYING: "DYING",
    DEAD: "DEAD"
} as const

/**
 * Tween animations the player can player.
 */
export const PlayerTweens = {
    DEATH: "DEATH",
    DISAPPEAR: "DISAPPEAR",
    REAPPEAR: "REAPPEAR"
} as const

/**
 * Keys for the states the PlayerController can be in.
 */
export const PlayerStates = {
    IDLE: "IDLE",
    RUN: "RUN",
	JUMP: "JUMP",
    FALL: "FALL",
    DYING: "DYING",
    DEAD: "DEAD",
} as const

/**
 * The controller that controls the player.
 */
export default class PlayerController extends StateMachineAI {
    public readonly MAX_SPEED: number = 200;
    public readonly MIN_SPEED: number = 100;

    /** Health and max health for the player */
    protected _health: number;
    protected _maxHealth: number;

    /** The players game node */
    protected owner: HW3AnimatedSprite;
    public isHit: boolean = false;
    protected _velocity: Vec2;
	protected _speed: number;
    public isDying: boolean=false;
    protected tilemap: OrthogonalTilemap;
    // protected cannon: Sprite;
    protected goose: HW3AnimatedSprite;

    protected isInvincible: boolean;
    protected invincibleTimer: Timer;

    protected coverCheckTimer: Timer;
    protected canCover: boolean;
    protected isHidden: boolean;
    
    public initializeAI(owner: HW3AnimatedSprite, options: Record<string, any>){
        this.owner = owner;

        this.tilemap = this.owner.getScene().getTilemap(options.tilemap) as OrthogonalTilemap;
        this.speed = 400;
        this.velocity = Vec2.ZERO;

        this.health = 10
        this.maxHealth = 10;
        this.isInvincible = false;
        this.isHidden = false;
        this.invincibleTimer = new Timer(10000, () => {
            // After the timer ends, set isInvincible to false
            console.log("Invincibility deactivated.")
            this.isInvincible = false;
        });
        
        this.coverCheckTimer = new Timer(250, () => {
            this.emitter.fireEvent(HW3Events.DISABLE_COVER)
        });


        this.goose = options.goose;
        // Add the different states the player can be in to the PlayerController 
		this.addState(PlayerStates.IDLE, new Idle(this, this.owner));
		this.addState(PlayerStates.RUN, new Run(this, this.owner));
        this.addState(PlayerStates.JUMP, new Jump(this, this.owner));
        this.addState(PlayerStates.FALL, new Fall(this, this.owner));
        this.addState(PlayerStates.DYING, new Dying(this, this.owner));
        this.addState(PlayerStates.DEAD, new Dead(this, this.owner));
        this.receiver.subscribe(HW3Events.PLAYER_GOOSE_HIT);
        this.receiver.subscribe(HW3Events.ENABLE_COVER);
        this.receiver.subscribe(HW3Events.DISABLE_COVER);

        // Start the player in the Idle state
        this.initialize(PlayerStates.IDLE);
    }

    /** 
	 * Get the inputs from the keyboard, or Vec2.Zero if nothing is being pressed
	 */
    public get inputDir(): Vec2 {
        let direction = Vec2.ZERO;
		direction.x = (Input.isPressed(HW3Controls.MOVE_LEFT) ? -1 : 0) + (Input.isPressed(HW3Controls.MOVE_RIGHT) ? 1 : 0);
		direction.y = (Input.isJustPressed(HW3Controls.JUMP) ? -1 : 0);
		return direction;
    }
    
    public update(deltaT: number): void {
		super.update(deltaT);
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }
    
        if(this.isDying){
            this.emitter.fireEvent(HW3Events.PLAYER_DEAD);
            this.isDying = false;
        }
        
        if(Input.isKeyJustPressed("i")){
            console.log("Invincibility activated.")
            this.handleInvincibility();
        }
        if(Input.isKeyJustPressed("1")){
            this.emitter.fireEvent(HW3Events.SWITCH_LEVELS, {level: 1})
        }
        if(Input.isKeyJustPressed("2")){
            this.emitter.fireEvent(HW3Events.SWITCH_LEVELS, {level: 2})
        }
        if(Input.isKeyJustPressed("3")){
            this.emitter.fireEvent(HW3Events.SWITCH_LEVELS, {level: 3})
        }
        if(Input.isKeyJustPressed("4")){
            this.emitter.fireEvent(HW3Events.SWITCH_LEVELS, {level: 4})
        }
        if(Input.isKeyJustPressed("5")){
            this.emitter.fireEvent(HW3Events.SWITCH_LEVELS, {level: 5})
        }
        if(Input.isKeyJustPressed("6")){
            this.emitter.fireEvent(HW3Events.SWITCH_LEVELS, {level: 6})
        }

        if(this.canCover){
            if(Input.isKeyJustPressed("e")){
                this.isHidden = !this.isHidden;  
                if(this.isHidden){                    
                    console.log("Hiding activated.");
                    this.emitter.fireEvent(HW3Events.HIDE_INTERACTION_TEXT)
                    this.emitter.fireEvent(HW3Events.IN_HIDING)
                }                
                else{
                    this.emitter.fireEvent(HW3Events.NOT_HIDING)
                    console.log("Hiding deactivated.")
                }
            }
        }

	}
    public handleEvent(event: GameEvent): void {
        switch(event.type){
            case(HW3Events.PLAYER_GOOSE_HIT):
                if(!this.isInvincible && !this.isHidden)
                    this.isHit=true;
                break;
            case HW3Events.ENABLE_COVER: {
                this.canCover = true;
                if(!this.isHidden)
                    this.emitter.fireEvent(HW3Events.SHOW_INTERACTION_TEXT)
                this.coverCheckTimer.start();
                break;
            }
            case HW3Events.DISABLE_COVER: {
                this.canCover = false;
                this.isHidden = false;  
                this.emitter.fireEvent(HW3Events.NOT_HIDING)
                this.emitter.fireEvent(HW3Events.HIDE_INTERACTION_TEXT)
                console.log("Hiding deactivated.")
                break;
            }
    
        }
    }


    protected handleInvincibility(): void {
        // If the timer hasn't run yet, start the end level animation
        if (!this.invincibleTimer.hasRun() && this.invincibleTimer.isStopped()) {
            this.invincibleTimer.start();
            this.isInvincible = true;
        }
    }


    public get velocity(): Vec2 { return this._velocity; }
    public set velocity(velocity: Vec2) { this._velocity = velocity; }

    public get speed(): number { return this._speed; }
    public set speed(speed: number) { this._speed = speed; }

    public get maxHealth(): number { return this._maxHealth; }
    public set maxHealth(maxHealth: number) { this._maxHealth = maxHealth; }

    public get health(): number { return this._health; }
    public set health(health: number) { 
        this._health = MathUtils.clamp(health, 0, this.maxHealth);
        // When the health changes, fire an event up to the scene.
        this.emitter.fireEvent(HW3Events.HEALTH_CHANGE, {curhp: this.health, maxhp: this.maxHealth});
        // If the health hit 0, change the state of the player
    }
}