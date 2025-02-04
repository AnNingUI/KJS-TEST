const { $FluidStackJS } = require("packages/dev/latvian/mods/kubejs/fluid/$FluidStackJS");
const { $ItemStack } = require("packages/net/minecraft/world/item/$ItemStack");

global.myjqRecipes = [
	{
		rType: "item",
		input: {
			item: [
                Item.of("kubejs:pedestal",32),
                Item.of('cai:r_glowstone', 32)
            ],
			fluid: [
                Fluid.of("cai:mana", 2000)
            ]
		},
		output: Item.of("apple", 1), // maxCount: 64
        tick: 20,
		id: "kubejs:magic/test1"
	},
	{
		rType: "fluid",
		input: {
			item: [
                Item.of("kubejs:pedestal",32),
                Item.of("apple", 32)
            ],
			fluid: [
                Fluid.of("cai:mana", 2000)
            ]
		},
		output: Fluid.of("create:tea", 1000), // maxAmount: 8000
        tick: 20,
		id: "kubejs:magic/test2"
	},
    {
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
]


/**
 * A class to create custom recipes for myjq.
 * @constructor
 */
function createMyjqRecipe() {
    /**
     * The recipe type, either 'item' or 'fluid'.
     * @type {string}
     */
    this.rType = "item";

    /**
     * The input items and fluids for the recipe.
     * @type {{item: $ItemStack[], fluid: $FluidStackJS[]}}
     */
    this.input = { item: [], fluid: [] };

    /**
     * The output of the recipe, either an item or a fluid.
     * @type {$ItemStack|$FluidStackJS|undefined}
     */
    this.output = undefined;

    /**
     * The time required to complete the recipe, in ticks.
     * @type {number}
     */
    this.tick = 0;

    /**
     * The unique identifier for the recipe.
     * @type {string}
     */
    this.id = "";
}

/**
 * Sets the input items for the recipe.
 * @param {$ItemStack[]} items - An array of item stacks to be used as inputs.
 * @returns {createMyjqRecipe} The current recipe instance.
 */
createMyjqRecipe.prototype.inputItems = function(items) {
    this.input.item = items;
    return this;
};

/**
 * Sets the input fluids for the recipe.
 * @param {$FluidStackJS[]} fluids - An array of fluid stacks to be used as inputs.
 * @returns {createMyjqRecipe} The current recipe instance.
 */
createMyjqRecipe.prototype.inputFluids = function(fluids) {
    this.input.fluid = fluids;
    return this;
};

/**
 * Sets the output for the recipe.
 * The output can be either an item or a fluid stack.
 * @param {$ItemStack|$FluidStackJS} output - The output of the recipe.
 * @returns {createMyjqRecipe} The current recipe instance.
 * @throws {Error} If the output is not a valid $ItemStack or $FluidStackJS.
 */
createMyjqRecipe.prototype.setOutput = function(output) {
    if (output instanceof $ItemStack || output instanceof $FluidStackJS) {
        this.output = output;
        this.rType = output instanceof $ItemStack ? "item" : "fluid";
    } else {
        throw new Error("Invalid output type");
    }
    return this;
};

/**
 * Sets the time required to complete the recipe.
 * @param {integer} tick - The time in ticks.
 * @returns {createMyjqRecipe} The current recipe instance.
 */
createMyjqRecipe.prototype.setTick = function(tick) {
    this.tick = tick;
    return this;
};

/**
 * Sets the unique identifier for the recipe.
 * If the ID already exists in global.myjqRecipes, the recipe will not be added.
 * @param {string} id - The unique identifier for the recipe.
 * @returns {void}
 */
createMyjqRecipe.prototype.setId = function(id) {
    const ids = global.myjqRecipes.map(r => r.id);
    if (!ids.includes(id)) {
		this.id = id;
		if (this.output !== undefined) {
			global.myjqRecipes.push({
				rType: this.rType,
				input: {
					item: this.input.item,
					fluid: this.input.fluid
				},
				output: this.output,
				tick: this.tick,
				id: this.id
			});
		}
	};
	return this;
};


// function neoMyjqRecipe(items, fluids, output, tick) {

// }


// new createMyjqRecipe().inputItems(
//     [
//         Item.of("kubejs:pedestal",32),
//         Item.of("apple", 32)
//     ]
// ).inputFluids(
//     [Fluid.of("cai:mana", 2000)]
// ).setOutput(
//     Fluid.of("create:tea", 1000)
// ).setTick(20).setId("kubejs:magic/test2");
