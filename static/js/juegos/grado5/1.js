(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      g.base=utils.rnd(2,5);g.exp=utils.rnd(2,3);const a=Math.pow(g.base,g.exp);g.ans=a;g.opts=utils.shuffle([a,a+g.base,a-1,Math.pow(g.exp,g.base)]);
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();