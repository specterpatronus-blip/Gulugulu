(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const d=[{w:'Desde',t:'Preposición'},{w:'Hacia',t:'Preposición'},{w:'Para',t:'Preposición'}];const s=d[utils.rnd(0,2)];g.clue=s.w;g.ans=true;
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();