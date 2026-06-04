(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      g.a=utils.rnd(20,99);g.b=utils.rnd(20,99);if(g.a===g.b)g.b++;g.ans=g.a>g.b?'>':'<';if(Math.random()<0.1){g.b=g.a;g.ans='=';}
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else utils.shake(e.target);
    }
  };
})();