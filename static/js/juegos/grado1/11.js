(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const s=utils.rnd(1,5);g.seq=[s,s+1,'?',s+3];g.ans=s+2;let o=[s+2,s+4,s];if(o[2]<=0)o[2]=s+5;g.options=utils.shuffle(o);
    },
    play: (v, e, g, utils, win, score) => {
      if(v===g.ans)win();else utils.shake(e.target);
    }
  };
})();