
const { $RegisterParticleProvidersEvent } = require('packages/net/minecraftforge/client/event/$RegisterParticleProvidersEvent');
const { $RegistryObject } = require('packages/net/minecraftforge/registries/$RegistryObject');

// const { $LodestoneParticleType } = require('packages/team/lodestar/lodestone/systems/particle/type/$LodestoneParticleType');
// const $LodestoneParticleType = Java.loadClass('team.lodestar.lodestone.systems.particle.type.LodestoneParticleType');
// const { $LodestoneWorldParticleType } = require('packages/team/lodestar/lodestone/systems/particle/world/type/$LodestoneWorldParticleType');
const $LodestoneWorldParticleType = Java.loadClass('team.lodestar.lodestone.systems.particle.world.type.LodestoneWorldParticleType');
const $LodestoneParticleType = $LodestoneWorldParticleType;

const $LodestoneScreenParticleRegistry = require('packages/team/lodestar/lodestone/registry/common/particle/$LodestoneScreenParticleRegistry').$LodestoneScreenParticleRegistry;

// const $LodestoneParticleType$Factory = require('packages/team/lodestar/lodestone/systems/particle/type/$LodestoneParticleType$Factory').$LodestoneParticleType$Factory
// const $LodestoneParticleType$Factory = Java.loadClass('team.lodestar.lodestone.systems.particle.type.LodestoneParticleType');
const $LodestoneParticleType$Factory = Java.loadClass('team.lodestar.lodestone.systems.particle.world.type.LodestoneWorldParticleType$Factory');

// const $LodestoneScreenParticleType = require('packages/team/lodestar/lodestone/systems/particle/type/$LodestoneScreenParticleType').$LodestoneScreenParticleType;
// const $LodestoneScreenParticleType = Java.loadClass('team.lodestar.lodestone.systems.particle.type.LodestoneScreenParticleType');
const $LodestoneScreenParticleType = Java.loadClass('team.lodestar.lodestone.systems.particle.screen.LodestoneScreenParticleType');

const $LodestoneLib = require('packages/team/lodestar/lodestone/$LodestoneLib').$LodestoneLib

// const $LodestoneScreenParticleType$Factory = require('packages/team/lodestar/lodestone/systems/particle/type/$LodestoneScreenParticleType$Factory').$LodestoneScreenParticleType$Factory;
// const $LodestoneScreenParticleType$Factory = Java.loadClass('team.lodestar.lodestone.systems.particle.type.LodestoneScreenParticleType$Factory');
const $LodestoneScreenParticleType$Factory = Java.loadClass('team.lodestar.lodestone.systems.particle.screen.LodestoneScreenParticleType$Factory');

let sapConstructor = require('packages/net/minecraft/client/particle/$SimpleAnimatedParticle').$SimpleAnimatedParticle.__javaObject__.declaredConstructors[0];
let zero = Java.loadClass("java.lang.Float").valueOf(0);

/**
 * 
 * @param {$RegisterParticleProvidersEvent} event 
 * @param {String[]} List 
 */
export function registerParticleFactory$Screen(event,List){//TODO maybe use event?
    List.forEach(e => {
        $LodestoneScreenParticleRegistry.registerProvider($LodestoneScreenParticleRegistry.registerType(new $LodestoneScreenParticleType()), new $LodestoneScreenParticleType$Factory($LodestoneScreenParticleRegistry.getSpriteSet($LodestoneLib.lodestonePath(e))));
    });
}
/**
 * 
 * @param {$RegisterParticleProvidersEvent} event 
 * @param {$RegistryObject<$LodestoneParticleType>[]} List
 */
export function registerParticleFactory(event,List){
    List.forEach(e => {
        event.registerSpriteSet(e.get(), () => new $LodestoneParticleType$Factory($LodestoneScreenParticleRegistry.getSpriteSet($LodestoneLib.lodestonePath(e.id.getPath()))));
    })
}

StartupEvents.registry('particle_type', e => {
    global.rocketPlumeSupplier = e.create('flame').overrideLimiter(true);
})

if (Platform.isClientEnvironment()) {
    sapConstructor.setAccessible(true);
    global.registerParticleProvider = (event) => {
        event.registerSpriteSet(global.rocketPlumeSupplier.get(), set => {
            return (particleOptions, clientLevel, x, y, z, xSpeed, ySpeed, zSpeed) => {
                let plume = sapConstructor.newInstance(clientLevel, x, y, z, set, zero);
                // Initialize particle's values
                plume.setParticleSpeed(xSpeed, ySpeed, zSpeed);
                plume.scale(5);
                plume.setLifetime(65);
                plume.setSpriteFromAge(set);
                return plume
            }
        })
    }
    
    ForgeModEvents.onEvent($RegisterParticleProvidersEvent, e => global.registerParticleProvider(e));
}


