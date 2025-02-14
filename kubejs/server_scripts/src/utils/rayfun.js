
/**
 * 计算玩家视线射线的起始点和结束点
 * 
 * @param {number} rayLength 
 * @param {$Player_} player 
 * @returns {{startX: number, startY: number, startZ: number, endX: number, endY: number, endZ: number, direction: {x: number, y: number, z: number} }} 射线的起始点、结束点和方向向量
 */
const playerRayTrace = (rayLength, player) => {

    const { yaw, pitch, eyeHeight } = player
    const startX = player.x
    const startY = player.y + eyeHeight - 0.5
    const startZ = player.z
    const yawRad = yaw * (pi / 180);
    const pitchRad = pitch * (pi / 180);
    const x = -Math.sin(yawRad) * Math.cos(pitchRad);
    const y = -Math.sin(pitchRad);
    const z = Math.cos(yawRad) * Math.cos(pitchRad);
    const direction = { x: x, y: y, z: z };
    const endX = startX + direction.x * rayLength;
    const endY = startY + direction.y * rayLength;
    const endZ = startZ + direction.z * rayLength;
    return { startX: startX, startY: startY, startZ: startZ, endX: endX, endY: endY, endZ: endZ, direction: direction }
}

/**
 * 生成围绕固定点的随机坐标
 * 
 * @param {{ x: number, y: number, z: number }} fixedPoint 
 * @returns {{ x1: string, y1: string, z1: string, x2: string, y2: string, z2: string }} 生成的两个随机点的坐标，保留7位小数
 */
const generateRandomCoordinates = (fixedPoint) => {
    // 生成随机坐标
    const x1 = fixedPoint.x - 30 + Math.floor(Math.random() * 61); // x 范围在用户给定 x 的正负 20 范围内
    const z1 = fixedPoint.z - 30 + Math.floor(Math.random() * 61); // y 范围在用户给定 y 的正负 20 范围内
    const y1 = fixedPoint.y - 4 + Math.floor(Math.random() * 9);

    // 确定第二个点
    let x2, y2, z2;
    if (fixedPoint.x === x1 && fixedPoint.z === z1) {
        x2 = fixedPoint.x;
        z2 = fixedPoint.z;
        y2 = Math.floor(Math.random() * 10); // 假设 z 范围为 0 到 9
    } else {
        const slopeXZ = (fixedPoint.y - y1) / (Math.sqrt((fixedPoint.x - x1) ** 2 + (fixedPoint.z - z1) ** 2));
        const dx = Math.floor(Math.random() * 10) * (Math.random() > 0.5 ? 1 : -1); // 假设 dx 范围为 -10 到 10
        const dz = Math.floor(Math.random() * 10) * (Math.random() > 0.5 ? 1 : -1); // 假设 dy 范围为 -10 到 10
        x2 = fixedPoint.x + dx;
        z2 = fixedPoint.z + dz;
        y2 = fixedPoint.y + dx * slopeXZ + dz * slopeXZ; // 使用斜率在 xy 平面上推断 z 值
    }
    const numJq = 7;
    return {
        x1: x1.toFixed(numJq),
        y1: y1.toFixed(numJq),
        z1: z1.toFixed(numJq),
        x2: x2.toFixed(numJq),
        y2: y2.toFixed(numJq),
        z2: z2.toFixed(numJq)
    };
}






/**
 * 计算逆向获取的向量
 * 
 * @param {number} startX - 起始点的 x 坐标
 * @param {number} startY - 起始点的 y 坐标
 * @param {number} startZ - 起始点的 z 坐标
 * @param {number} endX - 结束点的 x 坐标
 * @param {number} endY - 结束点的 y 坐标
 * @param {number} endZ - 结束点的 z 坐标
 * @param {number} rayLength - 射线的长度
 * @returns {{x: number, y: number, z: number}} 逆向获取的向量
 */
const inverseAcquisitionVector = (startX, startY, startZ, endX, endY, endZ, rayLength) => {
    let x = (endX - startX) / rayLength;
    let y = (endY - startY) / rayLength;
    let z = (endZ - startZ) / rayLength;
    return { x: x, y: y, z: z }
}

/**
 * 在服务器中延迟执行函数
 * 
 * @param {$MinecraftServer_} server - Minecraft 服务器对象
 * @param {Function} fun - 要执行的函数
 * @param {number} sTick - 当前的 tick 计数
 * @param {number} eTick - 结束的 tick 计数
 * @param {number} delayTick - 延迟的 tick 数
 */
const delay = (server, fun, sTick, eTick, delayTick) => {
    server.scheduleInTicks(delayTick, () => {
        sTick += 1;
        fun(sTick, eTick);
        if (sTick < eTick) {
            return delay(server, fun, sTick, eTick, delayTick);
        }
    })
}


