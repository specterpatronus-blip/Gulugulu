(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      // Love completion
    },
    play: (v, e, g, utils, win, score) => {
      if(v==='O')win();else utils.shake(e.target);
    }
  };
})();