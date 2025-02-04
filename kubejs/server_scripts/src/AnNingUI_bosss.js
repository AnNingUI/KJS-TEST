const { $BlockRightClickedEventJS } = require("packages/dev/latvian/mods/kubejs/block/$BlockRightClickedEventJS");
/**
 * 
 * @param {$BlockRightClickedEventJS} event 
 * @param {*} entity 
 * @param {*} block 
 * @param {*} particle 
 */

function boss(event, entity, block, particle) {
	const offsetBlocks = [
		event.block.offset(3, 0, 0),
		event.block.offset(-3, 0, 0),
		event.block.offset(0, 0, -3),
		event.block.offset(0, 0, 3),
		event.block.offset(-2, 0, 2),
		event.block.offset(2, 0, 2),
		event.block.offset(2, 0, -2),
		event.block.offset(-2, 0, -2)
	];
	const newX = event.block.x
	const newY = event.block.y
	const newZ = event.block.z
	if (offsetBlocks.every(BK => BK.id == block) && event.block.id === `kubejs:${entity}spawn`) {
		if (event.block.offset(0, 1, 0).id == `twilightforest:${entity}_trophy`) {
			event.player.swing('MAIN_HAND', true);
			event.block.offset(0, 1, 0).set(`minecraft:air`)
			offsetBlocks.forEach(block => {
				event.level.destroyBlock(block.pos, false)
				// event.server.runCommandSilent(`execute in ${event.level.dimension} run setblock ${block.x} ${block.y} ${block.z} minecraft:air`);
				event.server.runCommandSilent(`execute in ${event.level.dimension} run particle ${particle} ${block.x} ${block.y} ${block.z} 1 1 1 1 10 normal`);
			})
			event.server.runCommandSilent(`execute in ${event.level.dimension} run particle ${particle} ${newX} ${newY} ${newZ} 1 1 1 1 200 normal`);
			event.player.playSound('minecraft:entity.warden.sonic_boom', 2, 1);
			event.block.offset(0, 1, 0).set(`twilightforest:${entity}_boss_spawner`)
			event.block.set(`minecraft:air`);
		}
	}
}
BlockEvents.rightClicked(event => {
	boss(event, 'naga', 'twilightforest:ironwood_block', 'minecraft:happy_villager')
	boss(event, 'lich', 'minecraft:gold_block', 'minecraft:dripping_lava')
	boss(event, 'hydra', 'minecraft:ancient_debris', 'minecraft:sneeze')
	boss(event, 'ur_ghast', 'minecraft:crying_obsidian', 'minecraft:instant_effect')
	boss(event, 'snow_queen', 'minecraft:lapis_block', 'minecraft:item_snowball')
})


// BlockEvents.rightClicked(event => {
// 	let items = []
// 	Ingredient.of('#forge:ores').itemIds.forEach(
// 		e => {
// 			items.push(e)
// 			console.log(e)
// 		}
// 	)
// 	console.log(items)
// })
// EntityEvents.hurt(event => {
//     if(event.entity.type == 'minecraft:horse'){
// 		event.cancel()
// 	}
// })



// const $PatchouliAPI = require('packages/vazkii/patchouli/api/$PatchouliAPI').$PatchouliAPI;
// BlockEvents.rightClicked(event => {
// 	if(event.item !== 'twilightforest:magic_map_focus') {return}
//     // $PatchouliAPI.get().showMultiblock($PatchouliAPI.get().getMultiblock("kubejs:clay_altar"), null, event.block.pos.offset(0,2,0),"none")
// 	// let rotation1 = /**@type {Internal.IMultiblock} */(global.MULTIBLOCK.ClayAltar()).validate(event.level, event.block.pos)
//     //     if(rotation1 === null){
//     //         return
//     //     }
// 	// console.log($PatchouliAPI.get().getCurrentMultiblock().place(event.level, event.block.pos.offset(0,3,0), "none"))
// 	$PatchouliAPI.get().getMultiblock("kubejs:test_multiblock_machine").place(event.level, event.block.pos.offset(0,2,0), "none")
// })

// BlockEvents.rightClicked(event => {
// 	if(event.hand !== 'MAIN_HAND') {return}
// 	let { level, block, player, item } = event
// 	let pos = block.pos
// 	if(event.item !== 'twilightforest:raven_feather') {return}
// 	let rotation1 = /**@type {Internal.IMultiblock} */(global.MULTIBLOCK.Test_MultiBlock_Machine()).validate(event.level, event.block.pos)
//         if(rotation1 === null){
//             return
//         }
	
// 	//清除建好的多方块结构

// 	let SimulateResult = /**@type {Internal.IMultiblock} */(global.MULTIBLOCK.Test_MultiBlock_Machine())
// 		.simulate(level,pos,"none",true).getSecond()
		
// 	// console.log(SimulateResult.map(e=>e.getStateMatcher()))
// 	let cBlocks = composedBlocks(SimulateResult,[$PatchouliAPI.get().anyMatcher(),Blocks.AIR],new Vec3i(0,-1,0))
// 	cBlocks.forEach(e=>{
// 	    level.destroyBlock(e,true)
// 	})
// })


// /**
//  * 
//  * @param {Internal.Collection<Internal.IMultiblock$SimulateResult>} SimulateResult
//  * @param {Internal.IStateMatcher[]} StateMatcherblacklist //匹配黑名单
//  * @param {Vec3i_} offset //偏移量
//  * @returns {Internal.BlockPos$MutableBlockPos[]}
//  */
// let composedBlocks = (SimulateResult, StateMatcherblacklist,offset) => {
// 	let container = []
//     SimulateResult.forEach(simulateResult => {
//         const pos = simulateResult.getWorldPosition().offset(offset);
//         const stateMatcher = simulateResult.getStateMatcher();
//         // 检查状态匹配器是否在黑名单中
//         if (StateMatcherblacklist.indexOf(stateMatcher) !== -1) {
//         }
// 		else {
// 			container.push(pos)
// 		}
//     });
// 	return container
// }

/*
我推荐使用
event.target.remove()
而不是
event.target.teleportTo(0,-1000,0)
If you need to clear entities, 
I recommend using "event.target.remove()"" instead of "event.target.teleportTo(0,-1000,0)"
*/


