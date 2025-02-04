//"hydra",'minecraft:ancient_debris',[4.5, 1, 2.5]
//"lich",'minecraft:gold_block',[4.5, 1, 4.5]
//"naga",'twilightforest:ironwood_block',[3.5, 1, 3.5]
//"snow_queen",'minecraft:lapis_block',[4.5, 1, 4.5]
//"ur_ghast",'minecraft:crying_obsidian',[3.5, 1, 3.5]
let twp = [
    {
        Boss: "hydra",
        block: "minecraft:ancient_debris",
        EntityPos: [4.5, 1, 2.5]
    },
    {
        Boss: "lich",
        block: "minecraft:gold_block",
        EntityPos: [4.5, 1, 4.5]
    },
    {
        Boss: "naga",
        block: "twilightforest:ironwood_block",
        EntityPos: [3.5, 1, 3.5]
    },
    {
        Boss: "snow_queen",
        block: "minecraft:lapis_block",
        EntityPos: [4.5, 1, 4.5]
    },
    {
        Boss: "ur_ghast",
        block: "minecraft:crying_obsidian",
        EntityPos: [3.5, 1, 3.5]
    }
]
Ponder.registry((event) => {
    twp.forEach(i => {
        const { Boss, block, EntityPos} = i;
        event
        .create(`kubejs:${Boss}spawn`)
        .scene(
            `kubejs:${Boss}spawn_1`,
            `${Boss}s Spawn`,
            "kubejs:twilightforest_db",
            (scene,utils) => {
                //底盘
                scene.showBasePlate();
                scene.idle(20);
                //<- ^
                // 第一层
                // 关键帧
                let pos = [
                    [4, 1, 4],[1, 1, 4],[2, 1, 2],
                    [4, 1, 1],[6, 1, 2],[7, 1, 4],
                    [6, 1, 6],[4, 1, 7],[2, 1, 6]
                ]
                scene.addKeyframe()
                scene.level.setBlocks([4, 1, 4], `kubejs:${Boss}spawn`, true);
                scene.level.setBlocks([1, 1, 4], block);
                scene.level.setBlocks([2, 1, 2], block);
                scene.level.setBlocks([4, 1, 1], block);
                scene.level.setBlocks([6, 1, 2], block);
                scene.level.setBlocks([7, 1, 4], block);
                scene.level.setBlocks([6, 1, 6], block);
                scene.level.setBlocks([4, 1, 7], block);
                scene.level.setBlocks([2, 1, 6], block);
                for (let P of pos) {
                    scene.world.showSection(P, Direction.down)
                    
                    scene.idle(2)
                }
                scene.idle(20)
                // 第二层
                // 关键帧
                scene.addKeyframe()
                scene.level.setBlocks([4, 2, 4], `twilightforest:${Boss}_trophy`, true);
                scene.world.showSection([4, 2, 4], Direction.down)
                scene.idle(20)
                // 第三层
                // 关键帧
                scene.addKeyframe()
                scene.text(10, `Right click it generates ${Boss} (actually ${Boss} Boss brush monster cage)`).attachKeyFrame();
                scene.showControls(10, [4.5, 1.5, 4.5], "left")
                    .rightClick()
                scene.idle(10)
                scene.world.replaceBlocks([1, 2, 7, 7, 1, 1], "minecraft:air", true);
                scene.world.createEntity(`twilightforest:${Boss}`, EntityPos);
            }
        )
    });
})