(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const d=[{s:'Juan',p:'corre en el parque'},{s:'El perro',p:'ladra mucho'},{s:'María',p:'estudia inglés'}];const s=d[utils.rnd(0,2)];g.clue=s.s + ' ' + s.p;g.ans=s.p;g.options=utils.shuffle([s.p,s.s,'corre','parque']);
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();