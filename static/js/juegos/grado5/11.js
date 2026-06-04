(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const d=[{n:7,p:true},{n:10,p:false},{n:13,p:true},{n:15,p:false}];const s=d[utils.rnd(0,3)];g.clue=s.n;g.ans=s.p;
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();