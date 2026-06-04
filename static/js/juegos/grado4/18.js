(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const d=[{w:'Café',t:'Aguda'},{w:'Árbol',t:'Grave'},{w:'Música',t:'Esdrújula'}];const s=d[utils.rnd(0,2)];g.clue=s.w;g.ans=s.t;g.options=['Aguda','Grave','Esdrújula'];
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();