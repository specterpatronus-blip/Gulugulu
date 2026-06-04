(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const n1=utils.rnd(4,7),n2=utils.rnd(1,3);const a=n1-n2;g.n1=n1;g.n2=n2;g.ans=a;let o=utils.shuffle([a,a+1,Math.max(1,a-1)]);g.options=o;
    },
    play: (v, e, g, utils, win, score) => {
      if(v===g.ans)win();else utils.shake(e.target);
    }
  };
})();