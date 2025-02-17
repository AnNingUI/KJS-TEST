const ParticleType = {
    WISP: "WISP",
    SMOKE: "SMOKE",
    SPARKLE: "SPARKLE",
    TWINKLE: "TWINKLE",
    STAR: "STAR",
    LAVA: "LAVA_PARTICLE",
    NAUTILUS: "NAUTILUS_PARTICLE",
    CLOUD: "CLOUD_PARTICLE",
    SONIC_BOOM: "SONIC_BOOM_PARTICLE",
    SOUL: "SOUL_PARTICLE",
    VIBRATION: "VIBRATION_PARTICLE",
    ELECTRIC_SPARK: "ELECTRIC_SPARK_PARTICLE",
    NOTE: "NOTE_PARTICLE",
}

/**
 * 
 * @param {Internal.PlayerEventJS} event 
 */
function Particle(event) {
    const { level } = event
    let particleType
    let lifetime = 100
    let transparencyData = [0, 0]
    let scaleData = [1, 1]
    let colorStart = [0, 0, 0]
    let colorEnd = [0, 0, 0]
    let position = [0, 0, 0]
    let motion = [0, 0, 0]
    let randomMotion = [0, 0, 0]
    let randomOffset = 0
    let count = 1

    this.type = function (type) {
        particleType = type
        return this
    }

    this.lifetime = function (time) {
        lifetime = time
        return this
    }

    this.transparencyData = function (start, end) {
        transparencyData = [start, end]
        return this
    }

    this.scaleData = function (start, end) {
        scaleData = [start, end]
        return this
    }

    this.colorData = function (start, end) {
        colorStart = start
        colorEnd = end
        return this
    }

    this.position = function (x, y, z) {
        position = [x, y, z]
        return this
    }

    this.motion = function (x, y, z) {
        motion = [x, y, z]
        return this
    }

    this.randomMotion = function (x, y, z) {
        randomMotion = [x, y, z]
        return this
    }

    this.randomOffset = function (amount) {
        randomOffset = amount
        return this
    }

    this.spawn = function (amount) {
        count = amount
        level.getPlayers().forEach(player => {
            /**@type {Internal.Player} */(player).sendData('ld:particle', {
            pType: particleType,
            x: position[0],
            y: position[1],
            z: position[2],
            motionX: motion[0],
            motionY: motion[1],
            motionZ: motion[2],
            randomMotionX: randomMotion[0],
            randomMotionY: randomMotion[1],
            randomMotionZ: randomMotion[2],
            randomOffset: randomOffset,
            count: count,
            lifetime: lifetime,
            scaleStart: scaleData[0],
            scaleEnd: scaleData[1],
            colorStart: colorStart,
            colorEnd: colorEnd,
            transparencyStart: transparencyData[0],
            transparencyEnd: transparencyData[1]
        })
        })
        return this
    }
}


