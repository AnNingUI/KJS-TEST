
ItemEvents.tooltip(tooltip => {
	global.itemTooltipEventKJS(tooltip)
})

let z
let tr = 0
let tg = 60
let tb = 100
/**
 * 
 * @param {Internal.ItemTooltipEventJS} tooltip 
 */
global.itemTooltipEventKJS = (tooltip) => {
	tooltip.addAdvanced('cai:gdcz_sword', (item, advanced, text) => {
		text.add(1/*index*/, Text.translate("tooltip.cai.gdcz_sword.text.0"))
		text.add(2/*index*/, Text.translate("tooltip.cai.gdcz_sword.text.1"))
		text.add(3/*index*/, Text.translate("tooltip.cai.gdcz_sword.text.2").red())
		if (!tooltip.isShift()) {
			//text.add(4, [Text.of('Hold ').gold(), Text.of('Shift ').yellow(), Text.of('to see more info.').gold()])
			text.add(4, [Text.translate("tooltip.cai.gdcz_sword.text.3").gold(), Text.translate("tooltip.cai.gdcz_sword.text.4").yellow(), Text.translate("tooltip.cai.gdcz_sword.text.5").gold()])
		}
		if (tooltip.isShift()) {
			text.add(4, Text.translate("tooltip.cai.gdcz_sword.text.6"))
		}
	})
	tooltip.addAdvanced('cai:soul_talisman', (item, advanced, text) => {
		text.add(1/*index*/, Text.translate("tooltip.cai.soul_talisman.text.0"))
		text.add(2/*index*/, Text.translate("tooltip.cai.soul_talisman.text.1"))
		text.add(3/*index*/, Text.translate("tooltip.cai.soul_talisman.text.2").darkGreen())

		if (!tooltip.isShift()) {
			//text.add(4, [Text.of('Hold ').gold(), Text.of('Shift ').yellow(), Text.of('to see more info.').gold()])
			text.add(4, [Text.translate("tooltip.cai.soul_talisman.text.3").gold(), Text.translate("tooltip.cai.soul_talisman.text.4").yellow(), Text.translate("tooltip.cai.soul_talisman.text.5").gold()])
		}
		if (tooltip.isShift()) {
			text.add(4, Text.translate("tooltip.cai.soul_talisman.text.6"))
		}
	})

	tooltip.addAdvanced('cai:anli', (item, advanced, text) => {
		text.add(1/*index*/, Text.translate("tooltip.cai.anli.text.0"))
		text.add(2/*index*/, Text.translate("tooltip.cai.anli.text.1"))
		text.add(3/*index*/, Text.translate("tooltip.cai.anli.text.2"))
		text.add(4/*index*/, Text.translate("tooltip.cai.anli.text.3").blue())

		if (!tooltip.isShift()) {
			//text.add(4, [Text.of('Hold ').gold(), Text.of('Shift ').yellow(), Text.of('to see more info.').gold()])
			text.add(5, [Text.translate("tooltip.cai.anli.text.4").gold(), Text.translate("tooltip.cai.anli.text.5").yellow(), Text.translate("tooltip.cai.anli.text.6").gold()])
		}
		if (tooltip.isShift()) {
			text.add(5, Text.translate("tooltip.cai.anli.text.7"))
		}
	})
	tooltip.addAdvanced('minecraft:fire_charge', (item, advanced, text) => {
		if (parseInt(Client.partialTick * 1000) % 23 == 0) {
			// console.log(Client.partialTick)
			z = generateRandomString(Client.partialTick * 10)
		}
		else if (parseInt(Client.partialTick * 1000) % 3 == 0 || parseInt(Client.partialTick * 1000) % 2 == 0 || parseInt(Client.partialTick * 1000) % 5 == 0) {
			tr >= 255 ? tr = 0 : tr += 20
			tg >= 255 ? tg = 0 : tg += 20
			tb >= 255 ? tb = 0 : tb += 20
		}
		text.add(1/*index*/, Text.of(`${z}`).color(rgbToHex(tr, tg, tb)))
	})
	tooltip.addAdvanced('cai:star_data', (item, advanced, text) => {
		const { nbt } = item
		if (nbt === null) { return }
		if (nbt.rayLength !== null && nbt.observationBitspos !== null && nbt.endpos !== null && nbt.astrological !== null) {
			text.add(0/*index*/, Text.translate(`tooltip.cai.star_data.text.0`).darkPurple())
			text.add(1/*index*/, [Text.translate("tooltip.cai.star_data.text.1").red(), Text.of(`${nbt.observationBitspos.x.toFixed(2)},y:${nbt.observationBitspos.y.toFixed(2)},z:${nbt.observationBitspos.z.toFixed(2)}`).red()])
			text.add(2/*index*/, [Text.translate("tooltip.cai.star_data.text.2").red(), Text.of(`${nbt.rayLength}`).red(), Text.translate("tooltip.cai.star_data.text.3").red(), Text.of(`${nbt.endpos.x.toFixed(2)},y:${nbt.endpos.y.toFixed(2)},z:${nbt.endpos.z.toFixed(2)}`).red()])
			nbt.astrological.toArray().forEach((e, i) => {
				text.add(3 + parseInt(i)/*index*/, [Text.translate("tooltip.cai.star_data.text._1").darkRed(), Text.of(`${i + 1}: ${parseFloat(e)}`).darkRed()])
			});
		}
	})
	tooltip.addAdvanced("kubejs:aqaq", (item, advanced, text) => {
		const { nbt } = item
		const maxEnergy = feUnitConversion(10000) // 10 KFE
		const energy = feUnitConversion(nbt?.BlockEntityTag?.ForgeData?.energy ?? 0);
		const T0 = Text.of(energy + "/" + maxEnergy)
		const T1 = Text.translate("tooltip.kubejs.stored_energy")
		text.add(1/*index*/, [Text.of(T1).color(0x74FC88), T0])
	})
	tooltip.addAdvanced("kubejs:jar", (item, advanced, text) => {
		const { nbt } = item;
		const maxAmout = "8000";
		const fluidTank = nbt?.BlockEntityTag?.data?.fluidTank;
		const fluidName = fluidTank?.FluidName ?? "minecraft:empty";
		const amout = fluidTank?.Amount ?? 0;
		const fluid = Fluid.of(fluidName, amout);
		const TFluidName = !fluid.isEmpty() && fluid.fluidStack.getName() || "";
		const T0 = !fluid.isEmpty() ?
			[Text.of(TFluidName).color(0xd25dc9), Text.of(":").color(0xd25dc9), Text.of(` ${amout}`).color(0xcdcdcd), Text.of(" mB").color(0xd25dc9)] :
			[Text.translate("tooltip.kubejs.jar_empty").color(0xc7071f)];
		const T1 = [Text.translate("tooltip.kubejs.jar_max_amout").color(0x549cfc), Text.of(maxAmout).color(0xcdcdcd), Text.of(" mB").color(0x549cfc)];
		text.add(1, T0);
		text.add(2, T1);
	})
}


function generateRandomString(length) {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

function rgbToHex(red, green, blue) {
	return (red << 16) | (green << 8) | blue;
}

/**
 * Convert a number to a formatted string with unit suffixes.
 * 
 * @param {number} int - The integer to convert.
 * @returns {string} - The formatted string with unit suffixes.
 */
function feUnitConversion(int) {
	if (int < 0 || int > 2147483647) {
		return "0 FE"; // Default case for invalid or out-of-range numbers
	}

	let value = int;
	let suffix = "FE";

	if (value >= 1e9) {
		value /= 1e9;
		suffix = "GFE";
	} else if (value >= 1e6) {
		value /= 1e6;
		suffix = "MFE";
	} else if (value >= 1e3) {
		value /= 1e3;
		suffix = "KFE";
	}

	return value.toFixed(2) + " " + suffix;
}



ClientEvents.lang("zh_cn", (event) => {
	event.add("tooltip.kubejs.stored_energy", "已储能：")
})

ClientEvents.lang("en_us", (event) => {
	event.add("tooltip.kubejs.stored_energy", "Stored energy: ")
})


