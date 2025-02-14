import { $SoundEvent$Type } from "packages/net/minecraft/sounds/$SoundEvent";
import { $ParticleOptions$Type } from "packages/net/minecraft/core/particles/$ParticleOptions";
import { $ItemStack } from "packages/net/minecraft/world/item/$ItemStack";

export type SendDataId = "kubejs:sound" | "kubejs:magic_damage" | "ld:particle" | "mc:particle";
export enum ParticleType {
    WISP           = "WISP"                    ,
    SMOKE          = "SMOKE"                   ,
    SPARKLE        = "SPARKLE"                 ,
    TWINKLE        = "TWINKLE"                 ,
    STAR           = "STAR"                    ,
    LAVA           = "LAVA_PARTICLE"           ,
    NAUTILUS       = "NAUTILUS_PARTICLE"       ,
    CLOUD          = "CLOUD_PARTICLE"          ,
    SONIC_BOOM     = "SONIC_BOOM_PARTICLE"     ,
    SOUL           = "SOUL_PARTICLE"           ,
    VIBRATION      = "VIBRATION_PARTICLE"      ,
    ELECTRIC_SPARK = "ELECTRIC_SPARK_PARTICLE" ,
    NOTE           = "NOTE_PARTICLE"           ,
}
export type ParticleTypeStr = keyof typeof ParticleType;
export interface LDParticle {
    pType             : ParticleType | ParticleTypeStr ;
    x                 : number                         ;
    y                 : number                         ;
    z                 : number                         ;
    motionX           : number                         ;
    motionY           : number                         ;
    motionZ           : number                         ;
    randomMotionX     : number                         ;
    randomMotionY     : number                         ;
    randomMotionZ     : number                         ;
    randomOffset      : number                         ;
    count             : number                         ;
    lifetime          : number                         ;
    scaleStart        : number                         ;
    scaleEnd          : number                         ;
    colorStart        : [number, number, number]       ;
    colorEnd          : [number, number, number]       ;
    transparencyStart : number                         ;
    transparencyEnd   : number                         ;
}
export interface MCParticle {
    pType : $ParticleOptions$Type ;
    x     : number                ;
    y     : number                ;
    z     : number                ;
    dx    : number                ;
    dy    : number                ;
    dz    : number                ;
}
export interface KJSSound {
    sound  : $SoundEvent$Type ;
    volume : number           ;
    pitch  : number           ;
}

export interface TestMultiBlockRecipes {
    input  : $ItemStack[] ,
    Amount : number       ,
    output : number
}
