// 有问题在修中，不要使用
// Particle可以使用ParticleTypes.---试一试，但ponderjs不支持补全这个类，所以不好确定
global.AddParticle = (Particle,num1,num2,num3,num4,num5,num6) => {
    if(Particle === undefined || Particle == null || Particle === "" || !Particle ){}
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
    if(Particle === undefined || Particle == null || Particle === "" || !Particle ){}
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

NetworkEvents.dataReceived("mc:particle", (e) => {
    let { data, level } = e;
    let { pType, x, y, z, dx, dy, dz } = data;
})

ClientEvents.highPriorityAssets(e => {
    e.add("kubejs:particles/flame", {
        textures: [
            "kubejs:flame"
        ]
    })
})