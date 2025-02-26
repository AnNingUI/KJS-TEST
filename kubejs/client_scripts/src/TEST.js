let $RenderSystem = 
    Java.loadClass("com.mojang.blaze3d.systems.RenderSystem");
let $PoseStack =
    Java.loadClass("com.mojang.blaze3d.vertex.PoseStack");
let $Tessellator = 
    Java.loadClass("com.mojang.blaze3d.vertex.Tesselator");
let $VertexFormat$Mode = 
    Java.loadClass("com.mojang.blaze3d.vertex.VertexFormat$Mode");
let $DefaultVertexFormat = 
    Java.loadClass("com.mojang.blaze3d.vertex.DefaultVertexFormat");
let $GameRenderer = 
    Java.loadClass("net.minecraft.client.renderer.GameRenderer");
let $LightTexture = 
    Java.loadClass("net.minecraft.client.renderer.LightTexture");
// 接收数据包并进行渲染
let sx,sy,sz
NetworkEvents.dataReceived("trigger_rendering", (e) => {
    let { data, level } = e;
    let { item, x, y, z } = data;
    console.log(data);
    // testRender(x, y, z)
    sx = x
    sy = y
    sz = z
    console.log([sx, sy, sz].toString());
    // 调用自定义的渲染函数
    // renderItemAtWorldPosition(Item.of(item), new Vec3d(x, y, z), Client.partialTick);
    
});

const testRender = (x, y, z) => {
    
}