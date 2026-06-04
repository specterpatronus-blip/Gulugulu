(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const a=utils.rnd(2,9),b=utils.rnd(2,9);g.expr=`${a} × ${b}`;g.ans=a*b;g.opts=utils.shuffle([g.ans,g.ans+a,g.ans+b,g.ans-1]);
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();