/**
 * 
 * @param {Internal.FluidStackJS} fluid 
 * @param {number} fluidScale 
 * @param {PoseStack} poseStack 
 * @param {Internal.MultiBufferSource} bufferSource 
 * @param {number} light 
 * @param {number} packedOverlay 
 */
global.fluidRender = (fluid, fluidScale, poseStack, bufferSource, light, packedOverlay) => {
    const builder = bufferSource.getBuffer($RenderType.translucent());
    Client.getTextureManager().bindForSetup($TextureAtlas.LOCATION_BLOCKS);
    const sprite = Client.getTextureAtlas($TextureAtlas.LOCATION_BLOCKS).apply($IClientFluidTypeExtensions.of(fluid.fluidStack.getFluid()).getStillTexture(fluid));
    const m = poseStack.last().pose();
    const n = poseStack.last().normal();
    const color = $IClientFluidTypeExtensions.of(fluid.fluidStack.getFluid()).getTintColor(fluid.fluidStack);
    const r = ((color >> 16) & 255) / 255;
    const g = ((color >> 8) & 255) / 255;
    const b = ((color >> 0) & 255) / 255;
    const a = 1;

    const s0 = 3.2 / 16;
    const s1 = 1 - s0;

    const y0 = 0.2 / 16;
    const y1 = (0.2 + 12.6 * fluidScale) / 16;

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