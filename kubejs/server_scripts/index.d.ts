/// <reference path="./src/function/curios.js" />

import { $Event } from "packages/dev/architectury/event/$Event";
import { $PlayerEventJS$Type } from "packages/dev/latvian/mods/kubejs/player/$PlayerEventJS";
import { $MinecraftServer } from "packages/net/minecraft/server/$MinecraftServer";
import { $LivingEntity$Type } from "packages/net/minecraft/world/entity/$LivingEntity";
import { $Player } from "packages/net/minecraft/world/entity/player/$Player";
import { $Item$Type } from "packages/net/minecraft/world/item/$Item";
import { $ItemStack$Type } from "packages/net/minecraft/world/item/$ItemStack";
import { $EventPriority$Type } from "packages/net/minecraftforge/eventbus/api/$EventPriority";
import { $SlotResult } from "packages/top/theillusivec4/curios/api/$SlotResult";
import "packages/top/theillusivec4/curios/api/type/util/$ICuriosHelper";
import { $SidedNativeEvents } from "packages/zank/mods/eventjs/$SidedNativeEvents";

declare global {
  enum ParticleType {
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

  type ParticleTypeStr = keyof typeof ParticleType;

  class Particle {
    constructor(event: $PlayerEventJS$Type);
    public type(type: ParticleType | ParticleTypeStr): this;
    public lifetime(time: number): this;
    public transparencyData(start: number, end: number): this;
    public scaleData(start: number, end: number): this;
    public colorData(
      start: [number, number, number],
      end: [number, number, number]
    ): this;
    public position(x: number, y: number, z: number): this;
    public motion(x: number, y: number, z: number): this;
    public randomMotion(x: number, y: number, z: number): this;
    public randomOffset(amount: number): this;
    public spawn(amount: number): this;
  }
  type JavaNumber = number | double | any | integer | float;
  type generateRandomCoordinatesReturn = {
    x1: string;
    y1: string;
    z1: string;
    x2: string;
    y2: string;
    z2: string;
  };
  function generateRandomCoordinates(fixedPoint: {
    x: JavaNumber;
    y: JavaNumber;
    z: JavaNumber;
  }): generateRandomCoordinatesReturn;
  function delay(
    server: $MinecraftServer,
    fun: (s: number, e: number) => void,
    s_tick: number,
    e_tick: number,
    delayTick: number
  ): void;
  type CuriosMethod =
    | "shrink"
    | "grow"
    | "getfor"
    | "setfor"
    | "unlock"
    | "lock";
  type CuriosSlot =
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
  /**
   *
   * @param method shrink 是减少槽位，grow 是增加槽位，getfor 是获取指定槽位数量，setfor 是设置指定槽位数量，unlock 是解锁槽位，lock 是锁定槽位
   * @param slot an_focus U盘，belt 腰带，body 胸饰，charm 护符，extra 额外，feet 脚，hands 手，head 首饰，necklace 项链，ring 戒指
   */
  function CuriosSlotMethod(
    method: CuriosMethod,
    slot: CuriosSlot,
    player: $Player,
    amount: number
  ): void | integer;

  type CuriosInfoForPlayerSlot = {
    hasItem: boolean;
    count: number;
    SlotBySelfIndexs: Array<number>;
    SlotSize: number;
  };
  function getCuriosInfoForPlayerSlot(
    player: $Player,
    slot: CuriosSlot,
    itemId: $ItemStack$Type
  ): CuriosInfoForPlayerSlot;
  function getCuriosItemListBySlot(
    player: $Player,
    slot: CuriosSlot
  ): Array<$ItemStack$Type>;
  function hasCuriosItem(player: $Player, itemId: $ItemStack$Type): boolean;
  function hasCuriosItemBySlot(
    player: $Player,
    slot: CuriosSlot,
    itemId: $ItemStack$Type
  ): boolean;

  const NativeEvents: $SidedNativeEvents & {
    public
    "onEvent"<T extends typeof $Event<unknown>>(
      type: T,
      handler: (event: InstanceType<T>) => void
    ): any;
  };

  const global = {}
}

declare module "packages/top/theillusivec4/curios/api/type/util/$ICuriosHelper" {
  interface $ICuriosHelper {
    /**
     *
     * @deprecated
     */
    "findCurios(net.minecraft.world.entity.LivingEntity,net.minecraft.world.item.Item)"(
      arg0: $LivingEntity$Type,
      arg1: $Item$Type
    ): Array<$SlotResult>;
    /**
     *
     * @deprecated
     */
    "findCurios(net.minecraft.world.entity.LivingEntity,java.lang.String[])"(
      arg0: $LivingEntity$Type,
      ...arg1: string[]
    ): Array<$SlotResult>;
  }
}
