const $RegistryObject = 
    Java.loadClass('net.minecraftforge.registries.RegistryObject');
const $LodestoneScreenParticleRegistry = 
    Java.loadClass('team.lodestar.lodestone.registry.common.particle.LodestoneScreenParticleRegistry');
const $LodestoneParticleType$Factory = 
    Java.loadClass('team.lodestar.lodestone.systems.particle.world.type.LodestoneWorldParticleType$Factory');
const $LodestoneScreenParticleType = 
    Java.loadClass('team.lodestar.lodestone.systems.particle.screen.LodestoneScreenParticleType');
const $LodestoneLib = 
    Java.loadClass('team.lodestar.lodestone.LodestoneLib')
const $LodestoneScreenParticleType$Factory = 
    Java.loadClass('team.lodestar.lodestone.systems.particle.screen.LodestoneScreenParticleType$Factory');
let sapConstructor = 
    Java.loadClass('net.minecraft.client.particle.SimpleAnimatedParticle').__javaObject__.declaredConstructors[0];
let zero = 
    Java.loadClass("java.lang.Float").valueOf(0);
let $RegisterParticleProvidersEvent = 
    Java.loadClass('net.minecraftforge.client.event.RegisterParticleProvidersEvent');
/**
 * 
 * @param {Internal.RegisterParticleProvidersEvent} event 
 * @param {String[]} List 
 */
function registerParticleFactory$Screen(event,List){
    //TODO maybe use event?
    List.forEach(e => {
        $LodestoneScreenParticleRegistry.registerProvider($LodestoneScreenParticleRegistry.registerType(new $LodestoneScreenParticleType()), new $LodestoneScreenParticleType$Factory($LodestoneScreenParticleRegistry.getSpriteSet($LodestoneLib.lodestonePath(e))));
    });
}
/**
 * 
 * @param {Internal.RegisterParticleProvidersEvent} event 
 * @param {Internal.RegistryObject<Internal.LodestoneParticleType>[]} List
 */
function registerParticleFactory(event,List){
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


