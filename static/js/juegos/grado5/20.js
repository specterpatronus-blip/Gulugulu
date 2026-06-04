(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const n=utils.rnd(2,9);const s=n*n;g.expr=`Raíz de ${s}`;g.ans=n;g.opts=utils.shuffle([n,n+1,n-1,s/2]);
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();