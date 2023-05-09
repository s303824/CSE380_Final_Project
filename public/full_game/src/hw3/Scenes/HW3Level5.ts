import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import HW3Level, { HW3Layers } from "./HW3Level";
import MainMenu from "./MainMenu";

import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import SceneManager from "../../Wolfie2D/Scene/SceneManager";
import Level1 from "./HW3Level1";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Level2 from "./HW3Level2";
import Level3 from "./HW3Level3";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import { HW3Events } from "../HW3Events";
import { HW3PhysicsGroups } from "../HW3PhysicsGroups";
import Color from "../../Wolfie2D/Utils/Color";
import Level4 from "./HW3Level4";
import Level6 from "./HW3Level6";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import HumanController from "../Human/HumanController";
import Teleport from "../../Wolfie2D/Nodes/Graphics/Teleport";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";

/**
 * The second level for HW4. It should be the goose dungeon / cave.
 */
export default class Level5 extends HW3Level {

    public static readonly PLAYER_SPAWN = new Vec2(48, 320);
    public static readonly PLAYER_SPRITE_KEY = "PLAYER_SPRITE_KEY";
    public static readonly PLAYER_SPRITE_PATH = "hw4_assets/spritesheets/Seabass.json";

    public static readonly TILEMAP_KEY = "LEVEL4";
    public static readonly TILEMAP_PATH = "hw4_assets/tilemaps/level-5.json";
    public static readonly TILEMAP_SCALE = new Vec2(1, 1);
    public static readonly WALLS_LAYER_KEY = "Main";

    public static readonly LEVEL_MUSIC_KEY = "LEVEL_MUSIC";
    public static readonly LEVEL_MUSIC_PATH = "hw4_assets/music/level4.mp3";

    public static readonly JUMP_AUDIO_KEY = "PLAYER_JUMP";
    public static readonly JUMP_AUDIO_PATH = "hw4_assets/sounds/jump.wav";
    
    protected humanSpriteKey: string;
    protected human: AnimatedSprite;
    protected humanLocations: [number,number][]

    protected door: Rect;
    protected doorLocations: [number,number][]
    protected otherCoverLocations: [number,number][]

    public static readonly HUMAN_SPRITE_KEY = "HUMAN_SPRITE_KEY";
    public static readonly HUMAN_SPRITE_PATH = "hw4_assets/spritesheets/Lab_scientist.json";


    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        super(viewport, sceneManager, renderingManager, options);

        // Set the keys for the different layers of the tilemap
        this.tilemapKey = Level5.TILEMAP_KEY;
        this.tilemapScale = Level5.TILEMAP_SCALE;
        this.wallsLayerKey = Level5.WALLS_LAYER_KEY;

        // Set the key for the player's sprite
        this.playerSpriteKey = Level1.PLAYER_SPRITE_KEY;
        // Set the player's spawn
        this.playerSpawn = Level5.PLAYER_SPAWN;

        // Music and sound
        this.levelMusicKey = Level5.LEVEL_MUSIC_KEY
        this.jumpAudioKey = Level1.JUMP_AUDIO_KEY;

        // Level end size and position
        this.levelEndPosition = new Vec2(32, 880).mult(this.tilemapScale);
        this.levelEndHalfSize = new Vec2(64, 64).mult(this.tilemapScale);
        
        // enemies
        this.humanSpriteKey = Level5.HUMAN_SPRITE_KEY;
        this.humanLocations = [[400, 340], [600, 340], [1312, 340], [1536, 340], 
                                [400, 834], [600, 834], [1312, 834], [1536, 834]]

        this.teleporterLocations = [[1856, 328, 1856, 864]]

        this.doorLocations = [
                                [72, 336],[152, 336],[312, 336],[680, 336],[872, 336],[952, 336], [1128, 336],[1208, 336],[1640, 336],[1720, 336], 
                                [1720,864], [1640,864], [1128, 864],[1208, 864],[952, 864],[648, 864], [72, 864],[152, 864],[312, 864]
                            ]
        this.otherCoverLocations = [[496, 320], [1440, 320], [1440, 864], [800, 864], [496, 864]]
        this.endLevelBanner = "Escaped From Research Laboratory"

    }
    /**
     * Load in resources for level 2.
     */
    public loadScene(): void {
        // Load in the tilemap
        this.load.tilemap(this.tilemapKey, Level5.TILEMAP_PATH);
        this.load.audio(this.levelMusicKey, Level5.LEVEL_MUSIC_PATH);
        this.load.spritesheet(this.humanSpriteKey, Level5.HUMAN_SPRITE_PATH);

    }
    protected initializeViewport(): void {
        super.initializeViewport();
        this.viewport.setBounds(0, 16, 120*16, 60*16*4);
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
        this.nextLevel = Level6;
        this.currentLevel = Level5;

        for(let i = 0; i < this.teleporterLocations.length; i++){ // teleporter locations
            this.initializePlayerTeleport(new Vec2(this.teleporterLocations[i][0], this.teleporterLocations[i][1]).mult(this.tilemapScale), 
                                            new Vec2(48, 96).mult(this.tilemapScale), 
                                            new Vec2(this.teleporterLocations[i][2], this.teleporterLocations[i][3]).mult(this.tilemapScale))
        }

        // initialize all the places to hide
        for(let i = 0; i < this.doorLocations.length; i++){ // door location
            this.initializePlayerCover(new Vec2(this.doorLocations[i][0], this.doorLocations[i][1]).mult(this.tilemapScale), new Vec2(48, 96).mult(this.tilemapScale))
        }
        
        for(let i = 0; i < this.otherCoverLocations.length; i++){ // other locations
            this.initializePlayerCover(new Vec2(this.otherCoverLocations[i][0], this.otherCoverLocations[i][1]).mult(this.tilemapScale), new Vec2(160, 128))
        }

        // initialize all the humans
        for(let i = 0; i < this.humanLocations.length; i++){
            this.initializeHuman(new Vec2(this.humanLocations[i][0], this.humanLocations[i][1]).mult(this.tilemapScale))
        }

    }
    protected initializePlayerTeleport(position: Vec2, size: Vec2, newLocation: Vec2): void {
        if (!this.layers.has(HW3Layers.PRIMARY)) {
            throw new Error("Can't initialize the level ends until the primary layer has been added to the scene!");
        }
        
        this.levelTeleportArea = <Teleport>this.add.graphic(GraphicType.TELEPORT, HW3Layers.PRIMARY, { position: position, size: size, newLocation: newLocation});
        this.levelTeleportArea.addPhysics(undefined, undefined, false, true);
        this.levelTeleportArea.setTrigger(HW3PhysicsGroups.PLAYER, HW3Events.PLAYER_TELEPORT, null);
        this.levelTeleportArea.color = new Color(255, 0, 255, .0);
    }

    public unloadScene(): void {
        this.load.keepSpritesheet(this.playerSpriteKey);
        this.load.keepAudio(this.jumpAudioKey);
    }

    protected initializeHuman(spawn: Vec2): void {   
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
    protected initializePlayerCover(position: Vec2, size: Vec2): void {
        this.door = <Rect>this.add.graphic(GraphicType.RECT, HW3Layers.PRIMARY, { position: position, size: size});
        this.door.addPhysics(undefined, undefined, false, true);
        this.door.setTrigger(HW3PhysicsGroups.PLAYER, HW3Events.ENABLE_COVER, HW3Events.DISABLE_COVER);
        this.door.color = new Color(99,102,106, 0.4);
    }

    protected initializeUI(): void {
        super.initializeUI()
        this.interactionLabel = <Label>this.add.uiElement(UIElementType.LABEL, HW3Layers.UI, {position: new Vec2(150, 170), text: "E to Hide"});
        this.interactionLabel.size.set(300, 30);
        this.interactionLabel.fontSize = 24;
        this.interactionLabel.textColor = new Color(255, 255, 255, 0.0)
        this.interactionLabel.font = "Courier";

    }

}