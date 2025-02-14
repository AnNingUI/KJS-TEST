const $CuriosApi = Java.loadClass('top.theillusivec4.curios.api.CuriosApi')



/**
 * 返回对应槽位物品列表
 * @param {$Player_} player 
 * @param {CuriosSlot} slot
 * @returns {Array<$ItemStack_>}
 */
function getCuriosItemListBySlot(player,slot){
    // 推荐使用Nbt方法，简介明了，但是容易出bug所以在这里我使用CuriosApi
    // let curios = player.nbt.ForgeCaps['curios:inventory']["Curios"].find(function(curio) {
	// 	return curio["Identifier"] === slot;
	// })
    // return curios ? curios.StacksHandler.Stacks.Items : [];
    return $CuriosApi.getCuriosInventory(player).resolve().get().getCurios().get(slot).getStacks().getAllItems() ?? [];
}

/**
 * 判断玩家有无装饰此饰品
 * @param {$Player_} player 
 * @param {string} itemId 
 */
function hasCuriosItem(player,itemId){
    return $CuriosApi
       .getCuriosHelper()
       ['findCurios(net.minecraft.world.entity.LivingEntity,net.minecraft.world.item.Item)']
       (player, Item.of(itemId))
       .length > 0;
}

/**
 * 判断玩家有无装饰此饰品在目标槽位上
 * @param {$Player_} player 
 * @param {CuriosSlot} slot 
 * @param {string} itemId 
 * @returns 
 */
function hasCuriosItemBySlot(player, slot, itemId) {
    let ItemList = getCuriosItemListBySlot(player, slot);
    return ItemList.some(item => item.id === itemId);
}





/**
 * 返回是否有此物品在player的slot上，及物品数量，及对应物品数组对的每个物品相对于该槽位的索引，对应槽位数量
 * @param {$Player_} player 
 * @param {CuriosSlot} slot
 * @param {string} itemId 
 * @returns { CuriosInfoForPlayerSlot }
 */
function getCuriosInfoForPlayerSlot(player, slot, itemId) {
    let result = { 
        hasItem: false, 
        count: 0, 
        SlotBySelfIndexs: [], 
        SlotSize: 0
    };
    
    let ItemList = getCuriosItemListBySlot(player, slot);
    // result.SlotSize = player.nbt.ForgeCaps['curios:inventory']["Curios"].find(function(curio) {
    // 	return curio["Identifier"] === slot;
    // }).StacksHandler.Cosmetics.Size

    ItemList.forEach(item => { 
        if (item.id === itemId) { 
            result.hasItem = true;
            // result.count += item.Count;
            result.count += item.count;
            result.SlotBySelfIndexs.push(item.Slot);
        }
    });
    result.SlotSize = result.hasItem ? useCuriosSlotMethod("getfor", slot, player, null) : 0;
    return result;
}


/**
 * 对槽位数量的动态操作
 * @param {CuriosMethod} method 
 * @param {CuriosSlot} slot 
 * @param {$Player_} player 
 * @param {Number} amount 
 * @returns 
 */
function useCuriosSlotMethod(method,slot,player,amount){
    switch(method)
    {
        case "shrink":
            $CuriosApi.getSlotHelper().shrinkSlotType(slot, amount, player)
            break;
        case "grow":
            $CuriosApi.getSlotHelper().growSlotType(slot, amount, player)
            break;
        case "getfor":
            return $CuriosApi.getSlotHelper().getSlotsForType(player, slot)
        case "setfor":
            $CuriosApi.getSlotHelper().setSlotsForType(slot, player, amount)
            break;
        case "unlock":
            $CuriosApi.getSlotHelper().unlockSlotType(slot, player)
            break;
        case "lock":
            $CuriosApi.getSlotHelper().lockSlotType(slot, player)
            break;
    }
}