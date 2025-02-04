
StartupEvents.registry("fluid", event => {
    let MANA = event.create('cai:mana')
        .stillTexture("cai:block/mana")
        .flowingTexture('cai:block/mana')
        .bucketColor(0x99CCFF)
        .renderType("translucent")
        .createAttributes()
    MANA.luminosity(15)
    MANA.isLighterThanAir()
    MANA.tickDelay(10)
})

BlockEvents.modification(event => {
    event.modify("cai:mana", block => {
        block.setLightEmission(15)
    })
})


/*
public void animateTick(Level p_230567_, BlockPos p_230568_, FluidState p_230569_, RandomSource p_230570_) {
      BlockPos blockpos = p_230568_.above();
      if (p_230567_.getBlockState(blockpos).isAir() && !p_230567_.getBlockState(blockpos).isSolidRender(p_230567_, blockpos)) {
         if (p_230570_.nextInt(100) == 0) {
            double d0 = (double)p_230568_.getX() + p_230570_.nextDouble();
            double d1 = (double)p_230568_.getY() + 1.0D;
            double d2 = (double)p_230568_.getZ() + p_230570_.nextDouble();
            p_230567_.addParticle(ParticleTypes.LAVA, d0, d1, d2, 0.0D, 0.0D, 0.0D);
            p_230567_.playLocalSound(d0, d1, d2, SoundEvents.LAVA_POP, SoundSource.BLOCKS, 0.2F + p_230570_.nextFloat() * 0.2F, 0.9F + p_230570_.nextFloat() * 0.15F, false);
         }

         if (p_230570_.nextInt(200) == 0) {
            p_230567_.playLocalSound((double)p_230568_.getX(), (double)p_230568_.getY(), (double)p_230568_.getZ(), SoundEvents.LAVA_AMBIENT, SoundSource.BLOCKS, 0.2F + p_230570_.nextFloat() * 0.2F, 0.9F + p_230570_.nextFloat() * 0.15F, false);
         }
      }

   }
 */

