
/**
let apapEnergy = 0
BlockEvents.broken(event=>{
    let block = event.block
    let player = event.player
    if(block.id === "kubejs:aqaq"){
        if (player) {
            apapEnergy = block.entityData.ForgeData["energy"]
        }
    }
})

let JarFluidTank = {}
BlockEvents.broken(event=>{
    let block = event.block
    let player = event.player
    if(block.id === "kubejs:jar"){
        if (player) {
            JarFluidTank = block.entityData.getCompound("data").getCompound("fluidTank")
        }
    }
})


LootJS.modifiers((event)=>{
    event.addBlockLootModifier("kubejs:aqaq")
    .removeLoot(Ingredient.all)
    .apply((context)=>{
        let position = context.getPosition()
        let pos = blockVec3pos(position)
        let block = context.level.getBlock(pos)
        let energy = 
            block.id === "minecraft:air" ? 
            (apapEnergy || 0) : 
            block?.entityData?.getCompound("ForgeData")?.getInt("energy");
        let BlockEntityTag = {}.BlockEntityTag.ForgeData["energy"] = energy
        context.addLoot(energy > 0 ? Item.of("kubejs:aqaq",1,BlockEntityTag) : "kubejs:aqaq")
        apapEnergy = 0
    })
    event.addBlockLootModifier("kubejs:jar")
    .removeLoot(Ingredient.all)
    .apply((context)=>{
        let position = context.getPosition()
        let pos = blockVec3pos(position)
        let block = context.level.getBlock(pos)
        let fluidTank = 
            block.id === "minecraft:air" ? 
            JarFluidTank : 
            block.entityData.getCompound("data").getCompound("fluidTank");
        let Amount = fluidTank.getInt("Amount");
        let FluidName = fluidTank.getString("FluidName");
        let BlockEntityTag = {
            BlockEntityTag : {
                data: {
                    fluidTank: fluidTank
                }
            }
        }
        context.addLoot(Amount > 0 && FluidName != "" ? Item.of("kubejs:jar",1,BlockEntityTag) : "kubejs:jar")
    })
})
 */



const _runFunLootJS = () => {
let apapEnergy = 0;
let jarFluidTank = {};

// 监听方块破坏事件
BlockEvents.broken(event => {
    apapEnergy = getBlockData(event, "kubejs:aqaq", ["ForgeData", "energy"]) || 0;
    jarFluidTank = getBlockData(event, "kubejs:jar", ["data", "fluidTank"]) || {};
});

// 配置掉落修改器
LootJS.modifiers(event => {
    createLootModifier(
        event,
        "kubejs:aqaq",
        block => {
            let energy = block.id === "minecraft:air" ? apapEnergy : block?.entityData?.ForgeData?.energy;
            apapEnergy = 0; // 重置全局变量
            return energy > 0 ? { BlockEntityTag: { ForgeData: { energy: energy } } } : null;
        },
        "kubejs:aqaq"
    );

    createLootModifier(
        event,
        "kubejs:jar",
        block => {
            let fluidTank = block.id === "minecraft:air" ? jarFluidTank : block.entityData?.data?.fluidTank;
            let amount = fluidTank?.Amount || 0;
            let fluidName = fluidTank?.FluidName || "";
            return amount > 0 && fluidName ? { BlockEntityTag: { data: { fluidTank: fluidTank } } } : null;
        },
        "kubejs:jar"
    );
});
}

LootJS.modifiers((e) => {
    e.addBlockLootModifier("kubejs:zio")
    .addLoot("kubejs:zio")
    e.addBlockLootModifier("kubejs:qqqqoo")
    .addLoot("kubejs:qqqqoo")
})
_runFunLootJS()

/**
 * 
 * @param {import("packages/net/minecraft/world/phys/$Vec3").$Vec3$Type} vec3 
 * @returns 
 */
const blockVec3pos = (vec3) => {
    return new BlockPos(vec3.get("x") - 0.5, vec3.get("y") - 0.5, vec3.get("z") - 0.5)
}

/**
 * 
 * @param {$BlockPos_} pos 
 * @returns 
 */
const pos2str = (pos) => {
    return `${pos.x}_${pos.y}_${pos.z}`
}


/**
 * 封装获取方块数据的通用函数
 * @param {$BlockBrokenEventJS_} event 
 * @param {string} blockId 
 * @param {string[]} dataPath 
 * @returns 
 */
function getBlockData(event, blockId, dataPath) {
    let block = event.block;
    let player = event.player;
    if (block.id === blockId && player) {
        let data = block.entityData;
        for (let key of dataPath) {
            if (data && data.get(key)) {
                data = data[key];
            } else {
                return null; // 如果路径中某个部分不存在，返回 null
            }
        }
        return data;
    }
    return null;
}


/**
 * 封装 LootJS 的逻辑
 * @param {import("packages/com/almostreliable/lootjs/kube/$LootModificationEventJS").$LootModificationEventJS$Type} event 
 * @param {string} blockId 
 * @param {(block: $BlockContainerJS)=>{}} getCustomData 
 * @param {string} defaultLoot 
 */
function createLootModifier(event, blockId, getCustomData, defaultLoot) {
    event.addBlockLootModifier(blockId)
        .removeLoot(Ingredient.all)
        .apply((context) => {
            let position = context.getPosition();
            let pos = blockVec3pos(position);
            let block = context.level.getBlock(pos);

            // 获取自定义数据
            let customData = getCustomData(block);
            // console.log(customData)
            // 根据自定义数据生成掉落物
            context.addLoot(customData ? Item.of(blockId, 1, customData) : defaultLoot);
        });
}