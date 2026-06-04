(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const d=[{p:'Estómago',f:'Descompone el alimento'},{p:'Boca',f:'Inicia la digestión'},{p:'Intestino Delgado',f:'Absorbe nutrientes'}];const s=d[utils.rnd(0,2)];g.clue=s.f;g.ans=s.p;g.options=utils.shuffle(d.map(x=>x.p));
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();