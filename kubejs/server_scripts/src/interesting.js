const $PatchouliAPI = Java.loadClass('vazkii.patchouli.api.PatchouliAPI')
const AttributeModifier = Java.loadClass('net.minecraft.world.entity.ai.attributes.AttributeModifier')
const AttributeModifieroperation = Java.loadClass('net.minecraft.world.entity.ai.attributes.AttributeModifier$Operation')


//统计数组重复元素及重复元素个数
//返回带特定键值对{ItemId:重复元素，ItemCount:重复元素个数}的数组
function countSameElements(arr) {
    let counts = {};
    // 统计数组中每个元素出现的次数
    arr.forEach(function (item) {
        counts[item] = (counts[item] || 0) + 1;
    });
    // 格式化结果为指定格式
    let result = [];
    for (let key in counts) {
        if (key != "minecraft:air") {
            result.push({ ItemId: key, ItemCount: counts[key] });
        }
    }
    return result;
}
Object

ItemEvents.rightClicked(event => {

    if(!global.itemss) return
    
    //时钟【原来的】
    if (event.item.id === "minecraft:clock") {
        if (global.itemss.length !== 0) {
            event.item.count--
            event.player.give(Item.of("minecraft:clock", {
                Itemss: global.itemss.map(obj => obj.item)
            }))
            global.itemss = []
        }
        else if (event.item.nbt.Itemss !== undefined) {
            event.item.nbt.Itemss.forEach(e => {
                event.player.give(e)
            })
            event.item.count--
        }
    }
    //指南针【现在的】
    if (event.item.id === "minecraft:compass") {
        if (global.itemss.length !== 0) {
            event.item.count--
            let LoreP = []
            let AllItemS = countSameElements(global.itemss.map(
                obj => obj.item))

            // console.log(AllItemS)
            AllItemS.forEach(e => {
                if (e.ItemId != "minecraft:air") {
                    LoreP.push(`{"italic":false,"color":"white","extra":[{"text":""},{"color":"dark_purple","text":"${e.ItemCount
                        }x "},{"color":"dark_purple","translate":"${Item.of(e.ItemId).getDescriptionId()
                        }"}],"text":""}`)
                }
            })
            let giveItem = Item.of("minecraft:compass", {
                Itemss: AllItemS,
                display: {
                    Lore:
                        LoreP.map(function (element) { return element.toString(); })
                    ,
                    Name: `{"italic":false,"extra":[{"text":""},{"color":"dark_red","text":"扫描数据"}],"text":""}`
                }
            })
            // console.log(giveItem.nbt ?? null)
            event.player.give(giveItem)
            global.itemss = []
        }
        else if (event.item?.nbt?.Itemss !== undefined) {
            event.item.nbt.Itemss.forEach(e => {
                for (let i = 0; i < e.ItemCount; i++) {
                    event.player.give(e.ItemId)
                }
            })
            event.item.count--
        }
    }
})






//死亡点记录
global.pos = { x: 0, y: 0, z: 0 }
global.death_time = 0
function BIDUI(pos1, pos2) {
    return pos1.x === pos2.x && pos1.y === pos2.y && pos1.z === pos2.z
}
function MOHUBIDUI(pos1, pos2) {
    return (pos1.x >= pos2.x - 1 && pos1.x <= pos2.x + 1) &&
        (pos1.y >= pos2.y - 1 && pos1.y <= pos2.y + 1) &&
        (pos1.z >= pos2.z - 1 && pos1.z <= pos2.z + 1)
}

EntityEvents.death(event => {

    event.entity.isAnimal()
    if (event.entity.isPlayer()) {
        global.pos.x = event.entity.x
        global.pos.y = event.entity.y
        global.pos.z = event.entity.z
    }
    if (global.death_time == 1) { global.death_time = 0 }

})
PlayerEvents.tick(event => {
    let n = 2
    let pos = { x: global.pos.x, y: global.pos.y, z: global.pos.z }
    let aabb = AABB.CUBE.move(pos.x, pos.y, pos.z).expandTowards(-n, -n, -n).expandTowards(n, n, n)
    if (!BIDUI({ x: 0, y: 0, z: 0 }, pos)
        && !BIDUI(event.player, pos)
    ) {
        for (let i = 0; i <= 50; i++) {
            event.server.runCommandSilent(`execute in ${event.level.dimension} run particle ${global.particle.soulpac} ${pos.x} ${pos.y + i} ${pos.z}`)

        }
    }
    if (aabb.contains(event.player.x, event.player.y, event.player.z) && global.death_time == 1) {
        global.pos.x = 0
        global.pos.y = 0
        global.pos.z = 0
        global.death_time = 0
    }
})
PlayerEvents.respawned(event => {
    global.death_time = 1
})

//
ItemEvents.rightClicked(e => {
    let HandItem = 'minecraft:prismarine_crystals'
    let player = e.player
    let { x, y, z } = player
    let pos = { x: global.pos.x, y: global.pos.y, z: global.pos.z }
    if (e.player.getHeldItem(e.hand) === HandItem && !BIDUI({ x: 0, y: 0, z: 0 }, pos)) {

        let rayLength = Math.pow(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2) + Math.pow(z - pos.z, 2), 0.5)
        let particleD = Math.log(rayLength + 0.5 * 2.71828)
        let direction = { x: -(x - pos.x) / rayLength, y: -(y - pos.y) / rayLength, z: -(z - pos.z) / rayLength }
        if (rayLength >= 10000) { player.statusMessage = Text.translate("tell.anningui.interesting.death") } else {

            for (let i = 0; i < rayLength / particleD; i++) {
                e.server.runCommandSilent(`execute in ${e.level.dimension} run particle ${global.particle.soulpac} ${x + (direction.x) * i * particleD} ${y + direction.y * i * particleD + 3} ${z + (direction.z) * i * particleD}`)
            }
        }
    }
})


//kubejs画方程
/**
 * 
 * @param {number} start 
 * @param {number} stop 
 * @param {number} num 
 * @param {number} dimensionFactor 
 * @returns 
 */
function linspace(start, stop, num, dimensionFactor) {
    const adjustedNum = Math.floor(num / dimensionFactor);
    const step = (stop - start) / (adjustedNum - 1);
    return { start: start, stop: step, num: adjustedNum, step: step };
}

/**
 * 
 * @param {{ start: number, stop: number, num: number, step: number}} numlist1 
 * @param {{ start: number, stop: number, num: number, step: number}} numlist2 
 * @param {(x: number, z: number) => boolean} equation 
 * @returns 
 */
function coordinates(numlist1, numlist2, equation) {
    const result = [];
    const { start: start1, step: step1, num: num1 } = numlist1;
    const { start: start2, step: step2, num: num2 } = numlist2;

    for (let i = 0; i < num1; i++) {
        let x = start1 + i * step1;

        for (let j = 0; j < num2; j++) {
            let z = start2 + j * step2;

            if (equation(x, z)) {
                result.push({ dx: x, dy: z });
            }
        }
    }

    return result.length ? result : [];
}

let fractionDigits = 1;
let range = 1.8;

ItemEvents.rightClicked('minecraft:amethyst_shard', event => {
    const { player, server, level } = event;
    const { x, y, z } = player;
    const particle = global.particle.dripping_lava;
    // Dimension factor adjusts the density based on numlist1 dimension
    const dimensionFactor = 2; // Example: Increase this factor as numlist1 dimension increases

    const ix = linspace(-5, 5, 400, dimensionFactor);
    const jz = linspace(-5, 5, 400, dimensionFactor);

    const ijy = coordinates(ix, jz, (i, j) => {
        let i2 = i * i;
        let j2 = j * j;
        let lhs = Math.pow(i2 + j2 - range, 3).toFixed(fractionDigits);
        let rhs = (i2 * j * j * j).toFixed(fractionDigits);
        return lhs === rhs;
    });

    ijy.forEach((e) => {
        server.runCommandSilent(`execute in ${level.dimension} run particle ${particle} ${x + e.dx} ${y} ${z + e.dy}`);
    });
});





//





// //游泳速度
const SwimmingSpeed = 3 //游泳速度
const uuid = UUID.fromString("23fecb5a-0b1d-b1dd-1b3d-ceb903a47d5f")
const INCREASED_SWIM_SPEED = new AttributeModifier(uuid, "Increase Swimming Speed", SwimmingSpeed, AttributeModifieroperation.ADDITION)
PlayerEvents.tick((event) => {
    let { player } = event;
    const { headArmorItem, chestArmorItem, legsArmorItem, feetArmorItem } = player;
    if (player.isEyeInFluidType(Fluid.getType("water").fluidType)) {
        player.potionEffects.add("night_vision", 25, 20, false, false)
        if (!player.crouching && !player.jumping && !player.swimming) {
            player.setDeltaMovement(Vec3d.ZERO)
        }
        let swimSpeed = player.getAttribute("forge:swim_speed")
        if (!swimSpeed.hasModifier(INCREASED_SWIM_SPEED)) {
            swimSpeed.addPermanentModifier(INCREASED_SWIM_SPEED)
        } else {
            swimSpeed.removeModifier(uuid)
        }
    }
})











ItemEvents.rightClicked(event => {
    const { player, hand } = event
    const { yaw, pitch } = player
    const { direction, endX, endY, endZ } = playerRayTrace(30, player)
    let O_________O = []

    let dayTimer = event.level.dayTime() / 10000
    if (player.offHandItem.id != 'minecraft:book') {
        // player.statusMessage = "§c请左手手持书本"
        return
    }
    if (player.mainHandItem.id != "cai:quill") {
        // player.statusMessage = "§c请右手手持羽毛笔"
        return
    }
    //获取天气
    if (event.level.isRaining()) {
        player.statusMessage = Text.translate("tooltip.cai.star_data.text.4")
        return
    }
    if (dayTimer > 2.3 || dayTimer < 1.3) {
        player.statusMessage = Text.translate("tooltip.cai.star_data.text.5")
        return
    }
    if (endY < player.y + 15) {
        player.statusMessage = Text.translate("tooltip.cai.star_data.text.6")
        return
    }
    for (let i = 0; i < 6; i++) {
        // addparticle(
        //     "minecraft:electric_spark",
        //     endX + Math.cos(pitch + i) * Math.sin(yaw + i) * i * Math.random() + dayTimer,
        //     endY + Math.cos(yaw + i) * i * Math.random() + dayTimer,
        //     endZ + Math.sin(pitch + i) * Math.cos(yaw + i) * i * Math.random() + dayTimer,
        //     1,
        //     1,
        //     1,
        //     event,
        //     "js",
        //     "normal"
        // )
        $ParticleUtils.spawnParticle(event.level, "minecraft:electric_spark", new Vec3d(
            endX + Math.cos(pitch + i) * Math.sin(yaw + i) * i * Math.random() + dayTimer,
            endY + Math.cos(yaw + i) * i * Math.random() + dayTimer,
            endZ + Math.sin(pitch + i) * Math.cos(yaw + i) * i * Math.random() + dayTimer,
        ), new Vec3d(0, 0, 0), 5, 0.099)
        O_________O.push(pd(
            endX,
            endY,
            endZ,
            parseInt(endX + Math.cos(pitch + i) * Math.sin(yaw + i) * i * Math.random() + dayTimer),
            parseInt(endY + Math.cos(yaw + i) * i * Math.random() + dayTimer),
            parseInt(endZ + Math.sin(pitch + i) * Math.cos(yaw + i) * i * Math.random() + dayTimer)
        )
        )
    }
    let set = new Set(O_________O)
    if (set.size !== O_________O.length && set.size == 3 && Math.random() < 0.32) {
        // console.log(dayTimer)
        player.statusMessage = Text.translate("tooltip.cai.star_data.text.7")
        event.player.give(Item.of('cai:star_data', {
            rayLength: 30,
            observationBitspos: { x: player.x, y: player.y, z: player.z },
            endpos: { x: endX, y: endY, z: endZ },
            astrological: O_________O
        }))
    }

})
function pd(x, y, z, dx, dy, dz) {
    return Math.sqrt((x - dx) * (x - dx) + (y - dy) * (y - dy) + (z - dz) * (z - dz))
}




BlockEvents.rightClicked(event => {
    const { player, block, item, hand, server } = event
    if (!player.crouching) {
        return
    }
    // if(item == "stick" && block == 'extendedcrafting:pedestal'){
    //     event.cancel()
    // }
    if (hand == "OFF_HAND") {
        return
    }
    if (!(item == "stick" && block == 'extendedcrafting:pedestal')) {
        // console.log("item == stick && block == 'extendedcrafting:pedestal'")
        return
    }
    let be = block.getEntityData()
    if (be.get("Items") == null) {
        console.log("be.get(Items) == null")
        return
    }
    let star_data = be.get("Items")[0]
    // console.log(star_data)
    const { id, tag } = star_data == undefined ?
        { id: undefined, tag: undefined } : star_data
    if (id != "cai:star_data" || id == undefined) {
        // console.log("id != 'cai:star_data'")
        return
    }
    if (!(tag.rayLength != null && tag.observationBitspos != null && tag.endpos != null && tag.astrological != null)) {
        return
    }
    const { rayLength, observationBitspos, endpos, astrological } = tag
    const { x, y, z } = observationBitspos
    const { x: endX, y: endY, z: endZ } = endpos
    const { x: dx, y: dy, z: dz } = block
    const { cos, sin, sqrt, abs, sinh, cosh } = Math
    let _Particle = new Particle(event)
    _Particle.type('NOTE')
    _Particle.colorData([179, 80, 82], [112, 115, 51].map(e => e * Math.random() * 2))
    _Particle.motion(0, 0.05, 0)
    _Particle.scaleData(0.5, 0)
    _Particle.transparencyData(0.5, 0)
    delay(server, () => {

        global.raydrawLine_Ld(dx + cos(abs(x - dx)), dy, dz + sin(abs(z - dz)), endX, endY + 100, endZ, 0, _Particle, server)

    }, 2, 8, 1)

})


// LevelEvents.afterExplosion(event => {
//     const { x, y, z } = event
//     let count = 200
//     event.affectedBlocks.forEach(block => {
//         if (block.id == 'minecraft:air') { return }
//         count++
//     })
//     let SmokeParticle = new Particle(event)
//     SmokeParticle.type('NOTE')
//     SmokeParticle.colorData([149, 90, 82], [112, colorRandomNum(), 51])
//     SmokeParticle.lifetime(count / 100 * 150)
//     SmokeParticle.motion(0, 0.05, 0)
//     SmokeParticle.position(x, y, z)
//     SmokeParticle.randomMotion(0.05, 0.05, 0.05)
//     SmokeParticle.randomOffset(count / 60)
//     SmokeParticle.scaleData(0.5, 0)
//     SmokeParticle.transparencyData(0.5, 0)
//     SmokeParticle.spawn(count * 5)
//     global.raydrawLine_Cs(x, y, z, x + 180, y + 180, z + 180, 0, 180, "minecraft:note", event.level)
// })

// 写一个生成0~255的随机数的函数
function colorRandomNum () {
    return Math.floor(Math.random() * 255)
}

function colorLinearNum () {
    let time = Date.now()
    return (time % 255)
}



// ItemEvents.rightClicked('minecraft:blaze_rod',event => {
//     let { player, item, hand, level} = event
//     let { x, y, z } = player
//     global.raydrawLine_Cs(x,y,z,x+80,y+80,z+80,0,80,"minecraft:note",level)
// })
// 




BlockEvents.rightClicked(event => {
    const { level, block, player, item } = event

    const { pos } = block
    const facing = block.properties.facing
    if (event.item.id == 'minecraft:spectral_arrow') {
        const expectedRotations = {
            'north': 'CLOCKWISE_180',
            'east': 'COUNTERCLOCKWISE_90',
            'south': 'NONE',
            'west': 'CLOCKWISE_90',
            'down': 'NONE',
            'up': 'NONE',
        };
        $PatchouliAPI.get().showMultiblock($PatchouliAPI.get().getMultiblock("kubejs:blast_furnace"), null, event.block.pos, expectedRotations[player.facing])
    }
    if (block == 'minecraft:blast_furnace') {
        let rotation2 = global.MULTIBLOCK.blastFurnace().validate(level, pos)
        if (rotation2 === null) {
            player.statusMessage = '请在我寻思中查看结构'
            event.cancel()
            return
        }
        const expectedRotations = {
            'north': 'NONE',
            'east': 'CLOCKWISE_90',
            'south': 'CLOCKWISE_180',
            'west': 'COUNTERCLOCKWISE_90',
        };
        const currentRotation = expectedRotations[facing];
        if (currentRotation !== undefined && rotation2 !== currentRotation) {
            player.statusMessage = '不是，哥们，你方向错了'
            event.cancel()
            return;
        }
        player.tell($PatchouliAPI.get().clearMultiblock())
    }
})







// BlockEvents.rightClicked(event => {
//     if (event.block.id === 'kubejs:stone_crafting_table') {
//         event.player.openMenu(new SimpleMenuProvider((i, inv, p) => {
//             return new CraftingMenu(i, inv, (fun) => {
//                 fun.apply(event.level,event.block.pos)
//                 return $Optional.empty()
//             });
//         }, Component.translatable("container.crafting")))
//         event.cancel()

//     }
// })






// ServerEvents.tags("block",event => {
//     event.add()
// })


BlockEvents.broken("kubejs:myjq",(event)=>{
    $PatchouliAPI.get().clearMultiblock();
    global.showBool = true;
})


// ItemEvents.rightClicked(event => {
//     let { player, block, server } = event
//     let { x, y, z } = player
    
//     for (let i = 0; i < 360; i += 10) {
//         let angle = i * (KMath.PI / 180); // 将角度转换为弧度
//         let maxRadius = 2.0; // 初始螺旋半径
//         let radius = maxRadius * (1 - i / 360); // 半径随螺旋上升逐渐减小
//         let xOffset = radius * Math.cos(angle); // 螺旋上的X位置
//         let zOffset = radius * Math.sin(angle); // 螺旋上的Z位置
//         let yOffset = i / 360; // 上升时的Y位置

//         new Particle(event)
//             .type('NOTE')
//             .colorData([0, 0, 255], [255, 0, 0]) // 蓝色到红色
//             .lifetime(100 + Math.random() * 50)
//             .motion(-xOffset * 0.1, 0 -zOffset * 0.1) // 向上移动并沿螺旋内收缩
//             .position(x + xOffset, y + yOffset, z + zOffset)
//             .scaleData(0.5, 0)
//             .transparencyData(0.5, 0)
//             .spawn(1);
//     }

//     for (let i = 0; i < 360; i += 10) {
//         let angle = i * (KMath.PI / 180); // 将角度转换为弧度
//         let maxRadius = 2.0; // 初始螺旋半径
//         let radius = maxRadius * (1 - i / 360); // 半径随螺旋上升逐渐减小
//         let xOffset = radius * Math.cos(angle); // 螺旋上的X位置
//         let zOffset = radius * Math.sin(angle); // 螺旋上的Z位置
//         let yOffset = i / 360; // 上升时的Y位置

//         new Particle(event)
//             .type('NOTE')
//             .colorData([0, 0, 255], [255, 0, 0]) // 蓝色到红色
//             .lifetime(100 + Math.random() * 50)
//             .motion(-xOffset * 0.1, 0 -zOffset * 0.1) // 向上移动并沿螺旋内收缩
//             .position(x + xOffset, y + yOffset, z + zOffset)
//             .scaleData(0.5, 0)
//             .transparencyData(0.5, 0)
//             .spawn(1);
//     }

//     for (let i = 360; i > 0; i -= 10) {
//         let angle = i * (KMath.PI / 180); // 将角度转换为弧度
//         let maxRadius = 2.0; // 初始螺旋半径
//         let radius = maxRadius * (1 - i / 360); // 半径随螺旋上升逐渐减小
//         let xOffset = radius * -Math.cos(angle); // 螺旋上的X位置
//         let zOffset = radius * -Math.sin(angle); // 螺旋上的Z位置
//         let yOffset = i / 360; // 上升时的Y位置

//         new Particle(event)
//             .type('NOTE')
//             .colorData([255, 0, 255], [0, 0, 255]) // 蓝色到红色
//             .lifetime(100 + Math.random() * 50)
//             .motion(-xOffset * 0.1, 0, zOffset * 0.1) // 向上移动并沿螺旋内收缩
//             .position(x - xOffset, y + yOffset, z - zOffset)
//             .scaleData(0.5, 0)
//             .transparencyData(0.5, 0)
//             .spawn(1);
//     }

//     for (let i = 360; i > 0; i -= 10) {
//         let angle = i * (KMath.PI / 180); // 将角度转换为弧度
//         let maxRadius = 2.0; // 初始螺旋半径
//         let radius = maxRadius * (1 - i / 360); // 半径随螺旋上升逐渐减小
//         let xOffset = radius * -Math.cos(angle); // 螺旋上的X位置
//         let zOffset = radius * -Math.sin(angle); // 螺旋上的Z位置
//         let yOffset = i / 360; // 上升时的Y位置

//         new Particle(event)
//             .type('NOTE')
//             .colorData([255, 0, 255], [0, 0, 255]) // 蓝色到红色
//             .lifetime(100 + Math.random() * 50)
//             .motion(xOffset * 0.1, 0, -zOffset * 0.1) // 向上移动并沿螺旋内收缩
//             .position(x - xOffset, y + yOffset, z - zOffset)
//             .scaleData(0.5, 0)
//             .transparencyData(0.5, 0)
//             .spawn(1);
//     }
// })
ItemEvents.rightClicked('minecraft:poppy',event => {
    const { player } = event
    let castParticle = new Particle(event)
    let count = 100
    
    for (let i = 0; i < count / 10; i++) {
        event.server.scheduleInTicks(i,()=>{
            for (let j=0; j < 100; j++) {
                // console.log(i)
                castParticle.colorData([55, j, Math.abs(i - j)], [Math.abs(i - j), 0, j - 1])
                .lifetime(count / j * 600)
                .position(player.x, player.y, player.z)
                .randomMotion(0, 0, 0)
                .randomOffset(0)
                .scaleData(Math.abs(i - j) / 10, 0)
                .transparencyData(0.5, 0)
                .type("STAR")
                castParticle.position(player.x + Math.sin(j / 5) * 0.5, player.y + j / 50, player.z + Math.cos(j / 5) * 0.5)
                castParticle.motion(Math.sin(j / 5) * 0.01, 0, Math.cos(j / 5) * 0.01)
                castParticle.spawn(2)
            }
        })
    }
})
