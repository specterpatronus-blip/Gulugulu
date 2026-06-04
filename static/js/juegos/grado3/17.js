(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      g.a=utils.rnd(1000,9999);g.b=utils.rnd(1000,9999);while(g.a===g.b)g.b=utils.rnd(1000,9999);g.ans=g.a>g.b?'>':'<';
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();