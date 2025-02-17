

global.itemss = []
global.blockitem;
function addUniqueElement(array, element) {
    let isExist = false;
    for (let i = 0; i < array.length; i++) {
        if (array[i] === element) {
            isExist = true;
            break;
        }
    }
    if (!isExist) {
        array.push(element);
    }
}

StartupEvents.registry("entity_type", e => {
    e.create("myjo", "entityjs:arrow")
        .onHitBlock(context => {
            if (context) {
                let { result: { blockPos }, entity } = context
                let { x, y, z } = blockPos
                let level = entity.getLevel()
                //level.addParticle('minecraft:campfire_cosy_smoke', entity.getX(), entity.getY(), entity.getZ(), 0, 0, 0);
                let n = 3
                let BlockList = [{ "BlockX": x, "BlockY": y, "BlockZ": z }]
                let NOTH_Block = ['minecraft:bedrock', "minecraft:void_air", "minecraft:air"]
                NOTH_Block.push.apply(NOTH_Block,Ingredient.of('#forge:ores').itemIds)
                // Ingredient.of('#forge:ores').itemIds.forEach(e => {
                //     NOTH_Block.push(e)
                // })
                for (let j = 0; j <= n; j++) {
                    for (let i = -n; i <= n; i++) {
                        for (let k = -n; k <= n; k++) {
                            if (!BlockList.includes({ "BlockX": x - i, "BlockY": y - j, "BlockZ": z - k }) && !(i === 0 && j === 0 && k === 0)) {
                                BlockList.push({ "BlockX": x - i, "BlockY": y - j, "BlockZ": z - k })
                            }
                        }
                    }
                }
                

                if (BlockList.length >= 1) {
                    let kkk = 0
                    BlockList.forEach(e => {
                        if (entity.server !== null) {
                            let Th_BlockPos = new BlockPos(e.BlockX, e.BlockY, e.BlockZ)
                            let Th_Block = level.getBlockState(Th_BlockPos).getBlock()
                            if (!NOTH_Block.includes(Th_Block.id.toString())) {
                                if (Th_Block.id.toString() !== "minecraft:glass") {
                                    addUniqueElement(global.itemss, { item: Th_Block.id.toString(), posX: e.BlockX, posY: e.BlockY, posZ: e.BlockZ })
                                }
                                // let particleD = 0.5
                                // let rayLength = Math.pow(Math.pow(x - e.BlockX, 2) + Math.pow(y - e.BlockY, 2) + Math.pow(z - e.BlockZ, 2), 0.5)
                                // let direction = { x: -(x - e.BlockX) / rayLength, y: -(y - e.BlockY) / rayLength, z: -(z - e.BlockZ) / rayLength }
                                entity.server.scheduleInTicks(2 + kkk, function () {
                                    // level.addParticle('minecraft:campfire_cosy_smoke', Th_BlockPos.getX(), Th_BlockPos.getY(), Th_BlockPos.getZ(), 0, 0, 0);
                                    // entity.server.runCommandSilent(`execute in ${level.dimension} run particle minecraft:lava ${e.BlockX} ${e.BlockY + 1} ${e.BlockZ} 1 1 1`);
                                    level.getBlock(e.BlockX, e.BlockY, e.BlockZ).set('minecraft:glass')
                                    // entity.server.runCommandSilent(`execute in ${level.dimension} run setblock ${e.BlockX} ${e.BlockY} ${e.BlockZ} minecraft:glass`)
                                    entity.server.scheduleInTicks(1, function () {
                                        level.getBlock(e.BlockX, e.BlockY, e.BlockZ).set('minecraft:air')
                                        // entity.server.runCommandSilent(`execute in ${level.dimension} run setblock ${e.BlockX} ${e.BlockY} ${e.BlockZ} minecraft:air`)
                                    })
                                    //level.setBlock(Th_BlockPos,Th_Block,1,1)
                                })
                                kkk += 1
                            }
                        }
                    })
                }
                entity.kill()
            }
        })
        .tick(E=>{
            global.myjoTick(E)
        })
        .shouldRenderAtSqrDistance(() => true)
        .textureLocation(entity => {
            return "kubejs:textures/item/myjo_item.png"
        })
        .item(item => {
            item.tag("minecraft:arrows")
            item.texture("kubejs:item/myjo_item")
        })
})


/*
ForgeEvents.onEvent("net.minecraftforge.event.entity.living.LivingChangeTargetEvent",event => {
    global.LivingChangeTargetEvent(event)
})
*/

function colorLinearNum () {
    let time = Date.now()
    return (time % 255)
}
function colorRandomNum () {
    return Math.floor(Math.random() * 255)
}



/**
 * 
 * @param {Internal.Entity_} E 
 */
global.myjoTick = (E) => {
    let {x,y,z} = E
    // console.log(x,y,z)
    /** @type {LDParticle} */
    let data = {
        pType             : "ELECTRIC_SPARK",
        colorStart        : [colorLinearNum(),colorLinearNum(),colorRandomNum()],
        colorEnd          : [colorRandomNum(),colorRandomNum(),colorLinearNum()],
        transparencyStart : 1,
        transparencyEnd   : 0,
        scaleStart        : 1,
        scaleEnd          : 0,
        lifetime          : 20,
        randomOffset      : 0,
        motionX           : 0,
        motionY           : 0,
        motionZ           : 0,
        randomMotionX     : 0,
        randomMotionY     : 0,
        randomMotionZ     : 0,
        x                 : x,
        y                 : y,
        z                 : z,
        count             : 1
    }
    Utils.getServer().sendData(
        "ld:particle",
        data
    )
}