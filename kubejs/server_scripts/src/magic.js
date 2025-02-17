

ItemEvents.rightClicked('kubejs:magic_book', (e) => {
    const { player, server, level } = e;
    const item = e.player.getHeldItem(e.hand)
    const { x, y, z } = player;
    if (e.player.cooldowns.isOnCooldown(e.item)) return;
    player.swing(e.hand, true);
    player.sendData("kubejs:magic_damage", {
        type: "fiery_ingot",
        pos: {
            x: x,
            y: y,
            z: z
        }
    });

    const { cos, sin, sqrt, abs, sinh, cosh, random } = JavaMath;

    let t_particle = new Particle(e);
    t_particle.type("SOUL");
    t_particle.colorData([179, 80, 82], [112, 115, 51].map(e => e * random() * 2));
    t_particle.motion(0, 0.05, 0);
    t_particle.scaleData(0.5, 0);
    t_particle.transparencyData(0.5, 0);
    const copyParticle = t_particle;
    delay(server, (sa, ea) => {
        let PI = KMath.PI;
        let Height = 0.05 * sa;
        let r = 20;

        let aabb = AABB.of(
            x - r, y - 0.5, z - r,
            x + r, y + Height, z + r
        );
        let list = level.getEntities(null, aabb);
        let NoPlayList = /** @type {Internal.Entity[]} */(list).filter(e => e !== player && e.isLiving() && e.health > 0.1);

        NoPlayList.length < 20 && (() => {
            t_particle.lifetime(2 + 10 * sa);
            t_particle.position(x + cos(sa) * r, y, z + sin(sa) * r);
            t_particle.spawn(10);
        })()

        NoPlayList.forEach(et => {
            if (et.isLiving() && isPointInCircle(et.getX(), et.getZ(), x, z, r)) {
                let rp = getRandomPointOnCircle(x, z, r);
                let pos = {
                    x: rp.x,
                    y: y + Height,
                    z: rp.z
                };
                delay(server, (ss, ee) => {
                    const dx = et.getX() - pos.x;
                    const dy = et.getY() - pos.y;
                    const dz = et.getZ() - pos.z;
                    const length = sqrt(dx * dx + dy * dy + dz * dz);
                    const stepX = dx / length;
                    const stepY = dy / length;
                    const stepZ = dz / length;
                    const t = NoPlayList.length < 20 || NoPlayList.length >= 20 && random() < 0.2;
                    t && global.raydrawLine_Ld(
                        pos.x + stepX * ss,
                        pos.y + stepY * ss,
                        pos.z + stepZ * ss,
                        et.x,
                        et.y + 0.5,
                        et.z,
                        7,
                        copyParticle,
                        server,
                        (time) => {
                            const tt = NoPlayList.length < 20 || NoPlayList.length >= 20 && time % 2 == 0;
                            tt && attackNearby(
                                e,
                                level,
                                pos.x + stepX * ss,
                                pos.y + stepY * ss,
                                pos.z + stepZ * ss,
                                .5,
                                10,
                                (Et) => {
                                    if (Et.type === 'minecraft:ender_dragon') Et.attack(getOrSource(level, "explosion"), 10)
                                    // Et.absMoveTo(x, y, z)
                                    // Et.``
                                    // Et.getClass().getMethods().forEach(method => {
                                    //     if (method.getName() === "m_6027_") {
                                    //         method.invoke(Et, x, y, z);
                                    //     }
                                    // });
                                    const edx = x - et.getX();
                                    const edy = y - et.getY();
                                    const edz = z - et.getZ();
                                    const elength = sqrt(edx * edx + edy * edy + edz * edz);
                                    const estepX = edx / elength;
                                    const estepY = edy / elength;
                                    const estepZ = edz / elength;
                                    random() > 0.5 && NoPlayList.length < 20 && Et.moveTo(
                                        new Vec3d(
                                            et.getX() + estepX * 0.005,
                                            et.getY() + estepY * 0.005,
                                            et.getZ() + estepZ * 0.005
                                        )
                                    )
                                    // Et["void moveTo(double,double,double)"](x,y,z)
                                    // Et["void moveTo(arg0: double,arg1: double,arg2: double)"](x, y, z)
                                    // Et["void moveTo(double,double,double)"](x, y, z)
                                    // Et["moveTo(double,double,double)"](x, y, z)
                                    NoPlayList.length < 32 && Et.mergeNbt({ Fire: 2 })
                                },
                                (Et) => {
                                    return NoPlayList.length < 20 || (NoPlayList.length >= 20 && random() >= 0.7) || (NoPlayList.length >= 64 && random() >= 0.9) && !Et.invulnerable && Et.isAttackable()
                                }
                            )
                            return 1 + time;
                        },
                        (time) => {
                            if (NoPlayList.length < 20 && NoPlayList.length > 10) {
                                return random() > 0.5 ? 2 : 0;
                            } else if (NoPlayList.length < 10) {
                                return 5;
                            } else {
                                return random() > 0.5 ? 1 : 0;
                            }
                        }
                    );

                }, 0, r, 2);
            }
        });
    }, 0, 40, 1);
    e.player.addItemCooldown(e.item, 40);
});

function isPointInSphere(x1, y1, z1, x2, y2, z2, radius) {
    return Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2) <= radius * radius;
}

function isPointInCircle(x1, z1, x2, z2, radius) {
    return Math.pow(x2 - x1, 2) + Math.pow(z2 - z1, 2) <= radius * radius;
}

function getRandomPointOnCircle(cx, cz, radius) {
    const angle = Math.random() * 2 * KMath.PI; // 随机角度
    const x = cx + radius * Math.cos(angle);    // 计算 x 坐标
    const z = cz + radius * Math.sin(angle);    // 计算 z 坐标
    return { x: x, z: z };
}

// EntityEvents.hurt("*", e => {
//     e.entity
// })
