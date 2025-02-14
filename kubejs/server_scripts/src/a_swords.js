const $Player = Java.loadClass("net.minecraft.world.entity.player.Player");
const $LivingHurtEvent = Java.loadClass("net.minecraftforge.event.entity.living.LivingHurtEvent");


let bool = true;
let pi = KMath.PI






/**
 * 
 * @param {$Player_} player 
 */
function hasSoulInSolts(player) {
	return hasCuriosItem(player, "cai:soul_talisman");
}


let k = 0.28
/**
 *
 * @param {$Player_} player
 * @param {Number} n
 * @param {$LivingEntity_} entity
 */
function ActualHeal(player, n, entity) { player.heal(entity.health * n) }


function particle_fun(event, player, E) {
	let charmSee = false;
	let charmRender = player.nbt.ForgeCaps["curios:inventory"]["Curios"].find(function (curio) {
		return curio["Identifier"] === "charm";
	}).StacksHandler.Renders.Renders
	charmRender.forEach(a => {
		if (a.Render === 1) { charmSee = true }
	})
	if (hasSoulInSolts(player) === true && charmSee === true) {
		for (let i = -pi / 3; i <= pi / 3; i += k) {
			for (let j = -pi / 3; j <= pi / 3; j += k - 0.01) {
				if (i * i + j * j <= (pi ** 2) / 9 && i * i + j * j > 0.81 && Math.random() < 0.35) {
					event.server.runCommandSilent(`execute in ${event.level.dimension} run particle ${global.particle.soulpac} ${E.x + i} ${E.y + 1} ${E.z + j}`);
				}
			}
		}
	}
}




global.particle = {
	damage_indicator: "minecraft:damage_indicator",//黑色心
	crimson_spore: "minecraft:crimson_spore",//粉色发散
	ash: "minecraft:ash",//飞灰
	bubble_pop: "minecraft:bubble_pop", //泡泡
	barrier: "minecraft:barrier", //屏障
	dripping_lava: "minecraft:dripping_lava", //熔岩
	cloud: "minecraft:cloud", //云
	sonic_boom: "minecraft:sonic_boom", //音爆
	lava: "minecraft:lava", //熔岩
	soulpac: "minecraft:soul", //灵魂火焰
	campfire_cosy_smoke: "minecraft:campfire_cosy_smoke", //营火
	dragon_breath: "minecraft:dragon_breath", //龙息,
	cherry_leaves: "minecraft:cherry_leaves", //樱花
}





ItemEvents.rightClicked(e => {
	let HandItem = "cai:gdcz_sword"
	if (e.player.getHeldItem(e.hand) === HandItem) {
		bool = true;
		const player = e.player
		const rayLength = 50;
		const particleDistance = 0.7;
		const { startX, startY, startZ, direction } = playerRayTrace(rayLength, player)
		e.player.swing(e.hand, true)

		let Enchantments = e.player.getHeldItem(e.hand).enchantments;
		let FireAspect = false;
		let Sweeping = false;
		let SweepingLvl = 0;
		let Sharpness = false;
		let SharpnessLvl = 0;

		if (Enchantments != undefined) {
			for (var E in Enchantments) {
				if (Enchantments.hasOwnProperty(E)) { // 确保只遍历对象本身的属性，而不包括原型链上的属性
					var lvl = Enchantments[E];
					if (E === "minecraft:fire_aspect") {
						FireAspect = true;
					}
					if (E === "minecraft:sweeping") {
						Sweeping = true;
						if (lvl > 0 && lvl <= 255) { SweepingLvl = lvl; }
						else if (lvl > 255) { SweepingLvl = 255; }
					}
					if (E === "minecraft:sharpness") {
						Sharpness = true;
						if (lvl > 0 && lvl <= 255) { SharpnessLvl = lvl; }
						else if (lvl > 255) { SharpnessLvl = 255; }
					}
				}
			}
		}
		const c = 0.05
		let b = Sweeping === true ? Math.abs(Math.log(SweepingLvl * 2) * c + c) : 0
		for (let j = -pi * 0.1 - b; j <= pi * 0.1 + b; j += pi / 90) {
			for (let i = 0; i < rayLength / particleDistance; i++) {
				//e.server.runCommandSilent();
				if (FireAspect === true) {
					if (Math.random() * 0.1 < 0.01) {
						e.server.runCommandSilent(`execute in ${e.level.dimension} run particle ${global.particle.lava} ${startX + (direction.x + j) * i * particleDistance} ${startY + direction.y * i * particleDistance} ${startZ + (direction.z + j) * i * particleDistance}`)
					}
					else {
						e.server.runCommandSilent(`execute in ${e.level.dimension} run particle ${global.particle.damage_indicator} ${startX + (direction.x + j) * i * particleDistance} ${startY + direction.y * i * particleDistance} ${startZ + (direction.z + j) * i * particleDistance}`)
					}
				}
				else {
					e.server.runCommandSilent(`execute in ${e.level.dimension} run particle ${global.particle.damage_indicator} ${startX + (direction.x + j) * i * particleDistance} ${startY + direction.y * i * particleDistance} ${startZ + (direction.z + j) * i * particleDistance}`)
				}
				attackNearby(e, e.level, startX + (direction.x + j) * i * particleDistance, startY + direction.y * i * particleDistance, startZ + (direction.z + j) * i * particleDistance, 0.25, 14 + (Sharpness === true ? (SharpnessLvl + 1) / 2 : 1))

			}
		}
		let feetArmorEnchantments = e.player.feetArmorItem.enchantments
		let ptime = feetArmorEnchantments["minecraft:soul_speed"] * 2
		let plvl = feetArmorEnchantments["minecraft:soul_speed"] <= 10 ? feetArmorEnchantments["minecraft:soul_speed"] : 10
		if (feetArmorEnchantments.hasOwnProperty("minecraft:soul_speed") && e.player.sprinting == true) {
			e.player.potionEffects.add("minecraft:strength", 200, 3, false, false)
			e.player.potionEffects.add("minecraft:speed", 30 + ptime, 8 + plvl, false, false)
			e.player.potionEffects.add("minecraft:haste", 30 + ptime, 2, false, false)
			e.player.addItemCooldown(HandItem, 100 + plvl)
			if (e.level.dayTime() > 12000 && e.player.potionEffects.isActive("minecraft:night_vision") != true) {
				e.player.potionEffects.add("minecraft:night_vision", 30 + ptime, 8, false, false)
			}
		}
		else {
			e.player.addFood(1, 1.5)
			e.player.addItemCooldown(HandItem, 10)
		}

	}
})
///give @p written_book{title:"指令书",author:"传送术",pages:["[{"text":"主世界","clickEvent":{"action":"run_command","value":"/execute in minecraft:overworld run tp @s -166 79 -28"}},{"text":"  暮色","clickEvent":{"action":"run_command","value":"/execute in twilightforest:twilight_forest run tp @s 7 25 7"}},{"text":"  地狱","clickEvent":{"action":"run_command","value":"/execute in minecraft:the_nether run tp @s 4 51 107"}},{"text":"  末地","clickEvent":{"action":"run_command","value":"/execute in minecraft:the_end run tp @s -59 57 105"}}]"]}



NativeEvents.onEvent($LivingHurtEvent, (event) => {
	const actual = event.getSource().actual;
	const player = actual instanceof $Player ? actual : null
	/** @type {import("net/minecraft/world/item.ItemStack").$ItemStack} */ 
	const HeldItem = (player && player.getHandSlots()[0]) ?? Item.of("wooden_sword")
	HeldItem !== undefined ? HeldItem : HeldItem = HeldItem
	let { entity } = event
	let { level } = entity
	let { x, y, z } = entity
	if (HeldItem !== undefined && HeldItem === "cai:gdcz_sword" && event.entity.type !== null) {
		if (event.source.getType().toString() === "indirectMagic") return;
		let Enchantments = /** @type {import("net/minecraft/world/item.ItemStack").$ItemStack} */(HeldItem).enchantments;
		let FireAspect = false;
		let FireAspectLvl = 0;
		let Sweeping = false;
		let SweepingLvl = 0;
		let Sharpness = false;
		let SharpnessLvl = 0;
		if (Enchantments != undefined) {
			for (var E in Enchantments) {
				if (Enchantments.hasOwnProperty(E)) {
					var lvl = Enchantments[E];
					if (E === "minecraft:fire_aspect") {
						FireAspect = true;
						if (lvl > 0 && lvl <= 255) { FireAspectLvl = lvl; }
						else if (lvl > 255) { FireAspectLvl = 255; }
					}
					if (E === "minecraft:sweeping") {
						Sweeping = true;
						if (lvl > 0 && lvl <= 255) { SweepingLvl = lvl; }
						else if (lvl > 255) { SweepingLvl = 255; }
					}
					if (E === "minecraft:sharpness") {
						Sharpness = true;
						if (lvl > 0 && lvl <= 255) { SharpnessLvl = lvl; }
						else if (lvl > 255) { SharpnessLvl = 255; }
					}
				}
			}
		}


		let damage = 7
		let Type = event.entity.type;
		//function ActualHeal(n){event.source.actual.heal(event.entity.health * n)}
		if (Sharpness === true) {
			let Damage = damage + (SharpnessLvl + 1) * 0.9;
			Utils.server.scheduleInTicks(5, function () {
				if (!TB_TYPE.includes(Type)) {
					event.entity.attack(getOrSource(level, "magic"), Damage)
					if (hasSoulInSolts(event.source.actual) === true) {
						ActualHeal(event.source.actual, 0.01, event.entity)
						particle_fun(event, event.source.actual, event.entity)
					}
				}
				else {
					event.entity.attack(playAttack(event.source.actual, event.entity), Damage)
					if (hasSoulInSolts(event.source.actual) === true) {
						ActualHeal(event.source.actual, 0.01), event.entity
						particle_fun(event, event.source.actual, event.entity)
					}
				}
			})
		}
		let c = 5
		let b = Sweeping === true ? Math.abs(Math.log(SweepingLvl * 2) * c + c) : 1
		let n = 5 * b
		let aabb = AABB.CUBE.move(x - .5, y + .5, z - .5).expandTowards(-n, -n, -n).expandTowards(n, n, n)
		let list = level.getEntities(event.entity, aabb)
		let particleD = 0.2;



		list.forEach(e => {

			if (e === event.source.actual) { }
			else if (e.isLiving() && e.type === event.entity.type) {
				let rayLength = Math.pow(Math.pow(x - e.x, 2) + Math.pow(y - e.y, 2) + Math.pow(z - e.z, 2), 0.5)
				let direction = { x: -(x - e.x) / rayLength, y: -(y - e.y) / rayLength, z: -(z - e.z) / rayLength }
				for (let i = 0; i < rayLength / particleD; i++) {
					if (FireAspect === true) {
						if (Math.random() * 0.1 < 0.01) {
							Utils.server.runCommandSilent(`execute in ${level.dimension} run particle ${global.particle.lava} ${x + (direction.x) * i * particleD} ${y + (direction.y) * i * particleD} ${z + (direction.z) * i * particleD}`)
						}
						else {
							Utils.server.runCommandSilent(`execute in ${level.dimension} run particle ${global.particle.damage_indicator} ${x + (direction.x) * i * particleD} ${y + (direction.y) * i * particleD} ${z + (direction.z) * i * particleD}`)
						}
					}
					else {
						Utils.server.runCommandSilent(`execute in ${level.dimension} run particle ${global.particle.damage_indicator} ${x + (direction.x) * i * particleD} ${y + (direction.y) * i * particleD} ${z + (direction.z) * i * particleD}`)
					}
				}
				if (FireAspect == true) {
					e.mergeNbt({ Fire: (FireAspectLvl * 30) })
				}

				e.attack(getOrSource(level, "magic"), damage + (Sharpness === true ? (SharpnessLvl + 1) / 2 : 1))
				if (hasSoulInSolts(event.source.actual) === true) {
					ActualHeal(event.source.actual, 0.01, e)
					particle_fun(event, event.source.actual, e)
				}
			}
		})
	}
	let str = event.source.type().toString()
	let str_1 = str.indexOf("msgId=") + 6;
	let str_2 = str.indexOf(",", str_1);
	if (event.source !== undefined?.actual !== null && event.source !== undefined?.actual !== undefined && str.substring(str_1, str_2) === "player") {
		let charmSee = false;
		let charmRender = event.source.actual?.nbt?.ForgeCaps["curios:inventory"]["Curios"].find(function (curio) {
			return curio["Identifier"] === "charm";
		}).StacksHandler.Renders.Renders
		charmRender.forEach(a => {
			if (a.Render === 1) { charmSee = true }
		})
		if (charmSee === true && hasSoulInSolts(event.source.actual) === true) {
			for (let i = -pi / 3; i <= pi / 3; i += 0.28) {
				for (let j = -pi / 3; j <= pi / 3; j += 0.27) {
					if (i * i + j * j <= (pi ** 2) / 9 && i * i + j * j > 0.81 && Math.random() < 0.35) {
						Utils.server.runCommandSilent(`execute in ${level.dimension} run particle ${global.particle.soulpac} ${x + i} ${y + 1} ${z + j}`);
					}
				}
			}
		}
		if (hasSoulInSolts(event.source.actual) === true) {
			if (HeldItem !== "cai:gdcz_sword") { }
			else {
				event.entity.attack(getOrSource(level, "magic"), 1)
				event.source.actual.heal(event.entity.health * 0.01)
			}
		}
	}
})

// Item.of("tetra:modular_bow", "{Damage:0,HideFlags:1,"bow/basic_string_material":"basic_string/string","bow/extended_rest_material":"extended_rest/netherite","bow/recurve_stave_material":"recurve_stave/netherite","bow/riser":"bow/extended_rest","bow/stave":"bow/recurve_stave","bow/stave/settle_progress":973,"bow/string":"bow/basic_string","bow/string/settle_progress":342,honing_progress:162,id:"ecca62c0-8708-46f3-84d9-18a60507d470"}")
// Item.of("tetra:modular_bow", "{Damage:0,HideFlags:1,"bow/basic_string_material":"basic_string/phantom_membrane","bow/extended_rest_material":"extended_rest/netherite","bow/recurve_stave_material":"recurve_stave/netherite","bow/riser":"bow/extended_rest","bow/stave":"bow/recurve_stave","bow/stave/settle_progress":972,"bow/string":"bow/basic_string",honing_progress:161,id:"2c17cc33-5fcb-470e-99e6-be12ecc5069b"}")













// Item.of("acacia_boat").setRepairCost()

ServerEvents.tags("item", (event) => {
	event.add("forge:tier/netherite", /netherite_/)
})














































const END_TICK = 200;
let crouchTick = 0;

PlayerEvents.tick(event => {
	// console.log(crouchTick)
	const isAnli = event.player.getMainHandItem().id === "cai:anli" || event.player.getOffhandItem().id === "cai:anli";
	const removePaint = () => event.player.paint({
		example_1: {
			type: "item",
			x: 200,
			y: 200,
			remove: true
		}
	});
	const getShowText = (a, b) => a < b ? `蓄能中${a}.{b}${"🥵"}` : `蓄能完成${"❤️"}`
	if (isAnli) {
		event.player.paint({
			example_1: {
				type: "item",
				item: "cai:anli",
				customText: getShowText(crouchTick, END_TICK),
				x: 200,
				y: 200,
				remove: false
			}
		})
		if (event.player.crouching) {
			crouchTick < END_TICK && Math.random() < 0.5 ? addparticle(global.particle.dragon_breath, event.player.getX() + Math.cos(crouchTick) * 1.5, event.player.getY() + + crouchTick / 40, event.player.getZ() + Math.sin(crouchTick) * 1.5, 0, 0, 0, event, "jAVA") : {};
			crouchTick < END_TICK && Math.random() < 0.1 ? global.PlaySound("minecraft:entity.experience_orb.pickup", 2, 1) : undefined;

			if (crouchTick < END_TICK) {
				event.server.scheduleInTicks(1, () => {
					crouchTick += 1;
				})
			}
			else if (crouchTick >= END_TICK) {
				crouchTick = END_TICK;
			}
		} else if (crouchTick == 0) {
			removePaint();
		}
	} else {
		removePaint();
	}

	return;
})






ItemEvents.rightClicked(event => {
	let { player, item, server } = event;
	if (crouchTick === END_TICK && player.getMainHandItem().id === "cai:anli") {
		crouchTick = 0;
		player.swing(event.hand, true);
		// server.runCommandSilent(`playsound botania:rune_altar_craft block ${player.name} ${player.x} ${player.y} ${player.z} 1 1`)
		player.sendData("cai:music.wrist", 200, 1)
		// console.log(damage)
		for (let j = 0; j < 10; j++) {
			delay(server, () => {
				for (let i = 0; i < 23 - j; i++) {

					let FP = generateRandomCoordinates({ x: player.x, y: player.y + i * 0.001, z: player.z })
					let rom = JavaMath.random()
					let damage = EnCh(item).Sharpness ? EnCh(item).SharpnessLvl * 0.5 + 7.5 : 7
					let damageAdd = END_TICK / 20
					drawLine(FP.x1, FP.y1, FP.z1, FP.x2, FP.y2, FP.z2, event, damage + damageAdd, rom, 0)
				}
			}, 2, j + 1, 1)
		}
	}
})


/**
 * 
 * @param {$ItemStack_} HeldItem 
 * @returns 
 */
function EnCh(HeldItem) {
	if (HeldItem != undefined) {
		let Enchantments = HeldItem.enchantments;
		let FireAspect = false;
		let FireAspectLvl = 0;
		let Sweeping = false;
		let SweepingLvl = 0;
		let Sharpness = false;
		let SharpnessLvl = 0;
		if (Enchantments != undefined) {
			for (var E in Enchantments) {
				if (Enchantments.hasOwnProperty(E)) {
					var lvl = Enchantments[E];
					if (E === "minecraft:fire_aspect") {
						FireAspect = true;
						if (lvl > 0 && lvl <= 255) { FireAspectLvl = lvl; }
						else if (lvl > 255) { FireAspectLvl = 255; }
					}
					if (E === "minecraft:sweeping") {
						Sweeping = true;
						if (lvl > 0 && lvl <= 255) { SweepingLvl = lvl; }
						else if (lvl > 255) { SweepingLvl = 255; }
					}
					if (E === "minecraft:sharpness") {
						Sharpness = true;
						if (lvl > 0 && lvl <= 255) { SharpnessLvl = lvl; }
						else if (lvl > 255) { SharpnessLvl = 255; }
					}
				}
			}
		}
		return {
			FireAspect: FireAspect,
			FireAspectLvl: FireAspectLvl,
			Sweeping: Sweeping,
			SweepingLvl: SweepingLvl,
			Sharpness: Sharpness,
			SharpnessLvl: SharpnessLvl
		}
	}

}


NativeEvents.onEvent($LivingHurtEvent, event => {
	let { source, entity } = event;
	// console.log(`DAMAGE ${event.amount} ${getDamageReduction(entity)} ${event.amount * getDamageReduction(entity)}`)
	if (source.actual instanceof $Player && source.actual.getMainHandItem().id === "cai:anli") {
		let attackDamageValue = event.amount;
		let ad = crouchTick * 0.5 * (attackDamageValue - 1) > attackDamageValue ?
			crouchTick * 0.5 * (attackDamageValue - 1) :
			attackDamageValue
		let damageReduction = getDamageReduction(entity)
		event.setAmount(ad * damageReduction);
	}
})

/**
 * 
 * @param {import("net/minecraft/world/entity.LivingEntity").$LivingEntity$Type} entity 
 * @returns {number}
 */
const getDamageReduction = (entity) => {
	let armorValue = entity.getArmorValue()
	let damageReductionByArmor = 1 - JavaMath.max(0, armorValue / ( armorValue + 100 ))
	let damageReductionByResistance = 1;
	if (entity.hasEffect("resistance")) {
		let resistanceLevel = entity.getEffect("resistance").amplifier;
		damageReductionByResistance = 1 - (0.2 * (resistanceLevel + 1));
		console.log(damageReductionByResistance)
	}
	damageReductionByArmor *= damageReductionByResistance
	return damageReductionByArmor
}	