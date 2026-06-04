(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const d=[{d:'0.5',f:'1/2'},{d:'0.25',f:'1/4'},{d:'0.75',f:'3/4'},{d:'0.2',f:'1/5'}];const s=d[utils.rnd(0,3)];g.clue=s.d;g.ans=s.f;g.options=utils.shuffle(d.map(x=>x.f));
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();