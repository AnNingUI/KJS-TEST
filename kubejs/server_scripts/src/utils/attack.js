const $DamageTypes = Java.loadClass("net.minecraft.world.damagesource.DamageTypes")
const $Mob = Java.loadClass('net.minecraft.world.entity.Mob')
const $Holder = Java.loadClass('net.minecraft.core.Holder')
const $Entity = Java.loadClass('net.minecraft.world.entity.Entity')
const $Level = Java.loadClass('net.minecraft.world.level.Level')
/**
 * @param {$Level} level
 */
let $DamageSource = Java.loadClass('net.minecraft.world.damagesource.DamageSource')
let $ResourceKey = Java.loadClass('net.minecraft.resources.ResourceKey')
let DAMAGE_TYPE = $ResourceKey.createRegistryKey('damage_type')


const getOrSource = (/**@type {Internal.Level} */level, /**@type {Special.DamageType} */damageType) => {
	let ace = $ResourceKey.create(DAMAGE_TYPE, Utils.id(damageType))
	let holder = /**@type {Internal.Holder} */(level
		.registryAccess()
		.registryOrThrow(DAMAGE_TYPE)
		.getHolderOrThrow(ace))
	//KubeJS Additions 需要Holder$Reference 原生KuBeJs 只需要Holder
	// console.log(holder.get())
	// console.log(holder)
	return new $DamageSource(holder)
}

/**
 * 
 * @param {Internal.DamageTypes} damageType
 * @param {Internal.Player} play
 */
const getOrSourceByType = (damageType, play) => {
	return play.damageSources().source(damageType, play)
}

let TB_TYPE = ['twilightforest:hydra', 'minecraft:ender_dragon']
/**
 * 
 * @param {Internal.Player} player
 * @param {$Entity_} entity
 * @returns 
 */
const playAttack = (player, entity) => entity.damageSources().playerAttack(player)

// function playAttackByType(player, entity, type) {
// 	(new $DamageSource(type)).typeHolder
// }
/**
 * 
 * @param {Internal.PlayerEventJS} event
 * @param {Internal.ServerLevel} level
 * @param {number} x 
 * @param {number} y 
 * @param {number} z 
 * @param {number} n 
 * @param {number} damage 
 * @param { ((entity: Internal.LivingEntity) => void) } addCallBack
 * @param { ((entity: Internal.LivingEntity) => boolean) } canDamageCallBack
 * @return
 */
const attackNearby = (event, level, x, y, z, n, damage, addCallBack, canDamageCallBack) => {
	/**
	 * @param {String[]} list
	 */
	let can_damage_callBack = canDamageCallBack ?? ((e) => true)
	let aabb = AABB.CUBE.move(x - .5, y + .5, z - .5).expandTowards(-n, -n, -n).expandTowards(n, n, n)
	let list = /** @type {Internal.LivingEntity[]} */(level.getEntities(null, aabb))
	let player = event.player
	let NoPlayList = list.filter(e => e !== player);
	let callBack = addCallBack || ((e) => { })
	NoPlayList.forEach(e => {

		if (/** @type {Internal.Entity} */(e).type === 'minecraft:end_crystal' && bool === true) {
			var entity3 = level.createEntity('minecraft:lightning_bolt');

			entity3.setPosition(e.x, e.y, e.z);
			entity3.spawn();
		}
		if (!e.isLiving()) {
			return
		}

		let Enchantments = event.player.getHeldItem(event.hand).enchantments
		if (Enchantments !== undefined && Enchantments.hasOwnProperty("minecraft:fire_aspect")) {
			let FireAspectLvl = 0
			let FireAspect_Rightlvl = Enchantments["minecraft:fire_aspect"]
			if (FireAspect_Rightlvl > 0 && FireAspect_Rightlvl <= 255) { FireAspectLvl = FireAspect_Rightlvl; }
			else if (FireAspect_Rightlvl > 255) { FireAspectLvl = 255; }
			e.mergeNbt({ Fire: (FireAspectLvl * 30) })
		}
		if (hasSoulInSolts(event.player)) {
			ActualHeal(event.player, 0.001, e)
			particle_fun(event, event.player, e)
		}
		if (e.type === TB_TYPE[1]) {
			if (can_damage_callBack(e)) {
				e.attack(playAttack(player, e), damage)
				setTargetByPlayer(e, player)
			}
		} else {
			if (e.type === TB_TYPE[0]) {
				callBack(e)
				if (can_damage_callBack(e)) {
					e.attack(getOrSourceByType($DamageTypes.GENERIC_KILL, player), damage)
					setTargetByPlayer(e, player)
				}
			} else {
				callBack(e)
				if (can_damage_callBack(e)) {
					e.attack(getOrSourceByType($DamageTypes.INDIRECT_MAGIC, player), damage)
					setTargetByPlayer(e, player)
				}
			}

		}

	})
}


// EntityEvents.hurt(event => {
//     console.log(event.source.actual)
// })
/**
 * 
 * @param {Internal.LivingEntity} entity
 * @returns {entity is Internal.Mob}
 */
const isMobEntity = (entity) => {
	return entity instanceof $Mob
}

/**
 * 
 * @param {Internal.LivingEntity} entity
 * @param {Internal.Player} player
 */
const setTargetByPlayer = (entity, player) => {
	if (isMobEntity(entity)) {
		!entity.getTarget() && !player.creative && entity.setTarget(player)
	}
}