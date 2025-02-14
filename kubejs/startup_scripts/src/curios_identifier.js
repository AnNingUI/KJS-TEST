
// CuriosCapabilities
// CuriosCapabilityBuilder
// CuriosEvents
// CuriosRenderer

/**
 * 
 * @param {Internal.Ingredient} tag 
 * @param {Internal.ItemStack} item 
 * @returns 
 */
function hasTag(tag, item) {
    return Ingredient.of(tag).getItemIds().toArray().includes(item);
}

// hasTag("#forge:ingots", "iron_ingot")