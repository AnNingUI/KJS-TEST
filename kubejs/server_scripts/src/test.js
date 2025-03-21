ItemEvents.entityInteracted("kubejs:test_animation_by_render", (e) => {
    let { item, player, player: { x, y, z }, server, target } = e;
    delay(server, (s, e) => {
        let { x: tx, y: ty, z: tz } = target
        target.attack(s)
        // 计算玩家到target的向量
        let vec3 = new Vec3d(tx - x, ty - y, tz - z);
        // 模拟击退
        target.addMotion(
            vec3.x() * 0.005 * s,
            vec3.y() * 0.005 * s,
            vec3.z() * 0.005 * s
        )

    }, 0, 10, 2)
    if (Platform.isClientEnvironment()) {
        item.getOrCreateTag().putBoolean("isShow", true)
        server.scheduleInTicks(20, () => {
            item.getOrCreateTag().putBoolean("isShow", false)
        })
    }
})

// let res = []
// ServerEvents.recipes(e => {
//     e.recipeStream({
//         output: "minecraft:cake" // 指定输出物品是蛋糕
//     }).forEach((r) => {
//         res.push(r.json)
//         // res.push(r.getId()) //获取ResourceLocation
//     })
// })
// ItemEvents.rightClicked("cake", (e) => {
//     let { player } = e
//     player.tell(res)
// })

// Utils.runAsync