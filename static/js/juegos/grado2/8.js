(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      g.h=utils.rnd(1,5);g.t=utils.rnd(1,9);g.u=utils.rnd(1,9);const r=Math.random();if(r<.33){g.q='centenas';g.ans=g.h;}else if(r<.66){g.q='decenas';g.ans=g.t;}else{g.q='unidades';g.ans=g.u;}g.opts=utils.shuffle([g.ans,g.ans+1,Math.max(1,g.ans-1),g.ans+2]);
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else utils.shake(e.target);
    }
  };
})();