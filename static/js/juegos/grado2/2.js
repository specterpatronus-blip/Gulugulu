(function(){
  window.GULU_LEVEL_LOGIC = {
    init: (g, utils) => {
      g.data=[{w1:'alegre',w2:'feliz',s:true},{w1:'rápido',w2:'lento',s:false},{w1:'grande',w2:'enorme',s:true},{w1:'frío',w2:'caliente',s:false},{w1:'bonito',w2:'hermoso',s:true}];g.idx=0;
    },
    play: (v, e, g, utils, win, score, lose) => {
      if(v===g.data[g.idx].s){score.value++;if(g.idx===g.data.length-1)win();else g.idx++;}else utils.shake(e.target);
    }
  };
})();