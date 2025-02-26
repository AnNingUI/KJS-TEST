// const $Rarity = Java.loadClass("net.minecraft.world.item.Rarity")
// const $ItemModule = Java.loadClass("mekanism.common.item.ItemModule")
// const $Item$Properties = Java.loadClass('net.minecraft.world.item.Item$Properties')
// const $ModuleHelper = Java.loadClass("mekanism.common.content.gear.ModuleHelper")
// const $MekanismConfig = Java.loadClass("mekanism.common.config.MekanismConfig")
// const $FloatingLong = Java.loadClass("mekanism.api.math.FloatingLong")
// const $MekanismAPI = Java.loadClass("mekanism.api.MekanismAPI")
// const $MekanismModules = Java.loadClass("mekanism.common.registries.MekanismModules")
// const $ModuleDeferredRegister = Java.loadClass("mekanism.common.registration.impl.ModuleDeferredRegister")
// const $ItemMekaTool = Java.loadClass("mekanism.common.item.gear.ItemMekaTool")
// const $ItemMekaSuitArmor = Java.loadClass("mekanism.common.item.gear.ItemMekaSuitArmor")
// const $ServerPlayer = Java.loadClass("net.minecraft.server.level.ServerPlayer")
// const $Object = Java.loadClass("java.lang.Object")

// // === 这里不要使用 ICustomModule 因为这是一个泛型接口， JavaAdapter对泛型接口支持不太行 ===
// // const $ICustomModule = Java.loadClass("mekanism.api.gear.ICustomModule")
// // === 使用 ModuleColorModulationUnit 来实现是因为它没有被Mek所具体实现功能 ===
// const $ModuleColorModulationUnit = Java.loadClass("mekanism.common.content.gear.shared.ModuleColorModulationUnit")
// //

// const $ForgeRegistries = Java.loadClass("net.minecraftforge.registries.ForgeRegistries")
// const $InterModEnqueueEvent = Java.loadClass("net.minecraftforge.fml.event.lifecycle.InterModEnqueueEvent")
// const $MekanismHooks = Java.loadClass("mekanism.common.integration.MekanismHooks")
// const $MekanismIMC = Java.loadClass("mekanism.api.MekanismIMC")
// const $RegisterEvent = Java.loadClass("net.minecraftforge.registries.RegisterEvent")

// // === 这一部分最好放到单独文件，因为modEventBus是共享的 === 
// const $FMLJavaModLoadingContext = Java.loadClass("net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext")
// const modEventBus = $FMLJavaModLoadingContext.get().getModEventBus();
// //

// const MODULES = new $ModuleDeferredRegister("kubejs");
// MODULES.createAndRegister(modEventBus)
// const id$mceu = new ResourceLocation("kubejs","module_create_energy_unit")
// const module$mceu = MODULES.register("module_create_energy_unit", () => {
//     return new JavaAdapter(
//         $ModuleColorModulationUnit
//         , {
//             tickServer: function(modlue, player) {
//                 if (modlue && player && player.server && player instanceof $ServerPlayer && modlue.getContainer()) {
//                     let maxEnergy = getMaxEnergy(modlue.getContainer())
//                     if (modlue.getEnergyContainer()) {
//                         let energy = modlue.getEnergyContainer().getEnergy() ?? 0;
//                         if (energy < maxEnergy) modlue.getEnergyContainer().setEnergy(maxEnergy);
//                     }
//                 }
//             }
//         }
//     )
// }, () => $ForgeRegistries.ITEMS.getValue(id$mceu).asItem(), builder => builder.rarity($Rarity.EPIC))
// const hooks = new $MekanismHooks();

// /**
//  * 
//  * @param {Internal.ItemStack} stack 
//  * @returns { Internal.FloatingLong }
//  */
// const getMaxEnergy = (stack) => {
//     if (stack.getItem() instanceof $ItemMekaTool) {
//         let module = $ModuleHelper.get().load(stack, $MekanismModules.ENERGY_UNIT);
//         return module == null ? 
//             $MekanismConfig.gear.mekaToolBaseEnergyCapacity.get() : 
//             module.getCustomInstance().getEnergyCapacity(module);
//     } else if (stack.getItem() instanceof $ItemMekaSuitArmor) {
//         let module = $ModuleHelper.get().load(stack, $MekanismModules.ENERGY_UNIT);
//         return module == null ? 
//             $MekanismConfig.gear.mekaSuitBaseEnergyCapacity.get() : 
//             module.getCustomInstance().getEnergyCapacity(module);
//     } else {
//         return $FloatingLong.ZERO;
//     }
// }

// /**
//  * 
//  * @param {ResourceLocation} id 
//  * @returns 
//  */
// const getModuleById = (id) => {
//     return $MekanismAPI.moduleRegistry().getValue(id);
// }

// StartupEvents.registry("item", (event) => {
//     event.createCustom("module_create_energy_unit", () => {
//         return new JavaAdapter(
//             $ItemModule, 
//             {
//                 // m_5812_ 是 isFoil的方法名混淆
//                 m_5812_: function() {
//                     return true;
//                 }
//             },
//             module$mceu, new $Item$Properties()
//         )
//     })
// })

// ForgeEvents.onEvent($InterModEnqueueEvent, (e) => {
//     const id = new ResourceLocation("kubejs","module_create_energy_unit")
//     const module$1 = getModuleById(id)

//     hooks.sendIMCMessages(e);
//     $MekanismIMC.addModulesToAll(module$1);
// })

