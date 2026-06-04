(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      g.h1=utils.rnd(1,9);g.add=utils.rnd(1,3);g.ans=g.h1+g.add;g.opts=utils.shuffle([g.ans,g.ans+1,g.ans-1,g.ans+2]);
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();