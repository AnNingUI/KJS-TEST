import { $ForgeConfigSpec$BooleanValue } from "packages/net/minecraftforge/common/$ForgeConfigSpec$BooleanValue";
import { $ForgeConfigSpec$ConfigValue } from "packages/net/minecraftforge/common/$ForgeConfigSpec$ConfigValue";
import { $ForgeConfigSpec$IntValue } from "packages/net/minecraftforge/common/$ForgeConfigSpec$IntValue";


declare module "packages/net/minecraftforge/common/$ForgeConfigSpec$Builder" {

  export class $ForgeConfigSpec$Builder {
    constructor();

    public "defineInRange(java.lang.String,int,int,int)"(
        arg0: string,
        arg1: number,
        arg2: number,
        arg3: number
    ): $ForgeConfigSpec$IntValue;

    public "comment(java.lang.String)"(arg0: string): $ForgeConfigSpec$Builder;

    public "define(java.lang.String,boolean)"(
        arg0: string,
        arg1: boolean
    ): $ForgeConfigSpec$BooleanValue;

    public "define(java.lang.String,java.lang.Object)"<T>(
        arg0: string,
        arg1: T
    ): $ForgeConfigSpec$ConfigValue<T>;
  }
}

declare module "packages/com/mojang/blaze3d/systems/$RenderSystem" {
  export class $RenderSystem {
    public static "blendFunc(int,int)"(arg0: number, arg1: number): void
  }
}