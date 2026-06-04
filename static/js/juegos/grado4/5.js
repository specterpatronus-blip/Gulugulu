(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      g.w=utils.rnd(4,9);g.h=utils.rnd(3,6);const a=g.w*g.h;g.opts=utils.shuffle([a,a+2,a-2,g.w+g.h]);
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.w*g.h)win();else lose();
    }
  };
})();