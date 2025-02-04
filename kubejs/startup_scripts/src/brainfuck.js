// priority: 100
/**
 * @param {String} code 
 * @returns {{output: string, input: string, lastCell: Number, cellArray: Array}}
 */
const brainfuck = code => {
    /**
     * @param {String} code 
     * @param {Number} index 
     * @param {Array} array 
     * @param {String} output 
     * @param {Number} currentCell 
     * 
     * @returns {Array}
     */
    function nextSymbol(code, index, array, output, currentCell, loopPoint) {
        let symbol = code.split("")[index]
        let nextIndex = index+1

        switch(symbol) {
            case ">": currentCell = (currentCell+1) % 256; break;
            case "<": currentCell = currentCell>0 ? currentCell-1 : 255; break;

            case "+": array[currentCell] = (array[currentCell]+1) % 256; break;
            case "-": array[currentCell] = array[currentCell]>0 ? array[currentCell]-1 : 255; break;

            case ".": output += String.fromCharCode(array[currentCell]); break;
            case ",": console.log("[BF KJS] , not implemented, skipping."); break;

            case "[": loopPoint = index+1; break;
            case "]": loopPoint!=null && array[currentCell]!=0 ? nextIndex=loopPoint : null; break;
        }

        if (nextIndex==code.length) return [output, currentCell, array]
        return nextSymbol(code, nextIndex, array, output, currentCell, loopPoint)
    }

    let output = nextSymbol(code, 0, Array(256).fill(0), "", 0, null)
    return {
        output: decodeURIComponent(escape(output[0]))
    }
}
global.brainfuck = brainfuck;