import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import HW3Level, { HW3Layers } from "./HW3Level";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import SceneManager from "../../Wolfie2D/Scene/SceneManager";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import MainMenu from "./MainMenu";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import { HW3PhysicsGroups } from "../HW3PhysicsGroups";
import { HW3Events } from "../HW3Events";
import Color from "../../Wolfie2D/Utils/Color";
import GooseController from "../Goose/GooseController";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Level2 from "./HW3Level2";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import Level3 from "./HW3Level4";
import Level4 from "./HW3Level5";
import Level1 from "./HW3Level1";
import CutsceneController from "../Cutscene/CutsceneController";
import Level5 from "./HW3Level5";

/**
 * The first level for HW4 - should be the one with the grass and the clouds.
 */
export default class Cutscene1 extends HW3Level {


    public static readonly PLAYER_SPAWN = new Vec2(600, 200);
    public static readonly PLAYER_SPRITE_KEY = "PLAYER_SPRITE_KEY";
    public static readonly PLAYER_SPRITE_PATH = "hw4_assets/spritesheets/Seabass.json";

    public static readonly TILEMAP_KEY = "LEVEL1";
    public static readonly TILEMAP_PATH = "hw4_assets/tilemaps/cutscene_background.json";

    public static readonly TILEMAP_SCALE = new Vec2(1, 1);
    public static readonly DESTRUCTIBLE_LAYER_KEY = "Destructable";
    public static readonly WALLS_LAYER_KEY = "Main";

    public static readonly LEVEL_MUSIC_KEY = "LEVEL_MUSIC";
    public static readonly LEVEL_MUSIC_PATH = "hw4_assets/music/level1.mp3";

    public static readonly CUTSCENE_SPAWN = new Vec2(600, 400);
    public static readonly CUTSCENE_SPRITE_KEY = "CUTSCENE_SPRITE_KEY";
    public static readonly CUTSCENE_SPRITE_PATH = "hw4_assets/spritesheets/cutscene1.json";
    protected cutsceneSpriteKey: string;
    protected cutscene: AnimatedSprite;
    protected cutsceneSpawn: Vec2;

    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        super(viewport, sceneManager, renderingManager, options);

        // Set the keys for the different layers of the tilemap
        this.tilemapKey = Cutscene1.TILEMAP_KEY;
        this.tilemapScale = Cutscene1.TILEMAP_SCALE;
        this.wallsLayerKey = Cutscene1.WALLS_LAYER_KEY;

        // Set the key for the player's sprite
        this.playerSpriteKey = Cutscene1.PLAYER_SPRITE_KEY;
        // Set the player's spawn
        this.playerSpawn = Cutscene1.PLAYER_SPAWN;

        // Music and sound
        this.levelMusicKey = Cutscene1.LEVEL_MUSIC_KEY

        this.cutsceneSpriteKey = Cutscene1.CUTSCENE_SPRITE_KEY;
        this.cutsceneSpawn = Cutscene1.CUTSCENE_SPAWN;
        this.isCutscene = true;
    }

    /**
     * Load in our resources for level 1
     */
    public loadScene(): void {
        // Load in the tilemap
        this.load.tilemap(this.tilemapKey, Cutscene1.TILEMAP_PATH);
        // Load in the player's sprite
        this.load.spritesheet(this.playerSpriteKey, Cutscene1.PLAYER_SPRITE_PATH);
       
        // Audio and music
        this.load.audio(this.levelMusicKey, Cutscene1.LEVEL_MUSIC_PATH);

        // Cutscene
        this.load.spritesheet(this.cutsceneSpriteKey, Cutscene1.CUTSCENE_SPRITE_PATH);

    }

    /**
     * Unload resources for level 1 - decide what to keep
     */
    public unloadScene(): void {
        this.load.keepSpritesheet(this.playerSpriteKey);
        this.load.keepAudio(this.levelMusicKey);
        this.load.keepAudio(this.jumpAudioKey);
        this.isCutscene = false;
    }


    // FIX
    public startScene(): void {
        super.startScene();
        // Set the next level to be Level2
        //  this.nextLevel = Level2;
        this.nextLevel = Level1;
        this.initializeCutscene(this.cutsceneSpriteKey, this.cutsceneSpawn);
    }
    protected initializeCutscene(key: string, spawn: Vec2): void {
       
        if (spawn === undefined) {
            throw new Error("Cutscene spawn must be set before initializing the cutscene!");
        }

        // Add the player to the scene
        this.cutscene = this.add.animatedSprite(this.cutsceneSpriteKey, HW3Layers.PRIMARY);
        //this.cutscene.scale.set(1,1);
        this.cutscene.position.copy(spawn);
   
        // Give the player it's AI
    this.cutscene.addAI(CutsceneController);
    }

    /**
     * I had to override this method to adjust the viewport for the first level. I screwed up 
     * when I was making the tilemap for the first level is what it boils down to.
     * 
     * - Peter
     */
    protected initializeViewport(): void {
        super.initializeViewport();
        this.viewport.follow(this.cutscene);
        this.viewport.setZoomLevel(1);
        this.viewport.setBounds(0, 0, 1200, 800);


    }
    protected initializeUI(): void {
        super.initializeUI();
        this.levelEndLabel.visible = false
    }

}