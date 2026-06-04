(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const ps=[10,20,25,50];g.pct=ps[utils.rnd(0,3)];g.total=utils.rnd(1,10)*100;const a=(g.pct*g.total)/100;g.ans=a;g.opts=utils.shuffle([a,a+10,a-5,g.total/2]);
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();