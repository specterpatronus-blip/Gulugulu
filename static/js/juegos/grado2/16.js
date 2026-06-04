(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      g.coins=utils.rnd(3,8);g.ans=g.coins*10;g.opts=utils.shuffle([g.ans,g.ans+10,Math.max(10,g.ans-10),g.ans+20]);
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else utils.shake(e.target);
    }
  };
})();