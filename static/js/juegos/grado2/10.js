(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      g.mult=[2,5,10][utils.rnd(0,2)];g.a=utils.rnd(1,10);const ans=g.a*g.mult;g.opts=utils.shuffle([ans,ans+g.mult,Math.max(1,ans-g.mult),ans+1]);
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.a*g.mult)win();else utils.shake(e.target);
    }
  };
})();