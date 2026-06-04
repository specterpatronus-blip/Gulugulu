(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      g.b=utils.rnd(2,5);const q=utils.rnd(2,6);g.a=g.b*q;g.ans=q;g.opts=utils.shuffle([q,q+1,q-1<1?q+2:q-1,q+2]);
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();