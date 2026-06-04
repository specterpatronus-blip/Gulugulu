(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const d=[{n:'Agudo',v:45},{n:'Recto',v:90},{n:'Obtuso',v:130}];const s=d[utils.rnd(0,2)];g.ans=s.n;g.deg=s.v;
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();