const SickleItem = require('packages/com/morecategory/MoreCategory/items/$SickleItem').$SickleItem
const ItemProp = require('packages/net/minecraft/world/item/$Item$Properties').$Item$Properties
const Client$ItemProp = require('packages/net/minecraft/client/renderer/item/$ItemProperties').$ItemProperties
const BowItem = require('packages/net/minecraft/world/item/$BowItem').$BowItem
const CuriosBoneMealItem = require('packages/com/morecategory/MoreCategory/items/$CuriosBoneMealItem').$CuriosBoneMealItem
const $BlockItem = require('packages/net/minecraft/world/item/$BlockItem').$BlockItem
const RegistryInfo = require('packages/dev/latvian/mods/kubejs/registry/$RegistryInfo').$RegistryInfo


StartupEvents.registry("item", event => {
    event.create('cai:gdcz_sword', 'sword').tier('diamond').maxDamage(99999999).parentModel('cai:item/gdcz_sword')
    //event.create('cai:gdc2_sword','sword').parentModel('cai:item/gdcz_sword').tier('diamond').maxDamage(99999999)
    event.create('cai:anli', 'sword').tier('diamond').maxDamage(99999999).texture('cai:item/anli')
    event.create('cai:soul_talisman').maxStackSize(1).tag('curios:charm').texture('cai:item/soul_talisman')
    event.create("cai:quill").maxStackSize(1).texture("cai:item/quill")
    event.create("cai:star_data").maxStackSize(1).texture("cai:item/star_data")
    event.createCustom("cai:gdc2_sword", () => {
        let item = new SickleItem("diamond", 8, 0.4, new ItemProp());
        item.maxDamage = 99999999;
        return item;
    })
    event.createCustom("bone_meal_battle", () => {
        let item = new CuriosBoneMealItem(new ItemProp(), 99999999);
        item.setMaxStackSize(1);
        return item;
    })
    event.createCustom("qqqqoo", () => {
        return new $BlockItem(Block.getBlock("kubejs:qqqqoo"), new ItemProp())
    })
    event.createCustom("zio", () => {
        return new $BlockItem(Block.getBlock("kubejs:zio"), new ItemProp())
    })
    event.createCustom("stone_crafting_table", () => {
        return new $BlockItem(Block.getBlock("kubejs:stone_crafting_table"), new ItemProp())
    })
    // event.createCustom("ziou",()=>{
    // 	return new $BlockItem(Block.getBlock("kubejs:ziou"), new ItemProp())
    // })
    event.createCustom("bow", () => {
        let item = new BowItem(new ItemProp().durability(1024));
        let Mbow = RegistryInfo.ITEM.getValue("minecraft:bow")
        Client$ItemProp.register(item, "minecraft:pull", Client$ItemProp.getProperty(Mbow, "minecraft:pull"));
        Client$ItemProp.register(item, "minecraft:pulling", Client$ItemProp.getProperty(Mbow, "minecraft:pulling"));
        return item;
    })
})

const __ro__ = RawAnimation.begin().thenLoop("ro");
const __p1__ = RawAnimation.begin().thenLoop("p1");
const __p1l__ = RawAnimation.begin().thenLoop("p1l");
const __p3__ = RawAnimation.begin().thenLoop("p3");
const __p3l__ = RawAnimation.begin().thenLoop("p3l");
const __def__ = RawAnimation.begin().thenLoop("def");

const animationMap = new Map();

StartupEvents.registry("item", (e) => {
    e.create("magic_book", "animatable")
        .addAnimation((a) => {
            if (!Client || !Client.options || !Client.options.getCameraType() || !Client.player) {
                return a.setAndContinue(__def__);
            }
            const playCam = Client.options.getCameraType().isFirstPerson();
            const play = Client.player;
            const magicBookItem = Item.of("kubejs:magic_book");

            const setAnimationState = (offHand, mainHand) => {
                const itemIndex = play.getInventory().find(magicBookItem) ?? -1;
                // console.log(itemIndex);
                if (itemIndex >= 0) {
                    if (play.getOffHandItem().id === magicBookItem.id) {
                        return offHand; // 确保返回 PlayState 对象
                    } else if (play.getMainHandItem().id === magicBookItem.id) {
                        return mainHand; // 确保返回 PlayState 对象
                    } else {
                        return __def__; // 确保返回 PlayState 对象
                    }
                }
                else {
                    return __def__; // 确保返回 PlayState 对象
                }
            };
            const u = playCam ? setAnimationState(__p1l__, __p1__) : setAnimationState(__p3l__, __p3__)
            return a.setAndContinue(u);
        })
        .geoModel(geo => {
            geo.setSimpleModel("kubejs:geo/item/magic_book.geo.json")
            geo.setSimpleTexture("kubejs:textures/item/magic_book.png")
            geo.setSimpleAnimation("kubejs:animations/item/magic_book.animation.json")
        })
});