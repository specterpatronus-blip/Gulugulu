(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      g.num=utils.rnd(2,10);g.ans=g.num*3;g.opts=utils.shuffle([g.ans,g.num*2,g.num*4,g.ans+3]);
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else utils.shake(e.target);
    }
  };
})();