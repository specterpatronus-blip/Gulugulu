(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      g.opts=['Norte','Sur','Este','Oeste'];g.ans='Oeste';
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();