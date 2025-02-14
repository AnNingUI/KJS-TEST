global.PlaySound = (sound,volume,pitch) => {
    Client.player.playSound(sound,volume,pitch);
}


NetworkEvents.dataReceived("kubejs:sound", (e) => {
    let { data, level } = e;
    if (!Client.level) return;
    const { sound,volume,pitch } = data;
    Client.player.playSound(sound,volume,pitch);
})