const $BlockEntityJS = Java.loadClass("dev.latvian.mods.kubejs.block.entity.BlockEntityJS")

const $DepotBlockEntity = Java.loadClass("com.simibubi.create.content.logistics.depot.DepotBlockEntity");
const $ItemStack = Java.loadClass("net.minecraft.world.item.ItemStack");

const $BlockPos$MutableBlockPos = Java.loadClass("net.minecraft.core.BlockPos$MutableBlockPos")
const $BucketItem = Java.loadClass("net.minecraft.world.item.BucketItem")
const $Level = Java.loadClass("net.minecraft.world.level.Level")
const $ForgeFlowingFluid = Java.loadClass("net.minecraftforge.fluids.ForgeFlowingFluid")
const PatchouliAPI = Java.loadClass("vazkii.patchouli.api.PatchouliAPI")

let $ItemEntity = Java.loadClass("net.minecraft.world.entity.item.ItemEntity")
let $EntitySelector = Java.loadClass("net.minecraft.world.entity.EntitySelector")
let $CraftingTableBlock = Java.loadClass("net.minecraft.world.level.block.CraftingTableBlock")
let $NoteBlockInstrument = Java.loadClass("net.minecraft.world.level.block.state.properties.NoteBlockInstrument")
let $SixShapesBlock = Java.loadClass("com.morecategory.MoreCategory.blocks.block.SixShapesBlock")
let $Properties = Java.loadClass("net.minecraft.world.level.block.state.BlockBehaviour$Properties")


const blockid = [
	"hydraspawn",
	"lichspawn",
	"nagaspawn",
	"snow_queenspawn",
	"ur_ghastspawn"
]


const MaxEnergyStored = 10000; //最大蓄电量
const GenRate = 20; //发电速率 单位tick
const EnergyGen = 200; //发电量
global.XpUse = 400; //消耗经验量
global.particleUse1 = "minecraft:sonic_boom";
global.particleUse2 = "minecraft:electric_spark";
global.AQAQ = 9
global.AQAQRange = 10
global.showBool = false
StartupEvents.registry("block", event => {
	blockid.forEach(block =>
		event.create(block)
			.box(1, 0, 1, 15, 3, 15)
			.box(2, 3, 2, 14, 13, 14)
			.box(1, 12, 1, 4, 13, 4) //RED
			.box(12, 12, 1, 15, 13, 4)
			.box(1, 12, 12, 4, 13, 15)
			.box(12, 12, 12, 15, 13, 15)
			.box(1, 13, 1, 15, 16, 15)
			.model(`dimasic_server:block/${block}`).notSolid().fullBlock(false).displayName(block)
	)
	event.create('cai:r_glowstone').soundType('shroomlight').hardness(2.0).lightLevel(0.5)
	event.create('cai:ar_glowstone').soundType('shroomlight').hardness(2.0).lightLevel(0.2)
	event.create("ooot").blockEntity((info) => {
		info.inventory(9, 1)
		info.rightClickOpensInventory()
	})
	//default
	//working
	const __default__ = RawAnimation.begin().thenLoop("default");
	const __working__ = RawAnimation.begin().thenLoop("working");
	// geckojs
	event.create("aqaq", "animatable")
		.animatableBlockEntity(info => {
			info.enableSync() // clinet 和 server
			info.serverTick(global.AQAQ, 0, (be) => {
				// be.load(be.block.entityData);
				const { level, block } = be;

				// EN: Store the block facing value
				// ZH: 存储方向
				be.data.putString("facing", block.properties.facing)
				be.sync()

				const offsetblock = getBlockToFacing(block, global.AQAQRange, level)
				const energy = be.persistentData.getInt("energy") || 0;
				const BlockBool = energy >= 200 && offsetblock ? true : false;

				// EN: Store the animation boolean value
				// ZH: 存储决定动画的布尔值

				be.data.putBoolean("animationBool", BlockBool)
				be.sync()

				if (energy < 200) {
					return
				}

				if (offsetblock == undefined) { }
				else {
					if (offsetblock.blockState.getDestroySpeed(level.getChunkForCollisions(offsetblock.pos.x, offsetblock.pos.z), offsetblock.pos) <= 0) { return }
					be.persistentData.putInt("energy", energy - 200);
					global.getCoordinates3D(block.x + 0.5, block.y + 0.2, block.z + 0.5, offsetblock.x + 0.5, offsetblock.y, offsetblock.z + 0.5).forEach((poss, index) => {
						global.AddParticle(
							global.particleUse2,
							poss.x + Math.cos(index) / 9,
							poss.y + 0.5,
							poss.z + Math.sin(index) / 9,
							0, 0, 0
						)
					})
					level.server.scheduleInTicks(4, () => {
						level.destroyBlock(offsetblock.pos, true);
					})
				}

			})
			info.attachCapability(
				CapabilityBuilder.ENERGY.customBlockEntity()
					.canExtract(() => true)
					.canReceive(() => true)
					.extractEnergy((be, amount, simulate) => {
						const energy = be.persistentData.getInt("energy");
						const extracted = Math.min(energy, amount);
						if (!simulate) {
							be.persistentData.putInt("energy", energy - extracted);
						}
						return extracted;
					})
					.receiveEnergy((be, amount, simulate) => {
						let energy = be.persistentData.getInt("energy")
						let received = Math.min(MaxEnergyStored - energy, amount)
						if (!simulate) {
							be.persistentData.putInt("energy", energy + received)
						}
						return received

					})
					.getEnergyStored((be) => {
						const energy = be.persistentData.getInt("energy");
						return energy;
					})
					.getMaxEnergyStored(() => MaxEnergyStored)
			);
			info.addAnimation(state => {
				let entity = state.animatable.block.entity
				if (entity instanceof $BlockEntityJS) {
					let bool = entity.data.getBoolean("animationBool")
					let BlockBool = bool ? bool || false : false;

					if (BlockBool) {
						return state.setAndContinue(__working__)
					} else {
						return state.setAndContinue(__default__)
					}
				} else {
					return state.setAndContinue(__default__)
				}
			})
		})
		.geoModel(geo => {
			geo.autoGlowing = true;
			geo.setAnimation(_ => "kubejs:animations/block/aqaq.animation.json")
			geo.setModel(blockEntity => {
				let facing = blockEntity.data.getString("facing");
				switch (facing) {
					case "up":
						return "kubejs:geo/block/aqaq_up.geo.json";
					case "down":
						return "kubejs:geo/block/aqaq_down.geo.json";
					default:
						return "kubejs:geo/block/aqaq.geo.json";
				}
			})
			geo.setTexture(_ => "kubejs:textures/block/aqaq.png")
		})
		.property(BlockProperties.FACING)
		.placementState((callback) => callback.set(BlockProperties.FACING, callback.clickedFace))
		.notSolid().fullBlock(false)

	event.create("ttt").blockEntity((info) => {
		info.initialData({ energy: 0 });
		info.serverTick(GenRate, 0, (be) => {
			const { level, block } = be;
			let server = level.getServer();
			const energy = be.persistentData.getInt("energy") || 0;
			if (block.offset(0, 1, 0).id == "minecraft:sculk_shrieker") {
				let { x, y, z } = block.offset(0, 1, 0);
				let aabb = AABB.of(block.x - 5, block.y - 2, block.z - 5, block.x + 5, block.y + 2, block.z + 5);
				let entities = level.getEntities(null, aabb);
				entities.forEach(e => {
					if (e.player && e.xp > global.XpUse && energy <= MaxEnergyStored - GenRate) {

						e.setXp(e.xp - global.XpUse)
						global.raydrawLine(x + 0.5, y + 0.4, z + 0.5, e.x, e.y + 0.7, e.z, 0, global.particleUse1, server)
						be.persistentData.putInt("energy", energy + global.XpUse);
					}
				})
			}
		});
		info.attachCapability(
			CapabilityBuilder.ENERGY.customBlockEntity()
				.canExtract(() => true)
				.canReceive(() => true)
				.extractEnergy((be, amount, simulate) => {
					const energy = be.persistentData.getInt("energy");
					const extracted = Math.min(energy, amount);
					if (!simulate) {
						be.persistentData.putInt("energy", energy - extracted);
					}
					return extracted;
				})
				.receiveEnergy((be, amount, simulate) => {
					let energy = be.persistentData.getInt("energy")
					let received = Math.min(MaxEnergyStored - energy, amount)
					if (!simulate) {
						be.persistentData.putInt("energy", energy + received)
					}
					return received
				})
				.getEnergyStored((be) => {
					const energy = be.persistentData.getInt("energy");
					return energy;
				})
				.getMaxEnergyStored(() => MaxEnergyStored)
		);
	});



	event.createCustom("qqqqoo", () => {
		let Properties = $Properties.of().noOcclusion()
		Properties.destroyTime(2)
		let block = new $SixShapesBlock(Properties, 8)
		return block
	})
	event.createCustom("zio", () => {
		let Properties = $Properties.of().noOcclusion()
		Properties.destroyTime(2)
		let block = new $SixShapesBlock(Properties, 8)
		return block
	})
	event.createCustom("stone_crafting_table", () => {
		let block = new $CraftingTableBlock(
			$Properties.of()
				.instrument("bass")
				.strength(2.5).sound(SoundType.WOOD))
		return block
	})
	// event.createCustom("ziou",()=>{
	// 	let block = new $Cakeblock($Properties.of())
	// 	return block
	// })

	event.create("ababa", "animatable")
		.animatableBlockEntity(info => {
			info.addAnimation(state => state.setAndContinue(__working__))
		})
		.geoModel(geo => {
			geo.autoGlowing = true;
			geo.setAnimation(blockEntity => "kubejs:animations/block/ababa.animation.json")
			geo.setModel(blockEntity => "kubejs:geo/block/ababa.geo.json")
			geo.setTexture(blockEntity => "kubejs:textures/block/ababa.png")
		})
		.box(0, 0, 0, 16, 30, 16)
		.notSolid().fullBlock(false)

	event.create("myjq", "animatable")
		.animatableBlockEntity(info => {
			info.enableSync()
			info.serverTick(0, 0, (be) => {
				let { level, block } = be;
				let pos = block.pos;
				let rotation = global.MULTIBLOCK.magicAltar().validate(level, pos)

				if (rotation == null) {
					if (PatchouliAPI.get().getMultiblock("kubejs:magic_altar") && pos && be.data.getInt("showNum") < 5) {
						PatchouliAPI.get().showMultiblock(PatchouliAPI.get().getMultiblock("kubejs:magic_altar"), null, pos.offset(0, -1, 0), 'NONE')
						be.data.putInt("showNum", be.data.getInt("showNum") ? be.data.getInt("showNum") + 1 : 1)
						be.sync()
					}
					if (be.data.getInt("showNum") == 6) {
						be.data.putInt("showNum", 0)
						be.sync()
					}
				} else {
					// PatchouliAPI.get().clearMultiblock()
					be.data.putInt("showNum", 6)
					be.sync()
					!Item.of("kubejs:pedestal", 1).isEmpty() && Client.player && global.myjqRecipes && mutMain(block)
				}

				if (global.showBool && be.data.getInt("showNum") == 5) {
					be.data.putInt("showNum", 0)
					be.sync()
					be.level.server.scheduleInTicks(4, () => global.showBool = false)
				}

				be.data.putBoolean("animationBool", rotation != null)
				be.sync()
			})
			info.addAnimation(state => {
				let entity = state.animatable.block.entity
				if (entity instanceof $BlockEntityJS) {
					let bool = entity.data.getBoolean("animationBool")
					let bool2 = entity.data.getBoolean("reciping")
					let BlockBool = bool && bool2 ? bool && bool2 || false : false;

					if (BlockBool) {
						return state.setAndContinue(__working__)
					} else {
						return state.setAndContinue(__default__)
					}
				} else {
					return state.setAndContinue(__default__)
				}
			})
		})
		.geoModel(geo => {
			// console.log(geo.translucent)
			geo.autoGlowing = true;
			// geo.translucent = true;
			geo.setAnimation(blockEntity => "kubejs:animations/block/myjq.animation.json")
			geo.setModel(blockEntity => "kubejs:geo/block/myjq.geo.json")
			geo.setTexture(blockEntity => "kubejs:textures/block/myjq.png")
		})
		.notSolid().fullBlock(false)

	event.create("myjq2").notSolid().fullBlock(false).noItem()

	event.create("jar")
		.blockEntity((info) => {
			info.initialData({
				fluidTank: {
					FluidName: undefined,
					Amount: undefined,
				},
				give: 0
			})
			info.enableSync()
			info.serverTick(0, 0, (be) => {
				let { level, block } = be
				let data = block.entityData.getCompound("data")
				let fluidTank = data.getCompound("fluidTank")
				fluidTank ? be.data.put("fluidTank", fluidTank) : {}
				be.sync()
				let id = fluidTank.getString("FluidName")
				let amount = fluidTank.getInt("Amount")

				if (id && amount !== undefined) {
					if (amount > 8000) {
						fluidTank.putInt("Amount", 8000)
					} else if (amount <= 0) {
						fluidTank.putInt("Amount", 0)
						be.data.putInt("useAmount", 0)
						be.sync()
					}
				}
			})
			info.attachCapability(
				// 1.无法输入
				// 2.管道线路中无可存储节点时仍然会虚空抽取
				// 3.机械动力管道中会有所损耗
				// 4.PIPZE管道中会把所有节点的方块都同时添加，导致复制问题

				// 5.但是我不要输出功能了，以上问题皆以解决
				CapabilityBuilder.FLUID.customBlockEntity()
					.getCapacity((be) => 8000)
					.getFluid((/**@type {Internal.BlockEntityJS}*/be,/**@type {Internal.FluidStackJS_}*/stack) => {
						if (be instanceof $BlockEntityJS) {
							// let stackName = stack?.fluid?.arch$registryName()?.toString() ?? "minecraft:water"
							// let stackAmount = stack?.amount ?? 0
							// console.log(stack)
							let fluidTank = be.block.entityData.getCompound("data").getCompound("fluidTank")
							let id = fluidTank.getString("FluidName")
							let amount = fluidTank.getInt("Amount")
							if (id && amount) {
								return amount > 0 ? Fluid.of(id, amount) : Fluid.of("water", 0)
							} else {
								return Fluid.of("water", 0)
							}
						} else {
							return Fluid.getEmpty()
						}
					})
			)
		})
		.rightClick((event) => {
			let { player, hand, level, block } = event;
			let { pos, entityData } = block;
			let itemStack = player.getItemInHand(hand);
			let item = /**@type {Internal.BucketItem}*/(itemStack.getItem())
			let itemFluid = item.getFluid();
			if (itemFluid instanceof $ForgeFlowingFluid) {
				let itemFluidName = itemFluid.arch$registryName().toString();
				let fluidTank = entityData.getCompound("data").getCompound("fluidTank")
				let id = fluidTank.getString("FluidName")
				let amount = fluidTank.getInt("Amount")

				if (amount > 0 && (itemFluidName == id) && amount < 7001) {
					fluidTank.putInt("Amount", amount + 1000)
					itemStack.setCount(itemStack.getCount() - 1);
					player.give("bucket")
				} else if (amount == 0 || amount == undefined || id == "") {
					// console.log(itemFluidName)
					entityData.getCompound("data").put("fluidTank", {
						FluidName: itemFluidName,
						Amount: 1000
					})
					itemStack.setCount(itemStack.getCount() - 1);
					player.give("bucket")
				}
			}
		})
		.box(3, 0, 3, 13, 13, 13)
		.box(6, 13, 6, 10, 14, 10)
		.box(5, 14, 5, 11, 16, 11)
		.defaultTranslucent().notSolid().fullBlock(false).soundType("glass")

})


CapabilityEvents.blockEntity(event => {
	event.attach("create:fluid_tank",
		BotaniaCapabilityBuilder.MANA.blockEntity()
			.receiveMana((be, amount) => {
				let fluid = be.getCapability(ForgeCapabilities.FLUID_HANDLER).orElse(null)
				fluid.fill(Fluid.of("cai:mana", 0.1 * amount), "execute")
			})
			.getCurrentMana((be) => {
				let fluid = be.getCapability(ForgeCapabilities.FLUID_HANDLER).orElse(null)
				return fluid.getFluidInTank(0).amount;
			})
			.isFull((be) => {
				let fluid = be.getCapability(ForgeCapabilities.FLUID_HANDLER).orElse(null)
				return (fluid.getTankCapacity(0) <= fluid.getFluidInTank(0).amount)
					|| fluid.getFluidInTank(0).fluid != Fluid.of("cai:mana").fluid && fluid.getFluidInTank(0).amount > 0;
			})
	)
})




/**
 * @param {Internal.BlockPos$MutableBlockPos} worldPosition 
 * @param {Internal.Level} level*/
global.getItemListToBe = (worldPosition, level) => {
	let gp = worldPosition.offset(1, 1, 1)
	let aabb = AABB.of(worldPosition.x, worldPosition.y, worldPosition.z, gp.x, gp.y, gp.z);
	let itemEntities = level.getEntitiesOfClass($ItemEntity, aabb, $EntitySelector.ENTITY_STILL_ALIVE)
	let stacks = [];
	itemEntities.forEach(itemEntity => {
		if (!itemEntity.getItem().isEmpty()) {
			stacks.push(itemEntity.getItem());
		}
	})
	return stacks;
}




/**
 * @param {Internal.BlockContainerJS_} block
 * @param {Internal.BlockPos$MutableBlockPos_} pos
 * @param {Internal.ServerLevel_} level
 * @param {TestMultiBlockRecipes} recipes
 */
global.RemoveAndPopItemListToBe = (block, pos, level, recipes) => {
	let gp = pos.offset(1, 1, 1)
	let aabb = AABB.of(pos.x, pos.y, pos.z, gp.x, gp.y, gp.z);
	let itemEntities = level.getEntitiesOfClass($ItemEntity, aabb, $EntitySelector.ENTITY_STILL_ALIVE)
	/**@param {Internal.List_<Internal.ItemEntity>} itemEntities*/
	const isSubset = new Array(recipes.input).every(item => itemEntities.map(e => e.getItem().id).indexOf(item.id) != -1)
	//id检测^^^
	// new ArrayList(recipes.input).forEach(item => {console.log(item.count,itemEntities.find(e => e.getItem().id == item.id).getItem().count)})
	// console.log(itemEntities.map(e=>e.getItem()))
	// console.log(isSubset)
	if (!isSubset) {
		// console.log(isSubset)
		return
	}
	const countok = new Array(recipes.input).every(item => item.count <= itemEntities.find(e => e.getItem().id == item.id).getItem().count)
	//数量匹配^^^
	if (!countok) {
		// console.log(countok)
		return
	}
	// 定义递归函数来添加粒子
	let addParticles = (i, poss) => {
		if (i > 4) {
			return; // 当i大于4时结束递归
		}

		block.level.server.scheduleInTicks(2 + i, () => {
			global.AddParticle(
				global.particle.sonic_boom,
				poss.x + Math.cos(i),
				poss.y + i / 2,
				poss.z + Math.sin(i),
				0,
				0,
				0
			);
		});

		// 递归调用addParticles函数，每次都将i加1
		addParticles(i + 1, pos);
	}
	let i = 0;
	addParticles(i, pos);
	let boolfilterScreen = {
		boolers: {},
	};
	//^^^布尔过滤器
	recipes.input.forEach(input => {
		let items = recipes.input.filter(e => e.maxStackSize == 1);
		items.forEach(item => {
			boolfilterScreen.boolers[item.id] = false;
		});
	});

	itemEntities.forEach(itemEntity => {
		if (!itemEntity.getItem().isEmpty()) {
			recipes.input.forEach(input => {
				let item = recipes.input.find(e => e.maxStackSize == 1 && e.id === itemEntity.getItem().id);
				if (item && itemEntity.getItem().count >= input.count) {
					if (boolfilterScreen.boolers[item.id]) {
						return;
					} else {
						boolfilterScreen.boolers[item.id] = true;
					}
					itemEntity.getItem().count -= input.count;
				} else if (!item && itemEntity.getItem().count >= input.count && input.id === itemEntity.getItem().id) {
					itemEntity.getItem().count -= input.count;
				}
			});
			global.PlaySound("minecraft:block.sculk_shrieker.shriek", 200, 1)
		}
	});
	block.level.server.scheduleInTicks(20, () => {

		recipes.output.forEach(E => {

			block.up.popItem(E)
		})
	})
	return false;
}



/**
 * 
 * @param {number} x1 
 * @param {number} y1 
 * @param {number} z1 
 * @param {number} x2 
 * @param {number} y2 
 * @param {number} z2 
 * @param {number} time
 * @param {string} particle
 * @param {Internal.MinecraftServer_} server
 */
global.raydrawLine = (x1, y1, z1, x2, y2, z2, time, particle, server) => {
	let s = JavaMath.sqrt(JavaMath.pow(x2 - x1, 2) + JavaMath.pow(y2 - y1, 2) + JavaMath.pow(z2 - z1, 2));
	let dx = (x2 - x1) / s;
	let dy = (y2 - y1) / s;
	let dz = (z2 - z1) / s;
	x1 += dx;
	y1 += dy;
	z1 += dz;
	if (time < 8) {
		server.scheduleInTicks(2, () => {
			time += 1;
			global.AddParticle(particle, x1, y1, z1, 0, 0, 0)
			return global.raydrawLine(x1, y1, z1, x2, y2, z2, time, particle, server)
		})
	}
}

/**
 * 
 * @param {Internal.ServerLevel_} level
 * @param {Internal.BlockPos_} pos1
 * @param {number} offset 
 * @param {string} axis 
 * @returns 
 */
function getBlocksAlongAxis(level, pos1, offset, axis) {
	let blocks = [];
	let pos2
	switch (axis) {
		case "x":
			pos2 = level.getBlock(pos1).offset(offset, 0, 0).pos
			break;
		case "y":
			pos2 = level.getBlock(pos1).offset(0, offset, 0).pos
			break;
		case "z":
			pos2 = level.getBlock(pos1).offset(0, 0, offset).pos
			break;
	}
	// 确定轴对应的坐标属性
	let axisCoord = axis.toLowerCase(); // 将轴名转换为小写
	let axisMin = Math.min(pos1[axisCoord], pos2[axisCoord]);
	let axisMax = Math.max(pos1[axisCoord], pos2[axisCoord]);
	// 遍历轴上的每个坐标
	for (let coord = offset > 0 ? axisMin : axisMax; offset > 0 ? (coord <= axisMax) : (coord >= axisMin); offset > 0 ? coord++ : coord--) {
		let coordPos = { x: pos1.x, y: pos1.y, z: pos1.z }
		coordPos[axisCoord] = coord
		let block = level.getBlock(coordPos.x, coordPos.y, coordPos.z);
		let destroySpeed = level.getBlock(block.pos).blockState.getDestroySpeed(level.getChunkForCollisions(block.x, block.z), block)
		if (block.id === "minecraft:air") { }
		else if (destroySpeed >= 100 || destroySpeed <= 0) { blocks.push(undefined) }
		else { blocks.push(block) }
	}
	return blocks[1];
}


global.getCoordinates3D = (x1, y1, z1, x2, y2, z2) => {
	let coordinates = [];

	// 计算步长
	let distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));
	let stepX = (x2 - x1) / distance;
	let stepY = (y2 - y1) / distance;
	let stepZ = (z2 - z1) / distance;

	// 计算每个步长上的坐标点
	for (let t = 0; t <= distance; t += 1) {
		let x = x1 + t * stepX;
		let y = y1 + t * stepY;
		let z = z1 + t * stepZ;
		coordinates.push({ x: x, y: y, z: z });
	}

	return coordinates;
}






CapabilityEvents.blockEntity(event => {
	event.attach("blast_furnace",
		CapabilityBuilder.ITEM.blockEntity()
			.extractItem((blockEntity, slot, amount, simulate) => false)
			.insertItem((blockEntity, slot, stack, simulate) => false)
			.getSlotLimit((blockEntity, slot) => false)
			.getSlots((blockEntity) => false)
			.getStackInSlot((blockEntity, slot) => false)
			.isItemValid((blockEntity, slot, stack) => false)
			.availableOn((blockEntity, direction) => false)
			.side("down")
	)
})



/**
 * @param {Internal.BlockContainerJS_} block
 * @param {integer} offset 
 * @param {Internal.ServerLevel_} level
 * @returns {Internal.BlockContainerJS_ | undefined} The block at the calculated offset
 */
function getBlockToFacing(block, offset, level) {
	const facing = /**@type {"up" | "down" | "north" | "south" | "east" | "west"}*/(block.properties.facing);
	const directionMap = {
		"up": { axis: "y", offset: offset },
		"down": { axis: "y", offset: -offset },
		"north": { axis: "z", offset: -offset },
		"south": { axis: "z", offset: offset },
		"east": { axis: "x", offset: offset },
		"west": { axis: "x", offset: -offset }
	};

	const { axis, offset: axisOffset } = directionMap[facing] || { axis: "x", offset: -offset };
	return facing ? getBlocksAlongAxis(level, block.pos, axisOffset, axis) : undefined;
}

























































/**
 * 
 * @param {Internal.BlockContainerJS_} block
 */
function mutMain(block) {
	/**
	 * 
	 * @param {Internal.ItemStack[]} box 盒子
	 * @param {Internal.ItemStack[]} items 物品组
	 * @param {number} pLength 长度
	 * @returns {{matched: boolean, matchedItems: Internal.ItemStack[]}} 匹配结果及匹配成功的盒子项数组
	 */
	function itemMatch(box, items, pLength) {
		// 如果 items 的长度超出 pLength，则返回 false 和空数组
		if (items.length > pLength) {
			return { matched: false, matchedItems: [] };
		}

		// 创建一个用于检查 box 中每个 item 的列表
		let boxItems = box.slice(0, pLength);
		let matchedItems = [];
		// 检查 items 是否在 box 中
		for (let item of items) {
			let found = boxItems.some(stack =>
				stack.item === item.item &&
				(stack.nbt === item.nbt || !item.nbt) &&
				stack.count >= item.count // Allow partial matches
			);
			if (!found) {
				return { matched: false, matchedItems: [] };
			}
			// 如果匹配成功，将匹配的项添加到 matchedItems
			matchedItems.push(boxItems.find(stack =>
				stack.item === item.item &&
				(stack.nbt === item.nbt || !item.nbt) &&
				stack.count >= item.count
			));
		}

		return { matched: true, matchedItems: matchedItems };
	}

	/**
	 * 
	 * @param {{FluidName: string, Amount: number}[]} box 盒子
	 * @param {Internal.FluidStackJS_[]} fluids 物品组
	 * @param {number} pLength 长度
	 * @returns {{matched: boolean, matchedFluids: {FluidName: string, Amount: number}[]}} 匹配结果及匹配成功的盒子项数组
	 */
	function fluidMatch(box, fluids, pLength) {
		// 如果 fluids 的长度超出 pLength，则返回 false 和空数组
		if (fluids.length > pLength) {
			return { matched: false, matchedFluids: [] };
		}

		// 创建一个用于检查 box 中每个 item 的列表
		let boxItems = box.slice(0, pLength);
		let matchedFluids = [];

		// 检查 fluids 是否在 box 中
		for (let fluid of fluids) {
			let found = boxItems.some(stack =>
				stack.FluidName === `${fluid.fluid.arch$registryName()}` &&
				stack.Amount >= fluid.getAmount()
			);
			if (!found) {
				return { matched: false, matchedFluids: [] };
			}
			// 如果匹配成功，将匹配的项添加到 matchedFluids
			matchedFluids.push(boxItems.find(stack =>
				stack.FluidName === `${fluid.fluid.arch$registryName()}` &&
				stack.Amount >= fluid.getAmount()
			));
		}

		return { matched: true, matchedFluids: matchedFluids };
	}


	/**
	 * 查找符合条件的配方
	 * @param {Internal.ItemStack[]} itemBox 物品盒子
	 * @param {{FluidName: string, Amount: number}[]} fluidBox 流体盒子
	 * @returns {Object|null} 匹配的配方或 null（如果没有找到匹配的配方）
	 */
	function findRecipe(itemBox, fluidBox) {
		for (let recipe of global.myjqRecipes) {
			if (recipe.rType === "item") {
				let itemMatchResult = itemMatch(itemBox, recipe.input.item, itemBox.length);
				let fluidMatchResult = fluidMatch(fluidBox, recipe.input.fluid, fluidBox.length);
				if (itemMatchResult.matched && fluidMatchResult.matched) {
					return recipe;
				}
			} else if (recipe.rType === "fluid") {
				let itemMatchResult = itemMatch(itemBox, recipe.input.item, itemBox.length);
				let fluidMatchResult = fluidMatch(fluidBox, recipe.input.fluid, fluidBox.length);
				if (itemMatchResult.matched && fluidMatchResult.matched) {
					return recipe;
				}
			}
		}
		return null;
	}

	/**
	 * 消耗物品和流体 ps:我不想优化了，其实itemBox与itemBoxBlocks可以合并的
	 * @param {Internal.ItemStack[]} itemBox 物品盒子
	 * @param {Internal.FluidStackJS_[]} fluidBox 流体
	 * @param {Object} recipe 匹配的配方
	 * @param {Internal.BlockEntityJS_} giveBe 是否给予物品
	 * @param {Internal.BlockEntityJS_[]} itemBoxBlocks 置物台方块组
	 */
	function consumeAndGiveResources(itemBox, fluidBox, recipe, giveBe, itemBoxBlocks) {
		function consumeResources(itemBox, fluidBox, recipe) {
			// 消耗物品
			let itemMatchResult = itemMatch(itemBox, recipe.input.item, itemBox.length);
			itemMatchResult.matchedItems.forEach(item => {
				item.setCount(item.getCount() - recipe.input.item.find(input =>
					input.item === item.item &&
					input.nbt === item.nbt
				).count);
			});

			// 刷新置物台
			for (let block of itemBoxBlocks) {
				block.inventory.extractItem(0, 0, false)
			}
			// 消耗流体
			let fluidMatchResult = fluidMatch(fluidBox, recipe.input.fluid, fluidBox.length);
			fluidMatchResult.matchedFluids.forEach(fluid => {
				fluid.putInt("Amount", fluid.Amount - recipe.input.fluid.find(input =>
					`${input.fluid.arch$registryName()}` === fluid.FluidName
				).amount);
			});
		}

		if (itemMatch(itemBox, recipe.input.item, itemBox.length).matched && fluidMatch(fluidBox, recipe.input.fluid, fluidBox.length).matched) {
			if (recipe.rType === "item") {
				let outputItem = /**@type {Internal.ItemStack}*/(recipe.output);
				let oCopyItem = outputItem.copy();
				if (giveBe instanceof $DepotBlockEntity) {
					let itemHandler = giveBe.getCapability(ForgeCapabilities.ITEM_HANDLER, Direction.UP).orElse(null);
					let initialItem = itemHandler.getStackInSlot(0);
					if (initialItem === null || initialItem.isEmpty()) {
						consumeResources(itemBox, fluidBox, recipe);
						itemHandler.insertItem(0, oCopyItem, false);
					} else if (initialItem.count < initialItem.maxStackSize &&
						outputItem.id == initialItem.id &&
						(outputItem.nbt == initialItem.nbt || outputItem.nbt == null) &&
						outputItem.count + initialItem.count <= initialItem.maxStackSize
					) {
						consumeResources(itemBox, fluidBox, recipe)
						initialItem.count += oCopyItem.count;
					} else {
						// Client.player.statusMessage = "配方无法执行，可能置物台被占用或者置物台物品已满";
						giveBe.data.putInt("recipeTick", 0)
					}
				} else {
					// Client.player.statusMessage = "请在顶部放置置物台";
				}
			} else if (recipe.rType === "fluid") {
				let outputFluid = /**@type {Internal.FluidStackJS_}*/(recipe.output);
				let outputFluidName = `${outputFluid.fluid.arch$registryName()}`
				if (giveBe?.block?.id === "kubejs:jar" && giveBe instanceof $BlockEntityJS) {
					let data = giveBe.block.entityData.getCompound("data");
					let fluidTank = data.getCompound("fluidTank");
					let fluidName = fluidTank.getString("FluidName");
					let fluidAmount = fluidTank.getInt("Amount");
					if (fluidName === outputFluidName && fluidAmount + outputFluid.amount <= 8000) {
						consumeResources(itemBox, fluidBox, recipe)
						fluidTank.putInt("Amount", fluidAmount + outputFluid.amount);
					} else if (!fluidName || fluidAmount === 0 || fluidName == "") {
						consumeResources(itemBox, fluidBox, recipe)
						data.put("fluidTank", {
							FluidName: outputFluidName,
							Amount: outputFluid.amount
						})
					} else {
						// Client.player.statusMessage = "配方无法执行，可能储罐被占用或者储罐流体已满";
						giveBe.data.putInt("recipeTick", 0)
					}
				} else {
					// Client.player.statusMessage = "请在顶部放置储罐";
				}
			}
		}
	}
	let be = /**@type {Internal.BlockEntityJS}*/(block.entity)

	// 获取物品和流体
	let b1 = block.offset(2, 1, 2);
	let b2 = block.offset(2, 2, 2);
	let b3 = block.offset(-2, 1, 2);
	let b4 = block.offset(-2, 2, 2);
	let b5 = block.offset(2, 1, -2);
	let b6 = block.offset(2, 2, -2);
	let b7 = block.offset(-2, 1, -2);
	let b8 = block.offset(-2, 2, -2);
	let b9FluidTank = block.offset(2, 1, 0).entityData.getCompound("data").getCompound("fluidTank");
	let b10FluidTank = block.offset(0, 1, 2).entityData.getCompound("data").getCompound("fluidTank");
	let b11FluidTank = block.offset(-2, 1, 0).entityData.getCompound("data").getCompound("fluidTank");
	let b12FluidTank = block.offset(0, 1, -2).entityData.getCompound("data").getCompound("fluidTank");

	const ugataBlocks = [b1, b2, b3, b4, b5, b6, b7, b8];

	const [A, B, C, D, E, F, G, H] = [
		b1.getInventory(Direction.UP),
		b2.getInventory(Direction.UP),
		b3.getInventory(Direction.UP),
		b4.getInventory(Direction.UP),
		b5.getInventory(Direction.UP),
		b6.getInventory(Direction.UP),
		b7.getInventory(Direction.UP),
		b8.getInventory(Direction.UP)
	];

	const ugeta = [
		A.getStackInSlot(0),
		B.getStackInSlot(0),
		C.getStackInSlot(0),
		D.getStackInSlot(0),
		E.getStackInSlot(0),
		F.getStackInSlot(0),
		G.getStackInSlot(0),
		H.getStackInSlot(0)
	];

	const fluidUgeta = [b9FluidTank, b10FluidTank, b11FluidTank, b12FluidTank];

	// 查找匹配的配方
	let recipe = findRecipe(ugeta, fluidUgeta);
	let offBlock = block.offset(0, 1, 0)
	let giveBe = offBlock.entity;
	let reciping = be.data.getBoolean("reciping")
	// console.log(recipe)
	if (recipe) {
		let recipeTick = /**@type {integer}*/(recipe.tick) || 0;
		let blockRecipeTick = be.data.getInt("recipeTick")
		// 消耗物品和流体
		let canGiveBlocks = ["create:depot", "kubejs:jar"]
		let iscanGiveBlock = canGiveBlocks.includes(offBlock.id)
		let TupBlock = recipe.type === "item" ? "create:depot" : "kubejs:jar"
		let canInput = iscanGiveBlock ? (recipe.type === "item" ? itmeEquals(offBlock.inventory.getStackInSlot(0), recipe.output) : canInputFluid(offBlock.entityData.getCompound("data").getCompound("fluidTank"), recipe.output, 8000)) : false
		let soundTick = recipeTick > 40 ? recipeTick : 40 - recipeTick;
		let mathTick = ((recipeTick % blockRecipeTick) / 20)
		// console.log(mathTick)
		canInput && mathTick == NaN && soundTick < 40 ? global.PlaySound("create:haunted_bell_convert", 200, 1) : {}
		if (!iscanGiveBlock) {
			be.data.putBoolean("reciping", false)
			be.data.putInt("recipeTick", 0)
		}
		if (blockRecipeTick < recipeTick && iscanGiveBlock && canInput) {
			be.data.putBoolean("reciping", true)
			be.data.putInt("recipeTick", blockRecipeTick + 1)
		} else if (iscanGiveBlock && blockRecipeTick == recipeTick) {
			canInput && soundTick >= 40 ? global.PlaySound("create:haunted_bell_convert", 200, 1) : {} //create:haunted_bell_convert
			be.data.putBoolean("reciping", canInput)
			consumeAndGiveResources(ugeta, fluidUgeta, recipe, giveBe, ugataBlocks)
			be.data.putInt("recipeTick", 0)
		} else {
			be.data.putBoolean("reciping", false)
			be.data.putInt("recipeTick", 0)
		}
	} else {
		be.data.putBoolean("reciping", false)
		be.data.putInt("recipeTick", 0)
		// Client.player.statusMessage = "没有匹配的配方"; // 发送状态消息
	}
}



/**
 * 
 * @param {Internal.ItemStack} i1
 * @param {Internal.ItemStack} i2
 */
function itmeEquals(i1, i2) {
	return i1.id == i2.id && i1.count + i2.count <= i1.maxStackSize && (i1.nbt == i2.nbt || !i1.nbt)
}

/**
 * 
 * @param {{FluidName: string, Amount: number}} fb1 
 * @param {Internal.FluidStackJS_} f1 
 * @param {integer} maxA 
 */
function canInputFluid(fb1, f1, maxA) {
	return fb1.FluidName == f1.id && fb1.Amount <= maxA - f1.amount || !fb1.FluidName || fb1.Amount == 0;
}
