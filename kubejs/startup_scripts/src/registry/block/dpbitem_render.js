// startup_scripts

/**
If you're coming to see all the code for the Jar [jar], be sure to read this comment
[Block Renderer section]: use RenderJS + ModifyJS for rendering, as described in this script's // ANCHOR - Jar Block Renderer
[Block Capability section]: Use PowerfulJS, as described in this script's // ANCHOR - Jar Fluid Capability
[Item Renderer section]: Renders using ModifyJS, as described in this script's // ANCHOR - Jar Item Renderer
[Item Tooltip section]: in client_script/src/tooltip.js at line 87

如果你是来看Jar[罐子]的所有代码，请一定要看这个注释
[方块渲染部分]: 使用RenderJS + ModifyJS进行渲染 // ANCHOR - Jar Block Renderer
[方块能力部分]: 使用PowerfulJS，具体在本脚本的 // ANCHOR - Jar Fluid Capability
[物品渲染部分]: 使用ModifyJS进行渲染，具体在本脚本的 // ANCHOR - Jar Item Renderer
[物品Tooltip部分]: 在client_script/src/tooltip.js的第87行 // LINK - ./client_script/src/tooltip.js

Notes:
The version of the mod I'm using
- ProbeJS: v1.20.1-6.0.1
- RenderJS: v1.20.1-1.1.9
- PowerfulJS: v1.20.1-1.6.1
- ModifyJS: v1.20.1-1.1.0.0-forge
  ... Other mods: // LINK - ./modList.txt
If there is any problem, please check if the corresponding version of the mod is installed.
If you see a missing Java class, use `Java.loadClass` to load the Java class.

注意：
我使用的mod版本
- ProbeJS: v1.20.1-6.0.1
- RenderJS: v1.20.1-1.1.9
- PowerfulJS: v1.20.1-1.6.1
- ModifyJS: v1.20.1-1.1.0.0-forge
  ...其他mod：// LINK - ./modList.txt
如果有什么问题，请查看是否安装对应版本的mod，
如果缺少显示缺少Java类，请用 `Java.loadClass` 来加载Java类

My Vscode Plugin:
- Comment Anchors: Added annotation anchors

我的vscode插件：
- Comment Anchors: 添加注释锚点
 */


const $Axis = Java.loadClass("com.mojang.math.Axis");
const $RenderType = Java.loadClass("net.minecraft.client.renderer.RenderType");
const $ItemDisplayContext = Java.loadClass("net.minecraft.world.item.ItemDisplayContext");
const $MekanismRenderer = Java.loadClass("mekanism.client.render.MekanismRenderer");
const $MekanismISTER = Java.loadClass("mekanism.client.render.item.MekanismISTER");
const $RenderFluidTank = Java.loadClass("mekanism.client.render.tileentity.RenderFluidTank")
const $FaceDisplay = Java.loadClass("mekanism.client.render.RenderResizableCuboid$FaceDisplay");
const $Sheets = Java.loadClass("net.minecraft.client.renderer.Sheets");

const OMMMMO = 0;
/**
 * @typedef { ReturnType<typeof Item.of> } ItemStack
 * @typedef { { id: string, count: number, tag?: Internal.Tag } } ItemTag
 */
StartupEvents.registry("block", event => {
    event.create("pedestal")
        .blockEntity(info => {
            info.enableSync()
            info.inventory(1, 1);
            info.attachCapability(
                CapabilityBuilder.ITEM.blockEntity()
                    .extractItem((blockEntity, slot, amount, simulate) => blockEntity.inventory.extractItem(slot, amount, simulate))
                    .insertItem((blockEntity, slot, stack, simulate) => blockEntity.inventory.insertItem(slot, stack, simulate))
                    .getSlotLimit((blockEntity, slot) => blockEntity.inventory.getSlotLimit(slot))
                    .getSlots((blockEntity) => blockEntity.inventory.slots)
                    .getStackInSlot((blockEntity, slot) => blockEntity.inventory.getStackInSlot(slot))
                    .isItemValid((blockEntity, slot, stack) => blockEntity.inventory.isItemValid(slot, stack))
                    .availableOn((blockEntity, direction) => direction != "*")
            );
            info.serverTick(OMMMMO, 0, be => {
                const entityData = be.getBlock().entityData;
                const item = entityData.attachments[0].items[0] || undefined
                const entity = be.getBlock().entity;
                if (entity instanceof $BlockEntityJS) {
                    const itemObj = item ? (item?.tag ? { id: item.id, count: item.Count, tag: item.tag } : { id: item.id, count: item.Count }) : {}
                    entity.data.put("item", itemObj)
                    entity.sync();
                    be.sync();
                }
            });
        })
        .rightClick(e => {
            /**
             * 
             * @param {Internal.BlockEntityJS} block 
             * @param {*} item 
             * @param {boolean} isNew
             */
            let updateItems = (block, item, isNew) => {
                const items = block.getEntityData().attachments[0].items || [];
                if (isNew) {
                    items.push(item);
                } else {
                    Object.assign(items[0], item);
                }
                const newAttachment = {
                    id: item.id,
                    Count: item.Count
                };
                if (item.tag) {
                    newAttachment.tag = item.tag;
                }
                block.mergeEntityData({
                    attachments: [{ items: [newAttachment] }]
                });
            };
            let heldItem = e.player.getHeldItem("main_hand");
            let itemInSolt = e.block.inventory.getStackInSlot(0);
            let { id, nbt, count } = heldItem;
            if (id === "minecraft:air") return;
            let bitem = { id: id, Count: count };
            if (nbt) {
                bitem.tag = nbt;
            }
            let items = e.block.getEntityData().attachments[0].items || [];
            updateItems(e.block, { Count: bitem.Count, Slot: 0, id: bitem.id, tag: bitem.tag }, items.length === 0);
            e.player.setMainHandItem(itemInSolt)
        })
        .box(2, 0, 2, 14, 3, 14)
        .box(4, 3, 4, 12, 12, 12)
        .box(2, 12, 2, 14, 16, 14)
        .defaultCutout();

    event.create("ou_test").blockEntity((info) => {
        info.inventory(1, 1);
    })
        .box(5, 5, 5, 11, 11, 11)
        .defaultTranslucent().notSolid().fullBlock(false).soundType("glass").lightLevel(15);

    event.create("jar")
        .blockEntity((info) => {
            info.initialData({
                fluidTank: {
                    FluidName: Fluid.getEmpty().id,
                    Amount: 0,
                },
                give: 0
            })
            info.enableSync()
            info.serverTick(0, 0, (be) => {
                let { level, block } = be
                let data = block.entityData.getCompound("data")
                let fluidTank = data.getCompound("fluidTank")
                fluidTank ? be.data.put("fluidTank", fluidTank) : be.data.put("fluidTank", {
                    FluidName: Fluid.getEmpty().id,
                    Amount: 0,
                })
                be.sync()
                let id = fluidTank.getString("FluidName")
                !id && fluidTank.putString("FluidName", Fluid.getEmpty().id)
                let amount = fluidTank.getInt("Amount")
                !amount && fluidTank.putInt("Amount", 0)
                if (id && amount !== undefined) {
                    if (amount > 8000) {
                        fluidTank.putInt("Amount", 8000)
                    } else if (amount <= 0) {
                        fluidTank.putInt("Amount", 0)
                        be.data.putInt("useAmount", 0)
                        be.sync()
                    }
                }
            })
            info.attachCapability(
                // ANCHOR - Jar Fluid Capability
                CapabilityBuilder.FLUID.customBlockEntity()
                    .getCapacity((be) => 8000)
                    .getFluid((/**@type {Internal.BlockEntityJS}*/be,/**@type {Internal.FluidStackJS_}*/stack) => {
                        let waterZero = Fluid.of("minecraft:water", 0);
                        if (!(be instanceof $BlockEntityJS)) return waterZero;
                        let fluidTank = be.block.entityData.getCompound("data").getCompound("fluidTank");
                        let id = fluidTank.getString("FluidName")
                        if (!id) return waterZero;
                        let amount = fluidTank.getInt("Amount")
                        if (!amount) return waterZero;
                        be.sync();
                        return Fluid.of(id, amount)
                    })
                    .onFill((be, fluidStack, isFill) => {
                        if (!(be instanceof $BlockEntityJS)) return 0;
                        if (fluidStack.isEmpty() || fluidStack.amount == 0) return 0;
                        if (!isFill) return 0;
                        let fluidTank = be.block.entityData.getCompound("data").getCompound("fluidTank");
                        let id = fluidTank.getString("FluidName");
                        let amount = fluidTank.getInt("Amount");
                        let noHaveFluid = !id || Fluid.of(id, amount).isEmpty() || amount == 0;
                        // 如果没有流体或流体类型匹配，则可以填充
                        if (noHaveFluid || fluidStack.getId() == id) {
                            let newAmount = amount + fluidStack.amount;
                            if (newAmount <= 8000) {
                                noHaveFluid && fluidTank.putString("FluidName", fluidStack.fluid.arch$registryName().toString());
                                fluidTank.putInt("Amount", newAmount);
                                be.sync();
                                return fluidStack.amount; // 返回实际填充的流体量
                            } else {
                                let fillableAmount = 8000 - amount;
                                fluidTank.putInt("Amount", 8000);
                                be.sync();
                                return fillableAmount; // 返回可填充的最大流体量
                            }
                        }
                        return 0; // 无法填充
                    })
                    .onDrain((be, fluidStack, isDrain) => {
                        if (!(be instanceof $BlockEntityJS)) return 0;
                        let fluidTank = be.data.getCompound("fluidTank");
                        let id = fluidTank.getString("FluidName");
                        if (!id) return 0;
                        let amount = fluidTank.getInt("Amount");
                        if (!amount) return 0;
                        let fluidChange = Math.min(amount, 50, fluidStack.amount);
                        if (!isDrain && amount - fluidChange >= 0)
                            be.data.getCompound("fluidTank").putInt("Amount", amount - fluidChange);
                        return fluidChange;
                    })
                    .isFluidGood((be, fluidStack) => {
                        // 可以在这里检查流体类型，例如只接受某些类型的流体
                        return true; // 示例：允许任何类型的流体
                    })
                    .availableOn((be, d) => {
                        if (d) {
                            return d.axis.name() == "Y";
                        } else {
                            return false;
                        }
                    })

            )
        })
        .rightClick((event) => {
            let { player, hand, level, block } = event;
            let { pos, entityData } = block;
            let itemStack = player.getItemInHand(hand);
            let item = /**@type {Internal.BucketItem}*/(itemStack.getItem())
            let itemFluid = item.getFluid();
            if (itemFluid instanceof $ForgeFlowingFluid) {
                let itemFluidName = itemFluid.arch$registryName().toString();
                let fluidTank = entityData.getCompound("data").getCompound("fluidTank")
                let id = fluidTank.getString("FluidName")
                let amount = fluidTank.getInt("Amount")

                if (amount > 0 && (itemFluidName == id) && amount < 7001) {
                    fluidTank.putInt("Amount", amount + 1000)
                    itemStack.setCount(itemStack.getCount() - 1);
                    player.give("bucket")
                } else if (amount == 0 || amount == undefined || id == "") {
                    // console.log(itemFluidName)
                    entityData.getCompound("data").put("fluidTank", {
                        FluidName: itemFluidName,
                        Amount: 1000
                    })
                    itemStack.setCount(itemStack.getCount() - 1);
                    player.give("bucket")
                }
            }
        })
        .item((bb) => {
            // ANCHOR - Jar Item Renderer
            bb.isCustomRenderer(true)
            bb.renderByItem((itemStack, idCtx, poseStack, buffer, packedLight, packedOverlay) => {
                global.testJarItemRender(itemStack, idCtx, poseStack, buffer, packedLight, packedOverlay)
            })
        })
        .box(3, 0, 3, 13, 13, 13)
        .box(6, 13, 6, 10, 14, 10)
        .box(5, 14, 5, 11, 16, 11)
        .defaultTranslucent().notSolid().fullBlock(false).soundType("glass")
});

/**
 * 
 * @param {Internal.ItemStack} itemStack 
 * @param {Internal.ItemDisplayContext} idCtx 
 * @param {PoseStack} poseStack 
 * @param {Internal.MultiBufferSource} buffer 
 * @param {number} packedLight 
 * @param {number} packedOverlay 
 * @returns 
 */
global.testJarItemRender = (itemStack, idCtx, poseStack, buffer, packedLight, packedOverlay) => {
    let gameTime = Date.now();
    // Client.player.tell((gameTime % 3600) / 10)
    let scaleMap = SwitchMap.of(
        SwitchMap.defOf(() => 1),
        SwitchMap.caseOf($ItemDisplayContext.THIRD_PERSON_LEFT_HAND, 0.5),
        SwitchMap.caseOf($ItemDisplayContext.THIRD_PERSON_RIGHT_HAND, 0.5),
        SwitchMap.caseOf($ItemDisplayContext.FIRST_PERSON_LEFT_HAND, 0.7),
        SwitchMap.caseOf($ItemDisplayContext.FIRST_PERSON_RIGHT_HAND, 0.7),
        SwitchMap.caseOf($ItemDisplayContext.GUI, 0.7),
        SwitchMap.caseOf($ItemDisplayContext.GROUND, 0.35),
    )
    let rotateYMap = SwitchMap.of(
        SwitchMap.defOf(() => 45),
        SwitchMap.caseOf($ItemDisplayContext.THIRD_PERSON_LEFT_HAND, 225),
        SwitchMap.caseOf($ItemDisplayContext.FIRST_PERSON_LEFT_HAND, 225),
    )
    let rotateXMap = SwitchMap.of(
        SwitchMap.defOf(() => 0),
        SwitchMap.caseOf($ItemDisplayContext.THIRD_PERSON_LEFT_HAND, 72.5),
        SwitchMap.caseOf($ItemDisplayContext.THIRD_PERSON_RIGHT_HAND, 72.5),
        SwitchMap.caseOf($ItemDisplayContext.GUI, 37.5)
    )
    let rotateZMap = SwitchMap.of(
        SwitchMap.defOf(() => 0),
        SwitchMap.caseOf($ItemDisplayContext.THIRD_PERSON_LEFT_HAND, 0),
        SwitchMap.caseOf($ItemDisplayContext.THIRD_PERSON_RIGHT_HAND, 0),
    )
    let tYMap = SwitchMap.of(
        SwitchMap.defOf(() => 0),
        SwitchMap.caseOf($ItemDisplayContext.THIRD_PERSON_LEFT_HAND, 1),
        SwitchMap.caseOf($ItemDisplayContext.THIRD_PERSON_RIGHT_HAND, 1),
        SwitchMap.caseOf($ItemDisplayContext.FIRST_PERSON_LEFT_HAND, -0.2),
        SwitchMap.caseOf($ItemDisplayContext.FIRST_PERSON_RIGHT_HAND, -0.2),
        SwitchMap.caseOf($ItemDisplayContext.GUI, 0.5),
        SwitchMap.caseOf($ItemDisplayContext.GROUND, 1),
    )
    let tXMap = SwitchMap.of(
        SwitchMap.defOf(() => 0),
        SwitchMap.caseOf($ItemDisplayContext.THIRD_PERSON_LEFT_HAND, -1.6),
        SwitchMap.caseOf($ItemDisplayContext.THIRD_PERSON_RIGHT_HAND, 0.6),
        SwitchMap.caseOf($ItemDisplayContext.FIRST_PERSON_LEFT_HAND, -0.65),
        SwitchMap.caseOf($ItemDisplayContext.FIRST_PERSON_RIGHT_HAND, 0.65),
        SwitchMap.caseOf($ItemDisplayContext.GROUND, -0.5),
    )
    let tZMap = SwitchMap.of(
        SwitchMap.defOf(() => 0),
        SwitchMap.caseOf($ItemDisplayContext.THIRD_PERSON_LEFT_HAND, -0.7),
        SwitchMap.caseOf($ItemDisplayContext.THIRD_PERSON_RIGHT_HAND, -0.2),
        SwitchMap.caseOf($ItemDisplayContext.FIRST_PERSON_LEFT_HAND, -0.35),
        SwitchMap.caseOf($ItemDisplayContext.FIRST_PERSON_RIGHT_HAND, 0.35),
        SwitchMap.caseOf($ItemDisplayContext.GROUND, 1.5),
    )
    let scale = /** @type {number} */(scaleMap.get(idCtx));
    let rotateY = /** @type {number} */(rotateYMap.get(idCtx));
    let rotateX = /** @type {number} */(rotateXMap.get(idCtx));
    let rotateZ = /** @type {number} */(rotateZMap.get(idCtx));
    let tY = /** @type {number} */(tYMap.get(idCtx));
    let tX = /** @type {number} */(tXMap.get(idCtx));
    let tZ = /** @type {number} */(tZMap.get(idCtx));
    let mc = Client;
    let nbt = itemStack.nbt
    let light = packedLight;
    let itemRenderer = mc.getItemRenderer();
    let bakeModel = itemRenderer.getModel(itemStack, mc.level, null, 0);

    poseStack.pushPose();
    poseStack.rotateX(rotateX)
    poseStack.rotateY(rotateY)
    poseStack.rotateZ(rotateZ)
    poseStack.scale(
        scale,
        scale,
        scale
    )
    poseStack.translate(tX, tY, tZ)
    MJSRenderUtils.renderModelLists(
        itemRenderer,
        bakeModel,
        itemStack,
        poseStack,
        buffer,
        light,
        packedOverlay
    )
    poseStack.popPose();
    if (!nbt) return;
    let BlockEntityTag = nbt.getCompound("BlockEntityTag")
    if (!BlockEntityTag) return;
    let data = BlockEntityTag.getCompound("data")
    if (!data) return;
    let fluidTank = data.getCompound("fluidTank")
    if (!fluidTank) return;
    if (!fluidTank.getString("FluidName") && !fluidTank.getString("Amount")) {
        return;
    }
    let id = fluidTank.getString("FluidName")
    let amount = fluidTank.getInt("Amount")
    let fluid = Fluid.of(id, amount)

    if (fluid.isEmpty()) {
        return;
    }
    let fluidScale = amount / 8000;
    poseStack.pushPose();
    poseStack.rotateX(rotateX)
    poseStack.rotateY(rotateY)
    poseStack.rotateZ(rotateZ)
    poseStack.scale(
        scale,
        scale,
        scale
    )
    poseStack.translate(tX, tY, tZ);

    // If you want to extend or modify it, please go to ./client_script/src/network/render/test_render.js to see its specific implementation. // LINK - ./client_script/src/network/render/test_render.js
    // 如果你要扩展或者修改它，请去./client_script/src/network/render/test_render.js查看他的具体实现 // LINK - ./client_script/src/network/render/test_render.js
    MJSRenderUtils.renderFluidModel(
        fluid,
        fluidScale,
        poseStack,
        buffer,
        light,
        packedOverlay
    )
    poseStack.popPose();
}


global.StartupInited = false
StartupEvents.postInit(_ => {
    global.StartupInited = true
})


function swichMap(idCtx) {
    switch (idCtx) {
        case $ItemDisplayContext.GROUND:
            return 0.5;
        case $ItemDisplayContext.GUI:
            return 0.8;
        default:
            return 1;
    };
}
/**
SwichMap smap = new SwichMap(
    ItemDisplayContext
    SwichMap.case(ItemDisplayContext.GROUND, () -> 1),
    SwichMap.case(ItemDisplayContext.GUI, () -> 0.8),
    ...
    SwichMap.default(() -> 1)
)
ItemDisplayContext idx = ItemDisplayContext.GROUND;
Object smapvalue = smap.get(idCtx);
System.out.println(smapvalue); // 1
 */

const $EnchantTableRenderer = Java.loadClass("net.minecraft.client.renderer.blockentity.EnchantTableRenderer");
global.inited = false
ClientEvents.init(event => {
    global.inited = true
    event.registerBlockEntityRenderer("kubejs:pedestal", (context) =>
        RenderJSBlockEntityRenderer
            .create(context)
            .setCustomRender((renderer, context) => {
                let poseStack = context.poseStack
                let light = LevelRenderer.getLightColor(context.blockEntity.level, context.blockEntity.blockPos.above())//获取亮度
                let item = Item.getEmpty()
                let data = context.blockEntity.data//读取kjs方块实体的data("同步的信息")
                let itemData = data.get("item")//读取kjs方块实体的data("同步的信息")中的item
                if (itemData) {
                    item = itemData.tag ? Item.of(itemData.id, itemData.count, itemData.tag) : Item.of(itemData.id, itemData.count)
                }
                if (item !== Item.getEmpty()) {
                    poseStack.pushPose();
                    poseStack.translate(0.5, 1.25, 0.5)//平移(0.5, 1.5, 0.5)
                    let time = Date.now();
                    let angle = (time / 10) % 360;
                    poseStack.mulPose($Axis.YP.rotationDegrees(angle));
                    poseStack.scale(0.95, 0.95, 0.95);
                    renderer.itemRenderer.renderStatic(item, "ground", light, context.packedOverlay, context.poseStack, context.bufferSource, Client.level, Client.player.getId())
                    poseStack.popPose();
                }
            })
    )
    // ANCHOR - Jar Block Renderer
    event.registerBlockEntityRenderer("kubejs:jar", (context) =>
        RenderJSBlockEntityRenderer
            .create(context)
            .setCustomRender((renderer, context) => {
                let { poseStack, bufferSource, packedOverlay, blockEntity } = context
                if (blockEntity instanceof $BlockEntityJS) {
                    let light = LevelRenderer.getLightColor(blockEntity.level, blockEntity.blockPos.above())//获取亮度
                    const mc = Client;
                    const fluidTank = blockEntity.data.getCompound("fluidTank")
                    if (!fluidTank.getString("FluidName") && !fluidTank.getString("Amount")) {
                        return;
                    }
                    let id = fluidTank.getString("FluidName")
                    let amount = fluidTank.getInt("Amount")
                    let fluid = Fluid.of(id, amount)
                    if (fluid.isEmpty()) {
                        return;
                    }
                    let fluidScale = amount / 8000;

                    // If you want to extend or modify it, please go to ./client_script/src/network/render/test_render.js to see its specific implementation. // LINK - ./client_script/src/network/render/test_render.js
                    // 如果你要扩展或者修改它，请去./client_script/src/network/render/test_render.js查看他的具体实现 // LINK - ./client_script/src/network/render/test_render.js
                    MJSRenderUtils.renderFluidModel(
                        fluid,
                        fluidScale,
                        poseStack,
                        bufferSource,
                        light,
                        packedOverlay
                    )
                }
            })
    )
    event.registerBlockEntityRenderer("enchanting_table", (context) =>
        RenderJSBlockEntityRenderer
            .create(context, new $EnchantTableRenderer(context))
            .setCustomRender((renderer, context) => {
                let { poseStack, bufferSource, packedOverlay, blockEntity, partialTick } = context
                let light = LevelRenderer.getLightColor(blockEntity.level, blockEntity.blockPos.above())//获取亮度
                // $EnchantTableRenderer.render(blockEntity,partialTick,poseStack,bufferSource,light,packedOverlay)
                let item2 = Item.of("glass", 1, { Enchantments: [{ id: "minecraft:fortune", lvl: 1 }] })
                poseStack.pushPose();
                poseStack.translate(0.5, -0.4, 0.5)
                poseStack.scale(4.1, 6.4, 4.1);
                renderer.itemRenderer.renderStatic(item2, $ItemDisplayContext.GROUND, light, packedOverlay, poseStack, bufferSource, Client.level, Client.player.getId())
                poseStack.popPose();
            })
    )
    event.registerBlockEntityRenderer("kubejs:ou_test", (context) =>
        RenderJSBlockEntityRenderer
            .create(context)
            .setCustomRender((renderer, context) => {
                Client.itemRenderer.getBlockEntityRenderer().renderByItem(
                    "blue_bed",
                    $ItemDisplayContext.NONE,
                    context.poseStack,
                    context.bufferSource,
                    15728880,
                    context.packedOverlay,
                )
            })
    )
})





// 写一个生成0~255的随机数的函数
function colorRandomNum() {
    return Math.floor(Math.random() * 255)
}

function colorLinearNum() {
    let time = Date.now()
    return (time % 255)
}







const renderByItem = (pStack, pDisplayContext, pPoseStack, pBuffer, pPackedLight, pPackedOverlay) => {
    const degree = (Date.now() / 10) % 360
    let itemRenderer = Client.getItemRenderer();
    let bakedModel = itemRenderer.getModel(pStack, null, null, 1);
    pPoseStack.pushPose();
    pPoseStack.translate(0.5, 0.5, 0.5);
    let xOffset = -1 / 32;
    let zOffset = 0;
    pPoseStack.translate(-xOffset, 0, -zOffset);
    pPoseStack.mulPose($Axis.YP.rotationDegrees(degree));
    pPoseStack.translate(xOffset, 0, zOffset);
    itemRenderer.render(pStack, $ItemDisplayContext.NONE, false, pPoseStack, pBuffer, pPackedLight, pPackedOverlay, bakedModel);
    pPoseStack.popPose();
}


// function Inv(/** @type { Internal.BlockContainerJS } */ block) {
//     this.block = block;
//     this.entityData = block.entityData;
//     this.entity = /** @type { Internal.BlockEntityJS } */ (block.entity);
// }
// Inv.prototype = {

//     get: function () {
//         const item = /** @type {ItemTag} */ (this.entity.data.get("item")) || null
//         return item
//     },
//     isEmpty: function () {
//         return !this.get() || this.get() == {} || this.get().count == 0 || this.get().id == "minecraft:air"
//     },
//     clear: function () {
//         this.entity.data.put("item", {})
//         this.block.mergeEntityData({
//             attachments: [{ items: [] }]
//         })
//         this.entity.sync();
//     },
//     /**
//      * 
//      * @param { ItemStack } item 
//      */
//     set: function (item) {
//         const newAttachment = {
//             id: item.id,
//             Count: item.count,
//             Slot: 0
//         };
//         const hasNbt = !!item.nbt
//         this.entity.data.put("item", hasNbt ? {
//             id: item.id,
//             count: item.count,
//             tag: item.nbt
//         } : {
//             id: item.id,
//             count: item.count
//         })
//         if (item.nbt) {
//             newAttachment.tag = item.nbt;
//         }
//         this.block.mergeEntityData({
//             attachments: [{ items: [newAttachment] }]
//         })
//     }
// }
// /**
//  * 
//  * @param {Internal.BlockRightClickedEventJS} e 
//  * @returns 
//  */
// global.pedestalRightClick = e => {
//     let { player, block } = e;
//     let playerItem = e.player.getHeldItem("main_hand")
//     let { id, nbt, maxStackSize } = playerItem;
//     let playIsEmpty = playerItem.isEmpty()
//     /**
//      * 
//      * @param {ItemStack} item 
//      * @param {ItemTag} itemTag 
//      */
//     let equalsItemAddItemTag = (item, itemTag) => {
//         let baseEquals = item.id == itemTag.id && item.count == itemTag.count;
//         if (item.nbt || itemTag.tag) {
//             return baseEquals && item.nbt == itemTag.tag
//         }
//         return baseEquals
//     }
//     let itemTag2item = (/** @type { ItemTag } */itemTag) => {
//         return itemTag.tag ? Item.of(itemTag.id, itemTag.count, itemTag.tag) : Item.of(itemTag.id, itemTag.count);
//     }
//     let inv = new Inv(block);

//     let item = inv.get();
//     /**
//      * 
//      * @param {ItemStack} heldItem 
//      * @param {Internal.Player} player 
//      */
//     let gc = (heldItem, player) => {
//         if (!player.isCreative()) {
//             heldItem.shrink(1);
//             if (heldItem.isEmpty()) {
//                 player.setItemInHand("main_hand", Item.empty);
//             }
//         }
//     }
//     if (playIsEmpty) {
//         let eInv = inv
//         inv.clear()
//         if (!eInv.isEmpty()) player.setMainHandItem(itemTag2item(inv.get()));
//         return;
//     };
//     if (inv.isEmpty()) {
//         let onlyOneItem = nbt ? Item.of(
//             id, 1, nbt
//         ) : Item.of(id, 1);
//         gc(playerItem, player);
//         inv.set(onlyOneItem);
//     } else {
//         if (equalsItemAddItemTag(playerItem, item)) {
//             if (item.count + 1 > maxStackSize) return;
//             gc(playerItem, player);
//             inv.set(Item.of(id, item.count + 1, nbt));
//         } else {
//             let newInvItem = inv.get();
//             inv.clear()
//             gc(playerItem, player);
//             let newItem = itemTag2item(newInvItem);
//             player.setMainHandItem(newItem);
//             inv.set(playerItem);
//         }
//     }
// }