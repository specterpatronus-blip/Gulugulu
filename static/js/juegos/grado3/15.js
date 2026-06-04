(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      g.a=utils.rnd(2,9);g.b=[10,100,1000][utils.rnd(0,2)];g.ans=g.a*g.b;
      g.opts=utils.shuffle([g.ans,g.ans+g.b,g.ans/10,g.a*(g.b===10?100:10)]);
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();