/**
 * A set of events for HW4
 */
export const HW3Events = {
    // An event that tells the HW4 level to start. Has data: {}
    LEVEL_START: "LEVEL_START",
    // An event that tells the HW4 level to end. Has data: {}
    LEVEL_END: "LEVEL_END",

    // An event triggered when the player enters an area designated as a "level end" location. Had data: {}
    PLAYER_ENTERED_LEVEL_END: "PLAYER_ENTERED_LEVEL_END",

    /**
     * The event that gets emitted when the player's health changes
     * 
     * Has data: { curhp: number, maxhp: number }
     */
    HEALTH_CHANGE: "HEALTH_CHANGE",
    
    PLAYER_GOOSE_HIT: "PLAYER_GOOSE_HIT",
    GOOSE_MOVE: "GOOSE_MOVE",
    GOOSE_ATTACK: "GOOSE_ATTACK",

    // The event sent when a particle hits a tile in the destructible tilemap layer
    PARTICLE_HIT_DESTRUCTIBLE: "PARTICLE_HIT_DESTRUCTIBLE",

    // The event sent when the player dies. Gets sent after the player's death animation
    PLAYER_DEAD: "PLAYER_DEAD",

    PLAYER_TELEPORT: "PLAYER_TELEPORT",

    SWITCH_LEVELS: "SWITCH_LEVELS",

    ENABLE_COVER: "ENABLE_COVER",

    DISABLE_COVER: "DISABLE_COVER"

    
} as const;
