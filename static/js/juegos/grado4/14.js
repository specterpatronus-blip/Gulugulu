(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const d=[{n:'Equilátero',s:'3 lados iguales'},{n:'Isósceles',s:'2 lados iguales'},{n:'Escaleno',s:'0 lados iguales'}];const s=d[utils.rnd(0,2)];g.clue=s.s;g.ans=s.n;g.options=utils.shuffle(d.map(x=>x.n));
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();