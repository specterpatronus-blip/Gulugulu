(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const d=[{n:'Solar',t:'Renovable'},{n:'Petróleo',t:'No Renovable'},{n:'Eólica',t:'Renovable'},{n:'Carbón',t:'No Renovable'}];const s=d[utils.rnd(0,3)];g.clue=s.n;g.ans=s.t;g.options=['Renovable','No Renovable'];
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();