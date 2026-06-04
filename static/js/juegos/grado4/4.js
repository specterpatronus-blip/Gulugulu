(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const d=[{n:'Cloroplastos',t:'Vegetal'},{n:'Pared Celular',t:'Vegetal'},{n:'Centriolos',t:'Animal'},{n:'Vacuola Grande',t:'Vegetal'}];const s=d[utils.rnd(0,3)];g.ans=s.t;g.clue=s.n;
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();