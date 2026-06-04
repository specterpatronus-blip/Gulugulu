(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      // Steps of the food chain
      g.data=['🌿Planta','🐛Oruga','🐸Rana','🦅Águila'];
      g.shuffled=utils.shuffle([...g.data]);
      g.placed=[];
    },
    play: (v, e, g, utils, win, score, lose) => {
      // Robust comparison using the name part
      const expStr = g.data[g.placed.length];
      const getName = (s) => s.replace(/[^\wÁÉÍÓÚáéíóú]/g, '');
      
      if(getName(v) === getName(expStr)){
        g.placed.push(v);
        if(g.placed.length === g.data.length) win();
      } else {
        g.placed = [];
        lose();
      }
    }
  };
})();