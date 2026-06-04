(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      g.stages=['🌱 Semilla','🌿 Brote','🌸 Flor','🍎 Fruto'];g.shuffled=utils.shuffle([...g.stages]);g.placed=[];
    },
    play: (v, e, g, utils, win, score, lose) => {
      const exp=g.stages[g.placed.length];if(v===exp){g.placed.push(v);if(g.placed.length===4)win();}else{g.placed=[];utils.shake(document.querySelector('.cycle-board'));}
    }
  };
})();