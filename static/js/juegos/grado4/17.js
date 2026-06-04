(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const a=2,b=3;g.expr=`MCM de ${a} y ${b}`;g.ans=6;g.opts=utils.shuffle([6,5,4,12]);
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();