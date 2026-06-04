(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const idx=utils.rnd(0,1);g.answerIdx=idx;g.options=idx===0?[{size:'8rem'},{size:'3rem'}]:[{size:'3rem'},{size:'8rem'}];
    },
    play: (v, e, g, utils, win, score) => {
      if(v===g.answerIdx)win();else utils.shake(e.currentTarget);
    }
  };
})();