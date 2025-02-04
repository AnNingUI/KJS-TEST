
// CuriosCapabilities
// CuriosCapabilityBuilder
// CuriosEvents
// CuriosRenderer

/**
 * 
 * @param {import("packages/net/minecraft/world/item/crafting/$Ingredient").$Ingredient$Type} tag 
 * @param {import("packages/net/minecraft/world/item/$ItemStack").$ItemStack$Type} item 
 * @returns 
 */
function hasTag(tag, item) {
    return Ingredient.of(tag).getItemIds().toArray().includes(item);
}

// hasTag("#forge:ingots", "iron_ingot")