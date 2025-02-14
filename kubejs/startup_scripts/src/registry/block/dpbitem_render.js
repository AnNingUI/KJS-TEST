// startup_scripts


const $Axis = Java.loadClass("com.mojang.math.Axis");

const $RenderType = Java.loadClass("net.minecraft.client.renderer.RenderType");
const $TextureAtlas = Java.loadClass("net.minecraft.client.renderer.texture.TextureAtlas");
const $ItemDisplayContext = Java.loadClass("net.minecraft.world.item.ItemDisplayContext");
const $IClientFluidTypeExtensions = Java.loadClass("net.minecraftforge.client.extensions.common.IClientFluidTypeExtensions");


const OMMMMO = 0;

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
             * @param {*} block 
             * @param {*} item 
             * @param {*} isNew
             */
            const updateItems = (block, item, isNew) => {
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

            let { id, nbt, count, setCount } = e.player.getHeldItem("main_hand");
            if (id === "minecraft:air") return;
            const bitem = { id: id, Count: count };
            if (nbt) {
                bitem.tag = nbt;
            }
            const items = e.block.getEntityData().attachments[0].items || [];
            updateItems(e.block, { Count: bitem.Count, Slot: 0, id: bitem.id, tag: bitem.tag }, items.length === 0);
            setCount(0);
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
});



global.StartupInited = false
StartupEvents.postInit(_ => {
    global.StartupInited = true
})


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
    event.registerBlockEntityRenderer("kubejs:jar", (context) =>
        RenderJSBlockEntityRenderer
            .create(context)
            .setCustomRender((renderer, context) => {
                let { poseStack, bufferSource, packedOverlay, blockEntity } = context
                if (blockEntity instanceof $BlockEntityJS) {
                    let light = LevelRenderer.getLightColor(blockEntity.level, blockEntity.blockPos.above())//获取亮度
                    const mc = Client;
                    const m = poseStack.last().pose();
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
                    const builder = bufferSource.getBuffer($RenderType.translucent());

                    mc.getTextureManager().bindForSetup($TextureAtlas.LOCATION_BLOCKS);
                    const sprite = mc.getTextureAtlas($TextureAtlas.LOCATION_BLOCKS).apply($IClientFluidTypeExtensions.of(fluid.fluidStack.getFluid()).getStillTexture(fluid));

                    const n = poseStack.last().normal();
                    const color = $IClientFluidTypeExtensions.of(fluid.fluidStack.getFluid()).getTintColor(fluid.fluidStack);
                    const r = ((color >> 16) & 255) / 255;
                    const g = ((color >> 8) & 255) / 255;
                    const b = ((color >> 0) & 255) / 255;
                    const a = 1;

                    const s0 = 3.2 / 16;
                    const s1 = 1 - s0;

                    const y0 = 0.2 / 16;
                    const y1 = (0.2 + 12.6 * amount / 8000) / 16;

                    const u0 = sprite.getU(3);
                    const v0 = sprite.getV0();
                    const u1 = sprite.getU(13);
                    const v1 = sprite.getV(y1 * 16);

                    const u0top = sprite.getU(3);
                    const v0top = sprite.getV(3);
                    const u1top = sprite.getU(13);
                    const v1top = sprite.getV(13);

                    builder.vertex(m, s0, y1, s0).color(r, g, b, a).uv(u0top, v0top).overlayCoords(packedOverlay).uv2(light).normal(n, 0, 1, 0).endVertex();
                    builder.vertex(m, s0, y1, s1).color(r, g, b, a).uv(u0top, v1top).overlayCoords(packedOverlay).uv2(light).normal(n, 0, 1, 0).endVertex();
                    builder.vertex(m, s1, y1, s1).color(r, g, b, a).uv(u1top, v1top).overlayCoords(packedOverlay).uv2(light).normal(n, 0, 1, 0).endVertex();
                    builder.vertex(m, s1, y1, s0).color(r, g, b, a).uv(u1top, v0top).overlayCoords(packedOverlay).uv2(light).normal(n, 0, 1, 0).endVertex();

                    builder.vertex(m, s0, y0, s0).color(r, g, b, a).uv(u0top, v0top).overlayCoords(packedOverlay).uv2(light).normal(n, 0, 1, 0).endVertex();
                    builder.vertex(m, s1, y0, s0).color(r, g, b, a).uv(u1top, v0top).overlayCoords(packedOverlay).uv2(light).normal(n, 0, 1, 0).endVertex();
                    builder.vertex(m, s1, y0, s1).color(r, g, b, a).uv(u1top, v1top).overlayCoords(packedOverlay).uv2(light).normal(n, 0, 1, 0).endVertex();
                    builder.vertex(m, s0, y0, s1).color(r, g, b, a).uv(u0top, v1top).overlayCoords(packedOverlay).uv2(light).normal(n, 0, 1, 0).endVertex();

                    builder.vertex(m, s0, y1, s1).color(r, g, b, a).uv(u0, v0).overlayCoords(packedOverlay).uv2(light).normal(n, 0, 1, 0).endVertex();
                    builder.vertex(m, s0, y0, s1).color(r, g, b, a).uv(u0, v1).overlayCoords(packedOverlay).uv2(light).normal(n, 0, 1, 0).endVertex();
                    builder.vertex(m, s1, y0, s1).color(r, g, b, a).uv(u1, v1).overlayCoords(packedOverlay).uv2(light).normal(n, 0, 1, 0).endVertex();
                    builder.vertex(m, s1, y1, s1).color(r, g, b, a).uv(u1, v0).overlayCoords(packedOverlay).uv2(light).normal(n, 0, 1, 0).endVertex();

                    builder.vertex(m, s0, y1, s0).color(r, g, b, a).uv(u0, v0).overlayCoords(packedOverlay).uv2(light).normal(n, 0, 1, 0).endVertex();
                    builder.vertex(m, s1, y1, s0).color(r, g, b, a).uv(u1, v0).overlayCoords(packedOverlay).uv2(light).normal(n, 0, 1, 0).endVertex();
                    builder.vertex(m, s1, y0, s0).color(r, g, b, a).uv(u1, v1).overlayCoords(packedOverlay).uv2(light).normal(n, 0, 1, 0).endVertex();
                    builder.vertex(m, s0, y0, s0).color(r, g, b, a).uv(u0, v1).overlayCoords(packedOverlay).uv2(light).normal(n, 0, 1, 0).endVertex();

                    builder.vertex(m, s0, y1, s0).color(r, g, b, a).uv(u0, v0).overlayCoords(packedOverlay).uv2(light).normal(n, 0, 1, 0).endVertex();
                    builder.vertex(m, s0, y0, s0).color(r, g, b, a).uv(u0, v1).overlayCoords(packedOverlay).uv2(light).normal(n, 0, 1, 0).endVertex();
                    builder.vertex(m, s0, y0, s1).color(r, g, b, a).uv(u1, v1).overlayCoords(packedOverlay).uv2(light).normal(n, 0, 1, 0).endVertex();
                    builder.vertex(m, s0, y1, s1).color(r, g, b, a).uv(u1, v0).overlayCoords(packedOverlay).uv2(light).normal(n, 0, 1, 0).endVertex();

                    builder.vertex(m, s1, y1, s0).color(r, g, b, a).uv(u0, v0).overlayCoords(packedOverlay).uv2(light).normal(n, 0, 1, 0).endVertex();
                    builder.vertex(m, s1, y1, s1).color(r, g, b, a).uv(u1, v0).overlayCoords(packedOverlay).uv2(light).normal(n, 0, 1, 0).endVertex();
                    builder.vertex(m, s1, y0, s1).color(r, g, b, a).uv(u1, v1).overlayCoords(packedOverlay).uv2(light).normal(n, 0, 1, 0).endVertex();
                    builder.vertex(m, s1, y0, s0).color(r, g, b, a).uv(u0, v1).overlayCoords(packedOverlay).uv2(light).normal(n, 0, 1, 0).endVertex();
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
    console.log(degree)
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