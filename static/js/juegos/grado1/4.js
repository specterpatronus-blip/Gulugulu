(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const n1=utils.rnd(1,4),n2=utils.rnd(1,4);g.n1=n1;g.n2=n2;const a=n1+n2;let o=[a,a+1,a-1];if(o[2]===0)o[2]=a+2;g.options=utils.shuffle(o);
    },
    play: (v, e, g, utils, win, score) => {
      if(v===(g.n1+g.n2))win();else utils.shake(e.target);
    }
  };
})();