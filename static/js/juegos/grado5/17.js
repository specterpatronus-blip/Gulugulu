(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      g.expr='2, 2, 4, 6, 8';g.clue='Moda';g.ans=2;g.opts=utils.shuffle([2,4,6,5]);
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();