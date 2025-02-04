Ponder.registry((e)=>{
    e.create("kubejs:myjq")
    .scene(
        "kubejs:multiblock_magic", 
        "Multiblock: Magic", 
        "kubejs:twilightforest_db",
        (scene,utils) => {
            scene.showBasePlate();
                scene.idle(20);
                scene.scaleSceneView(0.5)
                // 1
                let pos = [
                    [4, 1, 4], // kubejs:myjq
                    [3, 1, 3],[3, 1, 4],[3, 1, 5],[4, 1, 3],[4, 1, 5],[5, 1, 3],[5, 1, 4],[5, 1, 5], // create:framed_glass
                    [6, 1, 3],[6, 1, 4],[6, 1, 5],[5, 1, 2],[5, 1, 6],[4, 1, 2],[4, 1, 6],[3, 1, 2],[3, 1, 6],[2, 1, 3],[2, 1, 4],[2, 1, 5], // mekanism:boiler_casing
                    [7, 1, 2],[7, 1, 3],[7, 1, 4],[7, 1, 5],[7, 1, 6],[6, 1, 1],[6, 1, 2],[6, 1, 6],[6, 1, 7],[5, 1, 1],[5, 1, 7],[4, 1, 1],[4, 1, 7],[3, 1, 1],[3, 1, 7],[2, 1, 1],[2, 1, 2],[2, 1, 6],[2, 1, 7],[1, 1, 2],[1, 1, 3],[1, 1, 4],[1, 1, 5],[1, 1, 6], // create:industrial_iron_block
                    [6, 2, 2],[6, 3, 2],[6, 2, 6],[6, 3, 6],[2, 2, 2],[2, 3, 2],[2, 2, 6],[2, 3, 6], // create:depot
                    [6, 2, 4],[4, 2, 2],[4, 2, 6],[2, 2, 4] // kubejs:jar
                ]
                scene.addKeyframe()
                scene.level.setBlocks([4, 1, 4], `kubejs:myjq`, true);
                // create:framed_glass
                scene.level.setBlocks([3, 1, 3], `create:framed_glass`, true);
                scene.level.setBlocks([3, 1, 4], `create:framed_glass`, true);
                scene.level.setBlocks([3, 1, 5], `create:framed_glass`, true);
                scene.level.setBlocks([4, 1, 5], `create:framed_glass`, true); 
                scene.level.setBlocks([4, 1, 3], `create:framed_glass`, true);
                scene.level.setBlocks([5, 1, 3], `create:framed_glass`, true);
                scene.level.setBlocks([5, 1, 4], `create:framed_glass`, true);
                scene.level.setBlocks([5, 1, 5], `create:framed_glass`, true); 
                // mekanism:boiler_casing
                scene.level.setBlocks([6, 1, 3], `mekanism:boiler_casing`, true);
                scene.level.setBlocks([6, 1, 4], `mekanism:boiler_casing`, true);
                scene.level.setBlocks([6, 1, 5], `mekanism:boiler_casing`, true);
                scene.level.setBlocks([5, 1, 2], `mekanism:boiler_casing`, true);
                scene.level.setBlocks([5, 1, 6], `mekanism:boiler_casing`, true);
                scene.level.setBlocks([4, 1, 2], `mekanism:boiler_casing`, true);
                scene.level.setBlocks([4, 1, 6], `mekanism:boiler_casing`, true);
                scene.level.setBlocks([3, 1, 2], `mekanism:boiler_casing`, true);
                scene.level.setBlocks([3, 1, 6], `mekanism:boiler_casing`, true);
                scene.level.setBlocks([2, 1, 3], `mekanism:boiler_casing`, true);
                scene.level.setBlocks([2, 1, 4], `mekanism:boiler_casing`, true);
                scene.level.setBlocks([2, 1, 5], `mekanism:boiler_casing`, true);
                // create:industrial_iron_block
                scene.level.setBlocks([7, 1, 2], `create:industrial_iron_block`, true);
                scene.level.setBlocks([7, 1, 3], `create:industrial_iron_block`, true);
                scene.level.setBlocks([7, 1, 4], `create:industrial_iron_block`, true);
                scene.level.setBlocks([7, 1, 5], `create:industrial_iron_block`, true);
                scene.level.setBlocks([7, 1, 6], `create:industrial_iron_block`, true);
                scene.level.setBlocks([6, 1, 1], `create:industrial_iron_block`, true);
                scene.level.setBlocks([6, 1, 2], `create:industrial_iron_block`, true);
                scene.level.setBlocks([6, 1, 6], `create:industrial_iron_block`, true);
                scene.level.setBlocks([6, 1, 7], `create:industrial_iron_block`, true);
                scene.level.setBlocks([5, 1, 1], `create:industrial_iron_block`, true);
                scene.level.setBlocks([5, 1, 7], `create:industrial_iron_block`, true);
                scene.level.setBlocks([4, 1, 1], `create:industrial_iron_block`, true);
                scene.level.setBlocks([4, 1, 7], `create:industrial_iron_block`, true);
                scene.level.setBlocks([3, 1, 1], `create:industrial_iron_block`, true);
                scene.level.setBlocks([3, 1, 7], `create:industrial_iron_block`, true);
                scene.level.setBlocks([2, 1, 1], `create:industrial_iron_block`, true);
                scene.level.setBlocks([2, 1, 2], `create:industrial_iron_block`, true);
                scene.level.setBlocks([2, 1, 6], `create:industrial_iron_block`, true);
                scene.level.setBlocks([2, 1, 7], `create:industrial_iron_block`, true);
                scene.level.setBlocks([1, 1, 2], `create:industrial_iron_block`, true);
                scene.level.setBlocks([1, 1, 3], `create:industrial_iron_block`, true);
                scene.level.setBlocks([1, 1, 4], `create:industrial_iron_block`, true);
                scene.level.setBlocks([1, 1, 5], `create:industrial_iron_block`, true);
                scene.level.setBlocks([1, 1, 6], `create:industrial_iron_block`, true);
                // create:depot
                scene.level.setBlocks([6, 2, 2], `create:depot`, true);
                scene.level.setBlocks([6, 3, 2], `create:depot`, true);
                scene.level.setBlocks([6, 2, 6], `create:depot`, true);
                scene.level.setBlocks([6, 3, 6], `create:depot`, true);
                scene.level.setBlocks([2, 2, 2], `create:depot`, true);
                scene.level.setBlocks([2, 3, 2], `create:depot`, true);
                scene.level.setBlocks([2, 2, 6], `create:depot`, true);
                scene.level.setBlocks([2, 3, 6], `create:depot`, true);
                // kubejs:jar
                scene.level.setBlocks([6, 2, 4], `kubejs:jar`, true);
                scene.level.setBlocks([4, 2, 2], `kubejs:jar`, true);
                scene.level.setBlocks([4, 2, 6], `kubejs:jar`, true);
                scene.level.setBlocks([2, 2, 4], `kubejs:jar`, true);
                
                for (let P of pos) {
                    // console.log(`${P}`)
                    scene.world.showSection(P, Direction.down)
                    scene.idle(1.2)
                }

                scene.addKeyframe()
                scene.rotateCameraY(15)

                scene.level.setBlocks([4, 2, 4], `kubejs:jar`, true);
                scene.idle(2.2)
                scene.text(40, "If the output you want is fluid, you should place the jar here", [4,3,4])
                scene.world.showSection([4, 2, 4], Direction.down)
                scene.idle(42.2)
                scene.level.setBlocks([4, 2, 4], `create:depot`, true);
                scene.text(40, "If the output you want is item, you should put depot here", [4,3,4])
                scene.world.showSection([4, 2, 4], Direction.down)
                scene.idle(42.2)

                scene.addKeyframe()
                let pos2 = [
                    [7, 2, 2],[7, 3, 2],[7, 4, 2], // minecraft:crying_obsidian // 0, 1, 2
                    [7, 2, 3],[7, 3, 3],[7, 4, 3], // cai:r_glowstone // 3, 4, 5
                    [7, 2, 4],[7, 3, 4],[7, 4, 4], // cai:r_glowstone // 6, 7, 8
                    [7, 2, 5],[7, 3, 5],[7, 4, 5], // cai:r_glowstone // 9, 10, 11
                    [7, 2, 6],[7, 3, 6],[7, 4, 6], // minecraft:crying_obsidian // 12, 13, 14
                    [6, 2, 7],[6, 3, 7],[6, 4, 7], // minecraft:crying_obsidian // 15, 16, 17
                    [5, 2, 7],[5, 3, 7],[5, 4, 7], // cai:r_glowstone // 18, 19, 20
                    [4, 2, 7],[4, 3, 7],[4, 4, 7], // cai:r_glowstone // 21, 22, 23
                    [3, 2, 7],[3, 3, 7],[3, 4, 7], // cai:r_glowstone // 24, 25, 26
                    [2, 2, 7],[2, 3, 7],[2, 4, 7], // minecraft:crying_obsidian // 27, 28, 29
                    [1, 2, 6],[1, 3, 6],[1, 4, 6], // minecraft:crying_obsidian // 30, 31, 32
                    [1, 2, 5],[1, 3, 5],[1, 4, 5], // cai:r_glowstone // 33, 34, 35
                    [1, 2, 4],[1, 3, 4],[1, 4, 4], // cai:r_glowstone // 36, 37, 38
                    [1, 2, 3],[1, 3, 3],[1, 4, 3], // cai:r_glowstone // 39, 40, 41
                    [1, 2, 2],[1, 3, 2],[1, 4, 2],  // minecraft:crying_obsidian // 42, 43, 44
                    [2, 2, 1],[2, 3, 1],[2, 4, 1], // minecraft:crying_obsidian // 45, 46, 47
                    [3, 2, 1],[3, 3, 1],[3, 4, 1], // cai:r_glowstone // 48, 49, 50
                    [4, 2, 1],[4, 3, 1],[4, 4, 1], // cai:r_glowstone // 51, 52, 53
                    [5, 2, 1],[5, 3, 1],[5, 4, 1], // cai:r_glowstone // 54, 55, 56
                    [6, 2, 1],[6, 3, 1],[6, 4, 1], // minecraft:crying_obsidian // 57, 58, 59
                ]

                let obsidianPositions = [];
                let otherPositions = [];
                
                for (let i = 0; i < pos2.length; i += 15) {
                    obsidianPositions.push(pos2[i]); // 每个周期的第一个
                    obsidianPositions.push(pos2[i + 1]); // 每个周期的第二个
                    obsidianPositions.push(pos2[i + 2]); // 每个周期的第三个
                    
                    obsidianPositions.push(pos2[i + 12]); // 每个周期的倒数第三个
                    obsidianPositions.push(pos2[i + 13]); // 每个周期的倒数第二个
                    obsidianPositions.push(pos2[i + 14]); // 每个周期的最后一个
                }
                
                // 过滤掉 obsidianPositions 中的元素，获取其他位置
                otherPositions = pos2.filter(pos => !obsidianPositions.includes(pos));                

                obsidianPositions.forEach((pos, index) => {
                    scene.level.setBlocks(pos, `minecraft:crying_obsidian`, true);
                })
                otherPositions.forEach((pos, index) => {
                    scene.level.setBlocks(pos, `cai:r_glowstone`, true);
                })

                for (let P of pos2) {
                    scene.rotateCameraY(P.length)
                    scene.world.showSection(P, Direction.down)
                    scene.idle(1.2)
                }
                // scene.idle(10)
                // scene.addKeyframe()

                // scene.rotateCameraY(-15)
                // // scene.idle(30)
                // for (let P of pos2) {
                //     scene.rotateCameraY(-P.length)
                //     scene.level.rotateSection()
                //     scene.idle(1.2)
                // }
        })
})