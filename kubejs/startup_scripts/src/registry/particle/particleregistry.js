//priority: 9999

const $LodestoneParticleRegistry = require('packages/team/lodestar/lodestone/registry/common/particle/$LodestoneParticleRegistry').$LodestoneParticleRegistry

// const $LodestoneParticleType = require('packages/team/lodestar/lodestone/systems/particle/type/$LodestoneParticleType').$LodestoneParticleType
// const { $LodestoneWorldParticleType } = require('packages/team/lodestar/lodestone/systems/particle/world/type/$LodestoneWorldParticleType');
const $LodestoneWorldParticleType = Java.loadClass('team.lodestar.lodestone.systems.particle.world.type.LodestoneWorldParticleType');
const $LodestoneParticleType = $LodestoneWorldParticleType

const $RegisterParticleProvidersEvent = require('packages/net/minecraftforge/client/event/$RegisterParticleProvidersEvent').$RegisterParticleProvidersEvent


const { registerParticleFactory, registerParticleFactory$Screen } = require('./particlere')



let LAVA_PARTICLE = $LodestoneParticleRegistry.PARTICLES.register("lava", () => new $LodestoneParticleType())

let NAUTILUS_PARTICLE = $LodestoneParticleRegistry.PARTICLES.register("nautilus", () => new $LodestoneParticleType())

let CLOUD_PARTICLE = $LodestoneParticleRegistry.PARTICLES.register("cloud", () => new $LodestoneParticleType())

let SONIC_BOOM_PARTICLE = $LodestoneParticleRegistry.PARTICLES.register("sonic_boom", () => new $LodestoneParticleType())

let SOUL_PARTICLE = $LodestoneParticleRegistry.PARTICLES.register("soul", () => new $LodestoneParticleType())

let VIBRATION_PARTICLE = $LodestoneParticleRegistry.PARTICLES.register("vibration", () => new $LodestoneParticleType())

let ELECTRIC_SPARK_PARTICLE = $LodestoneParticleRegistry.PARTICLES.register("electric_spark", () => new $LodestoneParticleType())

let NOTE_PARTICLE = $LodestoneParticleRegistry.PARTICLES.register("note", () => new $LodestoneParticleType())

const PARTICLE_LIST = [
    LAVA_PARTICLE,
    NAUTILUS_PARTICLE,
    CLOUD_PARTICLE,
    SONIC_BOOM_PARTICLE,
    SOUL_PARTICLE,
    VIBRATION_PARTICLE,
    ELECTRIC_SPARK_PARTICLE,
    NOTE_PARTICLE
]
const PARTICLE_LIST$SCREEN = [
    "lava",
    "nautilus",
    "cloud",
    "sonic_boom",
    "soul",
    "vibration",
    "electric_spark",
    "note"
]


ForgeModEvents.onEvent($RegisterParticleProvidersEvent, (event) => {
    registerParticleFactory$Screen(event,PARTICLE_LIST$SCREEN)
    registerParticleFactory(event,PARTICLE_LIST)
})


// global.PARTICLE_LIST.LAVA_PARTICLE = LAVA_PARTICLE
// global.PARTICLE_LIST.NAUTILUS_PARTICLE = NAUTILUS_PARTICLE
// global.PARTICLE_LIST.CLOUD_PARTICLE = CLOUD_PARTICLE
// global.PARTICLE_LIST.SONIC_BOOM_PARTICLE = SONIC_BOOM_PARTICLE
// global.PARTICLE_LIST.SOUL_PARTICLE = SOUL_PARTICLE
// global.PARTICLE_LIST.VIBRATION_PARTICLE = VIBRATION_PARTICLE
// global.PARTICLE_LIST.ELECTRIC_SPARK_PARTICLE = ELECTRIC_SPARK_PARTICLE
// global.PARTICLE_LIST.NOTE_PARTICLE = NOTE_PARTICLE
global.PARTICLE_LIST = {
    LAVA_PARTICLE: LAVA_PARTICLE,
    NAUTILUS_PARTICLE: NAUTILUS_PARTICLE,
    CLOUD_PARTICLE: CLOUD_PARTICLE,
    SONIC_BOOM_PARTICLE: SONIC_BOOM_PARTICLE,
    SOUL_PARTICLE: SOUL_PARTICLE,
    VIBRATION_PARTICLE: VIBRATION_PARTICLE,
    ELECTRIC_SPARK_PARTICLE: ELECTRIC_SPARK_PARTICLE,
    NOTE_PARTICLE: NOTE_PARTICLE
}

