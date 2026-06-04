(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      g.steps=['Observación','Hipótesis','Experimento','Conclusión'];g.shuffled=utils.shuffle([...g.steps]);g.placed=[];
    },
    play: (v, e, g, utils, win, score, lose) => {
      const exp=g.steps[g.placed.length];if(v===exp){g.placed.push(v);if(g.placed.length===4)win();}else{g.placed=[];lose();}
    }
  };
})();