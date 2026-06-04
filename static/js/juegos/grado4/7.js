(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      g.idx=0;g.data=[{w:'Cancion',a:true,ans:'Canción'},{w:'Arbol',a:true,ans:'Árbol'},{w:'Mesa',a:false,ans:'Mesa'},{w:'Lapiz',a:true,ans:'Lápiz'},{w:'Correr',a:false,ans:'Correr'}];
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.data[g.idx].a){score.value++;if(g.idx===g.data.length-1)win();else g.idx++;}else lose();
    }
  };
})();