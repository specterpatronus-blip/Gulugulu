(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      g.a=utils.rnd(10,50);g.b=10;g.ans=g.a/g.b;g.opts=utils.shuffle([g.ans,g.ans*10,g.ans+1,g.ans-0.5]);
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();