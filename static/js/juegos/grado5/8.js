(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const d=[{n:'Pila',f:'Fuente de energía'},{n:'Cable',f:'Conductor'},{n:'Bombillo',f:'Receptor'}];const s=d[utils.rnd(0,2)];g.clue=s.f;g.ans=s.n;g.options=utils.shuffle(d.map(x=>x.n));
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();