const $RenderJSBlockEntityRenderer     
    = Java.loadClass("com.chen1335.renderjs.client.renderer.RenderJSBlockEntityRenderer")
const $Axis                            
    = Java.loadClass("com.mojang.math.Axis")
const $RenderType                      
    = Java.loadClass("net.minecraft.client.renderer.RenderType")
const $ItemDisplayContext              
    = Java.loadClass("net.minecraft.world.item.ItemDisplayContext")
const LodestoneParticleRegistry        
    = Java.loadClass("team.lodestar.lodestone.registry.common.particle.LodestoneParticleRegistry")
const SimpleParticleOptions            
    = Java.loadClass("team.lodestar.lodestone.systems.particle.SimpleParticleOptions")
const WorldParticleBuilder             
    = Java.loadClass("team.lodestar.lodestone.systems.particle.builder.WorldParticleBuilder")
const GenericParticleData              
    = Java.loadClass("team.lodestar.lodestone.systems.particle.data.GenericParticleData")
const ColorParticleData                
    = Java.loadClass("team.lodestar.lodestone.systems.particle.data.color.ColorParticleData")
const LodestoneWorldParticleRenderType 
    = Java.loadClass("team.lodestar.lodestone.systems.particle.render_types.LodestoneWorldParticleRenderType")
const Color                            
    = Java.loadClass("java.awt.Color")

const y_s = generateArray(-2.0,2.0,0.1)
const points = y_s.map((y) => {
    return {x: 0.5, y: y, z: 0.5}
})
let axisSelector = axisLinearNum() 
let endSelector = linear(points)
let zTeSelector = linear([
    1,2,3,4,5,6,7,8
], 2)

// RenderJS 1.1.9
RenderJSEvents.RegisterItemDecorations(event => {
    event.register("kubejs:aqaq", "aqaq_energy", (context) => {
        const itemStack = context.itemStack
        const MaxEnergy = 10000
        const MaxGEnergy = 2147483647
        const energy = itemStack.nbt?.BlockEntityTag?.ForgeData?.energy ?? 0
        const energyPercent = energy > MaxGEnergy ? 0 : energy / MaxEnergy
        energy > MaxGEnergy && itemStack.setNbt(undefined)
        //重置颜色
        RenderJSRenderSystem.setShaderColorJS(1, 1, 1, 1)
        //禁用深度测试 要不然贴图会在物品下面
        RenderJSRenderSystem.enableBlend()

        const blackColor = new KjsColor([0, 0, 0, 255]);
        const redColor = new KjsColor([255, 0, 0, 255]);;

        //纯色填充
        context.guiGraphics.fill(
            $RenderType.guiOverlay(), 
            context.xOffset + 1, context.yOffset + 13, context.xOffset + 14, context.yOffset + 15, 
            blackColor.getRGB()
        ) //底色
        context.guiGraphics.fill(
            $RenderType.guiOverlay(), 
            context.xOffset +(energy ? 1 : 0), context.yOffset + 13, context.xOffset + energyPercent * 14, context.yOffset + 14, 
            redColor.getRGB()
        ) //条色()
    })
})



/**
 * Creates an instance of KjsColor.
 * 
 * @constructor
 * @param {number[]} rgba - An array of RGBA values where each value is an integer between 0 and 255.
 * @param {number} rgba[0] - The red component of the color.
 * @param {number} rgba[1] - The green component of the color.
 * @param {number} rgba[2] - The blue component of the color.
 * @param {number} [rgba[3]=255] - The alpha (opacity) component of the color, defaults to 255 if not provided.
 */
function KjsColor(rgba) {
    /**
     * The red component of the color.
     * @type {number}
     */
    this.r = rgba[0];
    
    /**
     * The green component of the color.
     * @type {number}
     */
    this.g = rgba[1];
    
    /**
     * The blue component of the color.
     * @type {number}
     */
    this.b = rgba[2];
    
    /**
     * The alpha (opacity) component of the color.
     * @type {number}
     */
    this.a = rgba[3] || 255;
    
    /**
     * An instance of the Color class representing the normalized color values.
     * @type {(Color)}
     */
    this.color = new Color(this.r / 255, this.g / 255, this.b / 255, this.a / 255);
}
/**
 * Example method for KjsColor (if needed).
 * 
 * @function
 * @name someMethod
 */
// KjsColor.prototype.getRGB = function() {
//     return this.color.getRGB();
// };
KjsColor.prototype = {
    getRGB: function() {
        return this.color.getRGB();
    }
}


RenderJSEvents.RegisterItemDecorations(event=>{
    event.register("diamond_sword","rendner_sword",(context)=>{
        // const itemStack = context.itemStack;
        // const damage = itemStack.nbt?.Damage ?? 0;
        RenderJSRenderSystem.setShaderColorJS(1, 1, 1, 1)
        //禁用深度测试 要不然贴图会在物品下面
        RenderJSRenderSystem.enableBlend()
        
        
        context.guiGraphics.fill(
            $RenderType.guiOverlay(), 
            context.xOffset + 1, context.yOffset + 13, context.xOffset + 14, context.yOffset + 15, 
            new KjsColor([colorLinearNum(),colorLinearNum(),colorRandomNum()]).getRGB()
        ) //底色
    })

    // event.register("kubejs:jar", "render_jaritem", (ctx) => {
        
    // })
})

// 写一个生成0~255的随机数的函数
function colorRandomNum () {
    return Math.floor(Math.random() * 255)
}

function colorLinearNum () {
    let time = Date.now()
    return (time % 255)
}

// 

if (global.inited) {
    RenderJSEvents.AddGuiRender((event)=>{
        event.addRender((cx)=>{
            let { guiGraphics, window, partialTick } = cx
            let dev = Client.player.headArmorItem.id === 'minecraft:netherite_helmet';
            let devBehavior = () => {
                let id = Component.of(Client.player.rayTrace().block ? Client.player.rayTrace().block.blockState : (Client.player.rayTrace().entity ? Client.player.rayTrace().entity : "minecraft:air")).blue()
                let str = "你好，世界"
                guiGraphics.renderComponentTooltip(Client.font, [id], window.guiScaledWidth / 2, window.guiScaledHeight / 2)
                guiGraphics.renderOutline(window.guiScaledWidth / 2 - 20, window.guiScaledHeight / 2 -20, 40, 40, new KjsColor([colorRandomNum(),colorLinearNum(),colorLinearNum(),colorLinearNum()]).getRGB())
            }
            dev && devBehavior()
        })
    
        event.addRender((cx)=>{
            let { guiGraphics, window, partialTick } = cx
            let dev = Client.player.headArmorItem.id === 'mekanism:mekasuit_helmet';
            let devBehavior = () => {
                let rOrG = colorLinearNum() * 0.1
                guiGraphics.fill($RenderType.guiOverlay(), 0, 0, window.guiScaledWidth-2, window.guiScaledHeight-2, new KjsColor([rOrG,0,0,52]).getRGB())
                guiGraphics.fill($RenderType.guiOverlay(), 2, 2, window.guiScaledWidth, window.guiScaledHeight, new KjsColor([0,0,rOrG,52]).getRGB())
            }
            dev && devBehavior()
        })
    })

    let ou_test_renderer = Client.blockEntityRenderDispatcher.rjs$getRendererByType("kubejs:ou_test")
    if (ou_test_renderer instanceof $RenderJSBlockEntityRenderer) {
        ou_test_renderer.setCustomRender((r,c)=>{
            
            let { poseStack, bufferSource, packedOverlay, blockEntity, partialTick } = c

            let i1 = Item.of("red_wool", 1, { Enchantments: [{ id: "minecraft:fortune", lvl: 1 }] })
            let i2 = Item.of("blue_wool", 1, { Enchantments: [{ id: "minecraft:fortune", lvl: 1 }] })
            let i3 = Item.of("cyan_wool", 1, { Enchantments: [{ id: "minecraft:fortune", lvl: 1 }] })
            let i4 = Item.of("gray_wool", 1, { Enchantments: [{ id: "minecraft:fortune", lvl: 1 }] })
            let i5 = Item.of("lime_wool", 1, { Enchantments: [{ id: "minecraft:fortune", lvl: 1 }] })
            let i6 = Item.of("pink_wool", 1, { Enchantments: [{ id: "minecraft:fortune", lvl: 1 }] })
            let i7 = Item.of("black_wool", 1, { Enchantments: [{ id: "minecraft:fortune", lvl: 1 }] })
            let i8 = Item.of("brown_wool", 1, { Enchantments: [{ id: "minecraft:fortune", lvl: 1 }] })

            let i13 = Item.of("kubejs:zio")

            let time = Date.now();
            let angle = (time / 45) % 360;
            let light = 15728880;

            let rx = Math.floor(Math.random() * 3) - 1;
            let ry = Math.floor(Math.random() * 3) - 1;
            let rz = Math.floor(Math.random() * 3) - 1;

            let pos = blockEntity.blockPos;

            let posX = pos.x;
            let posY = pos.y;
            let posZ = pos.z;

            function devUse() {
                let axis = axisSelector(angle)
                let end = endSelector()
                poseStack.pushPose();
                let t10 = rotatePointAroundAxis(
                    end,
                    {x: 0.5, y: 0.5, z: 0.5},
                    axis,
                    angle
                )
                let t11n = rotatePoint(
                    2,
                    t10.x,
                    t10.y,
                    t10.z,
                    angle,
                    0.5,
                    0,
                    0.5
                )
                let t11 = {
                    x: t11n[0] + 0.5,
                    y: t11n[1],
                    z: t11n[2] + 0.5
                }
                let offsetPos = {
                    x: posX + t11.x,
                    y: posY + t11.y,
                    z: posZ + t11.z
                }
                WorldParticleBuilder.create(LodestoneParticleRegistry.TWINKLE_PARTICLE)
                    .setTransparencyData(GenericParticleData.create(1, 0).build())
                    .setScaleData(GenericParticleData.create(0.25, 0).build())
                    .setColorData(ColorParticleData.create(new Color(1, angle / (410 + (Math.random() - 0.5) * 10), (1 - Math.random())), new Color(angle / (410 + (Math.random() - 0.5) * 10), (1 - Math.random()), 1)).build())
                    .setLifetime(40)
                    .setRandomOffset(0)
                    .addMotion(0, 0, 0)
                    .setRandomMotion(0, 0, 0)
                    .setDiscardFunction(SimpleParticleOptions.ParticleDiscardFunctionType.INVISIBLE)
                    .setRenderType(LodestoneWorldParticleRenderType.IRIS_ADDITIVE)
                    .repeat(Client.level, offsetPos.x, offsetPos.y + 0.01, offsetPos.z, 1)
                let i11 = getRandomValueFromArray([i1,i2,i3,i4,i5,i6,i7,i8])
                poseStack.translate(t11.x,t11.y,t11.z)
                // poseStack.scale(angle/360 * get0or1(),angle/360 * get0or1(),angle/360 * get0or1())
                r.itemRenderer.renderStatic(i11, "ground", light, packedOverlay, poseStack, bufferSource, Client.level, Client.player.getId())
                poseStack.popPose();
                // Client.level.createEntity("bat").setNbt

                poseStack.pushPose();
                poseStack.translate(t11.x,t11.y + 0.2,t11.z)
                poseStack.mulPose($Axis.YP.rotationDegrees(angle));
                poseStack.mulPose($Axis.ZP.rotationDegrees(angle));
                poseStack.mulPose($Axis.XP.rotationDegrees(angle));
                poseStack.scale(1,1,0.01)
                r.itemRenderer.renderStatic(i13, "ground", light, packedOverlay, poseStack, bufferSource, Client.level, Client.player.getId())
                poseStack.popPose();

                poseStack.pushPose();
                poseStack.translate(t11.x,t11.y + 0.2,t11.z)
                poseStack.mulPose($Axis.YP.rotationDegrees(360 - angle));
                poseStack.mulPose($Axis.ZP.rotationDegrees(360 - angle));
                poseStack.mulPose($Axis.XP.rotationDegrees(360 - angle));
                poseStack.scale(1,1,0.01)
                r.itemRenderer.renderStatic(i13, "ground", light, packedOverlay, poseStack, bufferSource, Client.level, Client.player.getId())
                poseStack.popPose();
            }

            let dev = Client.player.headArmorItem.id === 'mekanism:mekasuit_helmet';
            !dev && Client.itemRenderer.getBlockEntityRenderer().renderByItem(
                "ender_chest", 
                $ItemDisplayContext.NONE, 
                c.poseStack,
                c.bufferSource,
                15728880,
                c.packedOverlay,
            )
            dev && devUse()
        })
    }
}



// vanilla shader
function get0or1() {
    return getRandomValueFromArray([-1,0,1]);
}



/**
 * 
 * @param {[]} arr 
 * @returns 
 */
function getRandomValueFromArray(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}


/**
 * Rotates a point around a specified axis.
 * @param {number} axisFlag - The axis around which to rotate (1: X-axis, 2: Y-axis, 3: Z-axis, 4-8: custom axes).
 * @param {number} p_x - X coordinate of the point to rotate.
 * @param {number} p_y - Y coordinate of the point to rotate.
 * @param {number} p_z - Z coordinate of the point to rotate.
 * @param {number} alpha - Rotation angle in radians.
 * @param {number} tx - Translation along the X-axis for custom axes.
 * @param {number} ty - Translation along the Y-axis for custom axes.
 * @param {number} tz - Translation along the Z-axis for custom axes.
 * @returns {number[]} The rotated point coordinates [x, y, z].
 */
function rotatePoint(axisFlag, p_x, p_y, p_z, alpha, tx, ty, tz) {
    let n_x, n_y, n_z;
    let x_0, y_0, z_0;

    // Define rotation axis and point based on axisFlag
    switch (axisFlag) {
        case 1:
            n_x = 1.0; n_y = 0.0; n_z = 0.0;
            x_0 = 0.0; y_0 = 0.0; z_0 = 0.0;
            break;
        case 2:
            n_x = 0.0; n_y = 1.0; n_z = 0.0;
            x_0 = 0.0; y_0 = 0.0; z_0 = 0.0;
            break;
        case 3:
            n_x = 0.0; n_y = 0.0; n_z = 1.0;
            x_0 = 0.0; y_0 = 0.0; z_0 = 0.0;
            break;
        case 4:
            n_x = 1.0; n_y = 0.0; n_z = 0.0;
            x_0 = 0.0; y_0 = ty; z_0 = tz;
            break;
        case 5:
            n_x = 0.0; n_y = 1.0; n_z = 0.0;
            x_0 = tx; y_0 = 0.0; z_0 = tz;
            break;
        case 6:
            n_x = 0.0; n_y = 0.0; n_z = 1.0;
            x_0 = tx; y_0 = ty; z_0 = 0.0;
            break;
        case 7:
            n_x = 0.0; n_y = 0.0; n_z = 0.0;
            x_0 = 0.0; y_0 = 0.0; z_0 = 0.0;
            break;
        case 8:
            n_x = 0.0; n_y = 0.0; n_z = 0.0;
            x_0 = tx; y_0 = ty; z_0 = tz;
            break;
        default:
            return null;
    }

    const P = [p_x, p_y, p_z];
    const Q = [x_0, y_0, z_0];
    const n = [n_x, n_y, n_z];

    // Calculate t0
    const OP = [P[0] - Q[0], P[1] - Q[1], P[2] - Q[2]];
    const nDotn = n[0] * n[0] + n[1] * n[1] + n[2] * n[2];
    const t0 = (OP[0] * n[0] + OP[1] * n[1] + OP[2] * n[2]) / nDotn;

    // Calculate the rotation point O and vector OP
    const O = [Q[0] + n[0] * t0, Q[1] + n[1] * t0, Q[2] + n[2] * t0];
    const OP_norm = [
        (P[0] - O[0]),
        (P[1] - O[1]),
        (P[2] - O[2])
    ];
    const r = Math.sqrt(OP_norm[0] * OP_norm[0] + OP_norm[1] * OP_norm[1] + OP_norm[2] * OP_norm[2]);
    const OP_unit = OP_norm.map(val => val / r);

    // Calculate the perpendicular vector
    const y_pie = [
        n[1] * OP_unit[2] - n[2] * OP_unit[1],
        n[2] * OP_unit[0] - n[0] * OP_unit[2],
        n[0] * OP_unit[1] - n[1] * OP_unit[0]
    ];

    // Rotation matrix R
    const R = [
        [OP_unit[0], y_pie[0], n[0]],
        [OP_unit[1], y_pie[1], n[1]],
        [OP_unit[2], y_pie[2], n[2]]
    ];

    // New coordinates in the rotated system
    const xtemp = r * Math.cos(alpha);
    const ytemp = r * Math.sin(alpha);

    const p_pie = [
        R[0][0] * xtemp + R[0][1] * ytemp + O[0],
        R[1][0] * xtemp + R[1][1] * ytemp + O[1],
        R[2][0] * xtemp + R[2][1] * ytemp + O[2]
    ];

    return p_pie;
}


/**
 * 
 * @param {{ x:number, y:number, z:number }} P 
 * @param {{ x:number, y:number, z:number }} P1 
 * @param {{ x:number, y:number, z:number }} axis 
 * @param {number} degrees 
 * @returns 
 */
function rotatePointAroundAxis(P, P1, axis, degrees) {
    // 将角度转换为弧度
    const PI = KMath.PI

    // 将角度转换为弧度
    const theta = degrees * (PI / 180);

    // 计算旋转轴的单位向量
    const u = {
        x: axis.x,
        y: axis.y,
        z: axis.z
    };
    const length = Math.sqrt(u.x * u.x + u.y * u.y + u.z * u.z);
    u.x /= length;
    u.y /= length;
    u.z /= length;

    // 计算 P 到 P1 的向量
    const v = {
        x: P.x - P1.x,
        y: P.y - P1.y,
        z: P.z - P1.z
    };

    // Rodrigues' rotation formula
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);

    const rotatedP = {
        x: P1.x + (cosTheta + (1 - cosTheta) * u.x * u.x) * v.x +
                     ((1 - cosTheta) * u.x * u.y - sinTheta * u.z) * v.y +
                     ((1 - cosTheta) * u.x * u.z + sinTheta * u.y) * v.z,

        y: P1.y + ((1 - cosTheta) * u.x * u.y + sinTheta * u.z) * v.x +
                     (cosTheta + (1 - cosTheta) * u.y * u.y) * v.y +
                     ((1 - cosTheta) * u.y * u.z - sinTheta * u.x) * v.z,

        z: P1.z + ((1 - cosTheta) * u.x * u.z - sinTheta * u.y) * v.x +
                     ((1 - cosTheta) * u.y * u.z + sinTheta * u.x) * v.y +
                     (cosTheta + (1 - cosTheta) * u.z * u.z) * v.z
    };

    return rotatedP;
}


/**
 * 
 * @param {number} num 
 * @returns {() => {x: number, y: number, z: number}}
 */
function axisLinearNum() {
    let currentIndex = 0;
    let callCount = 0; // 记录调用次数
    const callsPerIteration = 1; // 每次迭代需要的调用次数
    return function(num) {
        const points = [
            {x: (num - 2)/(num - 3) * num, y: (num - 2)/(num - 3) * num, z: (num - 2)/(num - 3) * num},     // i1
            {x: num, y: (num - 2)/(num - 3) * num, z: (num - 2)/(num - 3) * num},   // i2
            {x: (num - 2)/(num - 3) * num, y: num, z: (num - 2)/(num - 3) * num},   // i3
            {x: (num - 2)/(num - 3) * num, y: (num - 2)/(num - 3) * num, z: num},   // i4
            {x: (num - 2)/(num - 3) * num, y: num, z: num}, // i5
            {x: num, y: num, z: (num - 2)/(num - 3) * num}, // i6
            {x: num, y: (num - 2)/(num - 3) * num, z: num},  // i7
            {x: num, y: num, z: num}  // i7
        ];
        if (callCount >= callsPerIteration) {
            currentIndex = (currentIndex + 1) % points.length; // 循环遍历
            callCount = 0; // 重置调用次数
        } else {
            callCount++; // 增加调用次数
        }
        return points[currentIndex];
    };
}



/**
 * 
 * @template T
 * @param {T[]} array - The array of points or any other objects you want to iterate over.
 * @param {number} [cp=1] - The number of times the function should be called before moving to the next element in the array. Default is 1.
 * @returns {() => T} - A function that returns the current element in the array, iterating over it in a loop.
 */
function linear(array, cp) {
    let currentIndex = 0;
    let callCount = 0; // Record the number of times the function is called
    let callsPerIteration = cp || 1
    return function() {
        if (callCount >= callsPerIteration) {
            currentIndex = (currentIndex + 1) % array.length; // Cycle through the array
            callCount = 0; // Reset the call count
        } else {
            callCount++; // Increment the call count
        }
        return array[currentIndex];
    };
}


/**
 * 
 * @param {number} min 
 * @param {number} max 
 * @param {number} step 
 * @returns 
 */
function generateArray(min,max,step) {
    let y_s = [];
    
    // 生成递增部分
    for (let i = min; i <= max; i += step) {
        y_s.push(parseFloat(i.toFixed(1))); // 使用toFixed确保精度问题
    }

    // 生成递减部分
    for (let i = max - step; i >= min; i -= step) {
        y_s.push(parseFloat(i.toFixed(1))); // 使用toFixed确保精度问题
    }

    return y_s;
}






























// RenderJSEvents.onLivingRender(event=>{
//     event.post((e)=>{
        
//     })
// })