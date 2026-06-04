(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const d=[{n:'En movimiento',t:'Cinética'},{n:'En reposo (altura)',t:'Potencial'}];const s=d[utils.rnd(0,1)];g.clue=s.n;g.ans=s.t;g.options=['Cinética','Potencial'];
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();