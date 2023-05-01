import StateMachineAI from "../../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";

import HW3AnimatedSprite from "../Nodes/HW3AnimatedSprite";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import { HW3Events } from "../HW3Events";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Timer from "../../Wolfie2D/Timing/Timer";
import Play from "./CutsceneStates/PLAY";

/**
 * Animation keys for the cutscene spritesheet
 */
export const Animations = {
    PLAY: "PLAY"
} as const

/**
 * Keys for the states the CutsceneController can be in.
 */
export const CutesceneStates = {
    PLAY: "PLAY"
} as const

/**
 * The controller that controls the cutscene.
 */
export default class CutsceneController extends StateMachineAI {
    /** The players game node */
    protected owner: HW3AnimatedSprite;

    
    public initializeAI(owner: HW3AnimatedSprite, options: Record<string, any>){
        this.owner = owner;


		this.addState(CutesceneStates.PLAY, new Play(this, this.owner));

        // Start the cutscene
        this.initialize(CutesceneStates.PLAY);
    }

    
    public update(deltaT: number): void {
		super.update(deltaT);
	}
}