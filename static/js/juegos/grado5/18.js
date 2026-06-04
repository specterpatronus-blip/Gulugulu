(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const d=[{n:'Lírico',f:'Poemas'},{n:'Narrativo',f:'Cuentos'},{n:'Dramático',f:'Teatro'}];const s=d[utils.rnd(0,2)];g.clue=s.f;g.ans=s.n;g.options=utils.shuffle(d.map(x=>x.n));
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();