(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const ts=[{inf:'Comer',t:'Pasado',a:'Comí'},{inf:'Comer',t:'Presente',a:'Como'},{inf:'Comer',t:'Futuro',a:'Comeré'},{inf:'Saltar',t:'Pasado',a:'Salté'},{inf:'Saltar',t:'Presente',a:'Salto'},{inf:'Saltar',t:'Futuro',a:'Saltaré'}];
      g.data=utils.shuffle(ts).slice(0,5);g.idx=0;g.opts=['Comí','Como','Comeré','Salté','Salto','Saltaré'];
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.data[g.idx].a){score.value++;if(g.idx===g.data.length-1)win();else g.idx++;}else lose();
    }
  };
})();