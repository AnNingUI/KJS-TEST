global.ServerLoaded = false
ServerEvents.loaded((e)=>{
    global.ServerLoaded = true
    // e.server.runCommandSilent(`kjs reload client_scripts`)
    // e.server.runCommandSilent(`kjs reload startup_scripts`)
    // e.server.runCommandSilent(`kjs reload server_scripts`)
})



