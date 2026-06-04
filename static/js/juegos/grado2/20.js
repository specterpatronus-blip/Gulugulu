(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      g.words=['Arbol','Barco','Cielo','Dedo','Elefante','Fuego','Gato'];const w1=g.words[utils.rnd(0,g.words.length-1)];let w2=g.words[utils.rnd(0,g.words.length-1)];while(w1===w2)w2=g.words[utils.rnd(0,g.words.length-1)];g.opts=utils.shuffle([w1,w2]);g.ans=w1.localeCompare(w2)<0?w1:w2;
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else utils.shake(e.target);
    }
  };
})();