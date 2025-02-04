// // const { $ShaderInstance } = require("packages/net/minecraft/client/renderer/$ShaderInstance")

// const { $CuriosApi } = require("packages/top/theillusivec4/curios/api/$CuriosApi")
// const { $CurioInventoryCapability$CurioInventoryWrapper: $CurioInventoryWrapper } = require("packages/top/theillusivec4/curios/common/capability/$CurioInventoryCapability$CurioInventoryWrapper")
// // const $CurioInventoryWrapper = Java.loadClass("top.theillusivec4.curios.common.capability.CurioInventoryCapability$CurioInventoryWrapper")
ItemEvents.rightClicked('minecraft:nether_star', event => {
//     // CuriosSlotMethod("getfor", "charm", event.player, null)
//     // const co = $CuriosApi.getCuriosHelper()["findCurios(net.minecraft.world.entity.LivingEntity,net.minecraft.world.item.Item)"](event.player, "cai:soul_talisman");
//     // co.forEach(solt => {
//     //     let ctx = solt.slotContext();
//     //     let identifier = ctx.getIdentifier();
//     // })
//     // getCuriosInfoForPlayerSlot(event.player, "charm", "cai:soul_talisman")
//     console.log(getCuriosInfoForPlayerSlot(event.player, "charm", "cai:soul_talisman"))
    console.log(hasCuriosItem(event.player, "cai:soul_talisman"))
})
