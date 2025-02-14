const $WorldParticleBuilder             
    = Java.loadClass("team.lodestar.lodestone.systems.particle.builder.WorldParticleBuilder")
const $LodestoneParticleRegistry        
    = Java.loadClass("team.lodestar.lodestone.registry.common.particle.LodestoneParticleRegistry")
const $GenericParticleData              
    = Java.loadClass("team.lodestar.lodestone.systems.particle.data.GenericParticleData")
const $ColorParticleData                
    = Java.loadClass("team.lodestar.lodestone.systems.particle.data.color.ColorParticleData")
const $ParticleDiscardFunctionType      
    = Java.loadClass("team.lodestar.lodestone.systems.particle.SimpleParticleOptions$ParticleDiscardFunctionType")
const $LodestoneWorldParticleRenderType 
    = Java.loadClass("team.lodestar.lodestone.systems.particle.render_types.LodestoneWorldParticleRenderType")
const $Color                            
    = Java.loadClass("java.awt.Color")

NetworkEvents.dataReceived("ld:particle",event=>{
    const { level, /** @type {LDParticle} */data } = event
    let mapper = {
        "WISP": $LodestoneParticleRegistry.WISP_PARTICLE,
        "SMOKE": $LodestoneParticleRegistry.SMOKE_PARTICLE,
        "SPARKLE": $LodestoneParticleRegistry.SPARKLE_PARTICLE,
        "TWINKLE": $LodestoneParticleRegistry.TWINKLE_PARTICLE,
        "STAR": $LodestoneParticleRegistry.STAR_PARTICLE,
        "LAVA": global.PARTICLE_LIST.LAVA_PARTICLE,
        "NAUTILUS": global.PARTICLE_LIST.NAUTILUS_PARTICLE,
        "CLOUD": global.PARTICLE_LIST.CLOUD_PARTICLE,
        "SONIC_BOOM": global.PARTICLE_LIST.SONIC_BOOM_PARTICLE,
        "SOUL": global.PARTICLE_LIST.SOUL_PARTICLE,
        "VIBRATION": global.PARTICLE_LIST.VIBRATION_PARTICLE,
        "ELECTRIC_SPARK": global.PARTICLE_LIST.ELECTRIC_SPARK_PARTICLE,
        "NOTE": global.PARTICLE_LIST.NOTE_PARTICLE
    }
    let type = mapper[data.pType.toUpperCase()] || null
    if(type == null){return}
    const colorStart = data.colorStart
    const colorEnd = data.colorEnd
    const pb = $WorldParticleBuilder.create(type)

    pb.setTransparencyData($GenericParticleData.create(data.transparencyStart, data.transparencyEnd).build())
    pb.setScaleData($GenericParticleData.create(data.scaleStart, data.scaleEnd).build())
    pb.setColorData($ColorParticleData.create(new $Color(colorStart[0] / 255, colorStart[1] / 255, colorStart[2] / 255), new $Color(colorEnd[0] / 255, colorEnd[1] / 255, colorEnd[2] / 255)).build())
    pb.setLifetime(data.lifetime)
    pb.setRandomOffset(data.randomOffset)
    pb.addMotion(data.motionX, data.motionY, data.motionZ)
    pb.setRandomMotion(data.randomMotionX, data.randomMotionY, data.randomMotionZ)
    pb.setDiscardFunction($ParticleDiscardFunctionType.INVISIBLE)
    pb.setRenderType($LodestoneWorldParticleRenderType.IRIS_ADDITIVE)
    pb.repeat(level, data.x, data.y, data.z, data.count)
})
