(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const ws=[{w:'Hermoso',a:true},{w:'Saltar',a:false},{w:'Gato',a:false},{w:'Valiente',a:true}];const s=ws[utils.rnd(0,3)];g.clue=s.w;g.ans=s.a;
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();