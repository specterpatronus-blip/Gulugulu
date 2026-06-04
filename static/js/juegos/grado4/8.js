(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const d=[{n:'Selva',i:'🌴'},{n:'Desierto',i:'🌵'},{n:'Páramo',i:'🏔️'},{n:'Costa',i:'🌊'}];const s=d[utils.rnd(0,3)];g.ans=s.n;g.img=s.i;g.options=utils.shuffle(d.map(x=>x.n));
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();