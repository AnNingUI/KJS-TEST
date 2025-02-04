const { $CommandSourceStack } = require('packages/net/minecraft/commands/$CommandSourceStack')
const { $BlockPos$MutableBlockPos } = require('packages/net/minecraft/core/$BlockPos$MutableBlockPos')
const { $MinecraftServer } = require('packages/net/minecraft/server/$MinecraftServer')
const { $ServerPlayer } = require('packages/net/minecraft/server/level/$ServerPlayer')
const { $Level } = require('packages/org/slf4j/event/$Level')

const { $IntegerArgumentType } = require("packages/com/mojang/brigadier/arguments/$IntegerArgumentType")
const { $ResourceArgument } = require("packages/net/minecraft/commands/arguments/$ResourceArgument")
const { $Registries } = require("packages/net/minecraft/core/registries/$Registries")
const { $SuggestionProviders } = require("packages/net/minecraft/commands/synchronization/$SuggestionProviders")
const { $Vec3Argument } = require("packages/net/minecraft/commands/arguments/coordinates/$Vec3Argument")
const { $CompoundTagArgument } = require("packages/net/minecraft/commands/arguments/$CompoundTagArgument")
const { $CompoundTag } = require("packages/net/minecraft/nbt/$CompoundTag")
const { $SummonCommand } = require("packages/net/minecraft/server/commands/$SummonCommand")




ServerEvents.commandRegistry(event => {
    const { commands: Commands, arguments: Arguments } = event

    event.register(Commands.literal('fly') // The name of the command
        .requires(s => s.hasPermission(2)) // Check if the player has operator privileges
        .executes(c => fly(c.source.player)) // Toggle flight for the player that ran the command if the `target` argument isn't included
        .then(Commands.argument('target', Arguments.PLAYER.create(event))
            .executes(c => fly(Arguments.PLAYER.getResult(c, 'target'))) // Toggle flight for the player included in the `target` argument
        )
    )

    // Helper function
    /**
     * 
     * @param {$ServerPlayer} player 
     * @returns 
     */
    let fly = (player) => {
        // console.log(player)
        if (player.abilities.mayfly) {
            player.abilities.mayfly = false
            player.abilities.flying = false
            player.displayClientMessage(Component.gold('Flying: ').append(Component.red('disabled')), true)
        } else {
            player.abilities.mayfly = true
            player.displayClientMessage(Component.gold('Flying: ').append(Component.green('enabled')), true)
        }
        player.onUpdateAbilities()
        return 1
    }

    event.register(Commands.literal('print')
        .then(Commands.argument('variable', Arguments.STRING.create(event))
            .executes(c => printVariable(c.source.player, Arguments.STRING.getResult(c, 'variable')))
        )
    )

    // Function to print global variable
    /**
     * 
     * @param {$ServerPlayer} player 
     * @param {string} variableName 
     * @returns 
     */
    let printVariable = (player, variableName) => {
        let str = `${variableName}`
        // console.log(str)
        // console.log(str.split('.').length)
        if (str.split('.').length > 0) {
            // console.log(str);
            // console.log(strfolet(str));
            player.tell(`Value of ${str}: ${strfolet(str)}`);
            return 1;
        }
        else if (str.split('.').length.toFixed() == 0) {
            let O_o = global[str] == undefined ? "没有此全局变量" : global[str]
            // console.log(str);
            // console.log(O_o);
            player.tell(`Value of ${str}: ${O_o}`);
            return 0;
        }
    }


    event.register(Commands.literal('summons')
        .requires((p_138819_) => {
            return p_138819_.hasPermission(2);
        })
        .then(Commands.argument("entity", $ResourceArgument.resource(event.context, $Registries.ENTITY_TYPE)).suggests($SuggestionProviders.SUMMONABLE_ENTITIES).executes((a) => {
            return spawnEntity($IntegerArgumentType.getInteger(a, "num"), a.getSource(), $ResourceArgument.getSummonableEntityType(a, "entity"), a.getSource().getPosition(), new $CompoundTag(), true);
        })
            .then(Commands.argument('num', $IntegerArgumentType.integer(0))
                .then(Commands.argument("pos", $Vec3Argument.vec3()).executes((b) => {
                    return spawnEntity($IntegerArgumentType.getInteger(b, "num"), b.getSource(), $ResourceArgument.getSummonableEntityType(b, "entity"), $Vec3Argument.getVec3(b, "pos"), new $CompoundTag(), true);
                })
                    .then(Commands.argument("nbt", $CompoundTagArgument.compoundTag()).executes((c) => {
                        return spawnEntity($IntegerArgumentType.getInteger(c, "num"), c.getSource(), $ResourceArgument.getSummonableEntityType(c, "entity"), $Vec3Argument.getVec3(c, "pos"), $CompoundTagArgument.getCompoundTag(c, "nbt"), false);
                    })))))
    )

    event.register(Commands.literal('summons')
        .requires((p_138819_) => {
            return p_138819_.hasPermission(2);
        })
        .then(Commands.argument("entity", $ResourceArgument.resource(event.context, $Registries.ENTITY_TYPE)).suggests($SuggestionProviders.SUMMONABLE_ENTITIES).executes((a) => {
            return spawnEntity($IntegerArgumentType.getInteger(a, "num"), a.getSource(), $ResourceArgument.getSummonableEntityType(a, "entity"), a.getSource().getPosition(), new $CompoundTag(), true);
        })
            .then(Commands.argument('num', $IntegerArgumentType.integer(0)).executes((b) => {
                return spawnEntity($IntegerArgumentType.getInteger(b, "num"), b.getSource(), $ResourceArgument.getSummonableEntityType(b, "entity"), b.getSource().getPosition(), new $CompoundTag(), true);
            })))
    )


    /**
     * 
     * @param {$CommandSourceStack} stack 
     * @param {*} entityType 
     * @param {*} vec3 
     * @param {*} nbt 
     * @param {*} bool 
     */
    let spawnEntity = (num, stack, entityType, vec3, nbt, bool) => {
        // console.log(num, stack, entityType, vec3, nbt, bool)
        for (let i = 0; i < (num || 1); i++) {
            let entity = $SummonCommand.createEntity(stack, entityType, vec3, nbt, bool)
        }
        return 1;
    }
    // event.register(Commands.literal('reload_datapack').requires((sourceStack) => {
    //     return sourceStack.hasPermission(2);
    //  }).executes((p_288528_) => {
    //     let commandsourcestack = p_288528_.getSource();
    //     let minecraftserver = commandsourcestack.getServer();
    //     let packrepository = minecraftserver.getPackRepository();
    //     let worlddata = minecraftserver.getWorldData();
    //     let collection = packrepository.getSelectedIds();
    //     let collection1 = discoverNewPacks(packrepository, worlddata, collection);
    //     commandsourcestack.sendSuccess(() => {
    //        return Component.translatable("commands.reload.success");
    //     }, true);
    //     reloadPacks(collection1, commandsourcestack)
    //     return 0;
    //  }))
    //kjs reload server_scripts
    /**
     * 
     * @param {$MinecraftServer} server 
     * @param {$Level} level
     * @param {$BlockPos$MutableBlockPos} pos 
     * @returns 
     */
    let printBlock = (server, level, pos) => {
        server.tell(level.getBlock(pos).up)
        server.tell(`BlockProgress at ${pos.x}, ${pos.y}, ${pos.z}: ${level.getBlock(pos).blockState.getDestroyProgress(Client.player, level.getChunkForCollisions(pos.x, pos.z), pos)}`)
        server.tell(`BlockDestroySpeed at ${pos.x}, ${pos.y}, ${pos.z}: ${level.getBlock(pos).blockState.getDestroySpeed(level.getChunkForCollisions(pos.x, pos.z), pos)}`)
        return 1;
    }

    event.register(Commands.literal('summons')
        .then(Commands.argument('entity', Arguments.BLOCK_POS.create(event))
            .executes(c => printBlock(c.source.server, c.source.level, Arguments.BLOCK_POS.getResult(c, 'pos')))
        )
    )
})


/**
 * 
 * @param {string} str 
 */
function strfolet(str) {
    let parts = str.split('.'); // 将字符串以 . 分割成数组
    let value = Object.assign({}, global); // 创建一个新的对象，避免直接修改全局对象

    for (let i = 0; i < parts.length; i++) {
        let part = parts[i];
        let descriptor = Object.getOwnPropertyDescriptor(value, part); // 获取属性的描述符
        if (descriptor && descriptor.hasOwnProperty('value')) {
            value = descriptor.value; // 获取属性的值
        } else {
            // 如果属性不存在或者不可读，则返回 undefined
            return undefined;
        }
    }
    return value; // 返回最终的值
}



