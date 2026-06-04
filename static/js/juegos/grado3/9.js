(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const cs=[{q:'¿En qué continente está Colombia?',a:'América'},{q:'¿Cuál es el continente más grande?',a:'Asia'},{q:'¿En qué continente está España?',a:'Europa'},{q:'¿Dónde viven los canguros?',a:'Oceanía'}];
      const c=cs[utils.rnd(0,cs.length-1)];g.clue=c.q;g.ans=c.a;g.opts=utils.shuffle(['América','Asia','Europa','África','Oceanía','Antártida']);
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();