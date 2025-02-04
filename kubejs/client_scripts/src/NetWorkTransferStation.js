const { $PoseStack } = require("packages/com/mojang/blaze3d/vertex/$PoseStack");
const { $Axis } = require("packages/com/mojang/math/$Axis");
const { $OverlayTexture } = require("packages/net/minecraft/client/renderer/texture/$OverlayTexture");
const { $ItemDisplayContext } = require("packages/net/minecraft/world/item/$ItemDisplayContext");
const { $ItemStack } = require("packages/net/minecraft/world/item/$ItemStack");
const { $Vec3 } = require("packages/net/minecraft/world/phys/$Vec3");

let Item1;
let Vec3_1;
NetworkEvents.dataReceived("magicDamage", (e) => {
    const { data, level } = e;
    // console.log(data);
    const { x, y, z } = data.pos;
    if (!Client.level) return;
    const server = Utils.getServer();
    const show = (st, et) => {
        // renderItemAtWorldPosition(
        //     Item.of("bamboo", t),
        //     new $Vec3(x,y,z),
        //     0
        // )
        Item1 = Item.of("kubejs:magic_book", st)
        Vec3_1 = new $Vec3(x, y + 0.2, z);
        if (st >= et - 10) {
            Item1 = null
            Vec3_1 = null
        }
    }
    delayFun(
        server,
        show,
        1, 80, 1
    )
});


// /**
//  * 
//  * @param {$ItemStack} itemStack 
//  * @param {$Vec3} worldPos 
//  * @param {number} partialTicks 
//  */
// const renderItemAtWorldPosition = (
//     itemStack,
//     worldPos,
//     partialTicks
// ) => {
//     const level = Client.level;
//     if (!level) {
//         console.error("Client.level is null");
//         return;
//     }
//     const matrixStack = new $PoseStack();
//     const cameraPos = Client.gameRenderer.getMainCamera().getPosition();
//     const offset = worldPos.subtract(cameraPos); // 计算相对坐标
//     console.log(offset.get("x"), offset.get("y"), offset.get("z"))
//     matrixStack.pushPose();
//     matrixStack.translate(offset.get("x"), offset.get("y"), offset.get("z"));
//     RenderJSWorldRender.renderItem(matrixStack, itemStack, 15728880, Client.level)
//     matrixStack.popPose();
// }


RenderJSEvents.AddWorldRender((e) => {
    e.addWorldRender((r) => {
        if (Item1 && Item1 instanceof $ItemStack && Vec3_1 && Vec3_1 instanceof $Vec3) {
            const { poseStack } = r
            const itemStack = Item1;
            const pos = Vec3_1;
            const camera = r.camera;
            const offset = pos.subtract(camera.getPosition())
            poseStack.pushPose();
            poseStack.translate(
                offset.get("x"),
                offset.get("y"),
                offset.get("z")
            );
            
            poseStack.scale(4.5, 4.5, 4.5)
            let time = Date.now();
            let angle = (time / 10) % 360;
            poseStack.mulPose($Axis.YP.rotationDegrees(angle));
            RenderJSWorldRender.renderItem(poseStack, itemStack, 15728880, Client.level); // 渲染物品
            poseStack.popPose();
        }
    });
});



/**
 * 在服务器中延迟执行函数
 * 
 * @param {import("packages/net/minecraft/server/$MinecraftServer").$MinecraftServer$Type} server - Minecraft 服务器对象
 * @param { ((sTick: number) => {}) } fun - 要执行的函数
 * @param {number} sTick - 当前的 tick 计数
 * @param {number} eTick - 结束的 tick 计数
 * @param {number} delayTick - 延迟的 tick 数
 */
const delayFun = (server, fun, sTick, eTick, delayTick) => {
    sTick += 1;
    fun(sTick, eTick);
    server.scheduleInTicks(delayTick, () => {
        sTick < eTick && delayFun(server, fun, sTick, eTick, delayTick);
    })
}
