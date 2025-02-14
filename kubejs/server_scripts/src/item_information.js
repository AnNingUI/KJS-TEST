// ItemEvents.rightClicked(event => {
//     let {player,item,server,level} = event
//     // player.tell([
//     //         // //为以确定，/**/为不确定和不清楚，待考究，···是该对象的内存地址标识
//     //         //item.getAllEnchantments(),'__',//输出{对应附魔Class=对应附魔level,对应附魔Class=对应附魔level,...} Obj
//     //         //item.getAttributeModifiers("mainhand"),'__',//一个物品在相应栏位所添加的基础值 Obj
//     //         //item.getBarColor(),'__',//进度条的颜色 Num
//     //         //item.getBarWidth(),'__',//进度条的长度 Num
//     //         //item.getBaseRepairCost(),'__',//修理时所需的经验等级 Num
//     //         //item.getBurnTime("smoking"),'__',/* 或许是获取燃烧(工作)时间 */ //Num
//     //         //item.getCapability(ForgeCapabilities.ITEM_HANDLER),'__', //一个惰性函数，获取物品Capability相应的一个标识为 ··· 的数据，可能代表了一个与物品能力处理器相关的信息或功能
//     //         //item.getCount(),'__', //物品数目
//     //         //item.getCraftingRemainingItem(),'__',/* 大概是区分于液体的桶与普通物品 */
//     //         //item.getDamageValue(),'__',//获取已损坏耐久
//     //         //item.getDescriptionId(),'__',//获取种类ID，可以当作翻译(资源)键名使用
//     //         //item.getDestroySpeed(Block.getBlock('minecraft:diorite').defaultBlockState()),'__',//获取物品挖掘某个方块的添加的速度
//     //         //item.getDisplayName(),'__',//获取所显示所有物品信息 //默认打印[物品名称],toSting()后打印所有相关键值信息，这里以钻石镐为例 //Component
//     //           //translation{key='chat.square_brackets', args=[empty[siblings=[translation{key='item.minecraft.diamond_pickaxe', args=[]}]]]}[style={color=white,hoverEvent=HoverEvent{action=<action show_item>, value='net.minecraft.network.chat.HoverEvent$ItemStackInfo@26ac3bbb'}}]
//     //         //item.getDrinkingSound(),'__',//物品被喝绑定的声音
//     //         //item.getEatingSound(),'__',//物品被吃绑定的声音
//     //         //item.getEnchantmentLevel("minecraft:fortune"),'__',//获取相应附魔等级
//     //         //item.getEnchantmentTags(),'__',//输出附魔nbt字段
//     //         //item.getEnchantmentValue(),'__',//返回物品可以附魔的等级
//     //         //item.getEnchantments(),'__',//输出{对应附魔id=对应附魔level,对应附魔id=对应附魔level,...}
//     //         //item.getEntityLifespan(level),'__',//物品掉落物在相应世界的生命时间
//     //         //item.getFoodProperties(player),'__',//打印出net.minecraft.world.food.FoodProperties@···
//     //         //item.getFrame(),'__',//
//     //         //item.getHarvestSpeed(),'__',//获取物品挖掘某个方块的速度
//     //         //item.getHighlightTip(item.displayName),'__',/* 不知道填什么 */
//     //         //item.getHoverName(),'__',//输出翻译名 toString()后打印translation{key='物品翻译(资源)键名', args=[]}
//     //         //item.getId(),'__',//物品id //string
//     //         //item.getIdLocation(),'__',//同上 //ResourceLocation
//     //         //item.getItem(),'__',//打印物品无mod部分id,其实是获取Item类
//     //         //item.getItemHolder(),'__',//打印`Reference{ResourceKey[minecraft:item / ${id}]=${item}}`
//     //         //item.getMaxDamage(),'__',//获取最大耐久
//     //         //item.getMaxStackSize(),'__',//获取最大堆叠数
//     //         //item.getMod(),'__',//获取物品所在mod
//     //         //item.getNbt(),'__',//获取物品nbt
//     //         //item.getNbtString(),'__',//获取物品nbt.toString()
//     //         //item.getOrCreateTag(),'__',//获取物品nbt
//     //         //item.getOrCreateTagElement("Damage"),'__',/* 不会 */
//     //         //item.getPopTime(),/* 不知道 */
//     //         //item.getRarity(),'__',//物品稀有度
//     //         //item.getRecipeRemainder(),'__',//参考https://maven.fabricmc.net/docs/fabric-api-0.76.0+1.18.2/net/fabricmc/fabric/api/item/v1/FabricItemStack.html
//     //         //item.getShareTag(),'__',//打印出服务端和客户端可以公用的tag(nbt)
//     //         //item.getSweepHitBox(),'__',//接player和entit得到物品攻击范围
//     //         //item.getTagElement("id"),'__',/* 不知道 */
//     //         //item.getTags(),'__',//打印出java.util.stream.ReferencePipeline$Head···
//     //         //item.getTooltipImage(),'__',/* 不知道 */
//     //         //item.getTooltipLines(),'__',/* 不知道 */
//     //         //item.getTypeData(),'__',/* 不知道 */
//     //         //item.getUseAnimation(),'__',//获取物品使用动画类型
//     //         //item.getUseDuration(),'__',//该方法返回值决定了物品使用耗费时间，单位为tick，例如返回100，那么如果该物品堆是食物，长按右键五秒才能完成一次进食
//     //         //item.getXpRepairRatio(),'__'/* 不知道 */
//     //     ]
//     // )
//     //item.setCount() //设置物品数量
//     //item.setDamageValue() //设置物品损坏值
//     //item.setEntityRepresentation(NoPlayList[Math.floor(Math.random() * arr.length)]) //设置
//     //item.setHoverName()
//     //item.setNbt()
//     //item.setPopTime()
//     //item.setRepairCost
    


// })

// ItemEvents.rightClicked("botania:mana_diamond", (event)=>{
//     let { player } = event
//     player.sendData("kubejs:drawing_cards",{
        
//     })
// })