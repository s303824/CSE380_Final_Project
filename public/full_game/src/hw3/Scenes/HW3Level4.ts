import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import HW3Level, { HW3Layers } from "./HW3Level";
import MainMenu from "./MainMenu";

import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import SceneManager from "../../Wolfie2D/Scene/SceneManager";
import Level1 from "./HW3Level1";
import Level2 from "./HW3Level2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import { HW3PhysicsGroups } from "../HW3PhysicsGroups";
import Color from "../../Wolfie2D/Utils/Color";
import { HW3Events } from "../HW3Events";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import HumanController from "../Human/HumanController";
import Level5 from "./HW3Level5";
import Level6 from "./HW3Level6";
import Level3 from "./HW3Level3";
import Timer from "../../Wolfie2D/Timing/Timer";

/**
 * The second level for HW4. It should be the goose dungeon / cave.
 */
export default class Level4 extends HW3Level {

    public static readonly PLAYER_SPAWN = new Vec2(48, 146);
    public static readonly PLAYER_SPRITE_KEY = "PLAYER_SPRITE_KEY";
    public static readonly PLAYER_SPRITE_PATH = "hw4_assets/spritesheets/Seabass.json";

    public static readonly TILEMAP_KEY = "LEVEL3";
    public static readonly TILEMAP_PATH = "hw4_assets/tilemaps/level-4.json";
    public static readonly TILEMAP_SCALE = new Vec2(1, 1);
    public static readonly WALLS_LAYER_KEY = "Main";

    public static readonly LEVEL_MUSIC_KEY = "LEVEL_MUSIC";
    public static readonly LEVEL_MUSIC_PATH = "hw4_assets/music/level4.mp3";

    public static readonly JUMP_AUDIO_KEY = "PLAYER_JUMP";
    public static readonly JUMP_AUDIO_PATH = "hw4_assets/sounds/jump.wav";

    public static readonly LEVEL_END = new AABB(new Vec2(224, 232), new Vec2(24, 16));

    protected door: Rect;
    protected doorLocations: [number,number][]

    protected instructionLabel: Label;

    protected humanSpriteKey: string;
    protected human: AnimatedSprite;
    protected humanSpawn: Vec2;
    protected humanSpawn2: Vec2;
    protected humanSpawn3: Vec2;

    public static readonly HUMAN_SPRITE_KEY = "HUMAN_SPRITE_KEY";
    public static readonly HUMAN_SPRITE_PATH = "hw4_assets/spritesheets/Lab_scientist.json";
    public static readonly HUMAN_SPAWN = new Vec2(400, 100);
    public static readonly HUMAN_SPAWN_2= new Vec2(500, 368);
    public static readonly HUMAN_SPAWN_3= new Vec2(400, 368);



    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        super(viewport, sceneManager, renderingManager, options);

        // Set the keys for the different layers of the tilemap
        this.tilemapKey = Level4.TILEMAP_KEY;
        this.tilemapScale = Level4.TILEMAP_SCALE;
        this.wallsLayerKey = Level4.WALLS_LAYER_KEY;

        // Set the key for the player's sprite
        this.playerSpriteKey = Level1.PLAYER_SPRITE_KEY;
        // Set the player's spawn
        this.playerSpawn = Level4.PLAYER_SPAWN;

        // enemies
        this.humanSpriteKey = Level4.HUMAN_SPRITE_KEY;
        this.humanSpawn = Level4.HUMAN_SPAWN;
        this.humanSpawn2 = Level4.HUMAN_SPAWN_2;
        this.humanSpawn3 = Level4.HUMAN_SPAWN_3;


        // Music and sound
        this.levelMusicKey = Level4.LEVEL_MUSIC_KEY
        this.jumpAudioKey = Level1.JUMP_AUDIO_KEY;

        // Level end size and position
        this.levelEndPosition = new Vec2(32, 400).mult(this.tilemapScale);
        this.levelEndHalfSize = new Vec2(32, 32).mult(this.tilemapScale);
        this.playerNewLocation = new Vec2(1312,224).mult(this.tilemapScale);

        this.doorLocations = [[152, 112],[344, 112],[648, 112],[840, 112],[152, 368],[344, 368],[648, 368],[840, 368]]

    }
    /**
     * Load in resources for level 2.
     */
    public loadScene(): void {
        // Load in the tilemap
        this.load.tilemap(this.tilemapKey, Level4.TILEMAP_PATH);
        this.load.spritesheet(this.humanSpriteKey, Level4.HUMAN_SPRITE_PATH);
        this.load.audio(this.levelMusicKey, Level4.LEVEL_MUSIC_PATH);

    }
    protected initializeViewport(): void {
        super.initializeViewport();
        this.viewport.setBounds(16, 0, 60*16*2, 64*16*2);
    }

    protected handleLevelSwitchEvent(event: GameEvent): void {
        switch(event.data.get("level")){
            case 1: 
            {                
                this.nextLevel = Level1
                break
            }           
            case 2: 
            {
                this.nextLevel = Level2
                break
            }
            case 3: 
            {                
                this.nextLevel = Level3
                break
            }
            case 4: 
            {
                this.nextLevel = Level4
                break
            } 
            case 5: 
            {                
                this.nextLevel = Level5
                break
            }
            case 6:
            {
                this.nextLevel = Level6
                break

            }
            default:
                throw new Error(`Unhandled event caught in scene with type ${event.type}`)
        }
    }


    public startScene(): void {
        super.startScene();
        this.currentLevel = Level4;
        this.nextLevel = Level5;

        this.levelTeleportPosition = new Vec2(928, 144).mult(this.tilemapScale)
        this.levelTeleportHalfSize = new Vec2(48, 96).mult(this.tilemapScale)
        this.playerNewLocation = new Vec2(928, 400).mult(this.tilemapScale)
        this.initializePlayerTeleport()


        // initialize all the places to hide
        for(let i = 0; i < this.doorLocations.length; i++){
            this.initializePlayerCover(new Vec2(this.doorLocations[i][0], this.doorLocations[i][1]).mult(this.tilemapScale))
        }

        this.initializeHuman(this.humanSpriteKey, this.humanSpawn);
        this.initializeHuman(this.humanSpriteKey, this.humanSpawn2);        
        this.initializeHuman(this.humanSpriteKey, this.humanSpawn3);

    }

    protected initializeHuman(key: string, spawn: Vec2): void {   
        if (spawn === undefined) {
            throw new Error("Human spawn must be set before initializing the human!");
        }

        // Add the human enemy to the scene
        this.human = this.add.animatedSprite(this.humanSpriteKey, HW3Layers.PRIMARY);
        this.human.scale.set(1.5,1.5);
        this.human.position.copy(spawn);
        
        // Give the human physics and setup collision groups and triggers for the player
   
        this.human.addPhysics(new AABB(this.human.position.clone(), this.human.boundary.getHalfSize().clone().sub(new Vec2(10,10))));
        this.human.setGroup(HW3PhysicsGroups.GOOSE);
        this.human.setTrigger(HW3PhysicsGroups.PLAYER, HW3Events.PLAYER_GOOSE_HIT, null);

        // Give the human it's AI
        this.human.addAI(HumanController, { player: this.player, levelEndArea: this.levelEndArea, tilemap: "Primary"});
    }

    protected initializePlayerTeleport(): void {
        if (!this.layers.has(HW3Layers.PRIMARY)) {
            throw new Error("Can't initialize the level ends until the primary layer has been added to the scene!");
        }
        
        this.levelTeleportArea = <Rect>this.add.graphic(GraphicType.RECT, HW3Layers.PRIMARY, { position: this.levelTeleportPosition, size:  this.levelTeleportHalfSize});
        this.levelTeleportArea.addPhysics(undefined, undefined, false, true);
        this.levelTeleportArea.setTrigger(HW3PhysicsGroups.PLAYER, HW3Events.PLAYER_TELEPORT, null);
        this.levelTeleportArea.color = new Color(255, 0, 255, 0.0);
        
    }

    protected initializePlayerCover(position: Vec2): void {
        this.door = <Rect>this.add.graphic(GraphicType.RECT, HW3Layers.PRIMARY, { position: position, size:  this.levelTeleportHalfSize});
        this.door.addPhysics(undefined, undefined, false, true);
        this.door.setTrigger(HW3PhysicsGroups.PLAYER, HW3Events.ENABLE_COVER, HW3Events.DISABLE_COVER);
        this.door.color = new Color(0, 0, 0, 0.3);
    }


    protected initializeUI(): void {
        super.initializeUI()
        this.instructionLabel = <Label>this.add.uiElement(UIElementType.LABEL, HW3Layers.UI, {position: new Vec2(150, 170), text: "E to Hide at Doorway"});
        this.instructionLabel.size.set(300, 30);
        this.instructionLabel.fontSize = 24;
        this.instructionLabel.textColor = new Color(255, 255, 255, 1.0)
        this.instructionLabel.font = "Courier";

    }
    public unloadScene(): void {
        this.load.keepSpritesheet(this.playerSpriteKey);
        this.load.keepSpritesheet(this.humanSpriteKey);
        this.load.keepAudio(this.jumpAudioKey);
    }
}