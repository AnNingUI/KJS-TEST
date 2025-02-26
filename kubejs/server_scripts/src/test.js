ItemEvents.rightClicked((e) => {
    let { item, player, player: { x, y, z } } = e;
    // player.sendData(
    //     "trigger_rendering",
    //     {
    //         item: item.id,
    //         x: x,
    //         y: y,
    //         z: z
    //     }
    // )
    console.log(Java.loadClass("com.anningui.modifyjs.callback.BlockItemBuilderMap").mjs$customRendererMap)
})