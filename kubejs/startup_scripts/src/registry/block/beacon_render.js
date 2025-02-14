// startup_scripts
const $Color = 
    Java.loadClass("java.awt.Color");
const $ForgeConfigSpec$Builder = 
    Java.loadClass("net.minecraftforge.common.ForgeConfigSpec$Builder");
const $Vec3 = 
    Java.loadClass("net.minecraft.world.phys.Vec3");
const $Tesselator = 
    Java.loadClass("com.mojang.blaze3d.vertex.Tesselator")
const $VertexFormat$Mode = 
    Java.loadClass("com.mojang.blaze3d.vertex.VertexFormat$Mode");
const $DefaultVertexFormat = 
    Java.loadClass("com.mojang.blaze3d.vertex.DefaultVertexFormat");
const $Vector4f = 
    Java.loadClass("org.joml.Vector4f");
const $GameRenderer = 
    Java.loadClass("net.minecraft.client.renderer.GameRenderer");
const $RenderSystem = 
    Java.loadClass("com.mojang.blaze3d.systems.RenderSystem");
const $ModConfig$Type = 
    Java.loadClass("net.minecraftforge.fml.config.ModConfig$Type");
const $BufferUploader = 
    Java.loadClass("com.mojang.blaze3d.vertex.BufferUploader");
const $BeaconRenderer = 
    Java.loadClass("net.minecraft.client.renderer.blockentity.BeaconRenderer");
const $GL11 = 
    Java.loadClass("org.lwjgl.opengl.GL11");
const $ModLoadingContext = 
    Java.loadClass("net.minecraftforge.fml.ModLoadingContext")


const BUILDER = new $ForgeConfigSpec$Builder()
const Config = {
    HEIGHT          : BUILDER["defineInRange(java.lang.String,int,int,int)"]("height", 128, 100, 4096),
    SEGMENTS        : BUILDER["defineInRange(java.lang.String,int,int,int)"]("segments", 240, 50, 1000000),
    COUNT           : BUILDER["defineInRange(java.lang.String,int,int,int)"]("count", 5, 1, 10),
    RADIUS          : BUILDER["defineInRange(java.lang.String,int,int,int)"]("radius", 48, 12, 100000),
    INTRVAL         : BUILDER["comment(java.lang.String)"]("Radius increment between consecutive halo circles")["defineInRange(java.lang.String,int,int,int)"]("interval",32,10,1000),
    INCREASING      : BUILDER["define(java.lang.String,boolean)"]("increasing",true),
    RED             : BUILDER["define(java.lang.String,java.lang.Object)"]("color_red", $Color.WHITE.getRed()),
    GREEN           : BUILDER["define(java.lang.String,java.lang.Object)"]("color_green", $Color.WHITE.getGreen()),
    BLUE            : BUILDER["define(java.lang.String,java.lang.Object)"]("color_blue", $Color.WHITE.getBlue()),
    ALPHA           : BUILDER["comment(java.lang.String)"]("Range: 0.0 ~ 1.0")["define(java.lang.String,java.lang.Object)"]("color_alpha", 0.85),
    RENDER_DISTANCE : BUILDER["defineInRange(java.lang.String,int,int,int)"]("render_distance",1024,128,2147483646),
    SPEC            : BUILDER.build()
}
Config.SPEC
ClientEvents.init(event => {
    event.registerBlockEntityRenderer("beacon", (ctx) =>
        RenderJSBlockEntityRenderer
            .create(ctx, new $BeaconRenderer(ctx))
            .setCustomRender((renderer, context) => {
                let { blockEntity, poseStack: stack } = context;
                let aLevel = /** @type { $BeaconBlockEntity_ } */ (blockEntity).levels;
                if (aLevel > 0) {
                    let circleCenter = new $Vec3(
                        blockEntity.getBlockPos().getX(), 
                        blockEntity.getBlockPos().getY() + 1 + Config.HEIGHT.get(), 
                        blockEntity.getBlockPos().getZ()
                    );
                    let cameraPos = Client.gameRenderer.getMainCamera().getPosition();
                    let red = Config.RED.get() / 255.0;
                    let green = Config.GREEN.get() / 255.0;
                    let blue = Config.BLUE.get() / 255.0;
                    let alpha = Config.ALPHA.get();
                    let segments = Config.SEGMENTS.get();
                    for (let i = 0; i < Config.COUNT.get(); i++) {
                        let tessellate = $Tesselator.getInstance();
                        let buffer = tessellate.getBuilder();
                        stack.pushPose();
                        stack.translate(circleCenter.get("x") - cameraPos.get("x"),
                            circleCenter.get("y") - cameraPos.get("y"),
                            circleCenter.get("z") - cameraPos.get("z"));
                        $RenderSystem.enableBlend();
                        $RenderSystem["blendFunc(int,int)"]($GL11.GL_SRC_ALPHA, $GL11.GL_ONE);
                        buffer.begin(
                            $VertexFormat$Mode.DEBUG_LINE_STRIP, 
                            $DefaultVertexFormat.POSITION_COLOR
                        );
                        let radius = kjs$getRadius(i);
                        for (let j = 0; j < segments; j++) {
                            let angle = 2.0 * JavaMath.PI * j / segments;
                            let x = radius * JavaMath.cos(angle);
                            let z = radius * JavaMath.sin(angle);
                            let worldPos = new $Vector4f(
                                x, 
                                circleCenter.get("y"),
                                z, 
                                1.0
                            );
                            worldPos.mul(stack.last().pose());
                            buffer.vertex(
                                worldPos.x, 
                                worldPos.y, 
                                worldPos.z)
                                .color(
                                    red, 
                                    green, 
                                    blue, 
                                    alpha
                                ).endVertex();
                        }
                        $RenderSystem
                            .setShader(() => $GameRenderer.getPositionColorShader());
                        $BufferUploader.drawWithShader(buffer.end());
                        $RenderSystem.disableBlend();
                        stack.popPose();
                    }
                }
            })
    )
})






/**
 * @param { integer | number } i
 */
const kjs$getRadius = (i) => {
    let base = Config.RADIUS.get();
    let intervalR = Config.INTRVAL.get() / 2;
    let ret = base + intervalR * i;
    if(!Config.INCREASING.get()){
        return ret;
    }
    else{
        return ret * i;
    }
}


StartupEvents.init((e) => {
    $ModLoadingContext.get().registerConfig($ModConfig$Type.CLIENT, Config.SPEC);
})