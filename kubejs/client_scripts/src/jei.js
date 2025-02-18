
const $Entity
	= Java.loadClass("net.minecraft.world.entity.Entity");
const $Level
	= Java.loadClass("net.minecraft.world.level.Level");
const $AnimatedKinetics
	= Java.loadClass("com.simibubi.create.compat.jei.category.animations.AnimatedKinetics");
const $Axis
	= Java.loadClass("com.mojang.math.Axis");
const $ItemStack
	= Java.loadClass("net.minecraft.world.item.ItemStack");
const $Font$DisplayMode
	= Java.loadClass("net.minecraft.client.gui.Font$DisplayMode");
const $ClientTooltipComponent
	= Java.loadClass("net.minecraft.client.gui.screens.inventory.tooltip.ClientTooltipComponent");
const $$Color
	= Java.loadClass("java.awt.Color");
const $Button
	= Java.loadClass("net.minecraft.client.gui.components.Button")
const $REIScreen
	= Java.loadClass("me.shedaniel.rei.impl.client.gui.screen.DefaultDisplayViewingScreen")

const upButton = $Button.builder(
	Text.literal("▲"),
	() => {
		if (global.mLayer > 0 && global.mLayer <= 3) {
			global.mLayer--;
		} else {
			global.mLayer = 3;
		}
	}
).bounds(120, 74, 18, 18)
	.build();
const downButton = $Button.builder(
	Text.literal("▼"),

	() => {
		if (global.mLayer < 3 && global.mLayer >= 0) {
			global.mLayer++;
		} else {
			global.mLayer = 0;
		}
	}
).bounds(120, 92, 18, 18)
	.build();

const setLevelMethod = $Entity.__javaObject__.getDeclaredMethod("m_284535_", $Level);
setLevelMethod.setAccessible(true);

// const drawCenteredStringMethod = $GuiGraphics.__javaObject__.getDeclaredMethod("m_280137_", $Font, $String, $Int, $Int, $Int);
// drawCenteredStringMethod.setAccessible(true);

global.ElementShowPoss = [];
global.renderOutlineRange = [];

JEIAddedEvents.registerCategories(event => {
	event.custom("kubejs:entity", category => {
		let { jeiHelpers } = category;
		let { guiHelper } = jeiHelpers;

		global.entityRecipeType = category
			.title(Text.translatable("category.kubejs.entity.test"))
			.background(guiHelper.createBlankDrawable(100, 100))
			.icon(guiHelper.createDrawableItemStack("cataclysm:ignis_spawn_egg"))
			.isRecipeHandled(r => global.verifyEntityRecipe(r))
			.handleLookup((builder, r, focuses) => global.handleEntityLookup(builder, r, focuses))
			.setDrawHandler((r, recipeSlotsView, guiGraphics, mouseX, mouseY) => global.renderEntityRecipe(r, guiGraphics))
			.recipeType;
	})

	event.custom("kubejs:multiblock", category => {
		let { jeiHelpers } = category;
		let { guiHelper } = jeiHelpers;
		global.multiBlockRecipeType = category
			.title(Text.translatable("category.kubejs.multiblock.test"))
			.background(guiHelper.createBlankDrawable(120, 120))
			.icon(guiHelper.createDrawableItemStack("minecraft:structure_block"))
			.isRecipeHandled(r => r.data != undefined && r.data.description != undefined)
			.handleLookup((builder, r, focuses) => global["handlemultiBlockLookup"](builder, r, focuses))
			.setDrawHandler((r, recipeSlotsView, guiGraphics, mouseX, mouseY) => global.drawObsidian(r, guiGraphics))
	})

	event.custom("kubejs:magic", category => {
		let { jeiHelpers } = category;
		let { guiHelper } = jeiHelpers;
		global.magicRecipeType = category
			.title(Text.translatable("category.kubejs.multiblock.magic"))
			.background(guiHelper.createBlankDrawable(140, 140))
			.icon(guiHelper.createDrawableItemStack("kubejs:myjq"))
			.isRecipeHandled(r => r.data != undefined && r.data.description != undefined)
			.handleLookup((builder, r, focuses) => global["magicBlockLookup"](builder, r))
			.setDrawHandler((r, recipeSlotsView, guiGraphics, mouseX, mouseY) => global.drawMagic(r, guiGraphics))
	})
})

JEIAddedEvents.registerRecipes(event => {
	let entity = Client.level.createEntity("cataclysm:ignis");
	entity.noCulling = true;

	event.custom("kubejs:entity")
		.add({
			entity: (level) => {
				if (entity.level != level) {
					setLevelMethod.invoke(entity, level);
				}
				return entity;
			},
			description: "jei.description.ignis",
			offset: 1, // Change to specification
			renderScale: 15 // Change to specification
		});

	event.custom("kubejs:multiblock")
		.add({
			recipes: {
				"input": [
					Item.of("minecraft:diamond_sword"),
					Item.of("morecategory:diamond_sickle"),
				],
				"Amount": 1000,
				"output": [
					Item.of("3x minecraft:diamond")
				]
			},
			description: "jei.description.ignis",
		})
		.add({
			recipes: {
				"input": [
					Item.of("minecraft:iron_sword"),
					Item.of("morecategory:diamond_sickle"),
				],
				"Amount": 1000,
				"output": [
					Item.of("3x minecraft:iron_ingot")
				]
			},
			description: "jei.description.ignis",
		})
		.add({
			recipes: {
				"input": [
					Item.of("minecraft:iron_sword"),
					Item.of("morecategory:diamond_sickle"),
					Item.of("minecraft:diamond_sword")
				],
				"Amount": 1000,
				"output": [
					Item.of("3x minecraft:apple")
				]
			},
			description: "jei.description.ignis",
		})

	global.myjqRecipes.forEach((r) => {
		event.custom("kubejs:magic")
			.add({ recipes: r, description: "jei.description.ignis" })
	})
})

JEIAddedEvents.registerRecipeCatalysts(event => {
	event.data.addRecipeCatalyst("cataclysm:ignis_spawn_egg", global.entityRecipeType)
})

global.verifyEntityRecipe = (r) => {
	return r.data != undefined && r.data.entity != undefined && r.data.description != undefined && r.data.offset != undefined && r.data.renderScale != undefined;
}

global.handleEntityLookup = (builder) => {
	// Required because JEI doesn"t seem to build a category if it has no slots
	builder.addSlot("catalyst", 0, 0);
}
/**
 * 
 * @param {Internal.CustomJSRecipe} r 
 * @param {GuiGraphics} guiGraphics 
 */
global.renderEntityRecipe = (r, guiGraphics) => {
	guiGraphics.drawWordWrap(Client.font, Text.translatable(r.data.description), 0, 5, 100, 0);
	let poseStack = guiGraphics.pose();
	poseStack.pushPose();
	let entity = r.data.entity(Client.level);

	// This part mostly comes from looking at how patchouli does it
	poseStack.translate(58, 60, 50);
	let scale = r.data.renderScale;
	poseStack.scale(scale, scale, scale)
	poseStack.translate(0, r.data.offset, 0);
	poseStack.mulPose(new Quaternionf().rotationZ(KMath.PI)); // Whoever decided to bind Quaternionf thank you so much
	poseStack.mulPose(new Quaternionf().rotationY(KMath.PI / 3)); // Experiment with these values, find a value you like

	let entityRenderDispatcher = Client.entityRenderDispatcher;
	entityRenderDispatcher.setRenderShadow(false);
	entityRenderDispatcher.render(entity, 0, 0, 0, 0, 1, poseStack, guiGraphics.bufferSource(), 0xF000F0);
	entityRenderDispatcher.setRenderShadow(true);

	guiGraphics.bufferSource().endBatch();
	poseStack.popPose();
}






//使用$AnimatedKinetics.defaultBlockElement方法渲染方块
//参考自https://github.com/Creators-of-Create/Create/blob/mc1.20.1/dev/src/main/java/com/simibubi/create/compat/jei/category/animations/AnimatedKinetics.java
/* 
let $GuiGameElement = Java.loadClass("com.simibubi.create.foundation.gui.element.GuiGameElement")
let $CustomLightingSettings = Java.loadClass("com.simibubi.create.foundation.gui.CustomLightingSettings")
以下 defaultBlockElement(block.get) 可替换为 $GuiGameElement.of(block.get).lighting($CustomLightingSettings.builder()
			.firstLightRotation(12.5, 45.0)
			.secondLightRotation(-20.0, 50.0)
			.build())
使用of也可以渲染物品，流体，以下不做演示
参考自
https://github.com/Creators-of-Create/Create/blob/mc1.20.1/dev/src/main/java/com/simibubi/create/foundation/gui/element/GuiGameElement.java
https://github.com/Creators-of-Create/Create/blob/mc1.20.1/dev/src/main/java/com/simibubi/create/foundation/gui/CustomLightingSettings.java
*/

/**
 * 
 * @param {Internal.CustomJSRecipe} r 
 * @param {GuiGraphics} graphics 
 * @param {Array<{get: Internal.Block, pos: BlockPos}> | {layer: number, maxLayer: number, blocks: Internal.ArrayList<{get: Internal.Block, pos: BlockPos}>} } mutblocks
 * @param {boolean} canRotation
 * @param {number} renderScale
 * @param {{x: number, y: number, z: number}} offset
 * @param {number} angle
 */
global.draw = (r, graphics, mutblocks, canRotation, renderScale, offset, angle) => {
	// graphics.drawWordWrap(Client.font, Text.of("=>"), global.j_go+10, 85, 140, 0);
	let matrixStack = graphics.pose();
	let { defaultBlockElement } = $AnimatedKinetics
	matrixStack.pushPose();
	// matrixStack.translate(xOffset, yOffset, 200);

	let time = (Date.now() / 10) % 360
	matrixStack.mulPose($Axis.XP.rotationDegrees(-15.5));
	!canRotation ? matrixStack.mulPose($Axis.YP.rotationDegrees(angle == undefined ? -22.5 : angle)) : {};
	let scale = renderScale;
	matrixStack.scale(scale, scale, scale)
	matrixStack.translate(offset.x + 10, offset.y + 2, offset.z + 5);
	let mubIsArray = Array.isArray(mutblocks)
	let mub = /**@type {{get: Internal.Block_, pos: BlockPos_}[]} */(
		mubIsArray ? mutblocks : mutblocks.blocks
	)
	let layer = mutblocks?.layer
	let maxLayer = mutblocks?.maxLayer
	// console.log(layer)
	mub.forEach((block, indx, muts) => {
		let bY = block.pos.getY();
		if (layer && maxLayer && bY > maxLayer - layer) {
			return
		}
		canRotation ? matrixStack.pushPose() : {};
		let { x, y, z } = block.pos
		// 自转
		canRotation ? matrixStack.rotateY(time) : {};
		// canRotation ? matrixStack.mulPose($Axis.YP.rotationDegrees(time)) : {};

		defaultBlockElement(block.get)
			.atLocal(x, -y, z)
			.scale(scale)
			.render(graphics);

		canRotation ? matrixStack.popPose() : {};
	});
	matrixStack.centre();
	// console.log(mutblocks)
	matrixStack.scale(scale, -scale, scale);
	matrixStack.translate(0, -1.8, 0);
	matrixStack.popPose();
}

/**
 * 
 * @param {Internal.CustomJSRecipe} r 
 * @param {GuiGraphics} graphics 
 */
global.drawObsidian = (r, graphics) => {
	return global.draw(r, graphics, [
		{ get: Block.getBlock("minecraft:obsidian"), pos: new BlockPos(0, 3, 0) },
		{ get: Block.getBlock("minecraft:obsidian"), pos: new BlockPos(0, 3, 1) },
		{ get: Block.getBlock("minecraft:obsidian"), pos: new BlockPos(0, 3, -1) },
		{ get: Block.getBlock("minecraft:obsidian"), pos: new BlockPos(1, 3, 0) },
		{ get: Block.getBlock("minecraft:obsidian"), pos: new BlockPos(-1, 3, 0) },
		{ get: Block.getBlock("minecraft:obsidian"), pos: new BlockPos(1, 3, -1) },
		{ get: Block.getBlock("minecraft:obsidian"), pos: new BlockPos(-1, 3, 1) },
		{ get: Block.getBlock("minecraft:obsidian"), pos: new BlockPos(1, 3, 1) },
		{ get: Block.getBlock("minecraft:obsidian"), pos: new BlockPos(-1, 3, -1) },
		{ get: Block.getBlock("minecraft:sculk_shrieker"), pos: new BlockPos(0, 4, 0) },
	], false, 4, { x: 7, y: 16, z: 7 })
}

global.mLayer = 3
global.isRenderButton = true

/**
 * 
 * @param {Internal.CustomJSRecipe} r 
 * @param {GuiGraphics} graphics 
 */
global.drawMagic = (r, graphics) => {
	// console.log(global.mLayer)
	let gH = graphics.guiHeight();
	let gW = graphics.guiWidth();
	let sW = Client.window.width;
	let sH = Client.window.height;
	let scH = gH / sH;
	let scW = gW / sW;
	// console.log(`${scW} - ${scH}`)
	let sX = (sW - gW) / 2
	let sY = (sH - gH) / 2
	let dX = scW < 0.26 ? sX - 128 : 112
	let dY = scH < 0.26 ? sY - 120 : 0
	// console.log(`${sX} - ${sY - dY} - ${sW} - ${sH}`)
	let partialTick = Client.partialTick;
	if (global.isRenderButton && Client.screen instanceof $REIScreen && partialTick > 0.5) {
		upButton.setPosition(sX - dX, sY - dY)
		downButton.setPosition(sX - dX, sY - dY + 18)
		Client.screen.addRenderableWidget(upButton);
		Client.screen.addRenderableWidget(downButton);
		global.isRenderButton = false;
	}


	let re = /**@type {MagicRecipes} */(r.data.recipes);
	let type = re.rType;
	let id = re.id;
	let angle = 65.5;
	if (global.ElementShowPoss) {
		// console.log(global.ElementShowPoss)
		for (let Element of global.ElementShowPoss) {
			if (Element[3] == id) {
				let str = `${Element[2]}`
				let i = Element[0];
				let j = Element[1];
				let type = Element[4];

				type == "fluid" ? renderComponentTooltip(graphics, Client.font, [Component.of(str).blue()], i - 11, j + 20, 0) : {};
				graphics.renderOutline(Element[0] - 1, Element[1] - 1, 18, 18, new KjsColor([115, 136, 137, 125]).getRGB());
			}
		}
	}

	if (global.renderOutlineRange) {
		global.renderOutlineRange.forEach((range) => {
			let minX = range[0];
			let minY = range[1];
			let maxX = range[2];
			let maxY = range[3];
			let rgba = range[4] || new KjsColor([115, 136, 137, 125]).getRGB();
			graphics.renderOutline(minX, minY, maxX - minX, maxY - minY, rgba);
		})
	}

	let canRotation = false
	let MAGIC_BLOCKS = [
		{ get: Block.getBlock("kubejs:myjq2"), pos: new BlockPos(0, 3, 0) },

		{ get: Block.getBlock(type == "fluid" ? "kubejs:jar" : "create:depot"), pos: new BlockPos(0, 4, 0) },

		{ get: Block.getBlock("kubejs:jar"), pos: new BlockPos(0, 4, 2) }, //
		{ get: Block.getBlock("kubejs:jar"), pos: new BlockPos(0, 4, -2) },
		{ get: Block.getBlock("create:depot"), pos: new BlockPos(-2, 4, -2) },
		{ get: Block.getBlock("create:depot"), pos: new BlockPos(-2, 5, -2) },
		{ get: Block.getBlock("create:depot"), pos: new BlockPos(2, 4, 2) },
		{ get: Block.getBlock("create:depot"), pos: new BlockPos(2, 5, 2) },
		{ get: Block.getBlock("create:depot"), pos: new BlockPos(2, 4, -2) },
		{ get: Block.getBlock("create:depot"), pos: new BlockPos(2, 5, -2) },
		{ get: Block.getBlock("create:depot"), pos: new BlockPos(-2, 4, 2) },
		{ get: Block.getBlock("create:depot"), pos: new BlockPos(-2, 5, 2) },
		{ get: Block.getBlock("kubejs:jar"), pos: new BlockPos(-2, 4, 0) }, //
		{ get: Block.getBlock("kubejs:jar"), pos: new BlockPos(2, 4, 0) },
		{ get: Block.getBlock("mekanism:boiler_casing"), pos: new BlockPos(0, 3, 2) }, //
		{ get: Block.getBlock("mekanism:boiler_casing"), pos: new BlockPos(0, 3, -2) },
		{ get: Block.getBlock("mekanism:boiler_casing"), pos: new BlockPos(1, 3, -2) },
		{ get: Block.getBlock("mekanism:boiler_casing"), pos: new BlockPos(1, 3, 2) },
		{ get: Block.getBlock("mekanism:boiler_casing"), pos: new BlockPos(-1, 3, 2) },
		{ get: Block.getBlock("mekanism:boiler_casing"), pos: new BlockPos(-1, 3, -2) },

		{ get: Block.getBlock("create:industrial_iron_block"), pos: new BlockPos(-3, 3, -2) },
		{ get: Block.getBlock("create:industrial_iron_block"), pos: new BlockPos(3, 3, 2) },
		{ get: Block.getBlock("create:industrial_iron_block"), pos: new BlockPos(-3, 3, 2) },
		{ get: Block.getBlock("create:industrial_iron_block"), pos: new BlockPos(3, 3, -2) },

		{ get: Block.getBlock("create:industrial_iron_block"), pos: new BlockPos(-2, 3, -3) },
		{ get: Block.getBlock("create:industrial_iron_block"), pos: new BlockPos(2, 3, 3) },
		{ get: Block.getBlock("create:industrial_iron_block"), pos: new BlockPos(-2, 3, 3) },
		{ get: Block.getBlock("create:industrial_iron_block"), pos: new BlockPos(2, 3, -3) },

		{ get: Block.getBlock("create:industrial_iron_block"), pos: new BlockPos(0, 3, -3) },
		{ get: Block.getBlock("create:industrial_iron_block"), pos: new BlockPos(0, 3, 3) },

		{ get: Block.getBlock("create:industrial_iron_block"), pos: new BlockPos(-3, 3, 0) },
		{ get: Block.getBlock("create:industrial_iron_block"), pos: new BlockPos(3, 3, 0) },

		{ get: Block.getBlock("create:industrial_iron_block"), pos: new BlockPos(-3, 3, -1) },
		{ get: Block.getBlock("create:industrial_iron_block"), pos: new BlockPos(3, 3, -1) },
		{ get: Block.getBlock("create:industrial_iron_block"), pos: new BlockPos(-3, 3, 1) },
		{ get: Block.getBlock("create:industrial_iron_block"), pos: new BlockPos(3, 3, 1) },

		{ get: Block.getBlock("create:industrial_iron_block"), pos: new BlockPos(-1, 3, -3) },
		{ get: Block.getBlock("create:industrial_iron_block"), pos: new BlockPos(1, 3, -3) },
		{ get: Block.getBlock("create:industrial_iron_block"), pos: new BlockPos(-1, 3, 3) },
		{ get: Block.getBlock("create:industrial_iron_block"), pos: new BlockPos(1, 3, 3) },

		{ get: Block.getBlock("create:industrial_iron_block"), pos: new BlockPos(-2, 3, -2) }, //1
		{ get: Block.getBlock("create:industrial_iron_block"), pos: new BlockPos(2, 3, 2) }, //2
		{ get: Block.getBlock("create:industrial_iron_block"), pos: new BlockPos(-2, 3, 2) }, //3
		{ get: Block.getBlock("create:industrial_iron_block"), pos: new BlockPos(2, 3, -2) }, //4

		{ get: Block.getBlock("cai:r_glowstone"), pos: new BlockPos(-1, 4, -3) },
		{ get: Block.getBlock("cai:r_glowstone"), pos: new BlockPos(0, 4, -3) },
		{ get: Block.getBlock("cai:r_glowstone"), pos: new BlockPos(1, 4, -3) },
		{ get: Block.getBlock("cai:r_glowstone"), pos: new BlockPos(3, 4, -1) },
		{ get: Block.getBlock("cai:r_glowstone"), pos: new BlockPos(3, 4, 0) },
		{ get: Block.getBlock("cai:r_glowstone"), pos: new BlockPos(3, 4, 1) },

		{ get: Block.getBlock("cai:r_glowstone"), pos: new BlockPos(-1, 5, -3) },
		{ get: Block.getBlock("cai:r_glowstone"), pos: new BlockPos(0, 5, -3) },
		{ get: Block.getBlock("cai:r_glowstone"), pos: new BlockPos(1, 5, -3) },
		{ get: Block.getBlock("cai:r_glowstone"), pos: new BlockPos(3, 5, -1) },
		{ get: Block.getBlock("cai:r_glowstone"), pos: new BlockPos(3, 5, 0) },
		{ get: Block.getBlock("cai:r_glowstone"), pos: new BlockPos(3, 5, 1) },

		{ get: Block.getBlock("cai:r_glowstone"), pos: new BlockPos(-1, 6, -3) },
		{ get: Block.getBlock("cai:r_glowstone"), pos: new BlockPos(0, 6, -3) },
		{ get: Block.getBlock("cai:r_glowstone"), pos: new BlockPos(1, 6, -3) },
		{ get: Block.getBlock("cai:r_glowstone"), pos: new BlockPos(3, 6, -1) },
		{ get: Block.getBlock("cai:r_glowstone"), pos: new BlockPos(3, 6, 0) },
		{ get: Block.getBlock("cai:r_glowstone"), pos: new BlockPos(3, 6, 1) },

		{ get: Block.getBlock("minecraft:crying_obsidian"), pos: new BlockPos(3, 4, -2) },
		{ get: Block.getBlock("minecraft:crying_obsidian"), pos: new BlockPos(3, 4, 2) },
		{ get: Block.getBlock("minecraft:crying_obsidian"), pos: new BlockPos(3, 5, -2) },
		{ get: Block.getBlock("minecraft:crying_obsidian"), pos: new BlockPos(3, 5, 2) },
		{ get: Block.getBlock("minecraft:crying_obsidian"), pos: new BlockPos(3, 6, -2) },
		{ get: Block.getBlock("minecraft:crying_obsidian"), pos: new BlockPos(3, 6, 2) },

		{ get: Block.getBlock("minecraft:crying_obsidian"), pos: new BlockPos(-2, 4, -3) },
		{ get: Block.getBlock("minecraft:crying_obsidian"), pos: new BlockPos(2, 4, -3) },
		{ get: Block.getBlock("minecraft:crying_obsidian"), pos: new BlockPos(-2, 5, -3) },
		{ get: Block.getBlock("minecraft:crying_obsidian"), pos: new BlockPos(2, 5, -3) },
		{ get: Block.getBlock("minecraft:crying_obsidian"), pos: new BlockPos(-2, 6, -3) },
		{ get: Block.getBlock("minecraft:crying_obsidian"), pos: new BlockPos(2, 6, -3) },

		{ get: Block.getBlock("mekanism:boiler_casing"), pos: new BlockPos(-2, 3, 0) }, //
		{ get: Block.getBlock("mekanism:boiler_casing"), pos: new BlockPos(-2, 3, 1) },
		{ get: Block.getBlock("mekanism:boiler_casing"), pos: new BlockPos(-2, 3, -1) },
		{ get: Block.getBlock("mekanism:boiler_casing"), pos: new BlockPos(2, 3, 0) },
		{ get: Block.getBlock("mekanism:boiler_casing"), pos: new BlockPos(2, 3, 1) },
		{ get: Block.getBlock("mekanism:boiler_casing"), pos: new BlockPos(2, 3, -1) },

		{ get: Block.getBlock("create:framed_glass"), pos: new BlockPos(0, 3, 1) },
		{ get: Block.getBlock("create:framed_glass"), pos: new BlockPos(0, 3, -1) },
		{ get: Block.getBlock("create:framed_glass"), pos: new BlockPos(1, 3, 0) },
		{ get: Block.getBlock("create:framed_glass"), pos: new BlockPos(-1, 3, 0) },
		{ get: Block.getBlock("create:framed_glass"), pos: new BlockPos(1, 3, -1) },
		{ get: Block.getBlock("create:framed_glass"), pos: new BlockPos(-1, 3, 1) },
		{ get: Block.getBlock("create:framed_glass"), pos: new BlockPos(1, 3, 1) },
		{ get: Block.getBlock("create:framed_glass"), pos: new BlockPos(-1, 3, -1) },
	]
	global.draw(r, graphics, {
		blocks: MAGIC_BLOCKS,
		layer: global.mLayer,
		maxLayer: 6 // 这里填写MAGIC_BLOCKS里面posY的最大值，为了性能所以硬编码
	}, canRotation, 3.05, canRotation ? { x: 7, y: 21, z: 14 } : { x: -16, y: 22, z: 15 }, angle)

	Client.screen.removed()
	global.isRenderButton = true;
}


/**
 * 
 * @param {Internal.IRecipeLayoutBuilder} builder 
 * @param {Internal.CustomJSRecipe} r 
 */
global["handlemultiBlockLookup"] = (builder, r) => {
	builder.setShapeless()
	let i = 0
	builder.addSlot("INPUT", 10, 80).addFluidStack(Fluid.getType("cai:mana"), r.data.recipes.Amount).setSlotName("input")
	r.data.recipes.input.forEach((input, index) => {
		builder.addSlot("INPUT", 30 + index * 23, 80).addItemStack(Item.of(input)).setSlotName("input");
		i = Math.max(i, 20 + index * 23)
	})
	global.j_go = i + 20
	r.data.recipes.output.forEach((output, index) => {
		builder.addSlot("OUTPUT", i + 40 + index * 25, 80).addItemStack(Item.of(output)).setSlotName("output");
	})
}


/**
 * 
 * @param {Internal.IRecipeLayoutBuilder} builder 
 * @param {Internal.CustomJSRecipe} r 
 */
global["magicBlockLookup"] = (builder, r) => {
	// builder.setShapeless();
	let w = 0;
	let h = 0;
	const ITEM_SPACING = 20;
	const OUTPUT_SPACING = 80;

	const HORIZONTALLINE = 85;

	let re = /**@type {MagicRecipes} */(r.data.recipes);
	// console.log(re);
	let inputItems = re.input.item;
	let inputFluids = re.input.fluid;
	let output = re.output;
	let tick = re.tick;
	let id = re.id;
	let rType = re.rType;

	builder.addSlot("CATALYST", 123, 2).addItemStack(Item.of("cai:r_glowstone", 36)).setSlotName(`show_block_0`);
	builder.addSlot("CATALYST", 123, 20).addItemStack(Item.of("minecraft:crying_obsidian", 24)).setSlotName(`show_block_1`);
	builder.addSlot("CATALYST", 123, 38).addItemStack(Item.of("create:industrial_iron_block", 24)).setSlotName(`show_block_3`);
	builder.addSlot("CATALYST", 123, 56).addItemStack(Item.of("mekanism:boiler_casing", 12)).setSlotName(`show_block_4`);
	builder.addSlot("CATALYST", 105, 2).addItemStack(Item.of("create:framed_glass", 8)).setSlotName(`show_block_5`);
	builder.addSlot("CATALYST", 105, 20).addItemStack(Item.of("create:depot", rType === "item" ? 9 : 8)).setSlotName(`show_block_6`);
	builder.addSlot("CATALYST", 105, 38).addItemStack(Item.of("kubejs:jar", rType === "fluid" ? 5 : 4)).setSlotName(`show_block_7`);
	builder.addSlot("CATALYST", 105, 56).addItemStack(Item.of("kubejs:myjq", 1)).setSlotName(`show_block_8`);
	global.renderOutlineRange.push([104, 0, 140, 75, new KjsColor([239, 239, 239, 255]).getRGB()])


	// Add item inputs
	if (inputItems.length > 0) {
		inputItems.forEach((input, index) => {
			builder.addSlot("INPUT", w, h + HORIZONTALLINE).addItemStack(input).setSlotName(`input_item_${index}`);
			global.ElementShowPoss.push([w, h + HORIZONTALLINE, null, id, "item"]);
			w += ITEM_SPACING;
			if ((index + 1) % 4 === 0) { // Wrap to the next row after 4 items
				w = 0;
				h += ITEM_SPACING;
			}
		});
	}

	// Add fluid inputs
	if (inputFluids.length > 0) {
		inputFluids.forEach((input, index) => {
			builder.addSlot("INPUT", w, h + HORIZONTALLINE).addFluidStack(`${input.fluid.arch$registryName()}`, input.amount).setSlotName(`input_fluid_${index}`);
			global.ElementShowPoss.push([w, h + HORIZONTALLINE, input.amount, id, "fluid"]);
			w += ITEM_SPACING;
			if ((index + 1) % 2 === 0) { // Wrap to the next row after 2 fluids
				w = 0;
				h += ITEM_SPACING;
			}
		});
	}

	// Reset width for output and position it
	w = 0;
	if (output instanceof $ItemStack) {
		builder.addSlot("OUTPUT", w + OUTPUT_SPACING, HORIZONTALLINE).addItemStack(Item.of(output)).setSlotName("output_item");
		global.ElementShowPoss.push([w + OUTPUT_SPACING, HORIZONTALLINE, null, id, "item"]);
	} else {
		builder.addSlot("OUTPUT", w + OUTPUT_SPACING, HORIZONTALLINE).addFluidStack(`${output.fluid.arch$registryName()}`, output.amount).setSlotName("output_fluid");
		global.ElementShowPoss.push([w + OUTPUT_SPACING, HORIZONTALLINE, output.amount, id, "fluid"]);
	}
}



let r = {
	rType: "fluid",
	input: {
		item: [],
		fluid: [
			Fluid.of("cai:mana", 200),
			Fluid.of("cai:mana", 200),
			Fluid.of("cai:mana", 200),
			Fluid.of("cai:mana", 200)
		]
	},
	output: Fluid.of("createmetallurgy:molten_gold", 100), // maxAmount: 8000
	tick: 80,
	id: "kubejs:magic/test3"
}




/**
 * 
 * @param {GuiGraphics} graphics 
 * @param {Internal.Font} font 
 * @param {string} string 
 * @param {integer} i 
 * @param {integer} j 
 * @param {integer} k 
 * @param {boolean} bl 
 * @returns 
 */
function drawString(graphics, font, string, i, j, k, bl) {
	if (string == null) {
		return 0;
	} else {
		let l = font.drawInBatch(string, i, j, k, bl, graphics.pose().last().pose(), graphics.bufferSource(), $Font$DisplayMode.NORMAL, 0, 15728880, font.isBidirectional());
		graphics.flush();
		return l;
	}
}




/**
 * 
 * @param {$GuiGraphics} graphics 
 * @param {Internal.Font} font 
 * @param {Internal.List<Internal.ClientTooltipComponent> } list 
 * @param {integer} i 
 * @param {integer} j 
 * @param {Internal.ClientTooltipPositioner} clientTooltipPositioner 
 */
function renderTooltipInternal(graphics, font, list, i, j, clientTooltipPositioner) {
	if (!list.isEmpty()) {
		let k = 0;
		let l = list.size() == 1 ? -2 : 0;

		let clientTooltipComponent;
		for (let var8 = list.iterator(); var8.hasNext(); l += clientTooltipComponent.getHeight()) {
			clientTooltipComponent = var8.next();
			let m = clientTooltipComponent.getWidth(font);
			if (m > k) {
				k = m;
			}
		}

		let vector2ic = clientTooltipPositioner.positionTooltip(graphics.guiWidth(), graphics.guiHeight(), i, j, k, l);
		let p = vector2ic.x();
		let q = vector2ic.y();
		graphics.pose().pushPose();
		let r = true;
		// this.drawManaged(() => {
		// 	TooltipRenderUtil.renderTooltipBackground(this, p, q, k, l, 400);
		// });
		graphics.pose().translate(0.0, 0.0, 400.0);
		let s = q;

		let t;
		// let clientTooltipComponent2;
		for (t = 0; t < list.size(); ++t) {
			let clientTooltipComponent2 = list.get(t);
			clientTooltipComponent2.renderText(font, p, s, graphics.pose().last().pose(), graphics.bufferSource());
			s += clientTooltipComponent2.getHeight() + (t == 0 ? 2 : 0);
		}

		// s = q;

		// for(t = 0; t < list.size(); ++t) {
		// 	clientTooltipComponent2 = list.get(t);
		// 	clientTooltipComponent2.renderImage(font, p, s, graphics);
		// 	s += clientTooltipComponent2.getHeight() + (t == 0 ? 2 : 0);
		// }

		graphics.pose().popPose();
	}
}

let $DefaultTooltipPositioner = Java.loadClass("net.minecraft.client.gui.screens.inventory.tooltip.DefaultTooltipPositioner");
let $Lists = Java.loadClass("com.google.common.collect.Lists")
let $Collectors = Java.loadClass("java.util.stream.Collectors");
/**
 * 
 * @param {GuiGraphics_} graphics 
 * @param {Internal.Font} font 
 * @param {Internal.List<Component>} list 
 * @param {integer} i 
 * @param {integer} j 
 */
function renderComponentTooltip(graphics, font, list, i, j) {
	renderTooltipInternal(graphics, font, $Lists.transform(list, (r) => r.getVisualOrderText()).stream().map((e) => $ClientTooltipComponent.create(e)).collect($Collectors.toList()), i, j, $DefaultTooltipPositioner.INSTANCE);
}



/**
 * Creates an instance of KjsColor.
 * 
 * @constructor
 * @param {number[]} rgba - An array of RGBA values where each value is an integer between 0 and 255.
 * @param {number} rgba[0] - The red component of the color.
 * @param {number} rgba[1] - The green component of the color.
 * @param {number} rgba[2] - The blue component of the color.
 * @param {number} [rgba[3]=255] - The alpha (opacity) component of the color, defaults to 255 if not provided.
 */
function KjsColor(rgba) {
	/**
	 * The red component of the color.
	 * @type {number}
	 */
	this.r = rgba[0];

	/**
	 * The green component of the color.
	 * @type {number}
	 */
	this.g = rgba[1];

	/**
	 * The blue component of the color.
	 * @type {number}
	 */
	this.b = rgba[2];

	/**
	 * The alpha (opacity) component of the color.
	 * @type {number}
	 */
	this.a = rgba[3] || 255;

	/**
	 * An instance of the Color class representing the normalized color values.
	 * @type {Internal.Color}
	 */
	this.color = new $$Color(this.r / 255, this.g / 255, this.b / 255, this.a / 255);
}
/**
 * Example method for KjsColor (if needed).
 * 
 * @function
 * @name someMethod
 */
// KjsColor.prototype.getRGB = function() {
//     return this.color.getRGB();
// };
KjsColor.prototype = {
	getRGB: function () {
		return this.color.getRGB();
	}
}