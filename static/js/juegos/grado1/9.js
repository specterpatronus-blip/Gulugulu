(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const n1=utils.rnd(2,9),n2=utils.rnd(2,9);if(n1===n2)n1++;g.n1=n1;g.n2=n2;g.ans=Math.max(n1,n2);
    },
    play: (v, e, g, utils, win, score) => {
      if(v===g.ans)win();else utils.shake(e.target);
    }
  };
})();