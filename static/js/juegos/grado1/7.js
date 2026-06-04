(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      // Word completion game
    },
    play: (v, e, g, utils, win, score) => {
      if(v==='E')win();else utils.shake(e.target);
    }
  };
})();