const { $BlockEntityJS : $BeJS } = require('packages/dev/latvian/mods/kubejs/block/entity/$BlockEntityJS');
const { $EntitySelector : EntitySelector } = require('packages/net/minecraft/world/entity/$EntitySelector');
const { $AABB : mutAABB } = require('packages/net/minecraft/world/phys/$AABB');

const $PatchouliAPI = require('packages/vazkii/patchouli/api/$PatchouliAPI').$PatchouliAPI;
const $Character = Java.loadClass('java.lang.Character');
const $GlowItemFrame = require('packages/net/minecraft/world/entity/decoration/$GlowItemFrame').$GlowItemFrame;

global.ClayAltarBlock = {
    O: Block.getBlock('minecraft:beacon'),
    B: Block.getBlock('minecraft:diamond_block'),
    I: Block.getBlock('minecraft:iron_block'),
}

global.Test_MultiBlock = {
    G: Block.getBlock('minecraft:obsidian'),
    O: Block.getBlock('minecraft:sculk_shrieker')
}

global.blastFurnaceBlock = {
    O: 'create:andesite_alloy_block',
    Y: Block.getBlock('minecraft:lava_cauldron'),
    Z: Block.getBlock('minecraft:blast_furnace')
}

global.magicAltarBlock = {
    O: 'kubejs:myjq', // 机器核心
    B: 'mekanism:boiler_casing', //锅炉外壳
    C: 'create:industrial_iron_block', //工业铁块
    Q: 'create:framed_glass', //框架玻璃
    K: 'cai:r_glowstone', //发光石
    D: 'minecraft:crying_obsidian', //哭泣的黑曜石
    Z: 'create:depot', //置物台
    J: 'kubejs:jar' //罐子
}

global.ClayAltar = () =>
    $PatchouliAPI.get().makeMultiblock(
        [
            ["___", "_0_", "___"],
            ["___", "_B_", "___"],
            ["DFH", "JIK", "LZX"],
        ],
        new $Character('_'),
        $PatchouliAPI.get().anyMatcher(),
        new $Character('J'), //面向玩家，玩家方向为北，方块为南，二阶数组从（各字符串内字符）左往右即玩家从北往南，方块从南往北，z递增
        "minecraft:polished_diorite_stairs[facing=south,half=bottom,shape=straight]",
        new $Character('K'), //玩家方向为南，方块为北
        "minecraft:polished_diorite_stairs[facing=north,half=bottom,shape=straight]",
        new $Character('D'), //玩家方向为西，方块为东，二阶数组从（各字符串）左往右即玩家从西往东，方块从东往西，x递增
        "minecraft:polished_diorite_stairs[facing=east,half=bottom,shape=outer_right]",
        new $Character('F'),
        "minecraft:polished_diorite_stairs[facing=east,half=bottom,shape=straight]",
        new $Character('H'),
        "minecraft:polished_diorite_stairs[facing=north,half=bottom,shape=outer_right]",
        new $Character('L'),
        "minecraft:polished_diorite_stairs[facing=south,half=bottom,shape=outer_right]",
        new $Character('Z'),
        "minecraft:polished_diorite_stairs[facing=west,half=bottom,shape=straight]",
        new $Character('X'),
        "minecraft:polished_diorite_stairs[facing=north,half=bottom,shape=outer_left]",
        new $Character('I'),
        global.ClayAltarBlock.I,
        new $Character('B'),
        global.ClayAltarBlock.B,
        new $Character('0'),
        global.ClayAltarBlock.O
    )


global.Test_MultiBlock_Machine = () =>
    $PatchouliAPI.get().makeMultiblock(
        [
            ["___", "___", "___"],
            ["___", "_0_", "___"],
            ["ggg", "ggg", "ggg"],
        ],
        new $Character('_'),
        $PatchouliAPI.get().anyMatcher(),
        new $Character('g'),
        global.Test_MultiBlock.G,
        new $Character('0'),
        global.Test_MultiBlock.O
    )


global.blastFurnace = () => 
    $PatchouliAPI.get().makeMultiblock(
        [
            ["___", "___", "___"],
            ["___", "OO_", "___"],
            ["OO_", "0YO", "OO_"],
        ],
        new $Character('_'),
        $PatchouliAPI.get().anyMatcher(),
        new $Character('O'),
        global.blastFurnaceBlock.O,
        new $Character('Y'),
        global.blastFurnaceBlock.Y,
        new $Character('0'),
        global.blastFurnaceBlock.Z,
    )


global.magicAltar = () =>
    $PatchouliAPI.get().makeMultiblock(
        [
            ["_dkkkd_", "d_____d", "k_____k", "k_____k", "k_____k", "d_____d", "_dkkkd_"],
            ["_dkkkd_", "dz___zd", "k_____k", "k_____k", "k_____k", "dz___zd", "_dkkkd_"],
            ["_dkkkd_", "dz_j_zd", "k_____k", "kj___jk", "k_____k", "dz_j_zd", "_dkkkd_"],
            ["_ccccc_", "ccbbbcc", "cbqqqbc", "cbq0qbc", "cbqqqbc", "ccbbbcc", "_ccccc_"],
        ],
        new $Character('_'),
        $PatchouliAPI.get().anyMatcher(),
        new $Character('0'),
        global.magicAltarBlock.O,
        new $Character('b'),
        global.magicAltarBlock.B,
        new $Character('c'),
        global.magicAltarBlock.C,
        new $Character('q'),
        global.magicAltarBlock.Q,
        new $Character('k'),
        global.magicAltarBlock.K,
        new $Character('d'),
        global.magicAltarBlock.D,
        new $Character('z'),
        global.magicAltarBlock.Z,
        new $Character('j'),
        global.magicAltarBlock.J
    )

global.MULTIBLOCK = {
    ClayAltar: global.ClayAltar,
    Test_MultiBlock_Machine: global.Test_MultiBlock_Machine,
    blastFurnace: global.blastFurnace,
    magicAltar: global.magicAltar
}

StartupEvents.postInit((event) => {
    $PatchouliAPI.get().registerMultiblock(
        ResourceLocation("kubejs:clay_altar"),
        global.ClayAltar()
    );
    $PatchouliAPI.get().registerMultiblock(
        ResourceLocation("kubejs:test_multiblock_machine"),
        global.Test_MultiBlock_Machine()
    );
    $PatchouliAPI.get().registerMultiblock(
        ResourceLocation("kubejs:blast_furnace"),
        global.blastFurnace()
    );
    $PatchouliAPI.get().registerMultiblock(
        ResourceLocation("kubejs:magic_altar"),
        global.magicAltar()
    );
})




CreateEvents.spoutHandler((event) => {
    //? 創建注液器處理器，需要提供 ID，因為這裡沒有辦法生成一個一致的 UUID。
    //?
    //? 注液器每個 tick 都會以 simulate = true 的方式調用處理器，如果返回值 > 0，則注液器將開始注液動畫，
    //? 動畫結束時，處理器將再次以 simulate = false 的方式調用。
    //?
    //? 返回的整數表示此操作應該消耗多少單位液體。
    //? 單位視模組載入器而不同，Forge = 1MB、Fabric = 1 unit
    //? 1 B（Bucket，桶） = 1000 MB（MiliBucket，千分之一桶） = 81000 unit（單位流體）
    

    //这个是芒果笔记里面的示例
    event.add(
        "kubejs:obsidian", // ID
        "minecraft:lava", // 目標方塊
        (block, fluid, simulate) => {
            if (fluid.id === Fluid.water().id && fluid.amount >= 100) {
                if (!simulate) {
                    block.set("minecraft:obsidian");
                }
                return 100;
            }
            return 0;
        });


    event.add(
        "kubejs:jar_input",
        "kubejs:jar",
        (block, fluid, simulate) => {
            let be = /**@type {$BeJS}*/(block.entity);
            let dataCompound = block.entityData.getCompound("data");
            if (!dataCompound) return 0;

            let fluidTank = dataCompound.getCompound("fluidTank");
            if (!fluidTank) return 0;

            let Amount = fluidTank.getInt("Amount") || 0;
            let id = fluidTank.getString("FluidName") || "";
            let fluidType = `${fluid.fluid.arch$registryName()}`;
            let fluidAmount = fluid.amount;

            let use = 250;
            let max = 8000;
            let maxUse = max - Amount;

            if (fluidType === id && Amount < max) {
                // 计算可以添加的流体量
                let addAmount = Math.min(fluidAmount, use, maxUse);
                if (addAmount > 0) {
                    if (simulate) {
                        // 模拟模式：预计算
                        return addAmount;
                    } else {
                        // 实际模式：更新流体箱
                        fluidTank.putInt("Amount", Amount + addAmount);
                        return addAmount;
                    }
                }
            } else if (Fluid.of(id, Amount).isEmpty() || id === "") {
                let addAmount = Math.min(fluidAmount, use);
                if (addAmount > 0) {
                    if (simulate) {
                        // 模拟模式：预计算
                        return addAmount;
                    } else {
                        // 实际模式：更新数据
                        dataCompound.put("fluidTank", {
                            FluidName: fluidType,
                            Amount: addAmount
                        });
                        return addAmount;
                    }
                }
            }

            return 0;
        }
    );

    
    
    global.customCastingrecipes.forEach(rs => {
        event.add(
            rs.id, // ID
            'minecraft:hopper', // 目標方塊
            (block, fluid, simulate) => {
                if (fluid.id === rs.fluid.id && fluid.amount >= rs.amount) {
                    let aabb = new mutAABB(block.x, block.y+1, block.z, block.x + 1, block.y + 2, block.z + 1);
                    let glow_item_frame = block.level.getEntitiesOfClass($GlowItemFrame,aabb,EntitySelector.ENTITY_STILL_ALIVE)
                    let glow_item_item = /**@type {$GlowItemFrame} */ (glow_item_frame[0] ==undefined ? undefined : glow_item_frame[0].item);
                    let length = block.getEntityData().Items.length
                    let level = block.level
                    // global.prtList([glow_item_frame,glow_item_item])
                    if (!simulate && glow_item_frame !== undefined && glow_item_item !== undefined && length < 5) {
                        if(glow_item_item.id == rs.template.id){
                            let entity3 = level.createEntity('minecraft:item');
                            entity3.mergeNbt({Item:{id:rs.output.id,Count:1}});
                            entity3.setPosition(block.offset(0, 1, 0).x + 0.5, block.offset(0, 1, 0).y - 0.2, block.offset(0, 1, 0).z + 0.5);
                            entity3.spawn();
                            
                        }
                    }
                    // global.prtList([glow_item_frame !== undefined && glow_item_item !== undefined && glow_item_item.id == "minecraft:fire_charge"])
                    return glow_item_frame !== undefined && glow_item_item !== undefined && glow_item_item.id == rs.template.id && length < 5 ? rs.amount : 0;
                }
                return 0;
            })
    })
});


global.prtList = (List) => {
    List.forEach(element => {
        console.log(element)
    });
}





global.customCastingrecipes = [
    {
        fluid: Fluid.of("minecraft:water"),
        amount: 1000,
        template: Item.of("minecraft:fire_charge"),
        output: Item.of("minecraft:diamond"),
        id: "kubejs:clay_altar"
    },
    {
        fluid: Fluid.of("lava"),
        amount: 1000,
        template: Item.of("minecraft:fire_charge"),
        output: Item.of("minecraft:apple"),
        id: "kubejs:omg"
    }
]