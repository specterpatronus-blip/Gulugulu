(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const d=[{q:'¿Cuántas capas tiene la Tierra?',a:'3'},{q:'¿Qué gas respiramos?',a:'Oxígeno'}];const s=d[utils.rnd(0,1)];g.clue=s.q;g.ans=s.a;g.opts=utils.shuffle([s.a,'Nitrógeno','5','CO2']);
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();