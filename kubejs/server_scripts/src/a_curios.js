let SoulTalismanHealth = 10;
PlayerEvents.tick(e => {
    let player = e.player;
    let SoulTalismanCount = 0;
    SoulTalismanCount = getCuriosInfoForPlayerSlot(player, 'charm', 'cai:soul_talisman').count
    let SoulTalismanAddHealth = SoulTalismanHealth * SoulTalismanCount
    let currentMaxHealth = 20 + SoulTalismanAddHealth;
    player.setMaxHealth(currentMaxHealth);
    player.setHealth(JavaMath.min(player.health, currentMaxHealth));
});
