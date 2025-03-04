// priority: 999999
StartupEvents.registry("item", e => {
    e.create("test_item", "render_basic")
        .isCustomRenderer(true)
        .renderByItem((itemStack, itemDisplayCtx, poseStack, buffer, packedLight, packedOverlay) => {
            let gameTime = Date.now(); // Use current time as a substitute for game time
            console.log(gameTime)
            let yOffset = 0;
            let height = 16; // Set the height of the beam
            let colors = [1 / (gameTime % 255), 1 / (gameTime % 255 + 20), 1 / (gameTime % 255 + 40)]; // Example color for the beam
            let BEAM_LOCATION = new ResourceLocation("textures/entity/beacon_beam.png");
            renderBeaconBeam(poseStack, buffer, BEAM_LOCATION, 0.0, 1.0, gameTime, yOffset, height, colors, 0.2, 0.25);
            // let itemRenderer = Client.getItemRenderer();
            // let bakedModel1 = Client.getModelManager().getModel(new ModelResourceLocation(Static.rl("infinity_sword"), "inventory"));
        })
})


/**
 * 
 * @param {Internal.Matrix4fc_} pose 
 * @param {Internal.Matrix3fc_} normal 
 * @param {Internal.VertexConsumer_} consumer 
 * @param {number} red 
 * @param {number} green 
 * @param {number} blue 
 * @param {number} alpha 
 * @param {number} y 
 * @param {number} x 
 * @param {number} z 
 * @param {number} u 
 * @param {number} v 
 */
function addVertex(pose, normal, consumer, red, green, blue, alpha, y, x, z, u, v) {
    consumer
        .vertex(pose, x, y, z)
        .color(red, green, blue, alpha)
        .uv(u, v)
        .overlayCoords($OverlayTexture.NO_OVERLAY)
        .uv2(15728880)
        .normal(normal, 0.0, 1.0, 0.0)
        .endVertex();
}


/**
 * 
 * @param {PoseStack} poseStack - Pose stack for transformations
 * @param {Internal.MultiBufferSource} bufferSource - Buffer source for rendering
 * @param {Internal.ResourceLocation} beamLocation - Texture location for the beam
 * @param {number} partialTick - Partial tick time
 * @param {number} textureScale - Scale for the texture
 * @param {number} gameTime - Game time
 * @param {number} yOffset - Y offset for the beam
 * @param {number} height - Height of the beam
 * @param {number[]} colors - RGB color array
 * @param {number} beamRadius - Radius of the beam
 * @param {number} glowRadius - Radius of the glow
 */
function renderBeaconBeam(poseStack, bufferSource, beamLocation, partialTick, textureScale, gameTime, yOffset, height, colors, beamRadius, glowRadius) {
    let i = yOffset + height;
    poseStack.pushPose();
    poseStack.translate(0.5, 0.0, 0.5);
    let f = (gameTime % 40) + partialTick;
    let g = height < 0 ? f : -f;
    let h = frac(g * 0.2 - Math.floor(g * 0.1));
    let j = colors[0];
    let k = colors[1];
    let l = colors[2];
    poseStack.pushPose();
    poseStack.mulPose($Axis.YP.rotationDegrees(f * 2.25 - 45.0));
    let m = 0.0;
    let p = 0.0;
    let q = -beamRadius;
    let r = 0.0;
    let s = 0.0;
    let t = -beamRadius;
    let u = 0.0;
    let v = 1.0;
    let w = -1.0 + h;
    let x = height * textureScale * (0.5 / beamRadius) + w;
    renderPart(poseStack, bufferSource.getBuffer($RenderType.beaconBeam(beamLocation, false)), j, k, l, 1.0, yOffset, i, 0.0, beamRadius, beamRadius, 0.0, q, 0.0, 0.0, t, 0.0, 1.0, x, w);
    poseStack.popPose();
    m = -glowRadius;
    const n = -glowRadius;
    p = -glowRadius;
    q = -glowRadius;
    u = 0.0;
    v = 1.0;
    w = -1.0 + h;
    x = height * textureScale + w;
    renderPart(poseStack, bufferSource.getBuffer($RenderType.beaconBeam(beamLocation, true)), j, k, l, 0.125, yOffset, i, m, n, glowRadius, p, q, glowRadius, glowRadius, glowRadius, 0.0, 1.0, x, w);
    poseStack.popPose();
}


/**
 * 
 * @param {PoseStack} poseStack - Pose stack for transformations
 * @param {Internal.VertexConsumer} consumer - Vertex consumer to add vertices
 * @param {number} red - Red component of the color (0.0 to 1.0)
 * @param {number} green - Green component of the color (0.0 to 1.0)
 * @param {number} blue - Blue component of the color (0.0 to 1.0)
 * @param {number} alpha - Alpha component of the color (0.0 to 1.0)
 * @param {number} minY - Minimum Y coordinate
 * @param {number} maxY - Maximum Y coordinate
 * @param {number} x0 - X coordinate of the first vertex
 * @param {number} z0 - Z coordinate of the first vertex
 * @param {number} x1 - X coordinate of the second vertex
 * @param {number} z1 - Z coordinate of the second vertex
 * @param {number} x2 - X coordinate of the third vertex
 * @param {number} z2 - Z coordinate of the third vertex
 * @param {number} x3 - X coordinate of the fourth vertex
 * @param {number} z3 - Z coordinate of the fourth vertex
 * @param {number} minU - Minimum U texture coordinate
 * @param {number} maxU - Maximum U texture coordinate
 * @param {number} minV - Minimum V texture coordinate
 * @param {number} maxV - Maximum V texture coordinate
 */
function renderPart(poseStack, consumer, red, green, blue, alpha, minY, maxY, x0, z0, x1, z1, x2, z2, x3, z3, minU, maxU, minV, maxV) {
    const pose = poseStack.last();
    const matrix4f = pose.pose();
    const matrix3f = pose.normal();
    renderQuad(matrix4f, matrix3f, consumer, red, green, blue, alpha, minY, maxY, x0, z0, x1, z1, minU, maxU, minV, maxV);
    renderQuad(matrix4f, matrix3f, consumer, red, green, blue, alpha, minY, maxY, x3, z3, x2, z2, minU, maxU, minV, maxV);
    renderQuad(matrix4f, matrix3f, consumer, red, green, blue, alpha, minY, maxY, x1, z1, x3, z3, minU, maxU, minV, maxV);
    renderQuad(matrix4f, matrix3f, consumer, red, green, blue, alpha, minY, maxY, x2, z2, x0, z0, minU, maxU, minV, maxV);
}

/**
 * 
 * @param {Internal.Matrix4f} pose - 4x4 transformation matrix
 * @param {Internal.Matrix3f} normal - 3x3 normal matrix
 * @param {Internal.VertexConsumer} consumer - Vertex consumer to add vertices
 * @param {number} red - Red component of the color (0.0 to 1.0)
 * @param {number} green - Green component of the color (0.0 to 1.0)
 * @param {number} blue - Blue component of the color (0.0 to 1.0)
 * @param {number} alpha - Alpha component of the color (0.0 to 1.0)
 * @param {number} minY - Minimum Y coordinate
 * @param {number} maxY - Maximum Y coordinate
 * @param {number} minX - Minimum X coordinate
 * @param {number} minZ - Minimum Z coordinate
 * @param {number} maxX - Maximum X coordinate
 * @param {number} maxZ - Maximum Z coordinate
 * @param {number} minU - Minimum U texture coordinate
 * @param {number} maxU - Maximum U texture coordinate
 * @param {number} minV - Minimum V texture coordinate
 * @param {number} maxV - Maximum V texture coordinate
 */
function renderQuad(pose, normal, consumer, red, green, blue, alpha, minY, maxY, minX, minZ, maxX, maxZ, minU, maxU, minV, maxV) {
    addVertex(pose, normal, consumer, red, green, blue, alpha, maxY, minX, minZ, maxU, minV);
    addVertex(pose, normal, consumer, red, green, blue, alpha, minY, minX, minZ, maxU, maxV);
    addVertex(pose, normal, consumer, red, green, blue, alpha, minY, maxX, maxZ, minU, maxV);
    addVertex(pose, normal, consumer, red, green, blue, alpha, maxY, maxX, maxZ, minU, minV);
}

const frac = (i) => {
    let u = Math.floor(i);
    return i - u;
}