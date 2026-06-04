(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const d=[{q:'Voto',f:'Derecho ciudadano'},{q:'Constitución',f:'Ley máxima'}];const s=d[utils.rnd(0,1)];g.clue=s.f;g.ans=s.q;g.opts=utils.shuffle([s.q,'Dictadura','Rey','Caos']);
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();