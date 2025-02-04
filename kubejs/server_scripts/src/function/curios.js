const { $Player } = require('packages/net/minecraft/world/entity/player/$Player');
const { $ItemStack } = require('packages/net/minecraft/world/item/$ItemStack');

let $CuriosApi = require('packages/top/theillusivec4/curios/api/$CuriosApi').$CuriosApi



/**
 * 返回对应槽位物品列表
 * @param {$Player} player 
 * @param {CuriosSlot} slot
 * @returns {Array<$ItemStack>}
 */
function getCuriosItemListBySlot(player,slot){
    // let curios = player.nbt.ForgeCaps['curios:inventory']["Curios"].find(function(curio) {
	// 	return curio["Identifier"] === slot;
	// })
    // return curios ? curios.StacksHandler.Stacks.Items : [];
    return $CuriosApi.getCuriosInventory(player).resolve().get().getCurios().get(slot).getStacks().getAllItems() ?? [];
}

/**
 * 
 * @param {$Player} player 
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
 * 
 * @param {$Player} player 
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
 * @param {$Player} player 
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
    result.SlotSize = result.hasItem ? CuriosSlotMethod("getfor", slot, player, null) : 0;
    return result;
}


/**
 * 
 * @param {CuriosMethod} method 
 * @param {CuriosSlot} slot 
 * @param {$Player} player 
 * @param {Number} amount 
 * @returns 
 */
function CuriosSlotMethod(method,slot,player,amount){
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








