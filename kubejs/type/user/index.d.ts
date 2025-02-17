declare type SendDataId =
  | "kubejs:sound"
  | "kubejs:magic_damage"
  | "ld:particle"
  | "mc:particle";
declare enum ParticleType {
  WISP = "WISP",
  SMOKE = "SMOKE",
  SPARKLE = "SPARKLE",
  TWINKLE = "TWINKLE",
  STAR = "STAR",
  LAVA = "LAVA_PARTICLE",
  NAUTILUS = "NAUTILUS_PARTICLE",
  CLOUD = "CLOUD_PARTICLE",
  SONIC_BOOM = "SONIC_BOOM_PARTICLE",
  SOUL = "SOUL_PARTICLE",
  VIBRATION = "VIBRATION_PARTICLE",
  ELECTRIC_SPARK = "ELECTRIC_SPARK_PARTICLE",
  NOTE = "NOTE_PARTICLE",
}

declare type CuriosMethod =
  | "shrink"
  | "grow"
  | "getfor"
  | "setfor"
  | "unlock"
  | "lock";
declare type CuriosSlot =
  | "an_focus"
  | "belt"
  | "body"
  | "charm"
  | "extra"
  | "feet"
  | "hands"
  | "head"
  | "necklace"
  | "ring";

declare type ParticleTypeStr = keyof typeof ParticleType;
declare interface LDParticle {
  pType: ParticleTypeStr;
  x: number;
  y: number;
  z: number;
  motionX: number;
  motionY: number;
  motionZ: number;
  randomMotionX: number;
  randomMotionY: number;
  randomMotionZ: number;
  randomOffset: number;
  count: number;
  lifetime: number;
  scaleStart: number;
  scaleEnd: number;
  colorStart: [number, number, number];
  colorEnd: [number, number, number];
  transparencyStart: number;
  transparencyEnd: number;
}
declare interface MCParticle {
  pType: Internal.ParticleOptions;
  x: number;
  y: number;
  z: number;
  dx: number;
  dy: number;
  dz: number;
}
declare interface KJSSound {
  sound: Internal.SoundEvent;
  volume: number;
  pitch: number;
}

declare interface TestMultiBlockRecipes {
  input: Internal.ItemStack[];
  Amount: number;
  output: number;
}

declare interface MagicRecipes {
  rType: String;
  input: { item: Internal.ItemStack[]; fluid: Internal.FluidStackJS_[] };
  output: Internal.ItemStack | Internal.FluidStackJS_;
  tick: integer;
  id: String;
}
