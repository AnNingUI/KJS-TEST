const { $ItemStack } = require("packages/net/minecraft/world/item/$ItemStack");
const { $IFluidHandler } = require("packages/net/minecraftforge/fluids/capability/$IFluidHandler");

let recipes = [{
    "input": [
        Item.of("minecraft:diamond_sword"),
        Item.of("morecategory:diamond_sickle"),
    ],
    "Amount": 1000,
    "output": [
        Item.of("3x minecraft:diamond")
    ]
}, {
    "input": [
        Item.of("minecraft:iron_sword"),
        Item.of("morecategory:diamond_sickle"),
    ],
    "Amount": 500,
    "output": [
        Item.of("3x minecraft:iron_ingot")
    ]
}, {
    "input": [
        Item.of("minecraft:iron_sword"),
        Item.of("morecategory:diamond_sickle"),
        Item.of("minecraft:diamond_sword")
    ],
    "Amount": 500,
    "output": [
        Item.of("3x minecraft:apple")
    ]
}];


//PatchouliAPI多方块检测 actualCombat
BlockEvents.rightClicked((event) => {
    const { item, level, block, player, } = event

    const { pos } = block
    /*
    // 调试获取data
    if(item == Item.of('kubejs:bone_meal_battle')){
        event.player.runCommand(`data get block ${block.x} ${block.y} ${block.z}`)
    }
    */
    if (item.id !== "minecraft:stick" || level.isClientSide()) {
        return
    }
    if (block.id === 'minecraft:sculk_shrieker') {
        let rotation = global.MULTIBLOCK.Test_MultiBlock_Machine().validate(level, pos)
        if (rotation === null) {
            return
        }
        let ItemList = global.getItemListToBe(pos, level)
        if (ItemList === undefined || ItemList.length === 0) {
            return
        }

        let recipe = selectRecipe(ItemList,recipes)
        // 判断有无储罐
        let ftBool = false
        // 判断有无魔力
        let ftBool2 = false
        let Amountreduce = () => {
            let offsetCoordinateSet = [
                [-2,  0,  2], [-2,  0,  1], [-2,  0,  0], [-2,  0, -1], [-2,  0, -2],
                [-1,  0, -2], [ 0,  0, -2], [ 1,  0, -2], [ 2,  0, -2],
                [ 2,  0, -1], [ 2,  0,  0], [ 2,  0,  1], [ 2,  0,  2],
                [ 1,  0,  2], [ 0,  0,  2], [-1,  0,  2], 
                [-2, -1,  2], [-2, -1,  1], [-2, -1,  0], [-2, -1, -1], [-2, -1, -2],
                [-1, -1, -2], [ 0, -1, -2], [ 1, -1, -2], [ 2, -1, -2],
                [ 2, -1, -1], [ 2, -1,  0], [ 2, -1,  1], [ 2, -1,  2],
                [ 1, -1,  2], [ 0, -1,  2], [-1, -1,  2]
            ]
            let ftPos = offsetCoordinateSet
                .filter(e => event.block.offset(e[0], e[1], e[2]).id === 'create:fluid_tank')[0]

            if (!ftPos) {
                player.statusMessage = Text.translate("tell.anningui.interesting.mana.need.0").darkRed()
                ftBool = true
                return
            }
            let ftBlock = event.block.offset(ftPos[0], ftPos[1], ftPos[2])
            let ftBlockBe = ftBlock.getEntity()
            let ftBlockCap = /**@type { $IFluidHandler }*/ (ftBlockBe.getCapability(ForgeCapabilities.FLUID_HANDLER).orElse(null))
            let ftFluid = ftBlockCap.getFluidInTank(0).fluid.arch$registryName()
            let ftAmount = ftBlockCap.getFluidInTank(0).amount
            if (ftFluid !== 'cai:mana') {
                player.statusMessage = Text.translate("tell.anningui.interesting.mana.need.1").darkRed()
                ftBool2 = true
                return
            }
            if (ftAmount < recipe.Amount) {
                player.statusMessage = Text.translate("tell.anningui.interesting.mana.need.2").darkRed()
                return
            }
            if (!isSubset(
                recipe.input.map(e => e.id), ItemList.map(i => i.id)
            )) {
                return
            }
            ftBlockCap.drain(Fluid.of('cai:mana', recipe.Amount), "execute");
            ftBool = false
            ftBool2 = false
        }

        recipe.Amount && Amountreduce()
        if (ftBool) { return }
        if (ftBool2) { return }
        if (global.RemoveAndPopItemListToBe(block, pos, level, recipe)) { }
        else {
            return
        }
    }

})

/**
 * 判断arr1是否是arr2的子集
 * @param {[]} arr1
 * @param {[]} arr2
 * @returns
 */
const isSubset = (arr1, arr2) => {
    return arr1.every(elem => arr2.includes(elem));
}

/**
 * 假设ItemList有[Item.of("minecraft:iron_sword"),Item.of("minecraft:iron_sword"),Item.of("morecategory:diamond_sickle"),Item.of("morecategory:diamond_sickle"),Item.of("minecraft:diamond_sword")]
 * 那么就选recipes中input为[Item.of("minecraft:iron_sword"),Item.of("morecategory:diamond_sickle"),Item.of("minecraft:diamond_sword")]物品最齐全的配方
 * 如果有多个符合则选择第一个
 * 注意recipe的input里面可以有相同元素如[Item.of("minecraft:iron_sword"),Item.of("minecraft:iron_sword")],则表示为有两个铁剑
 *
 * 根据可用的物品选择最合适的配方。
 * @param {$ItemStack[]} ItemList - 可用物品的列表。
 * @param {{ input: $ItemStack[], Amount: number, output: $ItemStack[] }[]} recipes - 配方列表。
 * @returns {{ input: $ItemStack[], Amount: number, output: $ItemStack[] } | null} - 选择的配方或如果没有合适的配方则返回 null。
 */
const selectRecipe = (ItemList, recipes) => {
    // 将 ItemList 转换为物品计数映射
    let itemCountMap = {};
    for (let item of ItemList) {
        let itemId = item.id;
        if (!itemCountMap[itemId]) {
            itemCountMap[itemId] = 0;
        }
        itemCountMap[itemId] += item.count;
    }

    // 获取配方能满足的物品数
    const countFulfilledItems = (requiredItems) => {
        let itemCountMapCopy = Object.assign({}, itemCountMap);
        let fulfilledCount = 0;

        for (let item of requiredItems) {
            let requiredCount = item.count;
            let availableCount = itemCountMapCopy[item.id] || 0;

            if (availableCount >= requiredCount) {
                fulfilledCount += requiredCount;
                itemCountMapCopy[item.id] -= requiredCount;
            }
        }

        return fulfilledCount;
    };

    // 选择物品最齐全的配方
    let bestRecipe = null;
    let maxFulfilledCount = -1;

    for (let recipe of recipes) {
        let fulfilledCount = countFulfilledItems(recipe.input);

        if (fulfilledCount > maxFulfilledCount) {
            maxFulfilledCount = fulfilledCount;
            bestRecipe = recipe;
        }
    }

    // 如果找到最齐全的配方，则返回
    if (bestRecipe) {
        return bestRecipe;
    }

    // 如果没有找到合适的配方，则返回 null
    return null;
};


