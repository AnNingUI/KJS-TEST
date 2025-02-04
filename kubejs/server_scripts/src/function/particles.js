const { $ParticleTypes } = require('packages/net/minecraft/core/particles/$ParticleTypes');
const { $Level } = require('packages/org/slf4j/event/$Level');

let $ParticleUtils = require('packages/com/cerbon/cerbons_api/api/static_utilities/$ParticleUtils').$ParticleUtils



/**
 * 
 * @param {string} Particle 
 * @param {number} num1 
 * @param {number} num2 
 * @param {number} num3 
 * @param {number} num4 
 * @param {number} num5 
 * @param {number} num6 
 * @param {*} event 
 * @param {"js" | "java"} JsOrJava 
 * @param {"force" | "normal" | null} forceOrNormal
 */
function addparticle(Particle, num1, num2, num3, num4, num5, num6, event, JsOrJava, forceOrNormal) {
	if (JsOrJava.toLowerCase() === "java") {
		Client.level.addParticle(Particle, num1, num2, num3, num4, num5, num6)
	} else if (JsOrJava.toLowerCase() === "js" && (forceOrNormal === "force" || forceOrNormal === "normal")) {
		switch (forceOrNormal) {
			case "force":
				event.server.runCommandSilent(`execute in ${event.level.dimension} run particle ${Particle} ${num1} ${num2} ${num3} ${num4} ${num5} ${num6} 1 1 force`)
				break;
			case "normal":
				event.server.runCommandSilent(`execute in ${event.level.dimension} run particle ${Particle} ${num1} ${num2} ${num3} ${num4} ${num5} ${num6} 1 1 normal`)
				break;
			default:
		}
	} else {
		event.server.runCommandSilent(`execute in ${event.level.dimension} run particle ${Particle} ${num1} ${num2} ${num3} ${num4} ${num5} ${num6} 1 1`)
	}
}


//我想要随机要么从min到max,要么从max到min,而不是单单的让min到max
/**
 * 
 * @param {number} x1 
 * @param {number} y1 
 * @param {number} z1 
 * @param {number} x2 
 * @param {number} y2 
 * @param {number} z2 
 * @param {import('packages/dev/latvian/mods/kubejs/entity/$EntityEventJS').$EntityEventJS$Type} event 
 */
function drawLine(x1, y1, z1, x2, y2, z2, event, d, random, time) {

	let minx = random > 0.5 ? Math.min(x1, x2) : Math.max(x1, x2)
	let miny = random > 0.5 ? Math.min(y1, y2) : Math.max(y1, y2)
	let minz = random > 0.5 ? Math.min(z1, z2) : Math.max(z1, z2)
	let maxx = random > 0.5 ? Math.max(x1, x2) : Math.min(x1, x2)
	let maxy = random > 0.5 ? Math.max(y1, y2) : Math.min(y1, y2)
	let maxz = random > 0.5 ? Math.max(z1, z2) : Math.min(z1, z2)
	const deltaX = maxx - minx;
	const deltaY = maxy - miny;
	const deltaZ = maxz - minz;

	// 计算步数
	const steps = Math.max(Math.abs(deltaX), Math.abs(deltaY), Math.abs(deltaZ));

	// 计算步长
	const stepX = (deltaX / steps);
	const stepY = (deltaY / steps);
	const stepZ = (deltaZ / steps);
	// 生成火焰颗粒效果
	if (minx != maxx && miny != maxy && minz != maxz && Math.abs(miny - maxy) <= 100 && time < 25) {
		event.server.scheduleInTicks(2, () => {
			minx += stepX;
			miny += stepY;
			minz += stepZ;
			time += 1;
			random > 0.7 ? addparticle(global.particle.sonic_boom, minx, miny, minz, 0, 0, 0, event, "js") : {};
			let da = d != undefined ? d : 7;
			attackNearby(event, event.level, minx, miny, minz, 2, da)
			return drawLine(minx, miny, minz, maxx, maxy, maxz, event, da, random, time)
		})
	}
}











/**
 * 
 * @param {number} x1 
 * @param {number} y1 
 * @param {number} z1 
 * @param {number} x2 
 * @param {number} y2 
 * @param {number} z2 
 * @param {number} time
 * @param {Particle} worldparticle 
 * @param {import('packages/net/minecraft/server/$MinecraftServer').$MinecraftServer$Type} server
 * @param { ((time: number) => {}) } lifeFun 
 * @param { ((time: number) => {}) } spawnFun
 */
global.raydrawLine_Ld = (x1, y1, z1, x2, y2, z2, time, worldparticle, server, lifeFun, spawnFun) => {
	// console.log({
	// 	x: x1,
	// 	y: y1,
	// 	z: z1,
	// 	x2: x2,
	// 	y2: y2,
	// 	z2: z2
	// })
	let life_fun = lifeFun ?? ((time) => 20)
	let spawn_fun = spawnFun ?? ((time) => 10)
	let s = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));
	let dx = (x2 - x1) / s;
	let dy = (y2 - y1) / s;
	let dz = (z2 - z1) / s;
	x1 += dx;
	y1 += dy;
	z1 += dz;
	// console.log(time)
	if (time < 8) {
		server.scheduleInTicks(2, () => {
			time += 1
			worldparticle.lifetime(life_fun(time))
			worldparticle.position(x1, y1, z1)
			worldparticle.spawn(spawn_fun(time))
			return global.raydrawLine_Ld(x1, y1, z1, x2, y2, z2, time, worldparticle, server, lifeFun, spawnFun)
		})
	}
}









/**
 * 
 * @param {number} x1 
 * @param {number} y1 
 * @param {number} z1 
 * @param {number} x2 
 * @param {number} y2 
 * @param {number} z2 
 * @param {number} time
 * @param {$ParticleTypes} particle
 * @param {$Level} level
 */
global.raydrawLine_Cs = (x1, y1, z1, x2, y2, z2, time, endtiem, particle, level) => {
	let s = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));
	let dx = (x2 - x1) / s;
	let dy = (y2 - y1) / s;
	let dz = (z2 - z1) / s;
	x1 += dx;
	y1 += dy;
	z1 += dz;
	// console.log(time)
	if (time < endtiem) {
		level.server.scheduleInTicks(2, () => {
			time += 1
			$ParticleUtils.spawnParticle(level, particle, new Vec3d(x1, y1, z1), new Vec3d(0, 0, 0), 10, 1)
			// console.log(time)
			return global.raydrawLine_Cs(x1, y1, z1, x2, y2, z2, time, endtiem, particle, level)
		})
	}
}