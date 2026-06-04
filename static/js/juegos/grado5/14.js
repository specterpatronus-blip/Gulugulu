(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const d=[{c:'Llover mucho',e:'Inundación'},{c:'Estudiar',e:'Aprender'},{c:'Hacer ejercicio',e:'Salud'}];const s=d[utils.rnd(0,2)];g.clue=s.c;g.ans=s.e;g.options=utils.shuffle(d.map(x=>x.e));
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();