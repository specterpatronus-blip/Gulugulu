(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      g.s=utils.rnd(3,6);const a=Math.pow(g.s,3);g.ans=a;g.opts=utils.shuffle([a,a+10,Math.pow(g.s,2),g.s*3]);
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();