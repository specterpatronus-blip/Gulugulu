(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const a=utils.rnd(2,5),b=utils.rnd(2,5),c=utils.rnd(2,5);g.expr=`${a} + ${b} × ${c}`;g.ans=a+(b*c);g.opts=utils.shuffle([g.ans,(a+b)*c,g.ans+2,g.ans-2]);
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();