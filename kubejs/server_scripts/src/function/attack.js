import { $DamageTypes } from 'packages/net/minecraft/world/damagesource/$DamageTypes'

const $Mob = /** @type {import('packages/net/minecraft/world/entity/$Mob').$Mob} */
(Java.loadClass('net.minecraft.world.entity.Mob'))

const { $Holder } = require('packages/net/minecraft/core/$Holder')
const { $Entity } = require('packages/net/minecraft/world/entity/$Entity')
const { $Player } = require('packages/net/minecraft/world/entity/player/$Player')
const { $Level } = require('packages/net/minecraft/world/level/$Level')
// const $DamageTypes = Java.loadClass('net.minecraft.world.damagesource.DamageTypes')

/**
 * @param {$Level} level
 */
let $DamageSource = require('packages/net/minecraft/world/damagesource/$DamageSource').$DamageSource
let $ResourceKey = require('packages/net/minecraft/resources/$ResourceKey').$ResourceKey
let DAMAGE_TYPE = $ResourceKey.createRegistryKey('damage_type')
export function getOrSource(/**@type {$Level} */level, /**@type {Special.DamageType} */damageType) {
	let ace = $ResourceKey.create(DAMAGE_TYPE, Utils.id(damageType))
	let holder = /**@type {$Holder} */(level
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
 * @param {import('packages/net/minecraft/world/damagesource/$DamageTypes').$DamageTypes$Type} damageType 
 * @param {$Player} play 
 */
export function getOrSourceByType(damageType, play) {
	return play.damageSources().source(damageType, play)
}

export let TB_TYPE = ['twilightforest:hydra', 'minecraft:ender_dragon']
/**
 * 
 * @param {$Player} player 
 * @param {$Entity} entity 
 * @returns 
 */
export function playAttack(player, entity) { return entity.damageSources().playerAttack(player) }

// function playAttackByType(player, entity, type) {
// 	(new $DamageSource(type)).typeHolder
// }
/**
 * 
 * @param {import('packages/dev/latvian/mods/kubejs/player/$PlayerEventJS').$PlayerEventJS$Type} event 
 * @param {import('packages/net/minecraft/server/level/$ServerLevel').$ServerLevel$Type} level 
 * @param {number} x 
 * @param {number} y 
 * @param {number} z 
 * @param {number} n 
 * @param {number} damage 
 * @param { ((entity: import('packages/net/minecraft/world/entity/$LivingEntity').$LivingEntity$Type) => void) } addCallBack 
 * @param { ((entity: import('packages/net/minecraft/world/entity/$LivingEntity').$LivingEntity$Type) => boolean) } canDamageCallBack 
 */
export function attackNearby(event, level, x, y, z, n, damage, addCallBack, canDamageCallBack) {
	/**
	 * @param {String[]} list
	 */
	let can_damage_callBack = canDamageCallBack ?? ((e) => true)
	let aabb = AABB.CUBE.move(x - .5, y + .5, z - .5).expandTowards(-n, -n, -n).expandTowards(n, n, n)
	let list = /** @type {import('packages/net/minecraft/world/entity/$LivingEntity').$LivingEntity$Type[]} */(level.getEntities(null, aabb))
	let player = event.player
	let NoPlayList = list.filter(e => e !== player);
	let callBack = addCallBack || ((e) => { })
	NoPlayList.forEach(e => {

		if (/** @type {$Entity} */(e).type === 'minecraft:end_crystal' && bool === true) {
			var entity3 = level.createEntity('minecraft:lightning_bolt');

			entity3.setPosition(e.x, e.y, e.z);
			entity3.spawn();
			bool = false;
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
		if (e.type == TB_TYPE[1] && bool === true) {
			if (can_damage_callBack(e)) {
				e.attack(playAttack(player, e), damage)
				setTargetByPlayer(e, player)
			}
			bool = false;
		} else {
			if (e.type == TB_TYPE[0]) {
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
 * @param {import('packages/net/minecraft/world/entity/$LivingEntity').$LivingEntity$Type} entity 
 * @returns {entity is import('packages/net/minecraft/world/entity/$Mob').$Mob$Type}
 */
const isMobEntity = (entity) => {
	return entity instanceof $Mob
}

/**
 * 
 * @param {import('packages/net/minecraft/world/entity/$LivingEntity').$LivingEntity$Type} entity 
 * @param {import('packages/net/minecraft/world/entity/player/$Player').$Player$Type} player 
 */
const setTargetByPlayer = (entity, player) => {
	if (isMobEntity(entity)) {
		!entity.getTarget() && !player.creative && entity.setTarget(player)
	}
}