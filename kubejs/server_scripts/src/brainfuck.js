let BOOLE = false
function isValidString(inputString) {
  return /^[+-\.,<>\[\] ]+$/.test(inputString);
}

BlockEvents.rightClicked('minecraft:command_block', event => {
    let { player, block } = event
    if(!player.creative && block.offset(0,-1,0).id == 'minecraft:white_terracotta'){
      if(!BOOLE){
          player.swing('MAIN_HAND', true);
          const Command = event.block.getEntityData().Command
          /*判断Command只由
            "+"
            "-"
            "."
            ","
            "<"
            ">"
            "["
            "]"
            " "
          九种字符组成*/
          if(isValidString(Command)){
            const bf = global.brainfuck(Command)
            const { input, output, lastCell, cellArray } = bf
            player.tell(output)
          }
          else{
            player.tell("Code Error")
          }
          BOOLE = true
      }else{
        BOOLE = false
      }
    }
})




