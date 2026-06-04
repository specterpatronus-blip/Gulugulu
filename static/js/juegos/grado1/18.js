(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      // Triangle sides
    },
    play: (v, e, g, utils, win, score) => {
      if(v===3)win();else utils.shake(e.target);
    }
  };
})();