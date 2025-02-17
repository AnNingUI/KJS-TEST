// const $Rarity = Java.loadClass("net.minecraft.world.item.Rarity")
// StartupEvents.registry("item", (event) => {
//     const a = event.create(
//         "module_create_energy_unit", "mek_unit"
//     )
    
//     // === MekUnitItemBuilder ===
    
//     a.setSlot("all")
//     a.tickServer((modlue, player) => {
//         const maxEnergy = KJSModuleUtils.getMaxEnergy(modlue.getContainer())
//         modlue.getEnergyContainer().setEnergy(maxEnergy)
//     })
    
//     // === ItemBuilder ===

//     a.glow(true)
//     a.rarity($Rarity.EPIC);
// })