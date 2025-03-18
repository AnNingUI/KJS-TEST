
StartupEvents.registry("item", e => {
    e.create("arc:rayaprime", "render_helmet")
        .addLayerRender((ctx) => global.rayaprimeLayerRender(ctx))
        .noDefaultRender()
        .isCustomRenderer(true)
        .renderByItem((itemStack, itemDisplayCtx, poseStack, buffer, packedLight, packedOverlay) => {
            global.rayaprimeRenderByItem(itemStack, itemDisplayCtx, poseStack, buffer, packedLight, packedOverlay)
        })

    e.create("arc:cyberpunk_chestplate", "render_chestplate")
        .addLayerRender((ctx) => global.cyberpunklayerRender(ctx, "chestplate"))
        .noDefaultRender()
        .isCustomRenderer(true)
        .renderByItem((itemStack, itemDisplayCtx, poseStack, buffer, packedLight, packedOverlay) => {
            global.rayaprimeRenderByItem(itemStack, itemDisplayCtx, poseStack, buffer, packedLight, packedOverlay)
        })

    e.create("arc:cyberpunk_leggings", "render_leggings")
        .addLayerRender((ctx) => global.cyberpunklayerRender(ctx, "leggings"))
        .noDefaultRender()
        .isCustomRenderer(true)
        .renderByItem((itemStack, itemDisplayCtx, poseStack, buffer, packedLight, packedOverlay) => {
            global.rayaprimeRenderByItem(itemStack, itemDisplayCtx, poseStack, buffer, packedLight, packedOverlay)
        })
})

/**
 * 
 * @param {Internal.ArmorLayerContext_} ctx 
 */
global.rayaprimeLayerRender = (ctx) => {
    if (!Platform.isClientEnvironment()) return;
    let { poseStack, buffer, packedLight, livingEntity } = ctx;
    MJSRenderUtils.runOnHumanoidModel(livingEntity, (entityModel) => {
        let model = MJSRenderUtils.getModel(new ResourceLocation(
            "arc:entity/armor/rayaprime"
        ))
        let head = entityModel.head;
        poseStack.pushPose();
        head.translateAndRotate(poseStack);
        poseStack.scale(0.95, 0.95, 0.95)
        poseStack.rotateZ(180)
        poseStack.translate(-0.5, -0.7, -0.5)
        Client.getBlockRenderer().getModelRenderer().renderModel(
            poseStack.last(),
            buffer.getBuffer($RenderType.cutoutMipped()),
            null,
            model,
            1, 1, 1,
            packedLight, $OverlayTexture.NO_OVERLAY
        )
        poseStack.popPose();
    })
}


global.rayaprimeRenderByItem = (itemStack, itemDisplayCtx, poseStack, buffer, packedLight, packedOverlay) => {
    if (!Platform.isClientEnvironment()) return;
    let model = MJSRenderUtils.getModel(new ResourceLocation(
        "arc:entity/armor/rayaprime"
    ))
    poseStack.pushPose();
    poseStack.scale(0.6, 0.6, 0.6)
    // poseStack.mulPose($Axis.YP.rotationDegrees(180 * KMath.PI / 180))
    poseStack.translate(0.3, -0.3, 0.3)
    Client.getBlockRenderer().getModelRenderer().renderModel(
        poseStack.last(),
        buffer.getBuffer($RenderType.cutoutMipped()),
        null,
        model,
        1, 1, 1,
        packedLight, $OverlayTexture.NO_OVERLAY
    )
    poseStack.popPose();
}

/**
        create(id: string, type: "render_helmet"): Internal.RenderArmorItem$Helmet;
        create(id: string, type: "render_chestplate"): Internal.RenderArmorItem$Chestplate;
        create(id: string, type: "render_leggings"): Internal.RenderArmorItem$Leggings;
        create(id: string, type: "render_boots"): Internal.RenderArmorItem$Boots;
 */

/**
 * 
 * @param {Internal.ArmorLayerContext_} ctx 
 * @param {"helmet" | "chestplate" | "leggings" | "boots"} type 
 */
global.cyberpunklayerRender = (ctx, type) => {
    if (!Platform.isClientEnvironment()) return;
    let { poseStack, buffer, packedLight, livingEntity } = ctx;
    MJSRenderUtils.runOnHumanoidModel(livingEntity, (entityModel) => {
        let { body, leftArm, rightArm, leftLeg, rightLeg } = entityModel
        let sMap = SwitchMap.of(
            SwitchMap.defOf(() => () => { }),
            SwitchMap.caseOf("chestplate", () => {

                let model$1 = MJSRenderUtils.getModel("arc:entity/armor/cyberpunk_body");
                let model$2 = MJSRenderUtils.getModel("arc:entity/armor/cyberpunk_left_arm");
                let model$3 = MJSRenderUtils.getModel("arc:entity/armor/cyberpunk_right_arm");
                poseStack.pushPose();
                leftArm.translateAndRotate(poseStack);
                poseStack.translate(0.2, 1.4, -0.5)
                poseStack.rotateZ(180)
                Client.getBlockRenderer().getModelRenderer().renderModel(
                    poseStack.last(),
                    buffer.getBuffer($RenderType.cutoutMipped()),
                    null,
                    model$2,
                    1, 1, 1,
                    packedLight, $OverlayTexture.NO_OVERLAY
                )
                poseStack.popPose();
                poseStack.pushPose();
                rightArm.translateAndRotate(poseStack);
                poseStack.translate(0.8, 1.4, -0.5)
                poseStack.rotateZ(180)
                Client.getBlockRenderer().getModelRenderer().renderModel(
                    poseStack.last(),
                    buffer.getBuffer($RenderType.cutoutMipped()),
                    null,
                    model$3,
                    1, 1, 1,
                    packedLight, $OverlayTexture.NO_OVERLAY
                )
                poseStack.popPose();
                poseStack.pushPose();
                body.translateAndRotate(poseStack);
                poseStack.translate(0.5, 1.5, -0.5)
                poseStack.rotateZ(180)
                Client.getBlockRenderer().getModelRenderer().renderModel(
                    poseStack.last(),
                    buffer.getBuffer($RenderType.cutoutMipped()),
                    null,
                    model$1,
                    1, 1, 1,
                    packedLight, $OverlayTexture.NO_OVERLAY
                )
                poseStack.popPose();
            }),
            SwitchMap.caseOf("leggings", () => {
                let model$1 = MJSRenderUtils.getModel("arc:entity/armor/cyberpunk_body_to_leg");
                let model$2 = MJSRenderUtils.getModel("arc:entity/armor/cyberpunk_left_leg");
                let model$3 = MJSRenderUtils.getModel("arc:entity/armor/cyberpunk_right_leg");

                poseStack.pushPose();
                body.translateAndRotate(poseStack);
                poseStack.translate(-0.5, -0.1, -0.5)
                Client.getBlockRenderer().getModelRenderer().renderModel(
                    poseStack.last(),
                    buffer.getBuffer($RenderType.cutoutMipped()),
                    null,
                    model$1,
                    1, 1, 1,
                    packedLight, $OverlayTexture.NO_OVERLAY
                )
                poseStack.popPose();

                poseStack.pushPose();
                leftLeg.translateAndRotate(poseStack);
                poseStack.translate(-0.13, -0.5, -0.5)
                Client.getBlockRenderer().getModelRenderer().renderModel(
                    poseStack.last(),
                    buffer.getBuffer($RenderType.cutoutMipped()),
                    null,
                    model$2,
                    1, 1, 1,
                    packedLight, $OverlayTexture.NO_OVERLAY
                )
                poseStack.popPose();

                poseStack.pushPose();
                rightLeg.translateAndRotate(poseStack);
                poseStack.translate(-0.83, -0.5, -0.5)
                Client.getBlockRenderer().getModelRenderer().renderModel(
                    poseStack.last(),
                    buffer.getBuffer($RenderType.cutoutMipped()),
                    null,
                    model$3,
                    1, 1, 1,
                    packedLight, $OverlayTexture.NO_OVERLAY
                )
                poseStack.popPose();
            })
        )
        let fun = sMap.get(type)
        fun()
    })
}


if (Platform.isClientEnvironment()) {
    MJSModelEvents.registerAdder(e => {
        e.register("arc", "entity/armor/rayaprime")
        e.register("arc", "entity/armor/cyberpunk")
        e.register("arc", "entity/armor/cyberpunk_body")
        e.register("arc", "entity/armor/cyberpunk_body_to_leg")
        e.register("arc", "entity/armor/cyberpunk_left_arm")
        e.register("arc", "entity/armor/cyberpunk_right_arm")
        e.register("arc", "entity/armor/cyberpunk_left_leg")
        e.register("arc", "entity/armor/cyberpunk_right_leg")
    })
}