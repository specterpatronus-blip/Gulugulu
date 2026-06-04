(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      const ws=[{c:'Raíz',e:'🌱',ans:'Raíz'},{c:'Tallo',e:'🎋',ans:'Tallo'},{c:'Hoja',e:'🍃',ans:'Hoja'},{c:'Flor',e:'🌸',ans:'Flor'}];const w=ws[utils.rnd(0,ws.length-1)];g.clue=w.c;g.emoji=w.e;g.ans=w.ans;g.opts=utils.shuffle(['Raíz','Tallo','Hoja','Flor']);
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.ans)win();else lose();
    }
  };
})();