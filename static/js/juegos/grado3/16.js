(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const ws=[{w:'_apatos',a:'Z'},{w:'_ielo',a:'C'},{w:'_illa',a:'S'},{w:'_erdo',a:'C'},{w:'_ol',a:'S'},{w:'_orro',a:'Z'}];
      g.data=utils.shuffle(ws).slice(0,5);g.idx=0;
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.data[g.idx].a){score.value++;if(g.idx===g.data.length-1)win();else g.idx++;}else lose();
    }
  };
})();