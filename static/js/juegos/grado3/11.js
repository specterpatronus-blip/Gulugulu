(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const p=[100,200,300,500][utils.rnd(0,3)];g.a=utils.rnd(1,5)*100;g.b=g.a+p;g.ans=g.b+p;
      g.opts=utils.shuffle([g.ans,g.ans+100,g.ans-100,g.ans+50]);
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();