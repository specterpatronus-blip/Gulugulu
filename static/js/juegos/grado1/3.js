(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const c=utils.rnd(3,7);g.count=c;let o=[c,c+1,c-1];if(o[2]===0)o[2]=c+2;g.options=utils.shuffle(o);
    },
    play: (v, e, g, utils, win, score) => {
      if(v===g.count)win();else utils.shake(e.target);
    }
  };
})();