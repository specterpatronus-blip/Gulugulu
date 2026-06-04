(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      g.b=utils.rnd(3,9);g.a=utils.rnd(20,50);g.ans=Math.floor(g.a/g.b);g.rem=g.a%g.b;g.opts=utils.shuffle([g.ans,g.ans+1,g.ans-1,g.ans+2]);
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();