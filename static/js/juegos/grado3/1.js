(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const ts=[3,4,6,7,8,9];g.b=ts[utils.rnd(0,ts.length-1)];g.a=utils.rnd(2,10);g.ans=g.a*g.b;g.opts=utils.shuffle([g.ans,g.ans+g.b,g.ans-g.b<0?g.ans+g.b*2:g.ans-g.b,g.ans+1]);
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();