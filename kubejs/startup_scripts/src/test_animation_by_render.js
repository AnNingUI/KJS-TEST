// StartupEvents.registry("item", (e) => {
//     e.create("test_animation_by_render", "render_sword")
//         .isCustomRenderer(true)
//         .renderByItem((item, itemCtx, poseStack, buffer, packedLight, packedOverlay) => global.testAnimationByRender(item, itemCtx, poseStack, buffer, packedLight, packedOverlay))
//         .useAnimation("spyglass")
// })


// /**
//  * 
//  * @param {Internal.ItemStack} item 
//  * @param {Internal.ItemDisplayContext} itemCtx 
//  * @param {PoseStack} poseStack 
//  * @param {Internal.MultiBufferSource} buffer 
//  * @param {number} packedLight 
//  * @param {number} packedOverlay 
//  */
// global.testAnimationByRender = (item, itemCtx, poseStack, buffer, packedLight, packedOverlay) => {
//     if (Platform.isClientEnvironment()) {
//         let player = Client.player;
//         let gameTime = Date.now() % 3600;
//         poseStack.pushPose();
//         if (itemCtx == "FIRST_PERSON_LEFT_HAND") {
//         }
//         if (
//             item.nbt && item.nbt.getBoolean("isShow")
//             && itemCtx !== "GUI"
//         ) {
//             // Client.player.tell(item.getEntityRepresentation())
//             poseStack.mulPose($Axis.ZP.rotationDegrees(gameTime))
//             poseStack.mulPose($Axis.XP.rotationDegrees(gameTime))
//             poseStack.mulPose($Axis.YP.rotationDegrees(gameTime))
//         }

//         poseStack.translate(0.5, 0.5, 0.5)
//         Client.itemRenderer.renderStatic(
//             Item.of("diamond_sword"),
//             itemCtx,
//             packedLight,
//             packedOverlay,
//             poseStack,
//             buffer,
//             Client.level,
//             player.getId()
//         )
//         poseStack.popPose();
//     }
// }