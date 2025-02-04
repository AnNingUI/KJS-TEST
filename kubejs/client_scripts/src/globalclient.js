const $WorldParticleBuilder = require("packages/team/lodestar/lodestone/systems/particle/builder/$WorldParticleBuilder").$WorldParticleBuilder
const $LodestoneParticleRegistry = require("packages/team/lodestar/lodestone/registry/common/particle/$LodestoneParticleRegistry").$LodestoneParticleRegistry
const $GenericParticleData = require("packages/team/lodestar/lodestone/systems/particle/data/$GenericParticleData").$GenericParticleData
const $ColorParticleData = require("packages/team/lodestar/lodestone/systems/particle/data/color/$ColorParticleData").$ColorParticleData
const $SimpleParticleOptions = require("packages/team/lodestar/lodestone/systems/particle/$SimpleParticleOptions").$SimpleParticleOptions
const $LodestoneWorldParticleRenderType = require("packages/team/lodestar/lodestone/systems/particle/render_types/$LodestoneWorldParticleRenderType").$LodestoneWorldParticleRenderType
const $Color = require("packages/java/awt/$Color").$Color






global.Clienttitle = (title) => {
    Client.title = title;
}

// 有问题在修中，不要使用
// Particle可以使用ParticleTypes.---试一试，但ponderjs不支持补全这个类，所以不好确定
global.AddParticle = (Particle,num1,num2,num3,num4,num5,num6) => {
    if(Particle == undefined || Particle == null || Particle == "" || !Particle ){}
    else if(Client.level != null){
        Client.level.addParticle(
            Particle,
            num1,
            num2,
            num3,
            num4,
            num5,
            num6
        );
    }
}

global.SpawnParticle = (Particle,overrideLimiter,x,y,z,vx,vy,vz,count,speed) => {
    if(Particle == undefined || Particle == null || Particle == "" || !Particle ){}
    else if(Client.level != null){
        Client.level.spawnParticles(
            Particle,
            overrideLimiter,
            x,
            y,
            z,
            vx,
            vy,
            vz,
            count, 
            speed
        )
    }
}



global.PlaySound = (sound,volume,pitch) => {
    Client.player.playSound(sound,volume,pitch);
}




NetworkEvents.dataReceived("particle",event=>{
    const { level, data } = event
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
    let type = mapper[data.type.toUpperCase()] || null
    if(type == null){return}
    const colorStart = data.colorStart
    const colorEnd = data.colorEnd
    $WorldParticleBuilder.create(type)
        .setTransparencyData($GenericParticleData.create(data.transparencyStart, data.transparencyEnd).build())
        .setScaleData($GenericParticleData.create(data.scaleStart, data.scaleEnd).build())
        .setColorData($ColorParticleData.create(new $Color(colorStart[0] / 255, colorStart[1] / 255, colorStart[2] / 255), new $Color(colorEnd[0] / 255, colorEnd[1] / 255, colorEnd[2] / 255)).build())
        .setLifetime(data.lifetime)
        .setRandomOffset(data.randomOffset)
        .addMotion(data.motionX, data.motionY, data.motionZ)
        .setRandomMotion(data.randomMotionX, data.randomMotionY, data.randomMotionZ)
        .setDiscardFunction($SimpleParticleOptions.ParticleDiscardFunctionType.INVISIBLE)
        .setRenderType($LodestoneWorldParticleRenderType.IRIS_ADDITIVE)
        .repeat(level, data.x, data.y, data.z, data.count)
})











ClientEvents.highPriorityAssets(e => {
    e.add("kubejs:particles/flame", {
        textures: [
            "kubejs:flame"
        ]
    })
})













// 






// ZH : 你可能需要 Client.player.playSound(sound,volume,pitch);
// EN : You may need Client.player.playSound(sound,volume,pitch);